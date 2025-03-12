import { AdminTable } from "@/components/admin-components/AdminTable";
import { useGetGrades } from "@/services/grade";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Link } from "react-router-dom";

interface Grade {
  id: string;
  grade: number;
  gradeName: string;
  numContests: number;
}

const h = createColumnHelper<Grade>();
const contestCols: ColumnDef<Grade, any>[] = [
  h.accessor("gradeName", { header: "Name" }),
  h.accessor("numContests", {
    header: "Total Contests",
    cell: (p) => `${p.getValue()}`,
  }),
  h.display({
    header: "Action",
    cell: (p) => (
      <Link to={`contests/${p.row.original.id}`}>add contest quiz</Link>
    ),
  }),
];

export default function ContestQuizTable() {
  const gradesQ = useGetGrades();

  const data: undefined | Grade[] = gradesQ.data?.map((g) => ({
    id: g._id,
    grade: g.grade,
    gradeName: `Grade ${g.grade}`,
    numContests: -1,
  })).sort((a, b) => a.grade - b.grade);;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-4xl">Contests</h1>
      <p>Choose a grade</p>
      <AdminTable
        data={data || null}
        columns={contestCols}
        isLoading={gradesQ.isLoading}
        error={gradesQ.error}
        retry={gradesQ.refetch}
        enablePagination={true}
      />
    </div>
  );
}
