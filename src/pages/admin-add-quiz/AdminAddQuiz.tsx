import Back from "@/components/admin-components/Back";
import QuizInfoForm from "@/components/admin-components/QuizInfoForm";

export default function AdminAddQuiz() {
  return (
    <div>
      <Back />
      <QuizInfoForm isEdit={false} />
    </div>
  );
}
