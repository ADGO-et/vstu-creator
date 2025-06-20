import {
  useGetCreatorUnverifiedQuizzesFiltered,
  useVerifyQuizByCreator,
} from "@/services/quiz";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";
import { AdminTable } from "@/components/admin-components/AdminTable";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Delete } from "../all-creator-unverified-quizzes/components/Delete";
import EditLink from "@/components/admin-components/EditLink";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetGrades } from "@/services/grade";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Language {
  _id: string;
  language: string;
  slug: string;
}

interface Subject {
  _id: string;
  name: string;
  language: Language;
}

interface QuizType {
  _id: string;
  quizTitle: string;
  topic: { subject: Subject; _id: string; grade: string };
  isAdminVerified: boolean;
  createdAt: string;
}

interface Grade {
  _id: string;
  grade: number;
  subjects: Subject[];
}

const columnHelper = createColumnHelper<QuizType>();

const AllCreatorUnverifiedFiltered = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, _] = useState(6);
  const [jumpPage, setJumpPage] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [isCreatorVerified, setIsCreatorVerified] = useState<string>("false");

  var tempgrade = "";

  const { data: gradesData } = useGetGrades();
  const { data, isLoading, error, refetch } =
    useGetCreatorUnverifiedQuizzesFiltered({
      page: currentPage,
      limit: 1000,
      gradeId: selectedGrade || undefined,
      subjectId: selectedSubject || undefined,
      isCreatorVerified,
    });

  const { mutate: verifyQuiz } = useVerifyQuizByCreator();

  const columns: ColumnDef<QuizType, any>[] = [
    columnHelper.accessor("quizTitle", { header: "Quiz Title" }),
    columnHelper.accessor("topic.subject.name", { header: "Subject" }),
    columnHelper.accessor("topic.subject.language.language", {
      header: "Language",
    }),
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
          <EditLink to={`${row.original.topic._id}/edit/${row.original._id}`} />
          <Delete id={row.original._id} name={row.original.quizTitle} />
        </div>
      ),
    }),
  ];

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (data && currentPage < data?.totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Get subjects for the selected grade
  const getSubjectsForGrade = () => {
    if (!selectedGrade || !gradesData) return [];
    const grade = gradesData.find((g) => g._id === selectedGrade);
    tempgrade = grade?.grade !== undefined ? String(grade.grade) : "";
    return grade ? grade.subjects : [];
  };

  const handleGradeChange = (value: string) => {
    setSelectedGrade(value);
    setSelectedSubject(null);
    setCurrentPage(1);
  };

  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value);
    setCurrentPage(1);
  };
  // this are to be removed once the
  const filteredQuizzes =
    data?.quizzes?.filter((quiz) => {
      // Find the selected grade object
      const gradeObj = gradesData?.find((g) => g._id === selectedGrade);
      // Get the grade number as string
      const gradeValue = gradeObj ? gradeObj.grade.toString() : "";

      return (
        (!selectedGrade || quiz.topic.grade.grade.toString() === gradeValue) &&
        (!selectedSubject || quiz.topic.subject._id === selectedSubject)
      );
    }) || [];
  const totalPages = Math.ceil(filteredQuizzes.length / limit);
  const paginatedQuizzes = filteredQuizzes.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-4xl">Unverified Quizzes</h1>
      <p>List of all unverified quizzes</p>

      <div className="flex gap-4">
        <div className="w-48">
          <Select onValueChange={handleGradeChange} value={selectedGrade || ""}>
            <SelectTrigger>
              <SelectValue placeholder="Select Grade" />
            </SelectTrigger>
            <SelectContent>
              {gradesData?.map((grade) => (
                <SelectItem key={grade._id} value={grade._id}>
                  Grade {grade.grade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-48">
          <Select
            onValueChange={handleSubjectChange}
            value={selectedSubject || ""}
            disabled={!selectedGrade}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  selectedGrade ? "Select Subject" : "Select Grade first"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {getSubjectsForGrade().map((subject) => (
                <SelectItem key={subject._id} value={subject._id}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-48">
          <Select
            onValueChange={setIsCreatorVerified}
            value={isCreatorVerified}
          >
            <SelectTrigger>
              <SelectValue placeholder="Verification Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="false">Unverified</SelectItem>
              <SelectItem value="true">Verified</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="relative ">
        <AdminTable
          data={paginatedQuizzes}
          columns={columns}
          isLoading={isLoading}
          error={error}
          retry={refetch}
        />
        <div
          className={` ${
            (data?.totalCount ?? 0) < limit ? "hidden" : ""
          } bottom-0 left-0 w-full bg-white p-4 flex justify-center`}
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
              <PaginationItem className="gap-x-2">{totalPages}</PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={handleNext}
                  className={
                    data && currentPage === totalPages
                      ? "disabled-class text-gray-500 cursor-not-allowed hover:bg-white hover:text-gray-500"
                      : "cursor-pointer"
                  }
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
              max={totalPages || 1}
              className="border px-2 py-1"
              placeholder="page #"
            />
            <Button
              onClick={() => {
                const page = parseInt(jumpPage);
                if (data && page >= 1 && page <= totalPages) {
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
  );
};

export default AllCreatorUnverifiedFiltered;
