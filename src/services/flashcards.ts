import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { FlashcardData } from "@/types/flashcard";
import { AxiosResponse, AxiosError } from "axios";

// Create Flashcard
export const useCreateFlashcard = () => {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<any>, AxiosError, FlashcardData>({
    mutationFn: (newCard) => apiClient.post("/flashcard", newCard),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["flashcards", variables.subject],
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
        queryKey: ["flashcards", variables.data.subject],
      });
    },
  });
};

// Delete Flashcard
export const useDeleteFlashcard = () => {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<any>, AxiosError, string>({
    mutationFn: (id) => apiClient.delete(`/flashcard/${id}`),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["flashcards"] }); // fallback
    },
  });
};

// services/flashcards.ts
export const useFlashcardsBySubject = (
  subjectId: string,
  page: number,
  count: number
) => {
  return useQuery<FlashcardData[]>({
    queryKey: ["flashcards", subjectId, page],
    queryFn: async () => {
      const response = await apiClient.get(`/flashcard`, {
        params: {
          subject: subjectId,
          count,
          page, // only if your backend supports it
        },
      });
      return response.data;
    },
    placeholderData: (previousData) => previousData,
  });
};
