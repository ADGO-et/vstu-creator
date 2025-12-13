import { apiClient } from "@/lib/axios";
import { SalesPayload, SalesProfileInfo, SalesReferralsResponse } from "@/types/sales";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";


export function useCreateSalesAccount() {
    const client = useQueryClient();
    return useMutation<void, AxiosError, SalesPayload>({
        mutationFn: async (sales) => {
            await apiClient.post("/register/sales", sales);
        },
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ["sales"] });
        },
    });
}


export const useGetSalesProfile = (options?: { enabled?: boolean }) => {
  return useQuery<SalesProfileInfo, AxiosError>({
    queryKey: ["salesProfile", "me"],
    queryFn: async () => {
      const { data } = await apiClient.get<SalesProfileInfo>(`/sales/me`);
      return data;
    },
    ...options,
  });
};



export const useGetSalesReferals = (page: number, limit: number) => {
  return useQuery<SalesReferralsResponse, AxiosError>({
    queryKey: ["salesReferrals", "me", page, limit],
    queryFn: async () => {
      const { data } = await apiClient.get<SalesReferralsResponse>(`/referrals/me`, {
        params: { page, limit },
      });
      return data;
    },
  });
};
