import { DeleteModal } from "@/components/admin-components/DeleteModal";
import { useDeleteQuestion } from "@/services/quiz";

export function Delete({
  name,
  id,
  quizId,
}: {
  name: string;
  quizId: string;
  id: string;
}) {
  const q = useDeleteQuestion({ questionId: id, quizId });
  return <DeleteModal name={`question:'${name}'`} query={q} />;
}
