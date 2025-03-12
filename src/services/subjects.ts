import { apiClient } from "@/lib/axios";
import { Subject } from "@/types/grade";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";

export function useGetSubjects() {
  return useQuery<Subject[], AxiosError>({
    queryKey: ["subjects"],
    queryFn: async () => {
      const res = await apiClient.get<{ subjects: Subject[] }>("/subjects");
      return res.data.subjects;
    },
  });
}

export function useGetSubject(id: string | null) {
  return useQuery<Subject, AxiosError>({
    queryKey: ["subject", id],
    enabled: id !== null,
    queryFn: async () => {
      const res = await apiClient.get<Subject>(`/subjects/${id}`);
      return res.data;
    },
  });
}

export const useAddSubject = () => {
  return useMutation<
    AxiosResponse<Subject>,
    AxiosError,
    { name: string; language: string }
  >({
    mutationFn: async (newSubject) => {
      return await apiClient.post("/subjects", newSubject);
    },
  });
};

export const useEditSubject = () => {
  return useMutation<
    AxiosResponse<Subject>,
    AxiosError,
    { id: string; subject: { name: string; language: string } }
  >({
    mutationFn: async ({ id, subject }) => {
      return apiClient.patch(`/subjects/${id}`, subject);
    },
  });
};
