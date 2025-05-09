import { apiClient } from "@/lib/axios";
import { QuestionGeneratePayload, QuestionResponse, QuestionType, ReportedQuestionsResponse } from "@/types/questions";
import {
  useMutation,
  // useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";




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



export function useReportedQuestions({ page, limit }: { page: number; limit: number; }) {
  return useQuery<ReportedQuestionsResponse, AxiosError>({
    queryKey: ["reportedQuestions", page, limit], 
    queryFn: async () => {
      const res = await apiClient.get<ReportedQuestionsResponse>(
        `/questions/reported?page=${page}&limit=${limit}`
      );
      return res.data;
    },
  });
}