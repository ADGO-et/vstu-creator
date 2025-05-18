import { AdminTable } from "@/components/admin-components/AdminTable";
import Back from "@/components/admin-components/Back";
import { useGetGrade } from "@/services/grade";
// import { useGetCreatorUnverifiedQuizzes } from "@/services/quiz";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Link, useParams } from "react-router-dom";

interface Subject {
  id: string;
  subject: string;
  language: string;
//   numQuizzes: number;
  // unverifiedCount: number;
}

const columnHelper = createColumnHelper<Subject>();

export default function ContentFlashCardSubjects() {
  const { gradeId } = useParams<{ gradeId: string }>();

  const gradeQ = useGetGrade(gradeId || null);
  // const unverifiedQuizzesQuery = useGetCreatorUnverifiedQuizzes({ isEnabled: true });

  // const unverifiedCounts = unverifiedQuizzesQuery.data?.quizzes.reduce((acc, quiz) => {
  //   const subjectId = quiz.topic.subject._id;
  //   acc[subjectId] = (acc[subjectId] || 0) + 1;
  //   return acc;
  // }, {} as Record<string, number>);

  const columns: ColumnDef<Subject, any>[] = [
    columnHelper.accessor("subject", { header: "Subject" }),
    columnHelper.accessor("language", { header: "Language" }),
    // columnHelper.accessor("numQuizzes", { header: "Total Quizzes" }),
    // columnHelper.accessor("unverifiedCount", { header: "Unverified Quizzes" }),
    columnHelper.display({
      header: "Action",
      cell: ({ row }) => <Link to={`${row.original.id}/add`}>Add Cards</Link>,
    }),
  ];

  const data: Subject[] | undefined = gradeQ.data?.subjects.map((subject) => ({
    id: subject._id,
    subject: subject.name,
    language: subject.language.language,
    // numQuizzes: subject.quizzes?.length || 0,
    // unverifiedCount: unverifiedCounts?.[subject._id] || 0,
  }));

  return (
    <div className="py-6 flex flex-col gap-6">
      <Back steps={1} />
      <h1 className="text-4xl">Flash Cards</h1>
      <p>Choose a subject</p>
      <AdminTable
        data={data || null}
        columns={columns}
        isLoading={gradeQ.isLoading}
        error={gradeQ.error}
        retry={() => {
          gradeQ.refetch();
          // unverifiedQuizzesQuery.refetch();
        }}
        enablePagination={true}
      />
    </div>
  );
}
