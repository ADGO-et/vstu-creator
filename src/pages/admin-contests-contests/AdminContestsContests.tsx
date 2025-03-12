import { AdminTable } from "@/components/admin-components/AdminTable";
import Back from "@/components/admin-components/Back";
import ErrorMessage from "@/components/status/ErrorMessage";
import { Button } from "@/components/ui/button";
import { toDate } from "@/lib/admin-utils";
import { useGetContests, useGetLatestContests } from "@/services/contest";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Link, useParams } from "react-router-dom";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";



interface Contest {
  id: string;
  title: string;

  gradeId: string;
  subject: string;
  topicId: string;
  quizId: string;

  registeredStudents: number;
  updatedAt: string;
  startTime: string;
  endTime: string;
  isLive: string;
}

const h = createColumnHelper<Contest>();
const cols: ColumnDef<Contest, any>[] = [
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
      return (
        <div className="flex items-center">
          <Link to={p.row.original.id}>Details</Link>
        </div>
      );
    },
  }),
];

export default function AdminContestsContests() {
  const { gradeId, subject } = useParams<{
    gradeId: string;
    subject: string;
  }>();

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, _] = useState(4);

  type Options = 'All' | 'Latest';
  const initialOption = 'All';
  const [selectedOption, setSelectedOption] = useState<"All" | "Latest">(initialOption);
  const [isOpen, setIsOpen] = useState(false);

  const contestsQ = useGetContests(currentPage, limit);
  const latestContestsQ = useGetLatestContests(currentPage, limit);
  
  const currentQuery = selectedOption === "Latest" ? latestContestsQ : contestsQ;
  
  const truncate = (str: string, n: number) => {
    return str.length > n ? str.substr(0, n - 1) + "..." : str;
  }

  const data: Contest[] | undefined = (selectedOption === "Latest"
    ? latestContestsQ.data?.contests
    : contestsQ.data?.contests
  )?.map((c) => ({
    id: c._id,
    title: truncate(c.title, 20),

    gradeId: gradeId || "-",
    subject: subject || "-",
    topicId: c.quiz.topic._id,
    quizId: c.quiz._id,

    registeredStudents: c.enrollCount,
    updatedAt: c.updatedAt.toString(),
    startTime: c.startTime.toString(),
    endTime: c.endTime.toString(),
    isLive: c.isLive === 1 ? "Yes" : "No",
    // description: truncate(c.description, 40),
  }))?.reverse();

    const handlePrevious = () => {
      if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };
  
    const handleNext = () => {
      if (currentQuery.data && currentPage < currentQuery.data.totalPages) {
        setCurrentPage(prev => prev + 1);
      }
    };

  return (
    <div className="py-6 flex flex-col gap-6">
      <Back />

      <div className="flex justify-between flex-wrap">
        <h1 className="text-4xl mb-5">Contests</h1>
        <div className="flex items-center gap-3">
        <Select
          onOpenChange={setIsOpen}
          value={selectedOption}
          onValueChange={(value) => {
            setSelectedOption(value as Options);
            setCurrentPage(1); 
          }}
        >
          <SelectTrigger
            className={`w-full sm:w-auto border-none rounded-full py-2 px-4 gap-2 ${
              isOpen ? "" : "text-primary"
            }`}
          >
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            {['All', 'Latest'].map((opt) => (
              <SelectItem key={opt} value={opt}>
                <div className="flex gap-4 items-center w-fit">
                  <span>{opt}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Link to={"add"}>
          <Button>Add Contest</Button>
        </Link>
        </div>
      </div>
      <ErrorMessage error={null} retry={() => {}} />
      <div className="relative h-[650px] md:h-[450px]">
        <AdminTable
          data={data || null}
          columns={cols}
          isLoading={false}
          error={null}
          retry={() => {}}
          enablePagination={false}
        />

        <div className={` ${(currentQuery.data?.totalCount ?? 0) < limit ? 'hidden': ""} absolute bottom-0 left-0 w-full bg-white p-4 flex justify-center`}>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={handlePrevious}
                  className={currentPage === 1 ? "disabled-class text-gray-500 cursor-not-allowed hover:bg-white hover:text-gray-500" : "cursor-pointer"}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink isActive>{currentPage}</PaginationLink>
              </PaginationItem>
              <PaginationItem className="gap-x-2">
                of
              </PaginationItem>
              <PaginationItem className="gap-x-2">
                {currentQuery.data?.totalPages}
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={handleNext}
                  className={currentQuery.data && currentPage === currentQuery.data.totalPages ? "disabled-class text-gray-500 cursor-not-allowed hover:bg-white hover:text-gray-500" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
