import { Link, useParams } from "react-router-dom";

import { AdminTable } from "@/components/admin-components/AdminTable";
import Back from "@/components/admin-components/Back";
import EditLink from "@/components/admin-components/EditLink";
import { WritableDropdown } from "@/components/ui/writable-dropdown";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";

interface StudentResults {
  _id: string;
  rank: number;
  name: string;
  points: number;
  prize: string;
}

const h = createColumnHelper<StudentResults>();
const cols: ColumnDef<StudentResults, any>[] = [
  h.accessor("rank", { header: "Rank" }),
  h.accessor("name", { header: "Student" }),
  h.accessor("points", { header: "Points" }),
  h.accessor("prize", { header: "Prize" }),

  h.display({
    header: "Action",
    cell: (p) => (
      <div className="flex items-center">
        <EditLink to={`${p.row.original._id}/edit`} />
        <Link to={`${p.row.original._id}/add`}>View Feedback</Link>
      </div>
    ),
  }),
];

export default function AdminContestResults() {
  const { contestId } = useParams<{ contestId: string }>();
  console.log("🚀 ~ AdminContestResults ~ contestId:", contestId);

  const ranges: { label: string; value: string }[] = [
    { label: "Weekly", value: "weekly" },
    { label: "Montly", value: "monthly" },
  ];
  const [range, setRange] = useState(ranges[0].value);

  const weeks: { week: number; date: string }[] = [
    { week: 1, date: "2021-09-21T10:00:00" },
    { week: 2, date: "2021-09-21T10:00:00" },
  ];
  const [week, setWeek] = useState(weeks[0].week);

  const data: undefined | StudentResults[] = [
    { _id: "2", rank: 2, name: "Abebe Kebede", points: 90, prize: "Silver" },
    { _id: "1", rank: 1, name: "Meritu Lemma", points: 100, prize: "Gold" },
  ].sort((a, b) => a.rank - b.rank);

  return (
    <div className="py-6 flex flex-col gap-6">
      <Back steps={1} />
      <div className="flex justify-between flex-wrap gap-6">
        <div className="flex flex-col gap-6">
          <h1 className="text-4xl">Results</h1>
        </div>
        <WritableDropdown
          isWritable={false}
          value={range}
          onValueChange={(v) => setRange(v)}
          options={ranges}
        />
      </div>

      <div className="flex justify-start">
        <WritableDropdown
          isWritable={false}
          value={week.toString()}
          onValueChange={(v) => setWeek(+v)}
          options={weeks.map((w) => ({
            label: `Week ${w.week}`,
            value: w.week.toString(),
          }))}
        />
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
