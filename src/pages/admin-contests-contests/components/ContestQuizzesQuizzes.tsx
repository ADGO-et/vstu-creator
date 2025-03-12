import { AdminTable } from "@/components/admin-components/AdminTable";
import Back from "@/components/admin-components/Back";
import EditLink from "@/components/admin-components/EditLink";
import ErrorMessage from "@/components/status/ErrorMessage";
import Loading from "@/components/status/Loading";
import { Button } from "@/components/ui/button";
import { useGetQuizzesContest, useGetTopic } from "@/services/quiz";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Link, useParams } from "react-router-dom";
import { Delete } from "./Delete";

interface Quiz {
  id: string;
  name: string;
  language: string;
  numQuestions: number;
}

const h = createColumnHelper<Quiz>();
const cols: ColumnDef<Quiz, any>[] = [
  h.accessor("name", { header: "Quiz" }),
  h.accessor("language", { header: "Language" }),
  h.accessor("numQuestions", { header: "Questions" }),
  h.display({
    header: "Action",
    cell: (p) => (
      <div className="flex">
        <EditLink to={`edit/${p.row.original.id}`} />
        <Delete id={p.row.original.id} name={p.row.original.name} />
      </div>
    ),
  }),
];

export default function ContestQuizzesQuizzes() {
  const { topicId } = useParams<{ topicId: string }>();

  const topicQ = useGetTopic(topicId || null);
  const quizzesQ = useGetQuizzesContest({
    topicId: topicId || "-",
    isEnabled: true,
  });

  const data: undefined | Quiz[] = quizzesQ.data
  ?.map((q) => ({
    id: q._id,
    name: q.quizTitle,
    language: q.language?.language,
    numQuestions: q.questions?.length,
  }));

  return (
    <div className="py-6 flex flex-col gap-6">
      <Back />
      <Loading isLoading={topicQ.isLoading} />
      <ErrorMessage error={topicQ.error} retry={topicQ.refetch} />

      <div className="flex justify-between">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-4xl">Quizzes</h1>
          </div>
          <p>
            Choose a quiz in
            <br />
            {topicQ.data && (
              <span>
                <span className="p-1 bg-muted mx-1">{topicQ.data.subject.name}</span>
                ,
                <span className="p-1 bg-muted mx-1">
                  Chapter {topicQ.data.chapter}
                </span>
                ,
                <span className="p-1 bg-muted mx-1">
                  {topicQ.data.chapterTitle}
                </span>
              </span>
            )}
            <Loading isLoading={topicQ.isLoading} />
          </p>
        </div>
        <Link to="add">
          <Button>Add Quiz</Button>
        </Link>
      </div>
      <AdminTable
        data={data || null}
        columns={cols}
        isLoading={quizzesQ.isLoading}
        error={quizzesQ.error}
        retry={quizzesQ.refetch}
        enablePagination={true}
      />
    </div>
  );
}
