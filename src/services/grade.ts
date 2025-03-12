import { apiClient } from "@/lib/axios";
import { Grade, GradeInfoResponse, GradePayload } from "@/types/grade";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";

const GRADES = "grades";

export function useGetGrades() {
  return useQuery<Grade[], AxiosError>({
    queryKey: [GRADES],
    queryFn: async () => {
      const res = await apiClient.get<{ grades: Grade[] }>("/grades");
      return res.data.grades;
    },
  });
}

export function useGetGradesWithInfo() {
  return useQuery<GradeInfoResponse, AxiosError>({
    queryKey: [GRADES, "info"],
    queryFn: async () => {
      const res = await apiClient.get<GradeInfoResponse>("/grades/info");
      return res.data;
    },
  });
}

export function useAddGrade() {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse, AxiosError, Omit<GradePayload, "_id">>({
    mutationFn: async (newGrade) => {
      const subjectIds = newGrade.subjects.map((subject) => {
        if (!subject) throw new Error("Subject ID cannot be null.");
        return subject;
      });

      return await apiClient.post("/grades", {
        grade: newGrade.grade,
        subjects: subjectIds,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GRADES] });
    },
  });
}
export function useGetGrade(id: string | null) {
  return useQuery<Grade, AxiosError>({
    enabled: id !== null,
    queryKey: [GRADES, id],
    queryFn: async () => {
      //Todo: use appropriate one after backend updates
      // const res = await apiClient.get<Grade>(`/grades/${id}`);

      const res = await apiClient.get<{ grades: Grade[] }>("/grades");
      const grade = res.data.grades.find((g) => g._id === id);

      if (!grade) throw new AxiosError("Grade not found", "404");

      return grade;
    },
  });
}

export function useEditGrade() {
  const queryClient = useQueryClient();
  return useMutation<
    AxiosResponse,
    AxiosError,
    { id: string; grade: Omit<GradePayload, "_id"> }
  >({
    mutationFn: async ({ id, grade }) => {
      return apiClient.patch(`/grades/${id}`, grade);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GRADES] });
    },
  });
}

export function useDeleteGrade(id: string) {
  const queryClient = useQueryClient();
  return useMutation<AxiosResponse, AxiosError>({
    mutationFn: async () => {
      return apiClient.delete(`/grades/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GRADES] });
    },
  });
}
