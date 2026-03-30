import { useMemo, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type Availability,
  type AvailabilitySlot,
  type DayOfWeek,
  type TutorRegisterPayload,
} from "@/types/teacher";
import {
  useRegisterTutor,
  useGetTeacherProfile,
  useUploadTutorDocument,
} from "@/services/teacher";

// shadcn ui
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const DAYS: DayOfWeek[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

import { useGetSubjects } from "@/services/subjects";
import ReactSelect from "react-select";
import {
  X,
  CheckCircle,
  Upload,
  FileText,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

function makeInitialAvailability(): Availability[] {
  return DAYS.map((day) => ({ day, isAvailable: false, slots: [] }));
}

const selectStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    minHeight: "42px",
    borderColor: state.isFocused ? "hsl(var(--ring))" : "hsl(var(--border))",
    boxShadow: state.isFocused ? "0 0 0 2px hsl(var(--ring))" : "none",
    "&:hover": { borderColor: "hsl(var(--border))" },
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "hsl(var(--primary))"
      : state.isFocused
        ? "hsl(var(--accent))"
        : "transparent",
    color: state.isSelected
      ? "hsl(var(--primary-foreground))"
      : "hsl(var(--foreground))",
  }),
};

// Schema for step 1 - Basic Info
const basicInfoSchema = z.object({
  firstName: z
    .string()
    .min(1, "Required")
    .regex(/^[a-zA-Z]+$/, "Only alphabetic letters allowed"),
  lastName: z
    .string()
    .min(1, "Required")
    .regex(/^[a-zA-Z]+$/, "Only alphabetic letters allowed"),
  phoneNumber: z
    .string()
    .min(1, "Required")
    .regex(/^\+2519\d{8}$/, "Enter a valid phone (e.g. +251911111111)"),
  bio: z.string().min(10, "Please add a short bio (min 10 chars)"),
  educationLevel: z.string().min(1, "Required"),
  institution: z.string().min(1, "Required"),
  subjectsInput: z.string().min(1, "Enter at least one subject"),
  experience: z.coerce.number().min(0, "Must be >= 0"),
  hourlyRate: z.coerce.number().min(0, "Must be >= 0"),
});

// Schema for step 2 - Documents (optional)
const documentsSchema = z.object({
  documentsInput: z.string().optional(),
  idImageUrl: z.string().optional(),
});

type BasicInfoFormValues = z.infer<typeof basicInfoSchema>;
type DocumentsFormValues = z.infer<typeof documentsSchema>;

export default function TutorRegister() {
  const [step, setStep] = useState<1 | 2>(1);
  const [, setRegisteredTutorId] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const { mutateAsync: registerTutor, isPending: isRegistering } =
    useRegisterTutor();
  const { mutateAsync: uploadDoc, isPending: uploading } =
    useUploadTutorDocument();
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string[]>([]);

  const [availability, setAvailability] = useState<Availability[]>(
    makeInitialAvailability(),
  );

  const [message, setMessage] = useState<string | null>(null);
  const { data: subjects } = useGetSubjects();
  const { data: teacherProfile } = useGetTeacherProfile();

  // Form for step 1
  const basicForm = useForm<BasicInfoFormValues>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      bio: "",
      educationLevel: "",
      institution: "",
      subjectsInput: "",
      experience: 0,
      hourlyRate: 0,
    },
    mode: "onTouched",
  });

  // Form for step 2
  const documentsForm = useForm<DocumentsFormValues>({
    resolver: zodResolver(documentsSchema),
    defaultValues: {
      documentsInput: "",
      idImageUrl: "",
    },
    mode: "onTouched",
  });

  const parseCSV = (val: string) =>
    val
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

  const documentsPreview = useMemo(
    () => parseCSV(documentsForm.getValues("documentsInput") || ""),
    [documentsForm.watch("documentsInput")],
  );

  const updateDayAvailability = (
    day: DayOfWeek,
    updater: (a: Availability) => Availability,
  ) => {
    setAvailability((prev) =>
      prev.map((a) => (a.day === day ? updater(a) : a)),
    );
  };

  const addSlot = (day: DayOfWeek) => {
    updateDayAvailability(day, (a) => ({
      ...a,
      isAvailable: true,
      slots: [
        ...a.slots,
        { startTime: "09:00", endTime: "10:00", booked: false },
      ],
    }));
  };

  const updateSlot = (
    day: DayOfWeek,
    index: number,
    slot: AvailabilitySlot,
  ) => {
    updateDayAvailability(day, (a) => {
      const next = [...a.slots];
      next[index] = slot;
      return { ...a, slots: next };
    });
  };

  const removeSlot = (day: DayOfWeek, index: number) => {
    updateDayAvailability(day, (a) => {
      const next = a.slots.filter((_, i) => i !== index);
      return { ...a, slots: next };
    });
  };

  const normalizePhone = (p?: string) => {
    if (!p) return "";
    return p.startsWith("251") ? `0${p.slice(3)}` : p;
  };

  useEffect(() => {
    if (!teacherProfile) return;
    basicForm.reset((prev) => ({
      ...prev,
      firstName: teacherProfile.firstName ?? "",
      lastName: teacherProfile.lastName ?? "",
      phoneNumber: normalizePhone(teacherProfile.phoneNumber),
      experience: teacherProfile.teachingExperience ?? 0,
    }));
  }, [teacherProfile, basicForm]);

  // Step 1: Submit basic info
  const onSubmitBasicInfo = async (values: BasicInfoFormValues) => {
    setMessage(null);

    const payload: Omit<TutorRegisterPayload, "documents" | "id"> = {
      firstName: values.firstName,
      lastName: values.lastName,
      phoneNumber: values.phoneNumber,
      bio: values.bio,
      educationLevel: values.educationLevel,
      institution: values.institution,
      subjects: parseCSV(values.subjectsInput),
      experience: Number(values.experience) || 0,
      hourlyRate: Number(values.hourlyRate) || 0,
      availability: availability.map((a) => ({
        ...a,
        slots: a.isAvailable
          ? a.slots.map((s) => ({ ...s, booked: s.booked ?? false }))
          : [],
      })),
    };

    try {
      const response = await registerTutor(payload as TutorRegisterPayload);

      const tutorId = response?.tutorId || null;
      setRegisteredTutorId(tutorId);
      setRegistrationSuccess(true);
      setMessage(
        "Tutor registered successfully! You can now upload documents.",
      );

      // Move to step 2
      setStep(2);
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Registration failed.");
    }
  };

  const addDocumentUrls = (urls: string[]) => {
    const current = parseCSV(documentsForm.getValues("documentsInput") || "");
    const next = Array.from(new Set([...current, ...urls]));
    documentsForm.setValue("documentsInput", next.join(", "));
    setUploadSuccess((prev) => [...prev, ...urls]);
  };

  const extractUrls = (data: any): string[] => {
    if (!data) return [];
    if (typeof data === "string") return [data];
    if (Array.isArray(data)) return data;
    if (data.url) return [data.url];
    if (data.urls) return data.urls;
    if (data.documents) return data.documents;
    return [];
  };

  const handleUpload = async (file?: File) => {
    if (!file) return;
    setUploadError(null);

    try {
      const res = await uploadDoc(file);
      const urls = extractUrls(res);
      if (urls.length === 0) {
        setUploadError("Upload succeeded but no URL was returned.");
        return;
      }
      addDocumentUrls(urls);
    } catch (err: any) {
      setUploadError(err?.response?.data?.message || "Upload failed.");
    }
  };

  const handleSkipDocuments = () => {
    setMessage(
      "Registration complete. You can upload documents later from your profile.",
    );
    // Reset form or redirect
    setTimeout(() => {
      // Redirect to dashboard or clear form
      basicForm.reset();
      setAvailability(makeInitialAvailability());
      documentsForm.reset();
      setStep(1);
      setRegistrationSuccess(false);
      setRegisteredTutorId(null);
    }, 2000);
  };

  const handleDone = () => {
    setMessage("Registration complete!");
    // Reset and redirect logic here
    setTimeout(() => {
      basicForm.reset();
      setAvailability(makeInitialAvailability());
      documentsForm.reset();
      setStep(1);
      setRegistrationSuccess(false);
      setRegisteredTutorId(null);
      setUploadSuccess([]);
    }, 2000);
  };

  return (
    <div className="py-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create Tutor Account
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {step === 1
              ? "Fill in your basic information to register as a tutor."
              : "Upload verification documents (optional)."}
          </p>
        </div>

        {/* Step indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${step === 1 ? "bg-primary text-primary-foreground" : "bg-primary/20 text-primary"}`}
              >
                1
              </div>
              <span
                className={step === 1 ? "font-medium" : "text-muted-foreground"}
              >
                Basic Information
              </span>
            </div>
            <div className="h-0.5 w-16 bg-border" />
            <div className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${step === 2 ? "bg-primary text-primary-foreground" : registrationSuccess ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}
              >
                2
              </div>
              <span
                className={step === 2 ? "font-medium" : "text-muted-foreground"}
              >
                Documents (Optional)
              </span>
            </div>
          </div>
        </div>

        {message && (
          <Alert
            className={`mb-6 ${
              message.toLowerCase().includes("success") ||
              message.toLowerCase().includes("complete")
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {/* Step 1: Basic Information Form */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                This information will be visible to students when they search
                for tutors.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...basicForm}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    basicForm.handleSubmit(onSubmitBasicInfo)(e);
                  }}
                  className="space-y-8"
                >
                  {/* Personal info */}
                  <section className="space-y-4">
                    <h2 className="text-base font-medium">
                      Personal information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={basicForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First name</FormLabel>
                            <FormControl>
                              <Input placeholder="Abebe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={basicForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last name</FormLabel>
                            <FormControl>
                              <Input placeholder="Kebede" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={basicForm.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone number</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="09xxxxxxxx"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={basicForm.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <textarea
                              rows={3}
                              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              placeholder="Experienced math tutor with 5 years of teaching."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </section>

                  {/* Education */}
                  <section className="space-y-4">
                    <h2 className="text-base font-medium">Education</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={basicForm.control}
                        name="educationLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Education level</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="High School">
                                    High School
                                  </SelectItem>
                                  <SelectItem value="Diploma">
                                    Diploma
                                  </SelectItem>
                                  <SelectItem value="Bachelor's Degree">
                                    Bachelor's Degree
                                  </SelectItem>
                                  <SelectItem value="Master's Degree">
                                    Master's Degree
                                  </SelectItem>
                                  <SelectItem value="PhD">PhD</SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={basicForm.control}
                        name="institution"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Institution</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Addis Ababa University"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </section>

                  {/* Subjects, Experience and Rate */}
                  <section className="space-y-4">
                    <h2 className="text-base font-medium">Expertise & Rate</h2>

                    <FormField
                      control={basicForm.control}
                      name="subjectsInput"
                      render={({ field }) => {
                        const ids = parseCSV(field.value);
                        const options =
                          subjects?.map((s) => ({
                            value: s._id,
                            label: s.name,
                          })) ?? [];
                        const selected = options.filter((o) =>
                          ids.includes(o.value),
                        );

                        const setIds = (nextIds: string[]) =>
                          field.onChange(nextIds.join(", "));

                        return (
                          <FormItem>
                            <FormLabel>Subjects</FormLabel>
                            <FormControl>
                              <ReactSelect
                                isMulti
                                options={options}
                                value={selected}
                                onChange={(selectedOptions) => {
                                  const nextIds = (selectedOptions ?? []).map(
                                    (o) => o.value,
                                  );
                                  setIds(nextIds);
                                }}
                                styles={selectStyles}
                                placeholder="Select subjects..."
                                className="text-sm"
                                classNamePrefix="rs"
                                isLoading={!subjects}
                              />
                            </FormControl>
                            <FormMessage />
                            {selected.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {selected.map((opt) => (
                                  <span
                                    key={opt.value}
                                    className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs text-muted-foreground"
                                    title={opt.label}
                                  >
                                    {opt.label}
                                    <button
                                      type="button"
                                      className="text-muted-foreground hover:text-foreground"
                                      onClick={() => {
                                        const nextIds = selected
                                          .filter((s) => s.value !== opt.value)
                                          .map((s) => s.value);
                                        setIds(nextIds);
                                      }}
                                    >
                                      <X size={12} />
                                    </button>
                                  </span>
                                ))}
                              </div>
                            )}
                          </FormItem>
                        );
                      }}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={basicForm.control}
                        name="experience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Experience (years)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                placeholder="4"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={basicForm.control}
                        name="hourlyRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hourly rate (ETB)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                placeholder="300"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </section>

                  {/* Availability */}
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-base font-medium">Availability</h2>
                      <p className="text-xs text-muted-foreground">
                        Toggle days and add time slots
                      </p>
                    </div>

                    <div className="space-y-4">
                      {availability.map((a) => (
                        <div key={a.day} className="rounded-md border p-3">
                          <div className="flex items-center justify-between gap-3">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                className="h-4 w-4 accent-primary"
                                checked={a.isAvailable}
                                onChange={(e) =>
                                  updateDayAvailability(a.day, (cur) => ({
                                    ...cur,
                                    isAvailable: e.target.checked,
                                  }))
                                }
                              />
                              <span className="font-medium">{a.day}</span>
                            </label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addSlot(a.day)}
                              disabled={!a.isAvailable}
                            >
                              Add slot
                            </Button>
                          </div>

                          {a.isAvailable && a.slots.length === 0 && (
                            <p className="text-xs text-muted-foreground mt-2">
                              No slots added.
                            </p>
                          )}

                          {a.isAvailable && a.slots.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {a.slots.map((s, i) => (
                                <div
                                  key={`${a.day}-slot-${i}`}
                                  className="grid grid-cols-12 gap-2"
                                >
                                  <div className="col-span-5">
                                    <label className="block text-xs text-muted-foreground">
                                      Start
                                    </label>
                                    <Input
                                      type="time"
                                      value={s.startTime}
                                      onChange={(e) =>
                                        updateSlot(a.day, i, {
                                          ...s,
                                          startTime: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="col-span-5">
                                    <label className="block text-xs text-muted-foreground">
                                      End
                                    </label>
                                    <Input
                                      type="time"
                                      value={s.endTime}
                                      onChange={(e) =>
                                        updateSlot(a.day, i, {
                                          ...s,
                                          endTime: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="col-span-2 flex items-end">
                                    <Button
                                      type="button"
                                      variant="destructive"
                                      size="sm"
                                      className="w-full"
                                      onClick={() => removeSlot(a.day, i)}
                                    >
                                      <X size={14} />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isRegistering} size="lg">
                      {isRegistering ? "Registering..." : "Register & Continue"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Documents Upload */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Registration Complete - Upload Documents (Optional)
              </CardTitle>
              <CardDescription>
                You've successfully registered as a tutor. You can upload
                verification documents now or do it later from your profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...documentsForm}>
                <div className="space-y-6">
                  {/* Upload Area */}
                  <div className="rounded-lg border border-dashed p-6">
                    <div className="flex flex-col items-center justify-center gap-2 text-center">
                      <div className="rounded-full bg-primary/10 p-3">
                        <Upload className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-medium">Upload Documents</h3>
                      <p className="text-sm text-muted-foreground max-w-md">
                        Upload your academic credentials, certifications, or ID
                        for verification. Supported formats: PDF, JPG, PNG
                      </p>

                      <div className="mt-4 w-full max-w-sm">
                        <Input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          disabled={uploading}
                          onChange={(e) => handleUpload(e.target.files?.[0])}
                          className="cursor-pointer"
                        />
                        {uploadError && (
                          <p className="mt-2 text-xs text-red-600">
                            {uploadError}
                          </p>
                        )}
                        {uploading && (
                          <p className="mt-2 text-xs text-muted-foreground">
                            Uploading...
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Uploaded Documents Preview */}
                  {documentsPreview.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Uploaded Documents ({documentsPreview.length})
                      </h3>
                      <div className="grid gap-2">
                        {documentsPreview.map((url, i) => (
                          <div
                            key={`${url}-${i}`}
                            className="flex items-center justify-between rounded-md border p-3"
                          >
                            <div className="flex items-center gap-2 truncate">
                              <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                              <span className="text-sm truncate">
                                {url.split("/").pop() || `Document ${i + 1}`}
                              </span>
                            </div>
                            <a
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-primary hover:underline shrink-0"
                            >
                              View
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Success Message */}
                  {uploadSuccess.length > 0 && (
                    <Alert className="bg-green-50 text-green-700 border-green-200">
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        Successfully uploaded {uploadSuccess.length} document
                        {uploadSuccess.length !== 1 ? "s" : ""}.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-6">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleSkipDocuments}>
                  Skip for Now
                </Button>
                <Button onClick={handleDone}>Complete Registration</Button>
              </div>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
