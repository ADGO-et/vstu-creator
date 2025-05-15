export interface FlashcardData {
  _id?: string;
  subject: string;
  front: string;
  back: string;
  
}
export type CreateFlashcardInput = Omit<FlashcardData, "_id">;
