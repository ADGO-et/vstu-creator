import { useState } from "react";
import { Flag, Clock, CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Link } from "react-router-dom"
import { useReportedQuestions } from "@/services/questions"
import { Skeleton } from "@/components/ui/skeleton" 
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert" 
import { AlertTriangle } from "lucide-react"
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination"

export default function AdminQuestionReports() {
  const [page, setPage] = useState(1)
  const limit = 5

  const { data, isLoading, isError, error } = useReportedQuestions({ page, limit })

  const totalReports = data?.totalCount ?? 0
  // Note: Pending and Resolved counts are not directly available from the current API response.
  // These will remain static or need backend adjustments.
  const pendingReviewCount = 12 
  const resolvedIssuesCount = 89 

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + "..."
  }

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Report Management</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="border border-gray-100 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-2">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <Flag className="h-5 w-5 text-red-500" />
              </div>
              <h2 className="text-4xl font-bold mt-2">{isLoading ? <Skeleton className="h-10 w-16" /> : totalReports}</h2>
              <div>
                <p className="text-gray-800 font-medium">Total Reports</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-100 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-2">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-orange-500" />
              </div>
              <h2 className="text-4xl font-bold mt-2">{pendingReviewCount}</h2>
              <div>
                <p className="text-gray-800 font-medium">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-100 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-2">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <h2 className="text-4xl font-bold mt-2">{resolvedIssuesCount}</h2>
              <div>
                <p className="text-gray-800 font-medium">Resolved Issues</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-6">Incoming Reports</h2>

        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        )}

        {isError && (
           <Alert variant="destructive">
             <AlertTriangle className="h-4 w-4" />
             <AlertTitle>Error Fetching Reports</AlertTitle>
             <AlertDescription>
               {error?.message || "An unexpected error occurred. Please try again later."}
             </AlertDescription>
           </Alert>
        )}

        {!isLoading && !isError && data && (
          <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Question</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Reports</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.questions.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-gray-500">
                      No reported questions found.
                    </td>
                  </tr>
                )}
                {data.questions.map((report) => (
                  <tr key={report._id} className="border-b border-gray-200">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium">{truncateText(report.question, 50)}</p> 
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100">
                        {report.questionReported} report{report.questionReported !== 1 ? "s" : ""}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge
                        variant="outline"
                        className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100"
                      >
                        Under Review
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Link to={`${report._id}`} className="text-primary p-0 h-auto hover:underline">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data.totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationPrevious 
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                // disabled={page === 1}
                className="cursor-pointer"
              />
              <PaginationContent>
                {Array.from({ length: data.totalPages }, (_, idx) => {
                  const pageNumber = idx + 1
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        isActive={pageNumber === page}
                        onClick={() => setPage(pageNumber)}
                        className="cursor-pointer"
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  )
                })}
              </PaginationContent>
              <PaginationNext 
                onClick={() => {
                  if (page < data.totalPages) {
                    setPage((prev) => Math.min(prev + 1, data.totalPages));
                  }
                }}
                className="cursor-pointer"
              />
            </Pagination>
          )}
          </>
        )}
      </div>
    </div>
  )
}