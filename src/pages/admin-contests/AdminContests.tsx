import ContestsTable from "./components/ContestsTable";
import QuizTable from "./components/QuizTable";

export default function AdminContests() {
  return (
    <div className="flex flex-col gap-12">
      <ContestsTable />
      <QuizTable />
    </div>
  );
}
