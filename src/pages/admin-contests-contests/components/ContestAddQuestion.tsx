import AddEditQuestion from "@/components/admin-components/AddEditQuestion";
import Back from "@/components/admin-components/Back";

export default function ContestAddQuestion() {
  return (
    <div className="flex flex-col gap-6">
      <Back />
      <AddEditQuestion isEdit={false} />
    </div>
  );
}
