import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetStudent } from "@/services/user";
import { useEditSingleQuestion, useGetQuestion, useDeleteQuestionDirect } from "@/services/quiz";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Back from "@/components/admin-components/Back";
import { MdDelete } from "react-icons/md";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";

const ReportedIssueItem: React.FC<{ studentId: string; issue: string }> = ({ studentId, issue }) => {
  const { data: studentData, isLoading: isLoadingStudent, error: studentError } = useGetStudent(studentId);

  const getInitials = (firstName?: string, lastName?: string) =>
    `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();

  if (isLoadingStudent) {
    return (
      <div className="flex items-center space-x-3 border-t border-gray-200 pt-3 mt-3">
        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
        <p className="text-sm text-gray-500">Loading student info...</p>
      </div>
    );
  }

  if (studentError || !studentData) {
    return (
      <div className="border-t border-gray-200 pt-3 mt-3">
        <p className="text-sm text-red-500">Error loading student info for ID: {studentId}</p>
        <p className="text-sm text-gray-600 mt-1">Issue: {issue}</p>
      </div>
    );
  }

  return (
    <div className="flex items-start space-x-4 border-t border-gray-200 pt-3 mt-3">
      <Avatar className="h-10 w-10">
        <AvatarImage src={studentData.profilePicture} alt={`${studentData.firstName} ${studentData.lastName}`} />
        <AvatarFallback>{getInitials(studentData.firstName, studentData.lastName)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p className="text-md font-medium text-gray-900">
          {studentData.firstName} {studentData.lastName}
        </p>
        <p className="text-sm text-gray-500">Student ID: {studentData.s_id}</p>
        <p className="text-md text-gray-700 mt-1">The issue Reported: {issue}</p>
      </div>
    </div>
  );
};

const DetailQuestionReport = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const { data: questionData, isLoading: isLoadingQuestion, error, refetch } = useGetQuestion(questionId || "");
  const deleteQuestion = useDeleteQuestionDirect(questionId || "");
  const editQuestionMutation = useEditSingleQuestion();
  const { toast } = useToast();

  const [questionText, setQuestionText] = useState("");
  const [choices, setChoices] = useState<string[]>([]);

  const handleDeleteQuestion = async () => {
    if (!questionId) return;
    try {
      await deleteQuestion.mutateAsync();
      toast({
        title: "Success",
        description: "Question deleted successfully!",
        variant: "default",
      });
    } catch (err: any) {
      console.error("Failed to delete question:", err);
      toast({
        title: "Error",
        description: "Failed to delete question. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (questionData) {
      setQuestionText(questionData.question);
      setChoices(questionData.choices || []);
    }
  }, [questionData]);

  const handleChoiceChange = (index: number, value: string) => {
    if (index < 0 || index >= choices.length) return;
    const newChoices = [...choices];
    newChoices[index] = value;
    setChoices(newChoices);
  };

  const addChoice = () => {
    setChoices([...choices, ""]);
  };

  const removeChoice = (index: number) => {
    if (choices.length <= 2) {
      toast({
        title: "Error",
        description: "At least two choices are required.",
        variant: "destructive",
      });
      return;
    }
    setChoices(choices.filter((_, i) => i !== index));
  };

  const handleSaveChanges = async () => {
    if (!questionId || !questionData) return;

    if (!questionText.trim()) {
      toast({ title: "Error", description: "Question text cannot be empty.", variant: "destructive" });
      return;
    }
    if (choices.some((choice) => !choice?.trim())) {
      toast({ title: "Error", description: "All choices must have text.", variant: "destructive" });
      return;
    }
    if (choices.length < 2) {
      toast({ title: "Error", description: "There must be at least two choices.", variant: "destructive" });
      return;
    }

    const payload: { question: string; choices: string[] } = {
      question: questionText,
      choices: choices,
    };

    try {
      await editQuestionMutation.mutateAsync({ questionId, question: payload });
      refetch();
      toast({
        title: "Success",
        description: "Question updated successfully!",
        variant: "default",
      });
    } catch (err: any) {
      console.error("Failed to update question:", err);
      toast({
        title: "Error",
        description: "Failed to update question. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoadingQuestion) {
    return (
      <div className="container mx-auto py-6 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading Question Details...</span>
      </div>
    );
  }

  if (error || !questionData) {
    return <div className="container mx-auto py-6 text-red-600">Error loading question details. Please try again.</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Back />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Detail Question Report</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive">Delete the question</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this question? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleDeleteQuestion} variant="destructive">Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Question</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="questionText">Question Text</Label>
            <Textarea
              id="questionText"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="mt-1"
              rows={4}
            />
          </div>
          <div>
            <Label>Choices</Label>
            <div className="space-y-2 mt-1">
              {choices?.map((choice, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={choice ?? ""}
                    onChange={(e) => handleChoiceChange(index, e.target.value)}
                    placeholder={`Choice ${index + 1}`}
                  />
                  <Button
                    variant="destructive"
                    onClick={() => removeChoice(index)}
                    disabled={choices.length <= 2}
                  >
                    <MdDelete className="" size={20} />
                  </Button>
                  {/* <Link to="" onClick={() => removeChoice(index)} disabled={choices.length <= 2}>
                    <MdDelete size={30} className=" text-red-600" />
                  </Link> */}
                </div>
              ))}
              <Button onClick={addChoice} className="mt-2">
                Add Choice
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveChanges} disabled={editQuestionMutation.isPending}>
            {editQuestionMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save Changes
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reported Issues ({questionData.issues?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {questionData.issues?.length ? (
            <div className="space-y-3">
              {questionData.issues.map((issue) => (
                <ReportedIssueItem key={issue.student} studentId={issue.student} issue={issue.issue} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No issues reported for this question.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailQuestionReport;