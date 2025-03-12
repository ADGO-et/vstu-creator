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