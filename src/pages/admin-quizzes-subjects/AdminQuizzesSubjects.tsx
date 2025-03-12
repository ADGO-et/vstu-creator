import { AdminTable } from "@/components/admin-components/AdminTable";
import Back from "@/components/admin-components/Back";
import { useGetGrade } from "@/services/grade";
import { useGetQuizzes } from "@/services/quiz";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Link, useParams } from "react-router-dom";

interface Subject {
  id: string;
  subject: string;
  language: string;
  numQuizzes: number;
}

const columnHelper = createColumnHelper<Subject>();

const columns: ColumnDef<Subject, any>[] = [
  columnHelper.accessor("subject", { header: "Subject" }),
  columnHelper.accessor("language", { header: "Language" }),
  columnHelper.accessor("numQuizzes", { header: "Total Quizzes" }),
  columnHelper.display({
    header: "Action",
    cell: ({ row }) => <Link to={row.original.id}>View Topics</Link>,
  }),
];


export default function AdminQuizzesSubjects() {
  const { gradeId } = useParams<{ gradeId: string }>();

  const gradeQ = useGetGrade(gradeId || null);
  const quizzesQ = useGetQuizzes({ isEnabled: true });
  console.log("🚀 ~ AdminQuizzesSubjects ~ gradeQ:", gradeQ.data);

  const makeCountMap = () => {
    if (!quizzesQ.data || !gradeQ.data) return;
    const countMap: { [subjectId: string]: number } = {};

    for (const quiz of quizzesQ.data.quizzes) {
      if (quiz.topic.grade !== gradeQ.data._id) continue;
      const subjectId = quiz.topic.subject;
      countMap[subjectId._id] = (countMap[subjectId._id] || 0) + 1;
    }
    return countMap;
  };

  const counts = makeCountMap();

  // Map data to match Subject interface
  const data: Subject[] | undefined = gradeQ.data?.subjects.map((subject) => ({
    id: subject._id,
    subject: subject.name,
    language: subject.language.language,
    numQuizzes: counts?.[subject._id] || 0,
  }));

  return (
    <div className="py-6 flex flex-col gap-6">
      <Back steps={2} />
      <h1 className="text-4xl">Quizzes</h1>
      <p>Choose a subject</p>
      <AdminTable
        data={data || null}
        columns={columns}
        isLoading={gradeQ.isLoading || quizzesQ.isLoading}
        error={gradeQ.error || quizzesQ.error}
        retry={() => {
          if (!gradeQ.data) gradeQ.refetch();
          if (!quizzesQ.data) quizzesQ.refetch();
        }}
        enablePagination={true}
      />
    </div>
  );
}
