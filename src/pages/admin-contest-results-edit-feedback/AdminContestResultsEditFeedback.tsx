import AddEditContestFeedback from "@/components/admin-components/AddEditContestFeedback";
import Back from "@/components/admin-components/Back";

export default function AdminContestResultsEditFeedback() {
  return (
    <div className="flex flex-col gap-6">
      <Back steps={2} />
      <AddEditContestFeedback isEdit={true} />
    </div>
  );
}
