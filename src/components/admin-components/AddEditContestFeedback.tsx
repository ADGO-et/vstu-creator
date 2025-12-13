import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ErrorMessage from "../status/ErrorMessage";
import LoadingBox from "../status/LoadingBox";

export default function AddEditContestFeedback({
  isEdit,
}: {
  isEdit: boolean;
}) {
  const { contestId } = useParams<{ contestId: string }>();
  const { studentId } = useParams<{ studentId: string }>();
  console.log("🚀 ~ contestId:", contestId, studentId);

  const [feedback, setFeedback] = useState("");

  const studentName = "Meritu Lemma";
  const schoolName = "ABCD High School";
  const rank = 1;

  const navigate = useNavigate();
  const back = () => navigate("../..", { relative: "path" });
  return (
    <div>
      <LoadingBox isLoading={false} />
      <ErrorMessage error={null} retry={() => {}} />
      <form
        className="py-6 flex flex-col gap-6"
        onSubmit={(e) => {
          e.preventDefault();
          back();
        }}
      >
        <div className="flex justify-between">
          <h2 className="text-2xl">{isEdit ? "Edit Feedback" : "Feedback"}</h2>
        </div>

        <div>
          <p>Student Name: {studentName}</p>
          <p>School Name: {schoolName}</p>
          <p>Rank: {rank}</p>
        </div>

        <Label className="flex flex-col gap-3">
          <span>Add {isEdit && "Edited"} Feedback</span>
          <Input
            required
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </Label>
        <div className="flex gap-6">
          <Button disabled={false}> Save </Button>

          <Button onClick={() => back()} type="button" variant={"secondary"}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
