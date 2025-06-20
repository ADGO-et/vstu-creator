import { apiClient } from "@/lib/axios";
import { QuestionType2 } from "@/types/questions";
import {
  AddEditQuiz,
  AddEditTopic,
  AddQuestion,
  Question,
  Quiz,
  QuizResponse,
  SingleStudentAttempt,
  StudentAttempts,
  SubmitAttempt,
  Topic,
  TopicsResponse,
  TopicWithInfo,
  TotalQuizzesContestCount,
} from "@/types/quiz";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

const QUIZZES = "quizzes";
const ATTEMPTS = "attempts";
const TOPICS = "topics";

export function useGetQuizzes(options?: {
  topicId?: string;
  langId?: string;
  isEnabled: boolean;
  page?: number;
  limit?: number;
}) {
  return useQuery<QuizResponse, AxiosError>({
    queryKey: [QUIZZES, options],

    enabled: options?.isEnabled,
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      const { topicId, page = 1, limit = 6 } = options || {};
      if (topicId !== undefined) queryParams.append("topic_id", topicId);
      // if (langId !== undefined) queryParams.append("lang_id", langId);

      const res = await apiClient.get<QuizResponse>(
        `/quizzes/?page=${page}&limit=${limit}&${queryParams}`
      );
      //Todo: remove filter after all quizzes have 'topic' and 'topic.grade'
      const quizzes = res.data.quizzes.filter((q) => q.topic?.grade);

      return {
        ...res.data,
        quizzes,
      };
    },
  });
}

export function useGetQuizzesContest(options?: {
  topicId?: string;
  langId?: string;
  isEnabled: boolean;
}) {
  return useQuery<Quiz[], AxiosError>({
    queryKey: [QUIZZES, options],

    enabled: options?.isEnabled,
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      const { topicId } = options || {};
      if (topicId !== undefined) queryParams.append("topic_id", topicId);
      queryParams.append("type", "CONTEST");
      // if (langId !== undefined) queryParams.append("lang_id", langId);

      const res = await apiClient.get<{ quizzes: Quiz[] }>(
        `/quizzes/?${queryParams}`
      );
      //Todo: remove filter after all quizzes have 'topic' and 'topic.grade'
      const quizzes = res.data.quizzes.filter((q) => q.topic?.grade);

      return quizzes;
    },
  });
}

export function useAddQuiz() {
  const queryClient = useQueryClient();
  return useMutation<string, AxiosError, AddEditQuiz>({
    mutationFn: async (quiz) => {
      const res = await apiClient.post<Quiz>(`/quizzes/`, quiz);
      return res.data._id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUIZZES] });
    },
  });
}

export function useGetTopics(options?: {
  enabled: boolean;
  gradeId?: string;
  subjectId?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery<TopicsResponse, AxiosError>({
    queryKey: [TOPICS, options],
    enabled: options?.enabled,
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      const { gradeId, subjectId, page = 1, limit = 6 } = options || {};
      if (gradeId) queryParams.append("grade_id", gradeId);
      if (subjectId) queryParams.append("subject_id", subjectId);
      //Todo: use query params when backend updates

      const res = await apiClient.get<TopicsResponse>(
        `/topics?page=${page}&limit=${limit}&${queryParams.toString()}`
      );

      return res.data;
    },
  });
}

export function useGetTopicsWithInfo() {
  return useQuery<TopicWithInfo[], AxiosError>({
    queryKey: [TOPICS, "info"],
    queryFn: async () => {
      const res = await apiClient.get<TopicWithInfo[]>(`/topics/info`);
      return res.data;
    },
  });
}

export function useEditSingleQuestion() {
  const client = useQueryClient();
  return useMutation<
    void,
    AxiosError,
    {
      questionId: string;
      question: { question: string; choices: string[] };
    }
  >({
    mutationFn: async ({ question, questionId }) => {
      await apiClient.patch(`/questions/${questionId}`, question);
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [QUIZZES] });
    },
  });
}

export function useGetQuestion(questionId: string | null) {
  return useQuery<QuestionType2, AxiosError>({
    queryKey: ["questionReport", questionId],
    enabled: questionId !== null,

    queryFn: async () => {
      const res = await apiClient.get<QuestionType2>(
        `/questions/${questionId}`
      );
      return res.data;
    },
  });
}

export function useDeleteQuestionDirect(questionId: string) {
  const client = useQueryClient();
  return useMutation<void, AxiosError>({
    mutationFn: async () => {
      await apiClient.delete(`/questions/${questionId}`);
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [QUIZZES] });
    },
  });
}

export function useAddTopic() {
  const client = useQueryClient();
  return useMutation<void, AxiosError, AddEditTopic>({
    mutationFn: async (topic) => {
      await apiClient.post("/topics", topic);
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [TOPICS] });
    },
  });
}

export function useEditTopic() {
  const client = useQueryClient();
  return useMutation<void, AxiosError, { id: string; topic: AddEditTopic }>({
    mutationFn: async ({ id, topic }) => {
      await apiClient.patch(`/topics/${id}`, topic);
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [TOPICS] });
    },
  });
}

export function useGetTopic(id: string | null) {
  return useQuery<Topic, AxiosError>({
    queryKey: [TOPICS, id],
    enabled: id !== null,
    queryFn: async () => {
      const res = await apiClient.get<Topic>(`/topics/${id}`);
      return res.data;
    },
  });
}

export function useDeleteTopic(id: string) {
  const client = useQueryClient();
  return useMutation<void, AxiosError>({
    mutationFn: async () => {
      await apiClient.delete(`/topics/${id}`);
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [TOPICS] });
    },
  });
}

export function useGetQuiz(id: string | null) {
  return useQuery<Quiz, AxiosError>({
    queryKey: [QUIZZES, id],
    enabled: id !== null,

    queryFn: async () => {
      const res = await apiClient.get<Quiz>(`/quizzes/${id}`);
      return res.data;
    },
  });
}

export function useEditQuiz() {
  const client = useQueryClient();
  return useMutation<void, AxiosError, { id: string; quiz: AddEditQuiz }>({
    mutationFn: async ({ id, quiz }) => {
      await apiClient.patch(`/quizzes/${id}`, quiz);
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [QUIZZES] });
    },
  });
}

export function useFetchQuizData(
  quizIds: string[]
): UseQueryResult<Quiz[], AxiosError> {
  return useQuery<Quiz[], AxiosError>({
    queryKey: [QUIZZES, quizIds],
    enabled: quizIds.length > 0,
    queryFn: async () => {
      const quizPromises = quizIds.map((id) =>
        apiClient
          .get<Quiz>(`/quizzes/${id}`)
          .then((res) => res.data)
          .catch(() => {
            return null;
          })
      );
      const quizzes = await Promise.all(quizPromises);
      const validQuizzes = quizzes.filter((q): q is Quiz => q !== null);
      //Todo: remove filter after all quizzes have 'topic' and 'topic.grade'
      return validQuizzes.filter((q) => q.topic?.grade);
    },
  });
}

export function useAddQuestion() {
  const client = useQueryClient();
  return useMutation<
    void,
    AxiosError,
    { quizId: string; question: AddQuestion }
  >({
    mutationFn: async ({ quizId, question }) => {
      const id = (await apiClient.post<{ _id: string }>(`/questions`, question))
        .data._id;

      const quiz = await apiClient.get<Quiz>(`/quizzes/${quizId}`);
      await apiClient.patch(`/quizzes/${quizId}`, {
        questions: [...quiz.data.questions.map((q) => q._id), id],
      });
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [QUIZZES] });
    },
  });
}

export function useEditQuestion() {
  const client = useQueryClient();
  return useMutation<
    void,
    AxiosError,
    {
      questionId: string;
      question: Omit<
        Question,
        | "_id"
        | "problemWithQuestion"
        | "problemWithAnswer"
        | "problemWithAnswerReasons"
      >;
    }
  >({
    mutationFn: async ({ question, questionId }) => {
      await apiClient.patch(`/questions/${questionId}`, question);
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [QUIZZES] });
    },
  });
}

export function useDeleteQuestion({
  quizId,
  questionId,
}: {
  quizId: string;
  questionId: string;
}) {
  const client = useQueryClient();
  return useMutation<void, AxiosError>({
    mutationFn: async () => {
      const quiz = await apiClient.get<Quiz>(`/quizzes/${quizId}`);
      await apiClient.patch(`/quizzes/${quizId}`, {
        questions: quiz.data.questions
          .map((q) => q._id)
          .filter((q) => q !== questionId),
      });
      await apiClient.delete(`/questions/${questionId}`);
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [QUIZZES] });
    },
  });
}

export function useDeleteQuiz(quizId: string) {
  const client = useQueryClient();
  return useMutation<void, AxiosError>({
    mutationFn: async () => {
      await apiClient.delete(`/quizzes/${quizId}`);
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [QUIZZES] });
    },
  });
}

export function useSubmitAttempt() {
  const client = useQueryClient();
  return useMutation<string, AxiosError, SubmitAttempt>({
    mutationFn: async (attempt) => {
      const { quizId, studentId, for: intent, ...attemptData } = attempt;
      if (intent === "QUIZ") {
        const res = await apiClient.post<{ attempt: { _id: string } }>(
          `/quizzes/${quizId}/submit`,
          attemptData
        );
        return res.data.attempt._id;
      } else {
        throw new Error("Contest submission not implemented yet");
      }
    },
    onSuccess: () => {
      console.log("invalidating quiz result");
      client.invalidateQueries({ queryKey: [ATTEMPTS] });
    },
  });
}

export function useGetAttempts(options: {
  studentId?: string;
  quizId?: string;
  isEnabled: boolean;
}) {
  //sort guarenteed
  const { studentId, quizId, isEnabled } = options;

  return useQuery<StudentAttempts[], AxiosError>({
    queryKey: [ATTEMPTS, options],
    enabled: isEnabled,

    queryFn: async () => {
      //Todo: use this endpoint after query params are acturally used in results in the route

      const queryParams = new URLSearchParams();
      if (studentId !== undefined) queryParams.append("s_id", studentId);
      if (quizId !== undefined) queryParams.append("q_id", quizId);
      const res = await apiClient.get<{ attempts: StudentAttempts[] }>(
        `/attempts?${queryParams.toString()}`
      );
      const data = res.data.attempts
        .filter((a) => a.studentId === studentId)
        .map((a) => {
          return {
            ...a,
            attempts: a.attempts
              .filter((a) => a.updatedAt) //filter old
              .filter((a) => a.quizId === quizId)
              .sort((a, b) => (a.updatedAt > b.updatedAt ? 1 : -1)),
          };
        });
      return data;
    },
  });
}

export function useGetStudentAttempts(id: string | null) {
  //sort guarenteed
  return useQuery<StudentAttempts, AxiosError>({
    queryKey: [ATTEMPTS, id],
    enabled: id !== null,
    queryFn: async () => {
      const res = await apiClient.get<StudentAttempts>(`/attempts/${id}`);
      console.log("🚀 ~ queryFn: ~ res:", res.data);
      res.data.attempts = res.data.attempts
        .filter((a) => a.updatedAt)
        .sort((a, b) => (a.updatedAt > b.updatedAt ? 1 : -1));
      return res.data;
    },
  });
}

export function useGetStudentLatestAttempt(options: {
  quizId?: string | null;
  id?: string | null;
  studentId: string | null;
  canBeNull: boolean;
}) {
  const { quizId, id, studentId, canBeNull } = options;
  if (quizId === undefined && id === undefined)
    throw new Error("quizId or id is required");

  return useQuery<StudentAttempts["attempts"][0] | null, AxiosError>({
    queryKey: [ATTEMPTS, options],
    enabled: id !== null && studentId !== null && quizId !== null,
    queryFn: async () => {
      //Todo: replace with an endpoint that returns a single attempt
      const res = await apiClient.get<StudentAttempts>(
        `/attempts/${studentId}?latest`
      );

      const attempt =
        res.data.attempts
          .filter((a) => {
            if (!a.updatedAt) return false;
            if (id && a._id !== id) return false;
            if (quizId && a.quizId !== quizId) return false;
            return true;
          })
          .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))[0] || null;
      if (!attempt && !canBeNull)
        throw new AxiosError("Attempt not found", "404");
      return attempt;
    },
  });
}

export function useGetSingleStudentLatestAttempt(
  quizId: string | null,
  options?: { enabled?: boolean }
) {
  return useQuery<SingleStudentAttempt | null, AxiosError>({
    queryKey: [ATTEMPTS, "recent", quizId],
    enabled: quizId !== null && (options?.enabled ?? true),
    queryFn: async () => {
      const res = await apiClient.get<SingleStudentAttempt>(
        `/attempts/me/recent/${quizId}`
      );
      return res.data;
    },
  });
}

export function useReportIssue() {
  const client = useQueryClient();
  return useMutation<
    void,
    AxiosError,
    { id: string; student: string; issue: string }
  >({
    mutationFn: async ({ id, student, issue }) => {
      await apiClient.patch(`/questions/${id}/report`, {
        student,
        issue,
      });
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [QUIZZES] });
    },
  });
}

// export function useGetCreatorVerifiedQuizzes(options?: {
//   topicId?: string;
//   isEnabled?: boolean;
// }) {
//   return useQuery<Quiz[], AxiosError>({
//     queryKey: [QUIZZES, "creator", "verified"],
//     enabled: options?.isEnabled,
//     queryFn: async () => {
//       const { topicId } = options || {};
//       const queryParams = new URLSearchParams();
//       if (topicId) queryParams.append("topic_id", topicId);
//       queryParams.append("isCreatorVerified", "true");
//       queryParams.append("isAdminVerified", "false");
//       const res = await apiClient.get<{ quizzes: Quiz[] }>(
//         `/quizzes?${queryParams.toString()}`
//       );
//       return res.data.quizzes;
//     },
//   });
// }

export function useGetCreatorVerifiedQuizzes(options?: {
  topicId?: string;
  isEnabled?: boolean;
  page?: number;
  limit?: number;
}) {
  const { topicId, page = 1, limit = 6 } = options || {};
  return useQuery<QuizResponse, AxiosError>({
    queryKey: [QUIZZES, "creator", "verified", page, limit, topicId],
    enabled: options?.isEnabled,
    queryFn: async () => {
      const { topicId } = options || {};
      const queryParams = new URLSearchParams();
      if (topicId) queryParams.append("topic_id", topicId);
      queryParams.append("isCreatorVerified", "true");
      queryParams.append("isAdminVerified", "false");
      const res = await apiClient.get<QuizResponse>(
        `/quizzes?page=${page}&limit=${limit}&${queryParams.toString()}`
      );
      return res.data;
    },
  });
}

export function useGetCreatorUnverifiedQuizzes(options?: {
  topicId?: string;
  isEnabled?: boolean;
  page?: number;
  limit?: number;
}) {
  const { topicId, page = 1, limit = 6 } = options || {};
  return useQuery<QuizResponse, AxiosError>({
    queryKey: [QUIZZES, "creator", "unverified", page, limit, topicId],
    enabled: options?.isEnabled,
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (topicId) queryParams.append("topic_id", topicId);
      queryParams.append("isCreatorVerified", "false");
      const res = await apiClient.get<QuizResponse>(
        `/quizzes?page=${page}&limit=${limit}&${queryParams.toString()}`
      );
      return res.data;
    },
  });
}

export function useGetCreatorUnverifiedQuizzesFiltered(options?: {
  topicId?: string;
  gradeId?: string;
  subjectId?: string;
  isEnabled?: boolean;
  page?: number;
  limit?: number;
}) {
  const { topicId, gradeId, subjectId, page = 1, limit = 6 } = options || {};
  return useQuery<QuizResponse, AxiosError>({
    queryKey: [
      QUIZZES,
      "creator",
      "unverified",
      page,
      limit,
      topicId,
      gradeId,
      subjectId,
    ],
    enabled: options?.isEnabled,
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (topicId) queryParams.append("topic_id", topicId);
      if (gradeId) queryParams.append("gradeId", gradeId);
      if (subjectId) queryParams.append("subjectId", subjectId);
      queryParams.append("isCreatorVerified", "false");
      const res = await apiClient.get<QuizResponse>(
        `/quizzes?page=${page}&limit=${limit}&${queryParams.toString()}`
      );
      return res.data;
    },
  });
}

export function useGetAdminVerifiedQuizzes(options?: {
  topicId?: string;
  isEnabled?: boolean;
  page?: number;
  limit?: number;
}) {
  return useQuery<QuizResponse, AxiosError>({
    queryKey: [QUIZZES, "admin", "verified", options],
    enabled: options?.isEnabled,
    queryFn: async () => {
      const { topicId, page = 1, limit = 3 } = options || {};
      const queryParams = new URLSearchParams();
      if (topicId) queryParams.append("topic_id", topicId);
      queryParams.append("isAdminVerified", "true");
      queryParams.append("isCreatorVerified", "true");
      // queryParams.append("page", '6');
      const res = await apiClient.get<QuizResponse>(
        `/quizzes?page=${page}&limit=${limit}&${queryParams.toString()}`
      );
      return res.data;
    },
  });
}

// Mutation for creator verification
export function useVerifyQuizByCreator() {
  const client = useQueryClient();
  return useMutation<void, AxiosError, { id: string }>({
    mutationFn: async ({ id }) => {
      await apiClient.patch(`/quizzes/${id}/verify-creator`);
    },
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: [QUIZZES, "creator", "unverified"],
      });
      client.invalidateQueries({ queryKey: [QUIZZES, "creator", "verified"] });
    },
  });
}

// Mutation for admin verification
export function useVerifyQuizByAdmin() {
  const client = useQueryClient();
  return useMutation<void, AxiosError, { id: string }>({
    mutationFn: async ({ id }) => {
      await apiClient.patch(`/quizzes/${id}/verify-admin`);
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [QUIZZES, "creator", "verified"] });
      client.invalidateQueries({ queryKey: [QUIZZES, "admin", "verified"] });
    },
  });
}

export function useGetTotalQuizzesContest() {
  return useQuery<TotalQuizzesContestCount, AxiosError>({
    queryKey: [QUIZZES, "contest", "total"],
    queryFn: async () => {
      const res = await apiClient.get<TotalQuizzesContestCount>(
        `/figures/grades/quizzes-and-contests`
      );
      return res.data;
    },
  });
}
