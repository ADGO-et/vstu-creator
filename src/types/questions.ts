export interface QuestionGeneratePayload {
  text: string;
  limit: number;
  grade?: number;
  difficulty?: number;
  subject?: string;
}

export interface QuestionType {
  text: string;
}

export interface QuestionResponse {
  question: string;
  options?: string[];
  choices?: string[];
}

export interface ReportedQuestionIssue {
  student: string;
  issue: string;
  reported: boolean;
}

export interface ReportedQuestion {
  _id: string;
  question: string;
  choices: string[];
  questionReported: number;
  issues: ReportedQuestionIssue[];
  __v: number;
}

export interface ReportedQuestionsResponse {
  questions: ReportedQuestion[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export interface QuestionType2 {
  _id: string;
  question: string;
  choices: string[];
  questionReported: number;
  issues: ReportedQuestionIssue[];
  __v: number;
}

// new type for fixing the errors in extract question
export interface ExtractQuestionPayload {
  text: string;
  grade: number;
  difficulty: number;
  subject: string;
}
