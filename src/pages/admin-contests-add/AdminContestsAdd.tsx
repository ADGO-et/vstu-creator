import Back from "@/components/admin-components/Back";
import ErrorMessage from "@/components/status/ErrorMessage";
import Loading from "@/components/status/Loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateContest } from "@/services/contest";
import { useGetQuiz } from "@/services/quiz";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useGetTeacher } from "@/services/user";

export default function AdminContestsAdd() {
  const navigate = useNavigate();
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

  const getErrMsg = (err: unknown) =>
    (err as any)?.response?.data?.message || (err as any)?.message || "";
  const createErrMsg = getErrMsg(createQ.error);
  const showVerifyNotice = createErrMsg
    ?.toLowerCase()
    .includes("your account should be verified");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const startDateTime = new Date(`${date}T${startTime}`).toISOString();
    const endDateTime = new Date(`${date}T${endTime}`).toISOString();

    if (!quizId) return;

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
          navigate("..", { relative: "path" });
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
    <div className="flex flex-col gap-6 pt-6">
      <Back />
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 overflow-y-auto pb-6 hide-scrollbar"
      >
        <div className="flex justify-between flex-wrap">
          <h1 className="text-4xl">Add a contest</h1>
          <Button disabled={createQ.isPending}>Add</Button>
        </div>
        <div className="relative flex items-center justify-between">
          <input
            required
            value={quizId || ""}
            onChange={() => {}}
            tabIndex={-1}
            className="w-1 h-1 absolute opacity-0"
          />
          <p className="bg-muted px-3 rounded">
            <Loading isLoading={quizQ.isLoading} />
            <ErrorMessage error={quizQ.error} />
            {quizQ.data?.quizTitle ||
              "No quiz selected, please select before proceeding"}
          </p>
          <Link to={"choose"}>
            <Button variant={"outline"}>Choose From VSTU Quiz Pool</Button>
          </Link>
          <Link to={"add"}>
            <Button variant={"outline"}>Insert Your Own Quiz</Button>
          </Link>
        </div>
        <Label className="flex flex-col gap-3">
          <span>Contest Title</span>
          <Input
            disabled={!quizId}
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Label>

        <Label className="flex flex-col gap-3">
          <span>Description</span>
          <Input
            required
            disabled={!quizId}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Label>

        <Label className="flex flex-col gap-3">
          <span>Date</span>
          <Input
            required
            disabled={!quizId}
            type="date"
            value={date}
            // min={new Date().toLocaleDateString("en-CA")}
            onChange={(e) => setDate(e.target.value)}
          />
        </Label>

        <div className="flex flex-col gap-6 sm:flex-row">
          <Label className="flex flex-col gap-3">
            <span>Start time</span>
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

          <Label className="flex flex-col gap-3">
            <span>End time</span>
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
        <Label className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="w-4 h-4"
            />
            <span>Make this contest private</span>
          </div>
          <p className="text-sm text-gray-500 md:pl-7">
            Private contests are only available for students in your school
            only.
          </p>
        </Label>
        {showVerifyNotice ? (
          <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-amber-800 space-y-1">
            <p className="font-semibold">⚠️ Account Verification Required</p>
            <p>
              Your account must be verified before you can create a contest for
              the first time. Please try again later.
            </p>
            <p>
              Once your account is verified, you'll be able to create as many
              contests as you want.
            </p>
          </div>
        ) : (
          <ErrorMessage error={createQ.error} />
        )}
      </form>
    </div>
  );
}
