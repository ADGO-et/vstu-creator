import { AdminTable } from "@/components/admin-components/AdminTable";
import { useGetGrades } from "@/services/grade";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Link } from "react-router-dom";

interface Grade {
  id: string;
  grade: number;
  gradeName: string;
  numSubjects: number;
}

const h = createColumnHelper<Grade>();
const cols: ColumnDef<Grade, any>[] = [
  h.accessor("gradeName", { header: "Name" }),
  h.accessor("numSubjects", {
    header: "Total Subjects",
    cell: (p) => `${p.getValue()}`,
  }),
  h.display({
    header: "Action",
    cell: (p) => <Link to={`quizzes/${p.row.original.id}`}>View Subjects</Link>,
  }),
];

export default function QuizTable() {
  const q = useGetGrades();
  const data: undefined | Grade[] = q.data?.map((g) => ({
    id: g._id,
    grade: g.grade,
    gradeName: `Grade ${g.grade}`,
    numSubjects: g.subjects.length,
  })).sort((a, b) => a.grade - b.grade);;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-4xl">Quizzes</h1>
      <p>Choose a grade</p>
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
