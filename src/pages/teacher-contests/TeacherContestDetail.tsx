import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdminTable } from "@/components/admin-components/AdminTable";
import { useGetContest } from "@/services/contest";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useParams } from "react-router-dom";
import ContestParticipants from "../admin-contests-detail/components/ContestParticipants";
import { toDate } from "@/lib/admin-utils";
import Back from "@/components/admin-components/Back";
import { Badge } from "@/components/ui/badge";

type QuizRow = {
  id: string;
  title: string;
  subject?: string;
  numQuestions: number;
};

const h = createColumnHelper<QuizRow>();
const cols: ColumnDef<QuizRow, string>[] = [
  h.accessor((row) => row.title, {
    id: "title",
    header: "Quiz",
  }),
  h.accessor((row) => row.subject ?? "—", {
    id: "subject",
    header: "Subject",
  }),
  h.accessor((row) => String(row.numQuestions), {
    id: "numQuestions",
    header: "Questions",
  }),
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
    <div className="mx-auto w-full space-y-6 px-4 pb-10 pt-6 sm:px-6 lg:px-8">
      <Back steps={1} />

      <Card>
        <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
          <div className="space-y-1">
            <CardTitle className="text-3xl sm:text-4xl">
              <span className="text-primary">{contest?.title ?? "Contest"}</span>
            </CardTitle>
            <CardDescription>
              Contest overview and participants.
            </CardDescription>
          </div>

          <Badge
            className="border-tertiary bg-tertiary text-tertiary-foreground"
          >
            Teacher View
          </Badge>
        </CardHeader>

        <CardContent className="grid gap-6">
          <div className="grid gap-4 rounded-lg border bg-muted/30 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-tertiary">Contest details</p>
              <Badge variant="secondary">Enrollments: {contest?.enrollCount ?? 0}</Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Description</p>
                <p className="text-sm">{contest?.description ?? "—"}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Subject</p>
                <p className="text-sm">{contest?.quiz?.topic?.subject?.name ?? "—"}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Chapter</p>
                <p className="text-sm">{contest?.quiz?.topic?.chapterTitle ?? "—"}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Start</p>
                  <p className="text-sm">{contest?.startTime ? toDate(contest.startTime) : "—"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">End</p>
                  <p className="text-sm">{contest?.endTime ? toDate(contest.endTime) : "—"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border">
            <div className="border-b bg-primary/10 px-4 py-3">
              <p className="text-sm font-semibold text-primary">Quiz summary</p>
            </div>
            <div className="p-4">
              <AdminTable
                data={quizRow}
                columns={cols}
                isLoading={isLoading}
                error={error}
                retry={refetch}
                enablePagination={false}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl">
            <span className="text-primary">Participants</span>{" "}
            <span className="text-tertiary">list</span>
          </CardTitle>
          <CardDescription>
            View enrolled students for this contest.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContestParticipants contestId={contestId || ""} />
        </CardContent>
      </Card>
    </div>
  );
}
