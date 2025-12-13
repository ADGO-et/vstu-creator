import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminTable } from "@/components/admin-components/AdminTable";
import { useGetContest } from "@/services/contest";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useParams } from "react-router-dom";
import ContestParticipants from "../admin-contests-detail/components/ContestParticipants";
import { toDate } from "@/lib/admin-utils";
import Back from "@/components/admin-components/Back";

type QuizRow = {
  id: string;
  title: string;
  subject?: string;
  numQuestions: number;
};

const h = createColumnHelper<QuizRow>();
const cols: ColumnDef<QuizRow, any>[] = [
  h.accessor("title", { header: "Quiz" }),
  h.accessor("subject", { header: "Subject" }),
  h.accessor("numQuestions", { header: "Questions" }),
];

export default function TeacherContestDetail() {
  const { contestId } = useParams<{ contestId: string }>();
  const {
    data: contest,
    isLoading,
    error,
    refetch,
  } = useGetContest(contestId || "-");

  const quiz = contest?.quiz;
  const quizRow: QuizRow[] | null = quiz
    ? [
        {
          id: quiz._id,
          title: quiz.quizTitle,
          subject: quiz.topic?.subject?.name,
          numQuestions: quiz.questions?.length ?? 0,
        },
      ]
    : null;

  return (
    <div className="space-y-6 pt-4">
      <Back steps={1} />

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">
            {contest?.title ?? "Contest"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p>
            <span className="text-gray-500">Description:</span>{" "}
            {contest?.description ?? "—"}
          </p>
          <p>
            <span className="text-gray-500">Enrollments:</span>{" "}
            {contest?.enrollCount ?? 0}
          </p>
          <p>
            <span className="text-gray-500">Start:</span>{" "}
            {contest?.startTime ? toDate(contest.startTime) : "—"}
          </p>
          <p>
            <span className="text-gray-500">End:</span>{" "}
            {contest?.endTime ? toDate(contest.endTime) : "—"}
          </p>
          <p>
            <span className="text-gray-500">Subject:</span>{" "}
            {contest?.quiz?.topic?.subject?.name ?? "—"}
          </p>
          <p>
            <span className="text-gray-500">Chapter:</span>{" "}
            {contest?.quiz?.topic?.chapterTitle ?? "—"}
          </p>
        </CardContent>
      </Card>

      <AdminTable
        data={quizRow}
        columns={cols}
        isLoading={isLoading}
        error={error}
        retry={refetch}
        enablePagination={false}
      />

      <h1 className="text-primary text-xl">Participants</h1>
      <ContestParticipants contestId={contestId || ""} />
    </div>
  );
}
