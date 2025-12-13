import { apiClient } from "@/lib/axios";
import { TeacherPayload, TeacherProfileInfo, TeacherReferralsResponse } from "@/types/teacher";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";


export function useCreateTeacherAccount() {
    const client = useQueryClient();
    return useMutation<void, AxiosError, TeacherPayload>({
        mutationFn: async (teacher) => {
            await apiClient.post("/register/teacher", teacher);
        },
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ["teacher"] });
        },
    });
}


export const useGetTeacherProfile = (options?: { enabled?: boolean }) => {
  return useQuery<TeacherProfileInfo, AxiosError>({
    queryKey: ["teacherProfile", "me"],
    queryFn: async () => {
      const { data } = await apiClient.get<TeacherProfileInfo>(`/teachers/me`);
      return data;
    },
    ...options,
  });
};


export const useGetTeacherReferals = (page: number, limit: number) => {
  return useQuery<TeacherReferralsResponse, AxiosError>({
    queryKey: ["teacherReferrals", "me", page, limit],
    queryFn: async () => {
      const { data } = await apiClient.get<TeacherReferralsResponse>(`/referrals/me`, {
        params: { page, limit },
      });
      return data;
    },
  });
};
