export interface TeacherPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  age: number;
  address: {
    region: string;
    woreda: string;
    zone: string;
  };
  languagesSpoken: string[];
  subject: string[];
  grades: string[];
  teachingExperience: number;
  school: string;
  password: string;
}

export interface TeacherProfileInfo {
  _id: string;
  role: "teacher";
  email: string;
  age: number;
  phoneNumber: string;
  gender: string;
  firstName: string;
  lastName: string;
  address: {
    region: string;
    zone: string;
    woreda: string;
    _id: string;
  };
  teachingExperience: number;
  school: string;
  grade: string[];
  subject: {
    _id: string;
    name: string;
    language: string;
    stream: string | null;
    __v: number;
  }[];
  languagesSpoken: {
    _id: string;
    language: string;
    slug: string;
    __v?: number;
  }[];
  grades: {
    _id: string;
    grade: number;
    subjects: string[];
    __v: number;
  }[];
  contests: number;
  isVerified: boolean;
  teacher_id: string;
  createdAt: string;
  updatedAt: string;
  quizzes: number;
}

export interface ReferredStudent {
  _id: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface ReferredParent {
  _id: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface Referral {
  _id: string;
  referralCode: string;
  referredParentId: string;
  referredStudentId: string;
  referredParent: ReferredParent;
  referredStudent: ReferredStudent;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherReferralsResponse {
  referrals: Referral[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

//tutor

export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export interface AvailabilitySlot {
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  booked?: boolean; // defaults false
}

export interface Availability {
  day: DayOfWeek;
  isAvailable: boolean;
  slots: AvailabilitySlot[];
}

export interface TutorSubject {
  _id: string;
  name: string;
}

export interface TutorRegisterPayload {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  bio: string;
  educationLevel: string;
  institution: string;
  subjects: string[];
  experience: number; // years
  hourlyRate: number;
  availability: Availability[];
  documents: string[]; // URLs
  id: string;
}

export interface TutorRegisterResponse {
  message: string;
  tutorId: string;
}

export interface Tutor {
  _id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  bio: string;
  educationLevel: string;
  institution: string;
  subjects: string[];
  experience: number;
  hourlyRate: number;
  availability: Availability[];
  documents: string[];
  id: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface TutorProfile {
  _id: string;
  teacher: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  bio?: string;
  educationLevel?: string;
  institution?: string;
  subjects: TutorSubject[];
  experience?: number;
  hourlyRate?: number;
  availability: any[];
  documents?: string[];
  id?: string;
  status?: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export interface TutorSubjectRef {
  _id: string;
  name: string;
}

export interface TutorWithSubjects extends Omit<Tutor, "subjects"> {
  subjects: TutorSubjectRef[];
  status?: "pending" | "approved" | "rejected";
}

export interface CheckTutorRegistrationResponse {
  isRegistered: boolean;
  message: string;
  tutor: TutorProfile | null;
}
