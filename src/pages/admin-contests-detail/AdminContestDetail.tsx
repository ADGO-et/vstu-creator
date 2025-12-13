import Back from "@/components/admin-components/Back";
import { useGetContest } from "@/services/contest";
import { useParams } from "react-router-dom";
import { useGetQuizzesContest } from "@/services/quiz";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { AdminTable } from "@/components/admin-components/AdminTable";
import EditLink from "@/components/admin-components/EditLink";
import { Delete } from "./components/Delete";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ContestParticipants from "./components/ContestParticipants";

interface Quiz {
  id: string;
  name: string;
  language: string;
  numQuestions: number;
}

const AdminContestDetail = () => {
  const { contestId } = useParams<{ contestId: string }>();
  const { data: singleContest } = useGetContest(contestId || "-");

  const enrollments = singleContest?.enrollCount;
  const title = singleContest?.title;
  const description = singleContest?.description;
  const quizId = singleContest?.quiz?._id;
  const topicId = singleContest?.quiz?.topic?._id;

  const quizzesQ = useGetQuizzesContest({
    topicId: topicId || "-",
    isEnabled: true,
  });

  const data: undefined | Quiz[] = quizzesQ.data
    ? quizzesQ.data
        .filter((q) => q._id === quizId)
        .map((q) => ({
          id: q._id,
          name: q.quizTitle,
          language: q.language?.language,
          numQuestions: q.questions?.length,
        }))
    : undefined;

  const h = createColumnHelper<Quiz>();
  const cols: ColumnDef<Quiz, any>[] = [
    h.accessor("name", { header: "Quiz" }),
    h.accessor("language", { header: "Language" }),
    h.accessor("numQuestions", { header: "Questions" }),
    h.display({
      header: "Action",
      cell: (p) => (
        <div className="flex gap-2">
          <EditLink to={`${topicId}/edit/${p.row.original.id}`} />
          <Delete id={p.row.original.id} name={p.row.original.name} />
        </div>
      ),
    }),
  ];

  const truncate = (str: string, n: number) => {
    return str.length > n ? str.slice(0, n - 1) + "..." : str;
  };

  return (
    <div className="space-y-6 pt-4">
      <Back />
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">
            {truncate(title || "", 60)}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-lg font-semibold">
            <span className="text-gray-500">Description:</span>{" "}
            {truncate(description || "", 100)}
          </p>
          <p className="text-lg font-semibold">
            <span className="text-gray-500">Total Enrollments:</span>{" "}
            {enrollments}
          </p>
        </CardContent>
      </Card>
      <AdminTable
        data={data || null}
        columns={cols}
        isLoading={quizzesQ.isLoading}
        error={quizzesQ.error}
        retry={quizzesQ.refetch}
        enablePagination={false}
      />
      <h1 className="text-primary text-xl">Participants</h1>
      <ContestParticipants contestId={contestId || ""} />
    </div>
  );
};

export default AdminContestDetail;
