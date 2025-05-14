import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useLanguages } from "@/services/language";
import { useState } from "react";
import { useNavigate, } from "react-router-dom";
import ErrorMessage from "../status/ErrorMessage";
import LoadingBox from "../status/LoadingBox";

export default function FlashCardForm({ isEdit }: { isEdit: boolean }) {
  

  const [flashTitle, setFlashTitle] = useState("");

  const [answer, setAnswer] = useState("");
  // const [language, setLanguage] = useState("");

  
  const langQ = useLanguages();
  

  

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    

    if (isEdit) {
      console.log('success')
    } else {
      console.log('not success')
    }
  };

  const navigate = useNavigate();
  return (
    <div>
      <LoadingBox
        isLoading={langQ.isLoading}
      />

      <ErrorMessage
        error={langQ.error }
        retry={() => {
          if (langQ.error) langQ.refetch();
          
        }}
      />
      {langQ.data  && (
        <form className="py-6 flex flex-col gap-6" onSubmit={submit}>
          <div className="flex justify-between">
            {!isEdit && <h2 className="text-2xl">Add a flashcard</h2>}
            <Button>
              Add
            </Button>
          </div>

          <Label className="flex flex-col gap-3">
            <span>Question</span>
            <Input
              required
              value={flashTitle}
              onChange={(e) => setFlashTitle(e.target.value)}
            />
          </Label>

          <Label className="flex flex-col gap-3">
            <span>Answer</span>
            <Textarea
              required
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
          </Label>

          
        </form>
      )}
    </div>
  );
}
