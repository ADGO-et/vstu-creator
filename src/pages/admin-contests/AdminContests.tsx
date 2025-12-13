import ContestsTable from "./components/ContestsTable";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import QuizTable from "./components/QuizTable";

export default function AdminContests() {
  return (
    <div className="mx-auto flex w-full flex-col gap-10 px-4 pb-10 pt-8 sm:px-6 lg:px-8">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl sm:text-4xl">Contests</CardTitle>
          <CardDescription>
            Choose a grade to view and manage its contests.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl">How to create a contest</CardTitle>
          <CardDescription>
            Follow these steps to publish a contest.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
          <li>Select the Grade.</li>
          <li>Select the Subject.</li>
          <li>
            Choose to add a quiz from the VSTU Pool or create your own quiz.
          </li>
          <li>Select a Topic.</li>
          <li>Add questions to your contest.</li>
          <li>Your contest will be ready.</li>
          </ol>
        </CardContent>
      </Card>

      <ContestsTable />
      {/* <QuizTable /> */}
    </div>
  );
}
