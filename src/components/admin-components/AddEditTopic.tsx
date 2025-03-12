import { useGetGrade } from "@/services/grade";
import { useAddTopic, useEditTopic, useGetTopic } from "@/services/quiz";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ErrorMessage from "../status/ErrorMessage";
import LoadingBox from "../status/LoadingBox";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useGetSubject } from "@/services/subjects";

export default function AddEditTopic({ isEdit }: { isEdit: boolean }) {
  const [chapter, setChapter] = useState(0);
  const [chapterTitle, setChapterTitle] = useState("");
  const { gradeId, subject, topicId } = useParams<{
    gradeId: string;
    subject: string;
    topicId?: string;
  }>();
  const navigate = useNavigate();

  const gradeQ = useGetGrade(gradeId || null);
  const addTopicQ = useAddTopic();
  const editTopicQ = useEditTopic();
  const getTopicQ = useGetTopic(topicId || null);
  const subjectQ = useGetSubject(subject || null)

  const subjectName = subjectQ?.data?.name

  useEffect(() => {
    if (getTopicQ.data) {
      setChapter(getTopicQ.data.chapter);
      setChapterTitle(getTopicQ.data.chapterTitle);
    }
  }, [getTopicQ.data]);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!gradeQ.data) return;
    if (subjectName === undefined) throw new Error("Subject is required in route");
    const subjectId = gradeQ.data.subjects.find((s) => s.name === subjectName)?._id;
    if (!subjectId) throw new Error("Subject not found in grade");

    if (isEdit) {
      editTopicQ.mutate(
        {
          id: topicId || "-",
          topic: {
            grade: gradeQ.data._id,
            subject: subjectId,
            chapter,
            chapterTitle,
          },
        },
        { onSuccess: () => navigate("../..", { relative: "path" }) }
      );
    } else {
      addTopicQ.mutate(
        {
          grade: gradeQ.data._id,
          subject: subjectId,
          chapter,
          chapterTitle,
        },
        { onSuccess: () => navigate("..", { relative: "path" }) }
      );
    }
  };
  return (
    <div>
      <LoadingBox isLoading={gradeQ.isLoading || getTopicQ.isLoading} />
      <ErrorMessage
        error={gradeQ.error || getTopicQ.error}
        retry={() => {
          if (gradeQ.error) gradeQ.refetch();
          if (getTopicQ.error) getTopicQ.refetch();
        }}
      />

      {gradeQ.data && (isEdit ? getTopicQ.data : true) && (
        <form className="flex flex-col gap-6" onSubmit={submit}>
          <div className="flex justify-between flex-wrap">
            <h1 className="text-4xl">{isEdit ? "Edit" : "Add"} a Topic</h1>
            <Button isLoading={addTopicQ.isPending || editTopicQ.isPending}>
              Save
            </Button>
          </div>
          <p>
            Grade {gradeQ.data.grade}, {subjectQ.data?.name}
          </p>

          <Label className="flex flex-col gap-3">
            <span>Chapter Number</span>
            <Input
              required
              type="number"
              value={chapter || ""}
              onChange={(e) => setChapter(+e.target.value || 0)}
            />
          </Label>
          <Label className="flex flex-col gap-3">
            <span>Chapter Title</span>
            <Input
              required
              value={chapterTitle}
              onChange={(e) => setChapterTitle(e.target.value)}
            />
          </Label>
          <ErrorMessage error={addTopicQ.error || editTopicQ.error} />
        </form>
      )}
    </div>
  );
}
