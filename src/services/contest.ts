import { apiClient } from "@/lib/axios";
import {
  AddContest,
  ContestParticipants,
  ContestSubmitPayload,
  ContestSubmitResponse,
  ContestType,
  Main,
} from "@/types/contest";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
// import { useGetTopics } from "./quiz";

const CONTESTS = "contests";

// //Todo: filter by gradeId and subject on backend
// export function useGetLatestContests(
//   options: {
//     gradeId?: string;
//     subject?: string;
//   } = {}
// ) {
//   //Todo: remove topicQ after backend filters by gradeId and subject

//   const topicQ = useGetTopics({ enabled: true });

//   const { gradeId, subject } = options;
//   return useQuery<ContestType[], AxiosError>({
//     queryKey: [CONTESTS, "latest", options],
//     enabled: topicQ.isSuccess,

//     queryFn: async () => {
//       const res = await apiClient.get<{ contests: ContestType[] }>(
//         //Todo: restore /latest after backend shows all future contests (somehow selective currently)
//         "/contests"
//       );

//       const topics = topicQ.data || [];

//       //Todo: filter by gradeId and subject on backend
//       const data = res.data.contests.filter((c) => {
//         //Todo: until backend avoid creation of null quizzes
//         if (!c.quiz) return false;

//         //if today is after end time, filter out
//         if (new Date().getTime() > new Date(c.endTime).getTime()) {
//           return false;
//         }

//         const topic = topics.find((t) => t._id === c.quiz.topic);
//         if (!topic) {
//           console.error(`Topic of contest :${c.quiz.topic} not found`);
//           return false;
//         }

//         if (gradeId && topic.grade._id !== gradeId) return false;
//         if (subject && topic.subject._id !== subject) return false;
//         return true;
//       });

//       return data;
//     },
//   });
// }

// Updated useGetLatestContests with a unique query key
export function useGetLatestContestsStudent(page?: number, limit?: number) {
  return useQuery<Main, AxiosError>({
    queryKey: [CONTESTS, "latest", { page, limit }],
    queryFn: async () => {
      const res = await apiClient.get<Main>(`/contests/me/latest`, {
        params: {
          ...(page !== undefined && { page }),
          ...(limit !== undefined && { limit }),
        },
      });
      return res.data;
    },
  });
}

export function useGetLatestContests(page?: number, limit?: number) {
  return useQuery<Main, AxiosError>({
    queryKey: [CONTESTS, "latest", { page, limit }],
    queryFn: async () => {
      const res = await apiClient.get<Main>(`/contests/latest`, {
        params: {
          ...(page !== undefined && { page }),
          ...(limit !== undefined && { limit }),
        },
      });
      return res.data;
    },
  });
}


// Updated useGetContests with a unique query key
export function useGetContests(page?: number, limit?: number) {
  return useQuery<Main, AxiosError>({
    queryKey: [CONTESTS, "all", { page, limit }],
    queryFn: async () => {
      const res = await apiClient.get<Main>(`/contests`, {
        params: {
          ...(page !== undefined && { page }),
          ...(limit !== undefined && { limit }),
        },
      });
      return res.data;
    },
  });
}

// export function useGetLiveContests() {
//   return useQuery<Main, AxiosError>({
//     queryKey: [CONTESTS],
//     queryFn: async () => {
//       const res = await apiClient.get<Main>(`/contests/me`);
//       return res.data;
//     },
//   });
// }

export function useCreateContest() {
  const client = useQueryClient();
  return useMutation<void, AxiosError, AddContest>({
    mutationFn: async (contest) => {
      await apiClient.post("/contests", contest);
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [CONTESTS] });
    },
  });
}

export function useGetContest(contestId: string) {
  return useQuery<ContestType, AxiosError>({
    queryKey: [CONTESTS, contestId],
    queryFn: async () => {
      const res = await apiClient.get<ContestType>(`/contests/${contestId}`);
      return res.data;
    },
  });
}

// this endpoint is for registering a student during contest
export function useEnterContest(contestId: string) {
  return useMutation<void, AxiosError>({
    mutationFn: async () => {
      await apiClient.patch(`/contests/${contestId}/enter`);
    },
  });
}

// this endpoint is for submitting a contest

export function useSubmitContest(contestId: string) {
  const queryClient = useQueryClient();
  return useMutation<ContestSubmitResponse, AxiosError, ContestSubmitPayload>({
    mutationFn: async (payload) => {
      const res = await apiClient.post<ContestSubmitResponse>(
        `/contests/${contestId}/submit`,
        payload
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contests"] });
    },
  });
}

// this endpoint is for getting a specific contest details including quizzes
export function useGetContestDetails(contestId: string) {
  return useQuery<ContestType, AxiosError>({
    queryKey: [CONTESTS, contestId, "details"],
    queryFn: async () => {
      const res = await apiClient.get<ContestType>(`/contests/${contestId}`);
      return res.data;
    },
  });
}

export function useGetContestParticipants(
  contestId: string,
  page?: number,
  limit?: number
) {
  return useQuery<ContestParticipants, AxiosError>({
    queryKey: [CONTESTS, contestId, "participants", { page, limit }],
    queryFn: async () => {
      const res = await apiClient.get<ContestParticipants>(
        `/contests/${contestId}/participants`,
        {
          params: {
            ...(page !== undefined && { page }),
            ...(limit !== undefined && { limit }),
          },
        }
      );
      return res.data;
    },
  });
}
