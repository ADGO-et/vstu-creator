import ContestsTable from "./components/ContestsTable";
// import QuizTable from "./components/QuizTable";

export default function AdminContests() {
  return (
    <div className="flex flex-col gap-12 pt-8">
      <div className="rounded-md border bg-white p-4 text-sm text-gray-700 space-y-2">
        <p className="font-semibold">How to create a contest</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Select the Grade.</li>
          <li>Select the Subject.</li>
          <li>
            Choose to add a quiz from the VSTU Pool or create your own quiz.
          </li>
          <li>Select a Topic.</li>
          <li>Add questions to your contest.</li>
          <li>Your contest will be ready.</li>
        </ol>
      </div>
      <ContestsTable />
      {/* <QuizTable /> */}
    </div>
  );
}
