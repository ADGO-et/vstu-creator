import { AdminTable } from "@/components/admin-components/AdminTable";
import Back from "@/components/admin-components/Back";
import { toDate } from "@/lib/admin-utils";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Link } from "react-router-dom";

interface Contest {
  _id: string;
  gradeName: string;
  totalContests: number;
  latestContest: string; //date string
}

const h = createColumnHelper<Contest>();
const cols: ColumnDef<Contest, any>[] = [
  h.accessor("gradeName", { header: "Name" }),
  h.accessor("totalContests", { header: "Total Contests" }),
  h.accessor("latestContest", {
    header: "Last Modified",
    cell: (p) => toDate(p.getValue()),
  }),

  h.display({
    header: "Action",
    cell: (p) => (
      <div className="flex">
        <Link to={p.row.original._id}>View Results</Link>
      </div>
    ),
  }),
];

export default function AdminContestsResults() {
  const data: undefined | Contest[] = [
    {
      _id: "1",
      gradeName: "Grade 1",
      totalContests: 3,
      latestContest: "2021-09-21T10:00:00",
    },
    {
      _id: "2",
      gradeName: "Grade 2",
      totalContests: 3,
      latestContest: "2021-09-21T10:00:00",
    },
    {
      _id: "3",
      gradeName: "Grade 3",
      totalContests: 3,
      latestContest: "2021-09-21T10:00:00",
    },
  ];

  return (
    <div className="py-6 flex flex-col gap-6">
      <Back steps={1} />
      <div className="flex justify-between flex-wrap gap-6">
        <div className="flex flex-col gap-6">
          <h1 className="text-4xl">Contest Results</h1>
          <p>Choose a grade</p>
        </div>
      </div>
      <AdminTable
        data={data || []}
        columns={cols}
        isLoading={false}
        error={null}
        retry={() => {}}
        enablePagination={true}
      />
    </div>
  );
}
