import Back from "@/components/admin-components/Back";
import { Button } from "@/components/ui/button";
import { useGenerateQuestion } from "@/services/questions";
import { useState } from "react";
import Spinner from "@/components/status/Spinner";
import { useAddQuestion } from "@/services/quiz";
import { useParams, useNavigate } from "react-router-dom";
import { useGetSubject } from "@/services/subjects";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useGetSingleGrade } from "@/services/grade";

interface Question {
  question: string;
  choices: string[];
}

interface QuestionGeneratorProps {
  text: string;
}

const QuestionGenerator = ({ text }: QuestionGeneratorProps) => {
  const [limit, setLimit] = useState<number>(10);
  const [questions, setQuestions] = useState<Question[]>([]);
  const generateQuestion = useGenerateQuestion();

  const { quizId, subject, gradeId } = useParams();
  const { data: subjectData } = useGetSubject(subject ?? null);
  const { data: gradeData } = useGetSingleGrade(gradeId ?? null);
  const grade = gradeData?.grade;
  const addQuestion = useAddQuestion();
  const [progress, setProgress] = useState<number>(0);
  const [isInserting, setIsInserting] = useState<boolean>(false);
  const [insertStatus, setInsertStatus] = useState<string | null>(null);
  const navigate = useNavigate();

  // New state for difficulty level
  const [difficulty, setDifficulty] = useState<number>(1);

  const handleGenerate = () => {
    generateQuestion.mutate(
      {
        limit,
        grade: Number(grade),
        difficulty,
        subject: subjectData?.name || "",
        text,
      },
      {
        onSuccess: (data) => {
          const normalized = data.map((q) => ({
            question: q.question,
            choices: q.choices ?? q.options ?? [],
          }));
          setQuestions(normalized);
        },
        onError: (error) => {
          console.error("Error generating questions:", error);
        },
      },
    );
  };

  const handleRetry = () => {
    setQuestions([]);
    generateQuestion.reset();
  };

  const handleInsert = async () => {
    if (!quizId) {
      console.error("Quiz ID not found");
      return;
    }
    setInsertStatus(null);
    setProgress(0);
    setIsInserting(true);
    for (let i = 0; i < questions.length; i++) {
      try {
        await addQuestion.mutateAsync({
          quizId,
          question: {
            question: questions[i].question,
            choices: questions[i].choices,
          },
        });
        setProgress(Math.round(((i + 1) / questions.length) * 100));
      } catch (error) {
        setInsertStatus(
          error instanceof Error
            ? error.message
            : "Failed to insert questions. Please try again.",
        );
        setIsInserting(false);
        return;
      }
    }
    setIsInserting(false);
    setInsertStatus("All questions inserted successfully.");
    setTimeout(() => {
      navigate(-1);
    }, 2000);
  };

  return (
    <div>
      <div className="">
        <Back />
        <h1 className="text-lg font-bold text-primary mb-5">
          This section allows you to generate a question based on the text you
          previously extracted.
        </h1>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-4">
            <label htmlFor="" className="text-gray-600 text-sm">
              Number of questions
            </label>
            <input
              type="number"
              className="p-2 border border-gray-300 rounded-md"
              placeholder="Enter the number of questions"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
            />
          </div>
          {/* Difficulty Dropdown */}
          <div className="w-[150px] flex items-center gap-3">
            <label htmlFor="" className="text-gray-600 text-sm">
              Difficulty
            </label>
            <Select
              value={difficulty.toString()}
              onValueChange={(value) => setDifficulty(Number(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="bg-[#e2ffde] p-2 rounded-md w-fit px-4">
            <span className="text-gray-500 text-xs">
              the difficulty level ranges from 1 - 10. 1 means very easy
              questions and 10 means very hard questions.
            </span>
          </div>

          <Button
            className="p-2 bg-primary text-white rounded-md"
            onClick={handleGenerate}
          >
            {!generateQuestion.isPending ? (
              "Generate Questions"
            ) : (
              <Spinner spin={true} property={""} />
            )}
          </Button>
          {generateQuestion.isPending && (
            <p className="text-primary">question is generating...</p>
          )}
          {questions.length > 0 && (
            <div className="mt-4 space-y-4 overflow-auto max-h-[500px]">
              {questions.map((q, idx) => (
                <div
                  key={idx}
                  className="p-4 border rounded-md shadow bg-[#e2ffde]"
                >
                  <p className="font-semibold">{q.question}</p>
                  <ul className="list-disc pl-5">
                    {q.choices.map((option, i) => (
                      <li key={i} className="text-gray-600 text-sm">
                        {option}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
          {questions.length === 0 && generateQuestion.isSuccess && (
            <p className="text-primary">
              No questions generated. Try increasing the limit.
            </p>
          )}
          {questions.length === 0 && generateQuestion.isError && (
            <p className="text-red-600">
              Failed to generate questions. Please try again.
            </p>
          )}
          {questions.length > 0 && (
            <div className="flex items gap-8 py-10">
              <Button
                className="w-fit bg-destructive"
                onClick={() => handleRetry()}
              >
                Retry
              </Button>
              <Button
                className="w-fit"
                onClick={handleInsert}
                disabled={isInserting}
              >
                {isInserting
                  ? `Inserting... (${progress}%)`
                  : "Insert the Questions Now"}
              </Button>
            </div>
          )}
          {insertStatus && (
            <p
              className={
                insertStatus.includes("successfully")
                  ? "text-primary"
                  : "text-red-600"
              }
            >
              {insertStatus}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionGenerator;
