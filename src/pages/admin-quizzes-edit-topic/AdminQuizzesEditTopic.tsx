import AddEditTopic from "@/components/admin-components/AddEditTopic";
import Back from "@/components/admin-components/Back";

export default function AdminDataEditTopic() {
  return (
    <div className="flex flex-col gap-6">
      <Back steps={2} />
      <AddEditTopic isEdit />
    </div>
  );
}
