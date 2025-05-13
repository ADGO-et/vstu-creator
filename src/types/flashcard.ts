export interface Flashcard {
  id: string;
  gradeId: string;
  subjectId: string;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFlashcardInput {
  gradeId: string;
  subjectId: string;
  question: string;
  answer: string;
}