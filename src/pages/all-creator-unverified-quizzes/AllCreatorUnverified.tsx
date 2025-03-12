import { useGetCreatorUnverifiedQuizzes, useVerifyQuizByCreator } from "@/services/quiz";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useState } from "react";
import { AdminTable } from "@/components/admin-components/AdminTable";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Delete } from "./components/Delete";
import EditLink from "@/components/admin-components/EditLink";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Language {
    _id: string;
    language: string;
    slug: string
  }
  
  interface Subject {
    _id: string;
    name: string;
    language: Language
  }
  
  interface QuizType {
    _id: string;
    quizTitle: string;
    topic: { subject: Subject; _id: string; grade: string };
    isAdminVerified: boolean;
    createdAt: string
  }
  
  const columnHelper = createColumnHelper<QuizType>();

const AllCreatorUnverified = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, _] = useState(6);
    const [jumpPage, setJumpPage] = useState("");

    const { data, isLoading, error, refetch } = useGetCreatorUnverifiedQuizzes({
        page: currentPage,
        limit
    });

    console.log(data);

      const { mutate: verifyQuiz } = useVerifyQuizByCreator();
    
      const columns: ColumnDef<QuizType, any>[] = [
        columnHelper.accessor("quizTitle", { header: "Quiz Title" }),
        columnHelper.accessor("topic.subject.name", { header: "Subject" }),
        columnHelper.accessor("topic.subject.language.language", { header: "Language" }),
        columnHelper.accessor("createdAt", {
          header: "Created At",
          cell: (props) => new Date(props.getValue()).toLocaleDateString(),
        }),
        columnHelper.display({
          header: "Verify",
          cell: ({ row }) => (
            <Button
              onClick={() => verifyQuiz({ id: row.original._id })}
              variant="secondary"
            >
              Verify
            </Button>
          ),
        }),
        columnHelper.display({
          header: "Action",
          cell: ({ row }) => (
            <div className="flex space-x-2">
              <EditLink
                to={`${row.original.topic._id}/edit/${row.original._id}`}
              />
              <Delete id={row.original._id} name={row.original.quizTitle} />
            </div>
          ),
        }),
      ];
    
      const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
      };
    
      const handleNext = () => {
        if (data && currentPage < data?.totalPages) {
          setCurrentPage(prev => prev + 1);
        }
      };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-4xl">Unverified Quizzes</h1>
      <p>List of all unverified quizzes</p>
      <div className="relative h-[460px]">
        <AdminTable
          data={data?.quizzes || null}
          columns={columns}
          isLoading={isLoading}
          error={error}
          retry={refetch}
        />
        <div className={` ${(data?.totalCount ?? 0) < limit ? 'hidden': ""} bottom-0 left-0 w-full bg-white p-4 flex justify-center`}>
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
                {data?.totalPages}
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={handleNext}
                  className={data && currentPage === data.totalPages ? "disabled-class text-gray-500 cursor-not-allowed hover:bg-white hover:text-gray-500" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          <div className="flex items-center space-x-2 mt-4">
            <Input
              type="number"
              value={jumpPage}
              onChange={(e) => setJumpPage(e.target.value)}
              min="1"
              max={data?.totalPages || 1}
              className="border px-2 py-1"
              placeholder="page #"
            />
            <Button
              onClick={() => {
                const page = parseInt(jumpPage);
                if (data && page >= 1 && page <= data.totalPages) {
                  setCurrentPage(page);
                }
              }}
            >
              Go
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AllCreatorUnverified
