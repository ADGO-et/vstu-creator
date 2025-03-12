import AddEditQuestion from "@/components/admin-components/AddEditQuestion";
import Back from "@/components/admin-components/Back";
import { useParams } from "react-router-dom";

export default function CCEditQuestion() {
  const { quizId, questionIndex } = useParams<{
    quizId: string;
    questionIndex: string;
  }>();
  console.log(quizId, questionIndex);

  return (
    <div className="flex flex-col gap-6">
      <Back steps={2} />
      <AddEditQuestion isEdit={true} />
    </div>
  );
}
