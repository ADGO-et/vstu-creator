// Single flashcard structure
export interface FlashcardData {
  _id?: string;
  subject: string;
  front: string;
  back: string;
}


// Pagination response type from the backend
export interface FlashcardApiResponse {
  flashcards: FlashcardData[];
  totalPages: number;
  currentPage: number;
  totalPage: number; 
}
// Input type for creating a flashcard (without ID)
export type CreateFlashcardInput = Omit<FlashcardData, "_id">;
