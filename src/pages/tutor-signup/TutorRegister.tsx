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
import { useRegisterTutor, useGetTeacherProfile } from "@/services/teacher";

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
import { X } from "lucide-react";

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
const schema = z.object({
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
    .regex(/^0\d{9}$/, "Enter a valid phone (10 digits, starts with 0)"),
  bio: z.string().min(10, "Please add a short bio (min 10 chars)"),
  educationLevel: z.string().min(1, "Required"),
  institution: z.string().min(1, "Required"),
  subjectsInput: z.string().min(1, "Enter at least one subject ID"),
  experience: z.coerce.number().min(0, "Must be >= 0"),
  hourlyRate: z.coerce.number().min(0, "Must be >= 0"),
  documentsInput: z.string().optional(),
  idImageUrl: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function TutorRegister() {
  const { mutateAsync, isPending } = useRegisterTutor();
  const [availability, setAvailability] = useState<Availability[]>(
    makeInitialAvailability(),
  );
  const [message, setMessage] = useState<string | null>(null);
  const { data: subjects } = useGetSubjects();
  const { data: teacherProfile } = useGetTeacherProfile();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
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
    () => parseCSV(form.getValues("documentsInput") || ""),
    [form.watch("documentsInput")],
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
    // API gives "2519xxxxxxxx", form expects "09xxxxxxxx"
    return p.startsWith("251") ? `0${p.slice(3)}` : p;
  };
  useEffect(() => {
    if (!teacherProfile) return;
    form.reset((prev) => ({
      ...prev,
      firstName: teacherProfile.firstName ?? "",
      lastName: teacherProfile.lastName ?? "",
      phoneNumber: normalizePhone(teacherProfile.phoneNumber),
      experience: teacherProfile.teachingExperience ?? 0,
    }));
  }, [teacherProfile, form]);

  const onSubmit = async (v: FormValues) => {
    setMessage(null);

    const payload: TutorRegisterPayload = {
      firstName: v.firstName,
      lastName: v.lastName,
      phoneNumber: v.phoneNumber,
      bio: v.bio,
      educationLevel: v.educationLevel,
      institution: v.institution,
      subjects: parseCSV(v.subjectsInput),
      experience: Number(v.experience) || 0,
      hourlyRate: Number(v.hourlyRate) || 0,
      availability: availability.map((a) => ({
        ...a,
        slots: a.isAvailable
          ? a.slots.map((s) => ({ ...s, booked: s.booked ?? false }))
          : [],
      })),
      documents: v.documentsInput ? parseCSV(v.documentsInput) : [],
      id: v.idImageUrl || "",
    };

    try {
      await mutateAsync(payload);
      setMessage("Tutor registered successfully.");
      // form.reset();
      // setAvailability(makeInitialAvailability());
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create Tutor Account
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Fill the form below. Make sure you are signed in as a Teacher.
        </p>
      </div>

      {message && (
        <div
          className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
            message.toLowerCase().includes("success")
              ? "border-green-300 bg-green-50 text-green-700"
              : "border-red-300 bg-red-50 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit(onSubmit)(e);
          }}
          className="space-y-8"
        >
          {/* Personal info */}
          <section className="rounded-lg border bg-card text-card-foreground shadow p-6 space-y-4">
            <h2 className="text-base font-medium">Personal information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
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
                control={form.control}
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
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="09xxxxxxxx" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
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
          <section className="rounded-lg border bg-card text-card-foreground shadow p-6 space-y-4">
            <h2 className="text-base font-medium">Education</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
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
                          <SelectItem value="Diploma">Diploma</SelectItem>
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
                control={form.control}
                name="institution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institution</FormLabel>
                    <FormControl>
                      <Input placeholder="Addis Ababa University" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>

          {/* Subjects, Experience and Rate */}
          <section className="rounded-lg border bg-card text-card-foreground shadow p-6 space-y-4">
            <h2 className="text-base font-medium">Expertise & Rate</h2>

            <FormField
              control={form.control}
              name="subjectsInput"
              render={({ field }) => {
                const ids = parseCSV(field.value);
                const options =
                  subjects?.map((s) => ({ value: s._id, label: s.name })) ?? [];
                const selected = options.filter((o) => ids.includes(o.value));

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
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience (years)</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} placeholder="4" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hourlyRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hourly rate</FormLabel>
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
          <section className="rounded-lg border bg-card text-card-foreground shadow p-6 space-y-4">
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
                              className="w-full"
                              onClick={() => removeSlot(a.day, i)}
                            >
                              Remove
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

          {/* Documents */}
          <section className="rounded-lg border bg-card text-card-foreground shadow p-6 space-y-4">
            <h2 className="text-base font-medium">Verification</h2>

            <FormField
              control={form.control}
              name="documentsInput"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Documents (comma-separated URLs)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://.../id.pdf, https://.../cert.pdf"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  {documentsPreview.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {documentsPreview.map((d, i) => (
                        <a
                          key={`${d}-${i}`}
                          href={d}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                          title={d}
                        >
                          {d.length > 36 ? d.slice(0, 33) + "..." : d}
                        </a>
                      ))}
                    </div>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="idImageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://.../id/front.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Registering..." : "Register"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
