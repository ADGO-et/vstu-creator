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
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ErrorMessage from "../status/ErrorMessage";
import LoadingBox from "../status/LoadingBox";
import { getAxiosError } from "@/lib/utils";

export default function FlashCardForm({ isEdit }: { isEdit: boolean }) {
  const { subjectId } = useParams<{ subjectId: string }>();
  const actualSubjectId = subjectId ?? "";
  const navigate = useNavigate();

  const [flashTitle, setFlashTitle] = useState("");
  const [answer, setAnswer] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const pageSize = 3;

  const langQ = useLanguages();
  const flashcardsQuery = useFlashcardsBySubject(
    actualSubjectId,
    page,
    pageSize
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

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this flashcard?")) {
      deleteFlashcardMutation.mutate(id);
    }
  };

  useEffect(() => {
    // Reset to page 1 after creating/updating/deleting to always show fresh data
    if (
      createFlashcardMutation.isSuccess ||
      updateFlashcardMutation.isSuccess ||
      deleteFlashcardMutation.isSuccess
    ) {
      setPage(1);
    }
  }, [
    createFlashcardMutation.isSuccess,
    updateFlashcardMutation.isSuccess,
    deleteFlashcardMutation.isSuccess,
  ]);

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
          <span>Question</span>
          <Input
            required
            value={flashTitle}
            onChange={(e) => setFlashTitle(e.target.value)}
          />
        </Label>

        <Label className="flex flex-col gap-1">
          <span>Answer</span>
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
          <table className="w-full border text-left text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Question</th>
                <th className="p-2 border">Answer</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {flashcardsQuery.data.flashcards.map((card) => (
                <tr key={card._id}>
                  <td className="p-2 border">{card.front}</td>
                  <td className="p-2 border">{card.back}</td>
                  <td className="p-2 border flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => handleEdit(card)}
                      size="sm"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(card._id!)}
                      size="sm"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="mt-4 flex justify-between items-center">
            <Button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              variant="outline"
            >
              Previous
            </Button>

            <span className="px-4">
              Page {flashcardsQuery.data.currentPage} of{" "}
              {flashcardsQuery.data.totalPages}
            </span>

            <Button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={
                flashcardsQuery.data.currentPage >=
                flashcardsQuery.data.totalPages
              }
              variant="outline"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
