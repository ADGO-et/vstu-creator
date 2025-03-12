export interface Language {
  _id: string;
  language: string;
  slug: string;
}

export interface Subject {
  [x: string]: any;
  _id: string;
  name: string;
  language: Language;
}

export interface Grade {
  _id: string;
  grade: number;
  subjects: Subject[];
}

export interface GradePayload {
  _id: string
  grade: number;
  subjects: string[];
}

export interface GradeWithInfo {
  studentCount: number;
  quizCount: number;
  contestCount: number;
  subjects: string[];
  gradeId: string;
  grade: number;
}


export interface GradeInfoResponse {
  grades: GradeWithInfo[],
  totalCount: number,
}