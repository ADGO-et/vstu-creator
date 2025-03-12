import { AdminTable } from "@/components/admin-components/AdminTable";
import { useGetGrades } from "@/services/grade";
// import { useGetCreatorUnverifiedQuizzes } from "@/services/quiz";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Link } from "react-router-dom";

interface Grade {
  id: string;
  grade: number;
  gradeName: string;
  numSubjects: number;
  // unverifiedCount: number;
}

const h = createColumnHelper<Grade>();

export default function ContentQuizTable() {
  const q = useGetGrades();
  // const unverifiedQuizzesQuery = useGetCreatorUnverifiedQuizzes({ isEnabled: true });

  // const unverifiedCounts = unverifiedQuizzesQuery.data?.quizzes.reduce((acc, quiz) => {
  //   const gradeId = quiz.topic.grade;
  //   acc[gradeId] = (acc[gradeId] || 0) + 1;
  //   return acc;
  // }, {} as Record<string, number>);

  const data: undefined | Grade[] = q.data?.map((g) => ({
    id: g._id,
    grade: g.grade,
    gradeName: `Grade ${g.grade}`,
    numSubjects: g.subjects.length,
    // unverifiedCount: unverifiedCounts?.[g._id] || 0,
  })).sort((a, b) => a.grade - b.grade);;

  const cols: ColumnDef<Grade, any>[] = [
    h.accessor("gradeName", { header: "Name" }),
    h.accessor("numSubjects", { header: "Total Subjects" }),
    // h.accessor("unverifiedCount", { header: "Unverified Quizzes" }),
    h.display({
      header: "Action",
      cell: (p) => <Link to={`${p.row.original.id}`}>View Subjects</Link>,
    }),
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-4xl">Quizzes</h1>
      <p>Choose a grade</p>
      <AdminTable
        data={data || null}
        columns={cols}
        isLoading={q.isLoading}
        error={q.error}
        retry={() => {
          q.refetch();
          // unverifiedQuizzesQuery.refetch();
        }}
        enablePagination={true}
      />
    </div>
  );
}
