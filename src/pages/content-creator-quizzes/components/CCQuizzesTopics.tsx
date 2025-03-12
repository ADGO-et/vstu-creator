import { AdminTable } from "@/components/admin-components/AdminTable";
import Back from "@/components/admin-components/Back";
import { useGetGrade } from "@/services/grade";
import { useGetTopics } from "@/services/quiz";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Link, useParams } from "react-router-dom";
import { useGetSubject } from "@/services/subjects";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useState } from "react";


interface Topic {
  id: string;
  chapter: number;
  title: string;
  // unverifiedCount: number;
}

const h = createColumnHelper<Topic>();

export default function ContentQuizzesTopics() {
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
  const subjectQ = useGetSubject(subjectId || null);
  // const unverifiedQuizzesQuery = useGetCreatorUnverifiedQuizzes({ isEnabled: true });

  // const unverifiedCounts = unverifiedQuizzesQuery.data?.quizzes.reduce((acc, quiz) => {
  //   const topicId = quiz.topic._id;
  //   acc[topicId] = (acc[topicId] || 0) + 1;
  //   return acc;
  // }, {} as Record<string, number>);

  const cols: ColumnDef<Topic, any>[] = [
    h.accessor("title", { header: "Topic" }),
    h.accessor("chapter", { header: "Chapter Number" }),
    // h.accessor("unverifiedCount", { header: "Unverified Quizzes" }),
    h.display({
      header: "Action",
      cell: (p) => <Link to={`${p.row.original.id}`}>View Quizzes</Link>,
    }),
  ];

  const data: undefined | Topic[] = topicsQ.data?.topics?.map((t) => ({
    id: t._id,
    chapter: t.chapter,
    title: t.chapterTitle,
    // unverifiedCount: unverifiedCounts?.[t._id] || 0,
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
      <h1 className="text-3xl">
        Topics <br />
        {gradeQ.data && (
          <span>
            Grade {gradeQ.data?.grade}, {subjectQ.data?.name}
          </span>
        )}
      </h1>
      <p>Choose a topic</p>
      <div className="relative h-[460px]">
        <AdminTable
          data={data || null}
          columns={cols}
          isLoading={topicsQ.isLoading || gradeQ.isLoading}
          error={topicsQ.error || gradeQ.error}
          retry={() => {
            topicsQ.refetch();
            gradeQ.refetch();
            // unverifiedQuizzesQuery.refetch();
          }}
          enablePagination={false}
        />

        <div className={` ${(topicsQ.data?.totalCount ?? 0) <= limit ? 'hidden': ""} bottom-0 left-0 w-full bg-white p-4 flex justify-center`}>
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
