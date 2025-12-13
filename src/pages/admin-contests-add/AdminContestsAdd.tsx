import Back from "@/components/admin-components/Back";
import ErrorMessage from "@/components/status/ErrorMessage";
import Loading from "@/components/status/Loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useCreateContest } from "@/services/contest";
import { useGetQuiz } from "@/services/quiz";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useGetTeacher } from "@/services/user";

export default function AdminContestsAdd() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [params] = useSearchParams();
  const quizId = params.get("quizId") || null;

  const [title, setTitle] = useState("");
  //no chapter
  const [description, setDescription] = useState("");
  //no lang
  const [date, setDate] = useState("");
  //start time
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  // is private
  const [isPrivate, setIsPrivate] = useState(false);

  const quizQ = useGetQuiz(quizId || null);
  const createQ = useCreateContest();
  const teacherQ = useGetTeacher();

  const getErrMsg = (err: unknown) => {
    if (!err || typeof err !== "object") return "";

    const errObj = err as Record<string, unknown>;
    const response = errObj.response;

    if (response && typeof response === "object") {
      const responseObj = response as Record<string, unknown>;
      const data = responseObj.data;
      if (data && typeof data === "object") {
        const dataObj = data as Record<string, unknown>;
        const message = dataObj.message;
        if (typeof message === "string") return message;
      }
    }

    const message = errObj.message;
    return typeof message === "string" ? message : "";
  };
  const createErrMsg = getErrMsg(createQ.error);
  const showVerifyNotice = createErrMsg
    ?.toLowerCase()
    .includes("your account should be verified");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!quizId) {
      toast({
        variant: "destructive",
        title: "Quiz required",
        description: "Please select a quiz before creating a contest.",
      });
      return;
    }

    const startDateTime = new Date(`${date}T${startTime}`).toISOString();
    const endDateTime = new Date(`${date}T${endTime}`).toISOString();

    createQ.mutate(
      {
        title,
        description,
        startTime: startDateTime,
        endTime: endDateTime,
        quiz: quizId,
        isPrivate,
        school: teacherQ.data?.school || "",
      },
      {
        onSuccess: () => {
          toast({
            title: "Contest created",
            description: "Your contest has been added successfully.",
            className:
              "border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-900/40 dark:bg-emerald-950 dark:text-emerald-50",
          });
          navigate("..", { relative: "path" });
        },
        onError: (err) => {
          const msg = getErrMsg(err);
          toast({
            variant: "destructive",
            title: "Failed to create contest",
            description: msg || "Please try again.",
          });
        },
      }
    );
  };

  // const minTime =
  //   new Date().toLocaleDateString("en-CA") === date
  //     ? new Date().toLocaleTimeString("en-GB", {
  //         hour: "2-digit",
  //         minute: "2-digit",
  //       })
  //     : undefined;

  return (
    <div className="mx-auto flex w-full flex-col gap-6 px-4 pb-10 pt-6 sm:px-6 lg:px-8">
      <Back />
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 overflow-y-auto pb-6 hide-scrollbar"
      >
        <Card>
          <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
            <div className="space-y-1">
              <CardTitle className="text-3xl sm:text-4xl">Add a contest</CardTitle>
              <CardDescription>
                Pick a quiz, set the schedule, then publish.
              </CardDescription>
            </div>
            <Button
              disabled={createQ.isPending || !quizId}
              className="w-full sm:w-auto"
            >
              Add
            </Button>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="gap-2">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-xl">Quiz</CardTitle>
              <Badge variant={quizId ? "secondary" : "outline"}>
                {quizId ? "Selected" : "Required"}
              </Badge>
            </div>
            <CardDescription>
              Choose a quiz from the pool or insert your own.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <input
                required
                value={quizId || ""}
                onChange={() => {}}
                tabIndex={-1}
                className="absolute h-1 w-1 opacity-0"
              />

              <div className="rounded-md border bg-muted/40 p-3 text-sm">
                <Loading isLoading={quizQ.isLoading} />
                <ErrorMessage error={quizQ.error} />
                <p className="font-medium">
                  {quizQ.data?.quizTitle ||
                    "No quiz selected. Please choose a quiz to continue."}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link className="w-full sm:w-auto" to={"choose"}>
              <Button className="w-full" variant={"outline"}>
                Choose From VSTU Quiz Pool
              </Button>
            </Link>
            <Link className="w-full sm:w-auto" to={"add"}>
              <Button className="w-full" variant={"outline"}>
                Insert Your Own Quiz
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Contest details</CardTitle>
            <CardDescription>
              Enter a clear title and a short description for participants.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <Label className="grid gap-2">
              <span className="text-sm font-medium">Contest Title</span>
              <Input
                disabled={!quizId}
                required
                value={title}
                placeholder="e.g. VSTU Weekly Challenge"
                onChange={(e) => setTitle(e.target.value)}
              />
            </Label>

            <Label className="grid gap-2">
              <span className="text-sm font-medium">Description</span>
              <Textarea
                required
                disabled={!quizId}
                value={description}
                placeholder="What is this contest about?"
                onChange={(e) => setDescription(e.target.value)}
              />
            </Label>

            <div className="grid gap-6 md:grid-cols-2">
              <Label className="grid gap-2">
                <span className="text-sm font-medium">Date</span>
                <Input
                  required
                  disabled={!quizId}
                  type="date"
                  value={date}
                  // min={new Date().toLocaleDateString("en-CA")}
                  onChange={(e) => setDate(e.target.value)}
                />
              </Label>

              <div className="grid gap-6 sm:grid-cols-2">
                <Label className="grid gap-2">
                  <span className="text-sm font-medium">Start time</span>
                  <Input
                    required
                    disabled={!quizId}
                    type="time"
                    value={startTime}
                    // min={minTime}
                    // max={"23:59"}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </Label>

                <Label className="grid gap-2">
                  <span className="text-sm font-medium">End time</span>
                  <Input
                    required
                    disabled={!quizId}
                    type="time"
                    value={endTime}
                    // min={startTime}
                    // max={"23:59"}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Privacy</CardTitle>
            <CardDescription>
              Private contests are visible only to students in your school.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Label className="flex items-start gap-3">
              <Checkbox
                checked={isPrivate}
                onCheckedChange={(checked) => setIsPrivate(Boolean(checked))}
              />
              <div className="grid gap-1">
                <span className="text-sm font-medium">
                  Make this contest private
                </span>
                <span className="text-sm text-muted-foreground">
                  Students outside your school won’t see it.
                </span>
              </div>
            </Label>
          </CardContent>
        </Card>

        {showVerifyNotice ? (
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-900">
            <div className="space-y-1">
              <p className="font-semibold">⚠️ Account Verification Required</p>
              <p className="text-sm">
                Your account must be verified before you can create a contest for
                the first time. Please try again later.
              </p>
              <p className="text-sm">
                Once your account is verified, you'll be able to create as many
                contests as you want.
              </p>
            </div>
          </div>
        ) : (
          <ErrorMessage error={createQ.error} />
        )}
      </form>
    </div>
  );
}
