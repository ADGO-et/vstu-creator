import { AdminTable } from "@/components/admin-components/AdminTable";
import Back from "@/components/admin-components/Back";
import Loading from "@/components/status/Loading";
import { Button } from "@/components/ui/button";
import { WritableDropdown } from "@/components/ui/writable-dropdown";
import { useGetQuiz, useGetQuizzesContest } from "@/services/quiz";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useNavigate, useParams } from "react-router-dom";

interface Question {
  id: string;
  quizId: string;
  question: string;
  numChoices: number;
}

const h = createColumnHelper<Question>();
const cols: ColumnDef<Question, any>[] = [
  h.display({
    header: "Name",
    cell: (p) => <span>Question {p.row.index + 1}</span>,
  }),
  h.accessor("question", {
    header: "Question",
    cell: (p) => (
      <span>
        {p.getValue().slice(0, 30)} {p.getValue().length > 30 && "..."}
      </span>
    ),
  }),
  h.accessor("numChoices", {
    header: "Choices",
  }),
];

export default function AdminContestsChooseViewQuiz() {
  const { quizId, topicId } = useParams<{ quizId: string; topicId: string }>();
  const quizzesQ = useGetQuizzesContest({ topicId: topicId || "-", isEnabled: true });
  const navigate = useNavigate();

  const quizQ = useGetQuiz(quizId || null);
  const data: undefined | Question[] = quizQ.data?.questions.map((q) => ({
    id: q._id,
    quizId: quizId || "-",
    question: q.question,
    numChoices: q.choices.length,
  }));

  return (
    <div className="py-6 flex flex-col gap-6">
      <Back />
      <div className="flex justify-between flex-wrap gap-6">
        <div className="flex flex-col gap-6">
          <h1 className="text-4xl">Choose From Quiz</h1>
          <Loading isLoading={quizzesQ.isLoading} />
          {quizzesQ.data && (
            <WritableDropdown
              isWritable={false}
              value={quizId}
              options={
                quizzesQ.data
                ?.map((q) => ({
                  label: q.quizTitle,
                  value: q._id,
                })) || []
              }
              onValueChange={(v) => {
                navigate(`../${v}`, { relative: "path" });
              }}
            />
          )}
        </div>

        <Button
          onClick={() => {
            navigate(`../../..?quizId=${quizId}`, { relative: "path" });
          }}
        >
          Choose Quiz
        </Button>
      </div>
      <AdminTable
        data={data || null}
        columns={cols}
        isLoading={quizQ.isLoading}
        error={quizQ.error}
        retry={quizQ.refetch}
        enablePagination={true}
      />
    </div>
  );
}
