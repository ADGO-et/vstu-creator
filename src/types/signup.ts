export type UserRole = 'teacher' | 'sales';

export interface BaseSignupData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  age: number;
  gender: string;
  location: string;
  languagesSpoken: string[];
}

export interface TeacherSignupData extends BaseSignupData {
  subjects: string[];
  grades: string[];
  school: string;
  yearsOfTeachingExperience: number;
}

export type SalesSignupData = BaseSignupData

export interface SignupState {
  role: UserRole;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}