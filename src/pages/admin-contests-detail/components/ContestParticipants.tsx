import { useState } from "react";
import { useGetContestParticipants } from "@/services/contest";
import { AdminTable } from "@/components/admin-components/AdminTable";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const columns = [
  {
    header: "Profile Picture",
    cell: ({ row }: any) => (
      <img
        src={row.original.profilePicture}
        alt="Profile"
        style={{ width: 40, height: 40, borderRadius: "50%" }}
      />
    ),
  },
  {
    header: "First Name",
    accessorKey: "firstName",
  },
  {
    header: "Last Name",
    accessorKey: "lastName",
  },
  {
    header: "Email",
    accessorKey: "email",
  },
  {
    header: "Address",
    cell: ({ row }: any) => {
      const addr = row.original.address;
      if (!addr) return "—";
      return `${addr.region ?? "-"}, ${addr.zone ?? "-"}, ${
        addr.woreda ?? "-"
      }`;
    },
  },
  {
    header: "School",
    cell: ({ row }: any) => row.original.school?.name ?? "—",
  },
];

const ContestParticipants = ({ contestId }: { contestId: string }) => {
  const [page, setPage] = useState(1);
  const limit = 1;
  const { data, isLoading, error } = useGetContestParticipants(
    contestId,
    page,
    limit
  );

  const participants = data?.participants ?? [];
  const rows = participants.filter((p: any) => p && Object.keys(p).length > 0);
  const currentPage = data?.currentPage || 1;
  const showEmpty = !isLoading && !error && rows.length === 0;

  const handlePrevious = () => {
    if (currentPage > 1) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (data && currentPage < data?.totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="relative h-[410px]">
      {!showEmpty && (
        <AdminTable
          columns={columns}
          data={rows}
          isLoading={isLoading}
          error={error}
          enablePagination={false}
        />
      )}
      {showEmpty && (
        <div className="flex items-center justify-center text-gray-500">
          No participants yet.
        </div>
      )}
      <div
        className={` ${
          showEmpty || (data?.totalCount ?? 0) < limit ? "hidden" : ""
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
              {data?.totalPages}
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={handleNext}
                className={
                  data && currentPage === data?.totalPages
                    ? "disabled-class text-gray-500 cursor-not-allowed hover:bg-white hover:text-gray-500"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default ContestParticipants;
