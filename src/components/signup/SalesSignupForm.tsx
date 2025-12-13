"use client"

import { useForm } from "react-hook-form"
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
// import type { SalesSignupData } from "@/types/signup"
import { Loader2, User, Mail, Phone, Calendar, Users, MapPin, Briefcase, Languages } from "lucide-react"
import { getAllRegions, getAllWoredas, getAllZones } from "@/lib/location-utils"
import ErrorMessage from "@/components/status/ErrorMessage"
import LoadingBox from "@/components/status/LoadingBox"
import { WritableDropdown } from "@/components/ui/writable-dropdown"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import ReactSelect from "react-select"
import { getLocalLabel } from "@/lib/lang-utils"
import { useLanguages } from "@/services/language"
import { useCreateSalesAccount } from "@/services/sales"
import Success from "@/components/status/Success"

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  phoneNumber: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  age: z
    .number()
    .min(18, {
      message: "Age must be at least 18 years.",
    })
    .max(100, {
      message: "Please enter a valid age.",
    }),
  gender: z.string().min(1, {
    message: "Please select a gender.",
  }),
  languages: z.array(z.string()).min(1, {
    message: "Please select at least one language.",
  }),
  region: z.string().optional(),
  zone: z.string().optional(),
  woreda: z.string().min(1, {
    message: "Please select your location.",
  }),
})

// Custom styles for react-select to match shadcn/ui theme
const selectStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    minHeight: "44px",
    borderColor: state.isFocused ? "hsl(var(--ring))" : "hsl(var(--border))",
    borderRadius: "6px",
    boxShadow: state.isFocused ? "0 0 0 2px hsl(var(--ring))" : "none",
    "&:hover": {
      borderColor: "hsl(var(--border))",
    },
  }),
  multiValue: (provided: any) => ({
    ...provided,
    backgroundColor: "hsl(var(--primary))",
    borderRadius: "4px",
  }),
  multiValueLabel: (provided: any) => ({
    ...provided,
    color: "hsl(var(--secondary-foreground))",
    fontSize: "14px",
  }),
  multiValueRemove: (provided: any) => ({
    ...provided,
    color: "hsl(var(--secondary-foreground))",
    "&:hover": {
      backgroundColor: "hsl(var(--destructive))",
      color: "hsl(var(--destructive-foreground))",
    },
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected ? "hsl(var(--primary))" : state.isFocused ? "hsl(var(--accent))" : "transparent",
    color: state.isSelected ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))",
  }),
}

export function SalesSignupForm() {
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [languages, setLanguages] = useState<{ label: string; value: string }[]>([])
  const [success, setSuccess] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      password: "",
      age: 18,
      gender: "",
      languages: [],
      region: "",
      zone: "",
      woreda: "",
    },
  })

  const formState = form.watch()
  const langsQ = useLanguages()
  const createSalesAccount = useCreateSalesAccount()
  const isNewWoreda = !getAllWoredas().find((w) => w.name === formState.woreda)

  useEffect(() => {
    if (langsQ.data) {
      setLanguages(langsQ.data.map((l) => ({ label: getLocalLabel(l), value: l._id })))
    }
  }, [langsQ.data])

  const handleLanguageChange = (selectedOptions: readonly { value: string; label: string }[] | null) => {
    const languages = selectedOptions ? Array.from(selectedOptions).map((option) => option.value) : []
    form.setValue("languages", languages)
    form.trigger("languages")
  }

  // Helper to normalize any backend / network error into a string
  const getErrorMessage = (err: any): string => {
    if (!err) return "An unexpected error occurred. Please try again."
    const respData = err?.response?.data
    if (typeof respData === "string") return respData
    if (respData && typeof respData.message === "string") return respData.message
    if (typeof err.message === "string") return err.message
    try {
      return JSON.stringify(respData || err)
    } catch {
      return "An unexpected error occurred. Please try again."
    }
  }

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setSubmitError(null)

      // Additional validation
      if (values.age < 18 || values.age > 100) {
        setSubmitError("Please enter a valid age between 18 and 100.")
        return
      }

      // Validate location completeness for new woreda
      if (isNewWoreda && (!values.region || !values.zone)) {
        setSubmitError("Please provide complete location information.")
        return
      }

      await createSalesAccount.mutateAsync({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        password: values.password,
        gender: values.gender,
        age: values.age,
        address: {
          region: values.region || "",
          woreda: values.woreda,
          zone: values.zone || "",
        },
        languagesSpoken: values.languages,
      })
      setSuccess(true)
    } catch (error: any) {
      console.error("Form submission error:", error)
      setSubmitError(getErrorMessage(error))
    }
  }

  const handleRetry = () => {
    if (!langsQ.data) langsQ.refetch()
  }
  const isLoadingData = langsQ.isLoading
  const dataError = langsQ.error

  if (success) {
    return <Success message="Sales account created successfully" />
  }

  return (
    <div className="min-h-screen">
      <Card className="w-full max-w-4xl mx-auto border bg-white/95 backdrop-blur-sm">
        <CardContent className="p-8">
          <LoadingBox isLoading={isLoadingData} />
          <ErrorMessage error={dataError} retry={handleRetry} />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
              {/* Personal Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-lg font-semibold text-slate-700 border-b border-slate-200 pb-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium">First Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your first name"
                            className="h-11 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium">Last Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your last name"
                            className="h-11 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="your.email@example.com"
                            type="email"
                            className="h-11 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="+1 (555) 123-4567"
                            type="tel"
                            className="h-11 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium flex items-center gap-2">
                          Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Password"
                            type="password"
                            className="h-11 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Age
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="25"
                            type="number"
                            min="18"
                            max="100"
                            className="h-11 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                            {...field}
                            onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 18)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Gender
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Location Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-lg font-semibold text-slate-700 border-b border-slate-200 pb-2">
                  <MapPin className="h-5 w-5" />
                  Location Information
                </div>

                <FormField
                  control={form.control}
                  name="woreda"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-medium">Location</FormLabel>
                      <FormControl>
                        <WritableDropdown
                          options={getAllWoredas()
                            .map((w) => ({
                              label: w.name + (w.hasDuplicate ? ` (${w.zone.name})` : ""),
                              value: w.name,
                            }))
                            .sort((a, b) => (a.label < b.label ? -1 : 1))}
                          value={field.value}
                          onValueChange={(woredaName) => {
                            field.onChange(woredaName)
                            const woreda = getAllWoredas().find((w) => w.name === woredaName)
                            form.setValue("zone", woreda?.zone.name || "")
                            form.setValue("region", woreda?.zone.region.name || "")
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {formState.woreda && isNewWoreda && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <FormField
                      control={form.control}
                      name="region"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-medium">Region</FormLabel>
                          <FormControl>
                            <WritableDropdown
                              isWritable={false}
                              options={getAllRegions().map((r) => ({
                                label: r.name,
                                value: r.name,
                              }))}
                              value={field.value}
                              onValueChange={(regionName) => {
                                field.onChange(regionName)
                                form.setValue("zone", "")
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {formState.woreda && formState.region && isNewWoreda && (
                      <FormField
                        control={form.control}
                        name="zone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-medium">Zone</FormLabel>
                            <FormControl>
                              <WritableDropdown
                                options={getAllZones()
                                  .filter((z) => z.region.name === formState.region)
                                  .map((z) => ({ label: z.name, value: z.name }))}
                                value={field.value}
                                onValueChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Skills & Languages Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-lg font-semibold text-slate-700 border-b border-slate-200 pb-2">
                  <Languages className="h-5 w-5" />
                  Languages
                </div>

                <FormField
                    control={form.control}
                    name="languages"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Languages
                        </FormLabel>
                        <FormControl>
                          <ReactSelect
                            isMulti
                            options={languages}
                            value={languages.filter((opt) => field.value.includes(opt.value))}
                            onChange={(selected) => handleLanguageChange(selected)}
                            styles={selectStyles}
                            placeholder="Select languages..."
                            className="text-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>

              {submitError && (
                <Alert className="mb-6 border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">{submitError}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="bg-primary text-white shadow-lg hover:shadow-xl transition-all duration-200 w-full"
                disabled={createSalesAccount.isPending}
              >
                {createSalesAccount.isPending ? (
                  <>
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    Creating Your Account...
                  </>
                ) : (
                  <>
                    <Briefcase className="mr-3 h-5 w-5" />
                    Create Sales Account
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
