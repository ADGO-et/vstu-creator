import AddEditTopic from "@/components/admin-components/AddEditTopic";
import Back from "@/components/admin-components/Back";

export default function AdminDataAddTopic() {
  return (
    <div className="flex flex-col gap-6">
      <Back />
      <AddEditTopic isEdit={false} />
    </div>
  );
}
