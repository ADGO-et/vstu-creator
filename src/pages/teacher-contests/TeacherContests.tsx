import { AdminTable } from "@/components/admin-components/AdminTable";
import { useGetTeacherProfile } from "@/services/teacher";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toDate } from "@/lib/admin-utils";
import { useGetTeacherContests } from "@/services/contest";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { useState } from "react";
import { ContestType } from "@/types/contest";

interface ContestRow {
  id: string;
  title: string;
  registeredStudents: number;
  startTime: string;
  endTime: string;
  isLive: string;
  gradeId?: string;
  subject?: string;
}

const h = createColumnHelper<ContestRow>();
const cols: ColumnDef<ContestRow, any>[] = [
  h.accessor("title", { header: "Title" }),
  h.accessor("isLive", { header: "IsLive" }),
  h.accessor("registeredStudents", { header: "Registered Students" }),
  h.accessor("startTime", {
    header: "Start Time",
    cell: (p) => toDate(p.getValue()),
  }),
  h.accessor("endTime", {
    header: "End Time",
    cell: (p) => toDate(p.getValue()),
  }),
  h.display({
    header: "Action",
    cell: (p) => {
      const { id } = p.row.original;
      return <Link to={`/teacher/my-contests/${id}`}>Details</Link>;
    },
  }),
];
const isLiveFromTime = (start: string, end: string) => {
  const startMs = Date.parse(start);
  const endMs = Date.parse(end);
  if (Number.isNaN(startMs) || Number.isNaN(endMs)) return "—";
  const now = Date.now();
  return now >= startMs && now <= endMs ? "Yes" : "No";
};

export default function TeacherContests() {
  const { data: currentTeacher } = useGetTeacherProfile();
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(4);
  const teacherId = currentTeacher?._id || "";

  const q = useGetTeacherContests(teacherId, currentPage, limit);

  const truncate = (str: string, n: number) =>
    str.length > n ? str.slice(0, n - 1) + "..." : str;

  const contests = q.data?.contests ?? [];

  const data: ContestRow[] | undefined = contests
    .map((c: ContestType) => {
      const gradeId = c.quiz?.topic?.grade;
      const subjectId = c.quiz?.topic?.subject?._id;
      return {
        id: c._id,
        title: truncate(c.title, 20),
        registeredStudents: c.enrollCount ?? 0,
        startTime: c.startTime,
        endTime: c.endTime,
        isLive: isLiveFromTime(c.startTime, c.endTime),
        gradeId,
        subject: subjectId,
      };
    })
    .reverse();

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };
  const handleNext = () => {
    if (q.data && currentPage < q.data.totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const showEmpty = !q.isLoading && !q.error && (q.data?.totalCount ?? 0) === 0;

  return (
    <div className="py-6 flex flex-col gap-6">
      <div className="flex justify-between flex-wrap">
        <h1 className="text-4xl mb-5">My Contests</h1>
      </div>

      {!showEmpty && (
        <div className="relative h-[650px] md:h-[450px]">
          <AdminTable
            data={data || null}
            columns={cols}
            isLoading={q.isLoading}
            error={q.error}
            retry={q.refetch}
            enablePagination={false}
          />
          <div
            className={` ${
              (q.data?.totalCount ?? 0) < limit ? "hidden" : ""
            } absolute bottom-0 left-0 w-full bg-white p-4 flex justify-center`}
          >
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={handlePrevious}
                    className={
                      currentPage === 1
                        ? "disabled-class text-gray-500 cursor-not-allowed hover:bg-white hover:text-gray-500"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink isActive>{currentPage}</PaginationLink>
                </PaginationItem>
                <PaginationItem className="gap-x-2">of</PaginationItem>
                <PaginationItem className="gap-x-2">
                  {q.data?.totalPages}
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={handleNext}
                    className={
                      q.data && currentPage === q.data.totalPages
                        ? "disabled-class text-gray-500 cursor-not-allowed hover:bg-white hover:text-gray-500"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}

      {showEmpty && (
        <div className="flex items-center justify-center text-gray-500 h-40">
          No contests yet.
        </div>
      )}
    </div>
  );
}
