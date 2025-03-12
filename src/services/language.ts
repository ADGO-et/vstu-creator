import { apiClient } from "@/lib/axios";
import { Language } from "@/types/language";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";

const LANGUAGES = "languages";

// Fetch the list of languages
export const useLanguages = () => {
  return useQuery<Language[], AxiosError>({
    queryKey: [LANGUAGES],
    queryFn: async () => {
      const { data } = await apiClient.get<{ languages: Language[] }>(
        "/languages"
      );

      return data.languages.map((lang) => ({
        ...lang,
        name: lang.language,
      }));
    },
    staleTime: 300000,
  });
};

// Create a new language
export const useCreateLanguage = () => {
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<{ _id: string; language: string; slug: string }>,
    AxiosError,
    Omit<Language, "_id">
  >({
    mutationFn: async (newLanguage) => {
      return apiClient.post(
        "/languages",
        {
          language: newLanguage.language,
          slug: newLanguage.slug,
        },
        {
          withCredentials: true,
        }
      );
    },
    onSuccess: (response) => {
      const createdLanguage = response.data;
      console.log("Created Language:", createdLanguage);

      queryClient.invalidateQueries({ queryKey: [LANGUAGES] });
    },
  });
};

export const useUpdateLanguage = (id: string) => {
  const queryClient = useQueryClient();
  console.log(id, "id");
  return useMutation<AxiosResponse, AxiosError, Omit<Language, "_id">>({
    mutationFn: async (updatedLanguage) => {
      return apiClient.patch(`/languages/${id}`, updatedLanguage, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LANGUAGES] });
    },
  });
};

export const useDeleteLanguage = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse, AxiosError>({
    mutationFn: async () => {
      return apiClient.delete(`/languages/${id}`, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LANGUAGES] });
    },
  });
};
