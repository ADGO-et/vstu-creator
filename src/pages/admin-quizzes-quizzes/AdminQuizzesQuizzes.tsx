import { AdminTable } from "@/components/admin-components/AdminTable";
import Back from "@/components/admin-components/Back";
import EditLink from "@/components/admin-components/EditLink";
import ErrorMessage from "@/components/status/ErrorMessage";
import Loading from "@/components/status/Loading";
import { Button } from "@/components/ui/button";
import { useGetQuizzes, useGetTopic } from "@/services/quiz";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Link, useParams } from "react-router-dom";
import { Delete } from "./components/Delete";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useState } from "react";


interface Quiz {
  id: string;
  name: string;
  language: string;
  numQuestions: number;
}

const h = createColumnHelper<Quiz>();
const cols: ColumnDef<Quiz, any>[] = [
  h.accessor("name", { header: "Quiz" }),
  h.accessor("language", { header: "Language" }),
  h.accessor("numQuestions", { header: "Questions" }),
  h.display({
    header: "Action",
    cell: (p) => (
      <div className="flex">
        <EditLink to={`edit/${p.row.original.id}`} />
        <Delete id={p.row.original.id} name={p.row.original.name} />
      </div>
    ),
  }),
];

export default function AdminQuizzesQuizzes() {
  const { topicId } = useParams<{ topicId: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, _] = useState(6);

  const topicQ = useGetTopic(topicId || null);
  const quizzesQ = useGetQuizzes({
    topicId: topicId || "-",
    isEnabled: true,
    page: currentPage,
    limit
  });

  const data: undefined | Quiz[] = quizzesQ.data?.quizzes.map((q) => ({
    id: q._id,
    name: q.quizTitle,
    language: q.language?.language,
    numQuestions: q.questions?.length,
  }));

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNext = () => {
    if (quizzesQ.data && currentPage < quizzesQ.data?.totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <div className="py-6 flex flex-col gap-6">
      <Back />
      <Loading isLoading={topicQ.isLoading} />
      <ErrorMessage error={topicQ.error} retry={topicQ.refetch} />

      <div className="flex justify-between">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-4xl">Quizzes</h1>
          </div>
          <p>
            Choose a quiz in
            <br />
            {topicQ.data && (
              <span>
                <span className="p-1 bg-muted mx-1">{topicQ.data.subject.name}</span>
                ,
                <span className="p-1 bg-muted mx-1">
                  Chapter {topicQ.data.chapter}
                </span>
                ,
                <span className="p-1 bg-muted mx-1">
                  {topicQ.data.chapterTitle}
                </span>
              </span>
            )}
            <Loading isLoading={topicQ.isLoading} />
          </p>
        </div>
        <div className="flex items-center gap-4">
        <Link to="add">
          <Button>Add Quiz</Button>
        </Link>
        </div>
      </div>
      <div className="relative h-[470px]">
        <AdminTable
          data={data || null}
          columns={cols}
          isLoading={quizzesQ.isLoading}
          error={quizzesQ.error}
          retry={quizzesQ.refetch}
          enablePagination={false}
        />

        <div className={` ${(quizzesQ.data?.totalCount ?? 0) <= limit ? 'hidden': ""} absolute bottom-0 left-0 w-full bg-white p-4 flex justify-center`}>
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
                {quizzesQ.data?.totalPages}
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={handleNext}
                  className={quizzesQ.data && currentPage === quizzesQ.data?.totalPages ? "disabled-class text-gray-500 cursor-not-allowed hover:bg-white hover:text-gray-500" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
