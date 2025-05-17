import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguages } from "@/services/language";
import {
  useCreateFlashcard,
  useDeleteFlashcard,
  useFlashcardsBySubject,
  useUpdateFlashcard,
} from "@/services/flashcards";
import { FlashcardData } from "@/types/flashcard";
import { useState } from "react";
import { useParams } from "react-router-dom";
import ErrorMessage from "../status/ErrorMessage";
import LoadingBox from "../status/LoadingBox";
import { getAxiosError } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Pencil, Trash } from "lucide-react"; // Import icons

export default function FlashCardForm() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const actualSubjectId = subjectId ?? "";

  const [flashTitle, setFlashTitle] = useState("");
  const [answer, setAnswer] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Pagination states
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const langQ = useLanguages();
  const flashcardsQuery = useFlashcardsBySubject(
    actualSubjectId,
    itemsPerPage
  );
  const createFlashcardMutation = useCreateFlashcard();
  const updateFlashcardMutation = useUpdateFlashcard();
  const deleteFlashcardMutation = useDeleteFlashcard();

  const isLoading =
    langQ.isLoading ||
    flashcardsQuery.isLoading ||
    createFlashcardMutation.isPending ||
    updateFlashcardMutation.isPending ||
    deleteFlashcardMutation.isPending;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!flashTitle || !answer || !actualSubjectId) return;

    const flashcard: Omit<FlashcardData, "_id"> = {
      subject: actualSubjectId,
      front: flashTitle,
      back: answer,
    };

    if (editId) {
      updateFlashcardMutation.mutate({ id: editId, data: flashcard });
    } else {
      createFlashcardMutation.mutate(flashcard);
    }
    

    setFlashTitle("");
    setAnswer("");
    setEditId(null);
  };

  const handleEdit = (card: FlashcardData) => {
    setFlashTitle(card.front);
    setAnswer(card.back);
    setEditId(card._id ?? null);
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      deleteFlashcardMutation.mutate(deleteId);
      setDeleteId(null);
    }
  };

  const paginatedFlashcards =
    flashcardsQuery.data?.slice((page - 1) * itemsPerPage, page * itemsPerPage) || [];

  const totalPages = Math.ceil((flashcardsQuery.data?.length || 0) / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="space-y-6">
      <LoadingBox isLoading={isLoading} />

      {(langQ.error || flashcardsQuery.error) && (
        <ErrorMessage
          error={
            getAxiosError(langQ.error) ?? getAxiosError(flashcardsQuery.error)
          }
          retry={() => {
            if (langQ.error) langQ.refetch();
            if (flashcardsQuery.error) flashcardsQuery.refetch();
          }}
        />
      )}

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl">
            {editId ? "Edit Flashcard" : "Add Flashcard"}
          </h2>
          <Button type="submit" disabled={isLoading}>
            {editId ? "Update" : "Add"}
          </Button>
        </div>

        <Label className="flex flex-col gap-1">
          <span className="mb-2">Question</span>
          <Input
            required
            value={flashTitle}
            onChange={(e) => setFlashTitle(e.target.value)}
          />
        </Label>

        <Label className="flex flex-col gap-1">
          <span className="mb-2">Answer</span>
          <Textarea
            required
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
        </Label>
      </form>

      {/* Flashcard Table */}
      {flashcardsQuery.data && (
        <div className="pt-4">
          <h3 className="text-xl mb-2">Flashcards</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead>Answer</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedFlashcards.map((card) => (
                <TableRow key={card._id}>
                  <TableCell>{card.front}</TableCell>
                  <TableCell>{card.back}</TableCell>
                  <TableCell className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => handleEdit(card)}
                      size="icon"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="destructive"
                          onClick={() => setDeleteId(card._id!)}
                          size="icon"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirm Deletion</DialogTitle>
                        </DialogHeader>
                        <p>Are you sure you want to delete this flashcard?</p>
                        <DialogFooter>
                          <DialogPrimitive.Close asChild>
                            <Button variant="outline" onClick={() => setDeleteId(null)}>
                              Cancel
                            </Button>
                          </DialogPrimitive.Close>
                          <Button variant="destructive" onClick={handleDeleteConfirm}>
                            Delete
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(Math.max(page - 1, 1))}
                    // disabled={page === 1}
                    className={`${page === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                  />
                </PaginationItem>
                <PaginationItem>
                  <span className="px-4">Page {page} of {totalPages}</span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(Math.min(page + 1, totalPages))}
                    // disabled={page === totalPages}
                    className={`${page === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      )}
    </div>
  );
}
