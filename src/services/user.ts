import { apiClient } from "@/lib/axios";
import {
  LoginCreator,
  Parent,
  Student,
} from "@/types/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";

export const USER_KEY = "users";
const STUDENT_PROFILE_QUERY_KEY = "studentProfile";
const PARENT_PROFILE_QUERY_KEY = "parentProfile";

export function useContentCreatorSignin({ onSuccess }: { onSuccess: () => void }) {
  return useMutation<void, AxiosError, LoginCreator>({
    mutationFn: async (info: LoginCreator) => {
      await apiClient.post("/login/creator", info);
    },
    onSuccess,
    retry: 1,
  });
}

export function useGetStudentProfile(options?: { enabled?: boolean }) {
  return useQuery<Student, AxiosError>({
    queryKey: ["studentProfile"],
    queryFn: async () => {
      const res = await apiClient.get(`/students/me`);
      //Todo: remove after every student has a language:{} instead of language:string
      if (!res.data?.language) {
        throw new AxiosError("Student has outdated schema", "404");
      }
      return res.data;
    },
    ...options,
  });
}


export const useGetParentProfile = (options?: { enabled?: boolean }) => {
  return useQuery<Parent, AxiosError>({
    queryKey: ["parentProfile", "me"],
    queryFn: async () => {
      const { data } = await apiClient.get<Parent>(`/parents/me`);
      return data;
    },
    ...options,
  });
};

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation<AxiosResponse, AxiosError>({
    mutationFn: async () => {
      //Better if was a post request
      return await apiClient.get("/logout");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [STUDENT_PROFILE_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [PARENT_PROFILE_QUERY_KEY] });
    },
  });
}