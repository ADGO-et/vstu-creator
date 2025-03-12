import { AdminTable } from "@/components/admin-components/AdminTable";
import Back from "@/components/admin-components/Back";
import { useGetGrade } from "@/services/grade";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Link, useParams } from "react-router-dom";

interface Subject {
  id: string;
  subject: string;
  numContests: number;
  updatedAt: string;
}

const h = createColumnHelper<Subject>();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cols: ColumnDef<Subject, any>[] = [
  h.accessor("subject", { header: "Subject" }),
  h.accessor("numContests", { header: "Total Contests" }),
  h.display({
    header: "Action",
    cell: (p) => <Link to={`${p.row.original.id}/add`}>add Contest quiz</Link>,
  }),
];

export default function ContestSubjectTable() {
  const { gradeId } = useParams<{ gradeId: string }>();

  const gradeQ = useGetGrade(gradeId || null);

  const data: undefined | Subject[] = gradeQ.data?.subjects.map((s) => ({
    id: s._id,
    subject: s.name,
    numContests: -1,
    updatedAt: "",
  }));

  return (
    <div className="py-6 flex flex-col gap-6">
      <Back steps={2} />
      <h1 className="text-4xl">Contests</h1>
      <p>Choose a subject</p>
      <AdminTable
        data={data || null}
        columns={cols}
        isLoading={gradeQ.isLoading}
        error={gradeQ.error}
        retry={() => {
          if (!gradeQ.data) gradeQ.refetch();
        }}
        enablePagination={true}
      />
    </div>
  );
}
