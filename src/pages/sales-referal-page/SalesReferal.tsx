import {useState, useMemo} from 'react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetSalesReferals } from '@/services/sales';

const SalesReferal = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data, isLoading, isError, error, isFetching } = useGetSalesReferals(page, limit);

  const referralCode = useMemo(()=> data?.referrals?.[0]?.referralCode ?? '—', [data]);

  const totalPages = data?.totalPages ?? 1;
  const canPrev = page > 1;
  const canNext = page < totalPages;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-8 w-40" />
        </div>
        <Card className="p-0 overflow-hidden">
          <div className="p-4">
            <Skeleton className="h-5 w-32 mb-4" />
            <div className="space-y-2">
              {Array.from({length:5}).map((_,i)=>(
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 space-y-4">
        <div className="text-red-500 text-sm font-medium">Failed to load referrals.</div>
        <pre className="text-xs opacity-60">{error.message}</pre>
      </div>
    );
  }

  const referrals = data?.referrals ?? [];

  return (
    <div className="space-y-6 mt-8">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-primary">Your Referrals</h1>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">Referral Code</span>
            <Badge className="text-base px-4 py-2 font-mono bg-tertiary">
              {referralCode}
            </Badge>
        </div>
      </div>

      <Card className="border rounded-xl overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between border-b bg-muted/30">
          <h2 className="font-medium text-sm">Referred Students</h2>
          {isFetching && <span className="text-xs text-muted-foreground animate-pulse">Refreshing...</span>}
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">#</TableHead>
                <TableHead>First Name</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead className="hidden md:table-cell">Date Referred</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {referrals.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-sm text-muted-foreground">
                    No referrals yet.
                  </TableCell>
                </TableRow>
              )}
              {referrals.map((r, idx) => {
                const student = r.referredStudent;
                const date = new Date(r.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric'});
                return (
                  <TableRow key={r._id}>
                    <TableCell className="font-medium">{(page - 1) * limit + idx + 1}</TableCell>
                    <TableCell className="font-medium">{student?.firstName || '—'}</TableCell>
                    <TableCell className="font-medium">{student?.lastName || '—'}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{date}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <div className="px-6 py-4 flex flex-col sm:flex-row gap-3 sm:items-center justify-between border-t bg-muted/20">
          <div className="text-xs text-muted-foreground">
            Showing {(referrals.length && (page - 1) * limit + 1) || 0} - {(page - 1) * limit + referrals.length} of {data?.totalCount ?? 0}
          </div>
          <Pagination className="justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => canPrev && setPage(p => p - 1)}
                  aria-disabled={!canPrev}
                  className={!canPrev ? 'pointer-events-none opacity-40' : ''}
                  href="#"
                />
              </PaginationItem>
              <PaginationItem>
                <span className="px-3 py-2 text-sm rounded-md border bg-background">
                  Page {page} / {totalPages}
                </span>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={() => canNext && setPage(p => p + 1)}
                  aria-disabled={!canNext}
                  className={!canNext ? 'pointer-events-none opacity-40' : ''}
                  href="#"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </Card>
    </div>
  );
}

export default SalesReferal;
