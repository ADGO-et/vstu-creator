import { DeleteModal } from "@/components/admin-components/DeleteModal";
import { useDeleteQuiz } from "@/services/quiz";

export function Delete({ id, name }: { id: string; name: string }) {
  const q = useDeleteQuiz(id);
  return <DeleteModal name={`Quiz: '${name}'`} query={q} />;
}
