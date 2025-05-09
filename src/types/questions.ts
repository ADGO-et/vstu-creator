export interface QuestionGeneratePayload {
    text: string;
    limit: number;
}


export interface QuestionType {
    text: string;
}

export interface QuestionResponse {
    question: string;
    options: string[];
  }

export interface ReportedQuestionIssue {
student: string;
issue: string;
reported: boolean
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
