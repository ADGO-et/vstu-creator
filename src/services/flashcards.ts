import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { FlashcardData, FlashcardApiResponse } from "@/types/flashcard";
import { AxiosResponse, AxiosError } from "axios";

// Create Flashcard
export const useCreateFlashcard = () => {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<any>, AxiosError, FlashcardData>({
    mutationFn: (newCard) => apiClient.post("/flashcard", newCard),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["adminFlashcards", variables.subject],
      });
    },
  });
};

// Update Flashcard
export const useUpdateFlashcard = () => {
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<any>,
    AxiosError,
    { id: string; data: FlashcardData }
  >({
    mutationFn: ({ id, data }) => apiClient.patch(`/flashcard/${id}`, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["adminFlashcards", variables.data.subject],
      });
    },
  });
};

// Delete Flashcard
export const useDeleteFlashcard = () => {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<any>, AxiosError, string>({
    mutationFn: (id) => apiClient.delete(`/flashcard/${id}`),
    onSuccess: (_data) => {
      queryClient.invalidateQueries({ queryKey: ["adminFlashcards"] }); // fallback
    },
  });
};

// Get Flashcards with Pagination
export const useFlashcardsBySubject = (
  subjectId: string,
  page: number,
  limit: number
) => {
  return useQuery<FlashcardApiResponse>({
    queryKey: ["flashcards", subjectId, page],

    queryFn: async () => {
      const response = await apiClient.get("/flashcard/admin", {
        params: {
          subject: subjectId,
          page,
          limit,

        },
      });
      return response.data;
    },
    placeholderData: (previousData) => previousData,
  });
};


export const useAdminFlashcards = (
  subjectId: string,
  page: number,
  limit: number
) => {
  return useQuery<{ flashcards: FlashcardData[]; totalCount: number }>({
    queryKey: ["adminFlashcards", subjectId, page, limit],
    queryFn: async () => {
      const response = await apiClient.get(`/flashcard/admin`, {
        params: {
          subject: subjectId,
          page,
          limit,
        },
      });
      return response.data;
    },
    placeholderData: (previousData) => previousData,
  });
};
