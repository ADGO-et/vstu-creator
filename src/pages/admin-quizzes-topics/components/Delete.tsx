import { DeleteModal } from "@/components/admin-components/DeleteModal";
import { useDeleteTopic } from "@/services/quiz";

export function Delete({ id, name }: { id: string; name: string }) {
  const q = useDeleteTopic(id);
  return <DeleteModal name={name} query={q} />;
}
