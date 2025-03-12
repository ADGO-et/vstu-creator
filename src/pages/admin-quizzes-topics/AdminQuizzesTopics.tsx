import { AdminTable } from "@/components/admin-components/AdminTable";
import Back from "@/components/admin-components/Back";
import EditLink from "@/components/admin-components/EditLink";
import ErrorMessage from "@/components/status/ErrorMessage";
import { Button } from "@/components/ui/button";
import { useGetGrade } from "@/services/grade";
import { useGetTopics } from "@/services/quiz";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Link, useParams } from "react-router-dom";
import { Delete } from "./components/Delete";
import { useGetSubject } from "@/services/subjects";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useState } from "react";


interface Topic {
  id: string;
  chapter: number;
  title: string;
}

const h = createColumnHelper<Topic>();
const cols: ColumnDef<Topic, any>[] = [
  h.accessor("title", { header: "Topic" }),
  h.accessor("chapter", { header: "Chapter Number" }),
  h.display({
    header: "Action",

    cell: (p) => (
      <div className="flex items-center">
        <EditLink to={`edit/${p.row.original.id}`} />
        <Delete id={p.row.original.id} name={p.row.original.title} />
        <Link to={p.row.original.id}>View Quizzes</Link>
      </div>
    ),
  }),
];

export default function AdminQuizzesTopics() {
  const { gradeId, subjectId } = useParams<{
    gradeId: string;
    subjectId: string;
  }>();

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, _] = useState(6);

  const gradeQ = useGetGrade(gradeId || null);
  const topicsQ = useGetTopics({
    gradeId: gradeQ.data?._id,
    subjectId,
    enabled: gradeQ.data !== undefined,
    page: currentPage,
    limit,
  });
  const subjectQ = useGetSubject(subjectId || null)

  const data: undefined | Topic[] = topicsQ.data?.topics.map((t) => ({
    id: t._id,
    chapter: t.chapter,
    title: t.chapterTitle,
  }));

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNext = () => {
    if (topicsQ.data && currentPage < topicsQ.data?.totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <div className="py-6 flex flex-col gap-6">
      <Back />

      <div className="flex justify-between flex-wrap">
        <h1 className="text-3xl">
          Topics <br />
          {gradeQ.data && (
            <span>
              Grade {gradeQ.data?.grade}, {subjectQ.data?.name}
            </span>
          )}
        </h1>
        <Link to={"add"}>
          <Button>Add Topic</Button>
        </Link>
      </div>
      <ErrorMessage error={gradeQ.error} retry={gradeQ.refetch} />
      <p>Choose a topic</p>
      <div className="relative h-[450px]">
        <AdminTable
          data={data || null}
          columns={cols}
          isLoading={topicsQ.isLoading || gradeQ.isLoading}
          error={topicsQ.error}
          retry={topicsQ.refetch}
          enablePagination={false}
        />
        <div className={` ${(topicsQ.data?.totalCount ?? 0) <= limit ? 'hidden': ""} absolute bottom-0 left-0 w-full bg-white p-4 flex justify-center`}>
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
                {topicsQ.data?.totalPages}
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={handleNext}
                  className={topicsQ.data && currentPage === topicsQ.data.totalPages ? "disabled-class text-gray-500 cursor-not-allowed hover:bg-white hover:text-gray-500" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
