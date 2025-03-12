import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguages } from "@/services/language";
import {
  useAddQuiz,
  useEditQuiz,
  useGetQuiz,
  useGetTopic,
} from "@/services/quiz";
import { AddEditQuizforContest } from "@/types/quiz";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ErrorMessage from "../status/ErrorMessage";
import LoadingBox from "../status/LoadingBox";

export default function ContestQuizInfoForm({ isEdit }: { isEdit: boolean }) {
  const { topicId, quizId } = useParams<{ topicId: string; quizId: string }>();
  if (!topicId) throw new Error("Subject is required in route");
  if (!quizId && isEdit) throw new Error("Quiz id is required in route");

  const [quizTitle, setQuizTitle] = useState("");

  const [description, setDescription] = useState("");
  // const [language, setLanguage] = useState("");

  const getQ = useGetQuiz(quizId || null);
  const langQ = useLanguages();
  const topicQ = useGetTopic(topicId || null);
  const addQ = useAddQuiz();
  const editQ = useEditQuiz();

  useEffect(() => {
    if (getQ.data) {
      setQuizTitle(getQ.data.quizTitle);
      setDescription(getQ.data.description || "");
      // setLanguage(getQ.data.language._id);
    }
  }, [getQ.data]);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!topicQ.data) throw new Error("Topic not found");
    if (isEdit && !getQ.data) throw new Error("Quiz not found");

    if (isEdit) {
      if (!getQ.data) return;
      const quiz: AddEditQuizforContest = {
        // language: language,
        quizTitle,
        description,
        topic: topicId,
        questions: getQ.data.questions.map((q) => q._id),
        for: 'CONTEST'
      };

      editQ.mutate({ id: quizId || "-", quiz });
    } else {
      const quiz: AddEditQuizforContest = {
        // language: language,
        quizTitle,
        description,
        topic: topicId,
        questions: [],
        for: 'CONTEST'
      };
    
      addQ.mutate(quiz, {
        onSuccess: (id) => {
          navigate(`../edit/${id}`, { relative: "path" });
        },
      });
    }
  };


  const navigate = useNavigate();
  return (
    <div>
      <LoadingBox
        isLoading={langQ.isLoading || topicQ.isLoading || getQ.isLoading}
      />

      <ErrorMessage
        error={langQ.error || topicQ.error || getQ.error}
        retry={() => {
          if (langQ.error) langQ.refetch();
          if (topicQ.error) topicQ.refetch();
          if (getQ.error) getQ.refetch();
        }}
      />
      {topicQ.data && langQ.data && (isEdit ? getQ.data : true) && (
        <form className="py-6 flex flex-col gap-6" onSubmit={submit}>
          <div className="flex justify-between">
            {!isEdit && <h2 className="text-2xl">Add a quiz</h2>}
            <Button isLoading={addQ.isPending || editQ.isPending}>
              {isEdit ? "Save" : "Next"}
            </Button>
          </div>

          <Label className="flex flex-col gap-3">
            <span>Quiz Title</span>
            <Input
              required
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
            />
          </Label>

          <Label className="flex flex-col gap-3">
            <span>Description</span>
            <Textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Label>

          <ErrorMessage error={addQ.error || editQ.error} />
        </form>
      )}
    </div>
  );
}
