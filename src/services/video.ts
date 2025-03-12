import { apiClient } from "@/lib/axios";
import { Main, Video, videoPayload } from "@/types/video";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";


export function useGetvideos(page?: number, limit?: number, grade_id?: string, subject_id?: string, lang_id?: string) {
    return useQuery<Main, AxiosError>({
        queryKey: ["videos", { page, limit, grade_id, subject_id, lang_id }],
        queryFn: async () => {
            const res = await apiClient.get<Main>(`/videos`, {
                params: {
                    ...(page !== undefined && { page }),
                    ...(limit !== undefined && { limit }),
                    ...(grade_id !== undefined && { grade_id }),
                    ...(subject_id !== undefined && { subject_id }),
                    ...(lang_id !== undefined && { lang_id }),
                },
            });
            return res.data;
        },
    });
}

export function useGetVideo(videoId: string, enabled: boolean = true) {
    return useQuery<Video, AxiosError>({
        queryKey: ["videos", videoId],
        queryFn: async () => {
            const res = await apiClient.get<Video>(`/videos/${videoId}`);
            return res.data;
        },
        enabled,
    });
}



export function useGetCustomedvideos(page?: number, limit?: number) {
    return useQuery<Main, AxiosError>({
        queryKey: ["videos", { page, limit }],
        queryFn: async () => {
            const res = await apiClient.get<Main>(`/videos/me`, {
                params: {
                    ...(page !== undefined && { page }),
                    ...(limit !== undefined && { limit }),
                },
            });
            return res.data;
        },
    });
}


export function useDeleteVideo(id: string ) {
    const client = useQueryClient();
    return useMutation<void, AxiosError>({
        mutationFn: async () => {
            await apiClient.delete(`/videos/${id}`);
        },
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ["videos"] });
        },
    });
}



export function useCreateVideo() {
    const client = useQueryClient();
    return useMutation<void, AxiosError, videoPayload>({
        mutationFn: async (video) => {
            await apiClient.post("/videos", video);
        },
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ["videos"] });
        },
    });
}

export function useUpdateVideo(id:string) {
    const client = useQueryClient();
    return useMutation<void, AxiosError, { video: videoPayload }>({
        mutationFn: async ({ video }) => {
            await apiClient.patch(`/videos/${id}`, video);
        },
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ["videos"] });
        },
    });
}
