import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAddQuestion, useEditQuestion, useGetQuiz } from "@/services/quiz";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import ErrorMessage from "../status/ErrorMessage";
import LoadingBox from "../status/LoadingBox";

export default function AddEditQuestion({ isEdit }: { isEdit: boolean }) {
  const navigate = useNavigate();
  const { quizId, questionId } = useParams<{
    quizId: string;
    questionId: string;
  }>();
  const [question, setQuestion] = useState("");
  const [choices, setChoices] = useState<string[]>([""]);

  const addQ = useAddQuestion();
  const editQ = useEditQuestion();
  const quizQ = useGetQuiz(quizId || null);
  const fetchedQuestion = quizQ.data?.questions.find(
    (q) => q._id === questionId
  );

  useEffect(() => {
    if (fetchedQuestion) {
      setQuestion(fetchedQuestion.question);
      setChoices(fetchedQuestion.choices);
    }
  }, [fetchedQuestion]);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!quizId) return;

    if (isEdit) {
      if (!questionId) throw new Error("Question id not found");
      if (!fetchedQuestion) throw new Error("Question not found");

      const { questionFlagged, answerFlagged } = fetchedQuestion;
      editQ.mutate(
        {
          questionId,
          question: { question, choices, questionFlagged, answerFlagged },
        },
        {
          onSuccess: () => {
            navigate("../..", { relative: "path" });
          },
        }
      );
    } else {
      addQ.mutate(
        { quizId, question: { question, choices } },
        {
          onSuccess: () => {
            navigate("..", { relative: "path" });
          },
        }
      );
    }
  };

  //ui utils
  const addChoice = () => {
    setChoices([...choices, ""]);
  };
  const removeChoice = (i: number) => {
    const newChoices = [...choices];
    newChoices.splice(i, 1);

    if (newChoices.length === 0) {
      newChoices.push("");
    }
    setChoices(newChoices);
  };
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-4xl">{isEdit ? "Edit" : "Add"} a Question</h1>
      <LoadingBox isLoading={quizQ.isLoading} />
      <ErrorMessage error={quizQ.error} retry={quizQ.refetch} />
      <ErrorMessage
        error={
          isEdit && quizQ.data && !fetchedQuestion
            ? new AxiosError("Question not found", "404")
            : null
        }
        retry={() => {
          //Todo: refetch doesnt do anything here
          quizQ.refetch();
        }}
      />

      {quizQ.data && (
        <form onSubmit={submit} className="flex flex-col gap-6">
          <Label className="flex flex-col gap-3">
            <span className="text-lg">Question</span>
            <Textarea
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </Label>
          <div className="flex flex-col gap-3">
            <span>Choices</span>
            {choices.map((choice, index) => (
              <div key={index} className="relative flex items-center ">
                <Button
                  type="button"
                  size={"icon"}
                  variant={"ghost"}
                  className="hover:bg-destructive absolute right-3"
                  onClick={() => removeChoice(index)}
                >
                  <MdDelete className="text-lg" />
                </Button>
                <Textarea
                  required
                  value={choice}
                  className="bg-primary/20"
                  onChange={(e) => {
                    const newChoices = [...choices];
                    newChoices[index] = e.target.value;
                    setChoices(newChoices);
                  }}
                />
              </div>
            ))}
          </div>
          <div className="flex  gap-6 items-center flex-wrap">
            <Button type="button" onClick={addChoice}>
              Add a Choice
            </Button>
            <Button isLoading={addQ.isPending || editQ.isPending}>
              {isEdit ? "Save" : "Finish"}
            </Button>
            <div className="flex-1"></div>
            <span>Total questions: {quizQ.data.questions.length}</span>
          </div>
          <ErrorMessage error={addQ.error || editQ.error} />
        </form>
      )}
    </div>
  );
}
