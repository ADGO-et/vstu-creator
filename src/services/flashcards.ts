import { apiClient } from "@/lib/axios";
import { Flashcard, CreateFlashcardInput } from "@/types/flashcard";

export const createFlashcard = async (
  data: CreateFlashcardInput
): Promise<Flashcard> => {
  const response = await apiClient.post("/flashcards", data);
  return response.data;
};

export const getFlashcardsByGradeAndSubject = async (
  gradeId: string,
  subjectId: string
): Promise<Flashcard[]> => {
  const response = await apiClient.get(
    `/flashcards?gradeId=${gradeId}&subjectId=${subjectId}`
  );
  return response.data;
};
