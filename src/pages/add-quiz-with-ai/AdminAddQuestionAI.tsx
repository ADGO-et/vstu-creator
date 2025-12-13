import { useState } from "react";
import PdfExtractor from "./components/PdfExractor";
import QuestionGenerator from "./components/QuestionGenerator";
import QuestionExtractor from "./components/QuestionExtractor";

type Mode = "pdf" | "generate" | "extract";

const AdminAddQuestionAI = () => {
  const [mode, setMode] = useState<Mode>("pdf");
  const [extractedText, setExtractedText] = useState<string>("");

  return (
    <div>
      {mode === "pdf" && (
        <PdfExtractor 
          onExtractionComplete={setExtractedText}
          onGenerate={() => setMode("generate")}
          onExtract={() => setMode("extract")}
        />
      )}
      {mode === "generate" && (
        <QuestionGenerator 
          text={extractedText}
        />
      )}
      {mode === "extract" && (
        <QuestionExtractor text={extractedText} />
      )}
    </div>
  )
}

export default AdminAddQuestionAI;
