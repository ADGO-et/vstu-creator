import { AdminTable } from "@/components/admin-components/AdminTable";
import { useGetCreatorUnverifiedQuizzes, useVerifyQuizByCreator } from "@/services/quiz";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Delete } from "./components/Delete";
import EditLink from "@/components/admin-components/EditLink";

interface Language {
  _id: string;
  language: string;
  slug: string
}

interface Subject {
  _id: string;
  name: string;
  language: Language
}

interface QuizType {
  _id: string;
  quizTitle: string;
  topic: { subject: Subject; _id: string; grade: string };
  isAdminVerified: boolean;
  createdAt: string
}

const columnHelper = createColumnHelper<QuizType>();

export default function UnverifiedQuizTable() {
  const { data, isLoading, error, refetch } = useGetCreatorUnverifiedQuizzes();

  const { mutate: verifyQuiz } = useVerifyQuizByCreator();

  const columns: ColumnDef<QuizType, any>[] = [
    columnHelper.accessor("quizTitle", { header: "Quiz Title" }),
    columnHelper.accessor("topic.subject.name", { header: "Subject" }),
    columnHelper.accessor("topic.subject.language.language", { header: "Language" }),
    columnHelper.accessor("createdAt", {
      header: "Created At",
      cell: (props) => new Date(props.getValue()).toLocaleDateString(),
    }),
    columnHelper.display({
      header: "Verify",
      cell: ({ row }) => (
        <Button
          onClick={() => verifyQuiz({ id: row.original._id })}
          variant="secondary"
        >
          Verify
        </Button>
      ),
    }),
    columnHelper.display({
      header: "Action",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <EditLink
            to={`quiz/${row.original.topic.grade}/${row.original.topic.subject._id}/${row.original.topic._id}/edit/${row.original._id}`}
          />
          <Delete id={row.original._id} name={row.original.quizTitle} />
        </div>
      ),
    }),
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-4xl">Unverified Quizzes</h1>
      <p>List of quizzes that need verification</p>
      <AdminTable
        data={data?.quizzes || null}
        columns={columns}
        isLoading={isLoading}
        error={error}
        retry={refetch}
      />
    </div>
  );
}
