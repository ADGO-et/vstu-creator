import { apiClient } from "@/lib/axios";
import { SchoolApiResponse } from "@/types/school";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const SCHOOLS = "schools";

export function useGetAllSchools() {
  return useQuery<SchoolApiResponse, AxiosError>({
    queryKey: [SCHOOLS],
    queryFn: async () => {
      const res = await apiClient.get("/schools?limit=1200");
      return res.data;
    },
  });
}
