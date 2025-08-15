import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
// import type { TeacherSignupData } from "@/types/signup"
import { Loader2, User, Mail, Phone, Calendar, Users, GraduationCap, BookOpen, MapPin } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useLanguages } from "@/services/language"
import { useGetAllSchools } from "@/services/school"
import { useGetGrades } from "@/services/grade"
import { WritableDropdown } from "@/components/ui/writable-dropdown"
import { getLocalLabel } from "@/lib/lang-utils"
import { getAllRegions, getAllWoredas, getAllZones } from "@/lib/location-utils"
import { useState, useEffect } from "react"
import ErrorMessage from "@/components/status/ErrorMessage"
import LoadingBox from "@/components/status/LoadingBox"
import ReactSelect from "react-select"
import type { MultiValue } from "react-select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {useCreateTeacherAccount} from '@/services/teacher';
import { TeacherPayload } from "@/types/teacher";
import Success from "@/components/status/Success"

// interface TeacherSignupFormProps {
//   onSubmit: (data: TeacherPayload) => void
//   isLoading: boolean
// }

const teacherSignupSchema = z.object({
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
  schoolId: z.string().min(1, {
    message: "Please select or enter a school.",
  }),
  isSchoolName: z.boolean().optional(),
  teachingExperience: z
    .number()
    .min(0, {
      message: "Years of experience must be at least 0.",
    })
    .max(50, {
      message: "Please enter a valid number of years.",
    }),
  languages: z.array(z.string()).min(1, {
    message: "Please select at least one language.",
  }),
  gradeIds: z.array(z.string()).min(1, {
    message: "Please select at least one grade.",
  }),
  subjectIds: z.array(z.string()).min(1, {
    message: "Please select at least one subject.",
  }),
  woreda: z.string().optional(),
  region: z.string().optional(),
  zone: z.string().optional(),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
})

// Custom styles for react-select to match shadcn/ui theme
const selectStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    minHeight: "40px",
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

export function TeacherSignupForm() {
  const [selectedGradeIds, setSelectedGradeIds] = useState<string[]>([])
  const [grades, setGrades] = useState<{ label: string; value: string }[]>([])
  const [languages, setLanguages] = useState<{ label: string; value: string }[]>([])
  const [availableSubjectGroups, setAvailableSubjectGroups] = useState<
    { label: string; options: { label: string; value: string }[] }[]
  >([])
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const { mutate: signup, isPending: isSubmitting } = useCreateTeacherAccount()

  const form = useForm<z.infer<typeof teacherSignupSchema>>({
    resolver: zodResolver(teacherSignupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      age: 18,
      gender: "",
      schoolId: "",
      teachingExperience: 0,
      languages: [],
      gradeIds: [],
      subjectIds: [],
      woreda: "",
      region: "",
      zone: "",
      password: "",
    },
  })

  const formState = form.watch()
  const isNewWoreda = !getAllWoredas().find((w) => w.name === formState.woreda)

  const schoolQ = useGetAllSchools()
  const gradesQ = useGetGrades()
  const langsQ = useLanguages()

  useEffect(() => {
    if (gradesQ.data) {
      // Sort grades numerically before mapping to options
      setGrades(
        gradesQ.data
          .slice()
          .sort((a, b) => a.grade - b.grade)
          .map((g) => ({ label: `Grade ${g.grade}`, value: g._id }))
      )
    }
    if (langsQ.data) {
      setLanguages(langsQ.data.map((l) => ({ label: getLocalLabel(l), value: l._id })))
    }
  }, [gradesQ.data, langsQ.data])

  useEffect(() => {
    if (gradesQ.data) {
      const groups = selectedGradeIds
        .map((id) => {
          const gradeObj = gradesQ.data.find((g) => g._id === id)
          if (gradeObj) {
            return {
              label: `Grade ${gradeObj.grade}`,
              options: gradeObj.subjects.map((subject) => ({
                label: subject.name,
                value: subject._id,
              })),
            }
          }
          return null
        })
        .filter((group) => group !== null) as {
        label: string
        options: { label: string; value: string }[]
      }[]
      setAvailableSubjectGroups(groups)

      // Clear selected subjects if they're no longer available
      const availableSubjectIds = groups.flatMap((g) => g.options.map((o) => o.value))
      const currentSubjects = form.getValues("subjectIds")
      const validSubjects = currentSubjects.filter((id) => availableSubjectIds.includes(id))
      if (validSubjects.length !== currentSubjects.length) {
        form.setValue("subjectIds", validSubjects)
      }
    }
  }, [selectedGradeIds, gradesQ.data, form])

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

  const handleGradeChange = (selectedOptions: MultiValue<{ value: string; label: string }> | null) => {
    const ids = selectedOptions ? Array.from(selectedOptions).map((option) => option.value) : []
    setSelectedGradeIds(ids)
    form.setValue("gradeIds", ids)
    form.trigger("gradeIds")
  }

  const handleLanguageChange = (selectedOptions: readonly { value: string; label: string }[] | null) => {
    const ids = selectedOptions ? Array.from(selectedOptions).map((option) => option.value) : []
    form.setValue("languages", ids)
    form.trigger("languages")
  }

  const handleSubjectChange = (selectedOptions: readonly { value: string; label: string }[] | null) => {
    const ids = selectedOptions ? Array.from(selectedOptions).map((option) => option.value) : []
    form.setValue("subjectIds", ids)
    form.trigger("subjectIds")
  }

  const handleSubmit = async (values: z.infer<typeof teacherSignupSchema>) => {
    try {
      setSubmitError(null)

      // Additional validation
      if (values.age < 18 || values.age > 100) {
        setSubmitError("Please enter a valid age between 18 and 100.")
        return
      }

      if (values.teachingExperience < 0 || values.teachingExperience > 50) {
        setSubmitError("Please enter valid years of teaching experience.")
        return
      }

      // Validate that subjects are available for selected grades
      const availableSubjectIds = availableSubjectGroups.flatMap((g) => g.options.map((o) => o.value))
      const invalidSubjects = values.subjectIds.filter((id) => !availableSubjectIds.includes(id))
      if (invalidSubjects.length > 0) {
        setSubmitError("Some selected subjects are not available for the chosen grades. Please review your selections.")
        return
      }

      // If it's a new school (isSchoolName is true), ensure location fields are provided
      if (values.isSchoolName && (!values.woreda || !values.region || !values.zone)) {
        setSubmitError("Please provide complete location information for the new school.")
        return
      }

      const transformedValues: TeacherPayload = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        gender: values.gender,
        age: values.age,
        address: {
          region: values.region || "",
          woreda: values.woreda || "",
          zone: values.zone || "",
        },
        languagesSpoken: values.languages,
        subject: values.subjectIds,
        grades: values.gradeIds,
        teachingExperience: values.teachingExperience,
        school: values.schoolId,
        password: values.password,
      }
      signup(transformedValues, {
        onSuccess: () => {
          setSuccess(true)
        },
        onError: (e: any) => {
          setSubmitError(getErrorMessage(e))
        },
      })
    } catch (error) {
      console.error("Form submission error:", error)
      setSubmitError(getErrorMessage(error))
    }
  }

  // Early return on success
  if (success) {
    return <Success message="Teacher account created successfully" />
  }

  const retry = () => {
    if (!gradesQ.data) gradesQ.refetch()
    if (!schoolQ.data) schoolQ.refetch()
    if (!langsQ.data) langsQ.refetch()
  }

  const isLoadingData = schoolQ.isLoading || gradesQ.isLoading || langsQ.isLoading
  const dataError = schoolQ.error || gradesQ.error || langsQ.error
  const showForm = schoolQ.data && gradesQ.data && langsQ.data

  return (
    <div className="min-h-screen">
      <Card className="w-full max-w-4xl mx-auto border bg-white/95 backdrop-blur-sm">

        <CardContent className="p-8">
          <LoadingBox isLoading={isLoadingData} />
          <ErrorMessage error={dataError} retry={retry} />

          {showForm && (
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
                              className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
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
                              className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
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
                              className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
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
                              className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                   <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-medium">Password</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your password"
                              type="password"
                              className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                              className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
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
                          <FormLabel className="text-slate-700 font-medium">Gender</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500">
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

                    <FormField
                      control={form.control}
                      name="teachingExperience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-medium">Years of Experience</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="5"
                              type="number"
                              min="0"
                              max="50"
                              className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                              {...field}
                              onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* School & Location Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-lg font-semibold text-slate-700 border-b border-slate-200 pb-2">
                    <MapPin className="h-5 w-5" />
                    School & Location
                  </div>

                  <FormField
                    control={form.control}
                    name="schoolId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium">School</FormLabel>
                        <FormControl>
                          <WritableDropdown
                            options={schoolQ.data.schools
                              .map((s) => ({
                                label: `${s.name} (${s.woreda})`,
                                value: s._id,
                              }))
                              .sort((a, b) => (a.label < b.label ? -1 : 1))}
                            value={field.value?.toString()}
                            onValueChange={(v) => {
                              const school = schoolQ.data.schools.find((s) => s._id === v)
                              const isSchoolName = v !== "" && school === undefined
                              form.setValue("isSchoolName", isSchoolName)
                              field.onChange(v)
                              if (!isSchoolName && school) {
                                form.setValue("woreda", school.woreda || "")
                                form.setValue("region", school.region || "")
                                form.setValue("zone", school.zone || "")
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {formState.isSchoolName && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <FormField
                        control={form.control}
                        name="woreda"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-medium">Woreda</FormLabel>
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
                      )}

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

                {/* Teaching Information Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-lg font-semibold text-slate-700 border-b border-slate-200 pb-2">
                    <BookOpen className="h-5 w-5" />
                    Teaching Information
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

                  <FormField
                    control={form.control}
                    name="gradeIds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium">Grades</FormLabel>
                        <FormControl>
                          <ReactSelect
                            isMulti
                            options={grades}
                            value={grades.filter((opt) => field.value.includes(opt.value))}
                            onChange={(selected) => handleGradeChange(selected)}
                            styles={selectStyles}
                            placeholder="Select grades..."
                            className="text-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subjectIds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium">Subjects</FormLabel>
                        <FormControl>
                          <ReactSelect
                            isMulti
                            options={availableSubjectGroups}
                            value={availableSubjectGroups
                              .flatMap((group) => group.options)
                              .filter((opt) => field.value.includes(opt.value))}
                            onChange={(selected) => handleSubjectChange(selected)}
                            styles={selectStyles}
                            placeholder={
                              selectedGradeIds.length === 0
                                ? "Please select grades first..."
                                : "Select subjects..."
                            }
                            isDisabled={selectedGradeIds.length === 0}
                            className="text-sm"
                          />
                        </FormControl>
                        <FormMessage />
                        {selectedGradeIds.length === 0 && (
                          <p className="text-sm text-slate-500 mt-1">Select grades first to see available subjects</p>
                        )}
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
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                      Creating Your Account...
                    </>
                  ) : (
                    <>
                      <GraduationCap className="mr-3 h-5 w-5" />
                      Create Teacher Account
                    </>
                  )}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  )

}
