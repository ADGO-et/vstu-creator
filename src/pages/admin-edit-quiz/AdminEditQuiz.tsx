import { AdminTable } from "@/components/admin-components/AdminTable";
import Back from "@/components/admin-components/Back";
import EditLink from "@/components/admin-components/EditLink";
import QuizInfoForm from "@/components/admin-components/QuizInfoForm";
import { Button } from "@/components/ui/button";
import { useGetQuiz } from "@/services/quiz";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Link, useParams } from "react-router-dom";
import { Delete } from "./components/Delete";

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

  h.display({
    header: "Action",
    cell: (p) => (
      <div className="flex">
        <EditLink to={`edit-question/${p.row.original.id}`} />
        <Delete
          name={p.row.original.question}
          quizId={p.row.original.quizId}
          id={p.row.original.id}
        />
      </div>
    ),
  }),
];

export default function AdminEditQuiz() {
  const { quizId } = useParams<{ quizId: string }>();

  const q = useGetQuiz(quizId || null);
  const data: undefined | Question[] = q.data?.questions.map((q) => ({
    id: q._id,
    quizId: quizId || "-",
    question: q.question,
    numChoices: q.choices.length,
  }));

  return (
    <div className="py-6 flex flex-col gap-6">
      <Back steps={2} />
      <div className="flex justify-between flex-wrap gap-6">
        <div className="flex flex-col gap-6">
          <h1 className="text-4xl">Edit Quiz</h1>
        </div>

        <div className="flex items-center gap-6">
          <Link to="add-question">
            <Button>Add Question</Button>
          </Link>
        </div>
      </div>
      <hr />
      <QuizInfoForm isEdit />
      <hr />
      <AdminTable
        data={data || null}
        columns={cols}
        isLoading={q.isLoading}
        error={q.error}
        retry={q.refetch}
        enablePagination={true}
      />
    </div>
  );
}
