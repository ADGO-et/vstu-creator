import { apiClient } from "@/lib/axios";
import { QuestionGeneratePayload, QuestionResponse, QuestionType } from "@/types/questions";
import {
  useMutation,
  // useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";



export function useGenerateQuestion() {
  return useMutation<QuestionResponse[], AxiosError, QuestionGeneratePayload>({
    mutationFn: async (payload) => {
      const res = await apiClient.post<QuestionResponse[]>(`/generate-content/generate`, payload);
      return res.data; 
    },
  });
}



export function useExtractQuestion() {
  return useMutation<QuestionResponse[], AxiosError, QuestionType>({
    mutationFn: async (payload) => {
      const res = await apiClient.post<QuestionResponse[]>(`/generate-content/extract`, payload);
      return res.data; 
    },
  });
}


