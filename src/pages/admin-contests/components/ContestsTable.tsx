import { AdminTable } from "@/components/admin-components/AdminTable";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
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
const contestCols: ColumnDef<Grade, string>[] = [
  h.accessor((row) => row.gradeName, {
    id: "gradeName",
    header: "Name",
  }),
  {
    id: "action",
    header: "Action",
    cell: (p) => (
      <Link
        className={cn(
          buttonVariants({ variant: "link" }),
          "h-auto p-0 text-tertiary"
        )}
        to={`contests/${p.row.original.id}`}
      >
        View contests
      </Link>
    ),
  },
];

export default function ContestsTable() {
  const gradesQ = useGetGrades();

  const data: undefined | Grade[] = gradesQ.data
    ?.map((g) => ({
      id: g._id,
      grade: g.grade,
      gradeName: `Grade ${g.grade}`,
      numContests: -1,
    }))
    .sort((a, b) => a.grade - b.grade);

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl">Choose a grade</CardTitle>
        <CardDescription>
          Select a grade to view contests and details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AdminTable
          data={data || null}
          columns={contestCols}
          isLoading={gradesQ.isLoading}
          error={gradesQ.error}
          retry={gradesQ.refetch}
          enablePagination={true}
        />
      </CardContent>
    </Card>
  );
}
