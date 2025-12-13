import React, { useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadCloud } from "lucide-react";
import Back from "@/components/admin-components/Back";
import { Textarea } from "@/components/ui/textarea";
// Added shadcn Select components
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
GlobalWorkerOptions.workerSrc = workerSrc;

interface PdfExtractorProps {
  onExtractionComplete?: (text: string) => void;
  onGenerate?: () => void;
  onExtract?: () => void;
}

const PdfExtractor = ({ onExtractionComplete, onGenerate, onExtract }: PdfExtractorProps) => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [startPage, setStartPage] = useState<string>("");
  const [endPage, setEndPage] = useState<string>("");
  const [maxPage, setMaxPage] = useState<number>(1);
  const [extractedText, setExtractedText] = useState<string>("");

  console.log(extractedText);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setPdfFile(file);
      // Load pdf and update maxPage
      (async () => {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const pdfDocument = await getDocument(arrayBuffer).promise;
          setMaxPage(pdfDocument.numPages);
        } catch (error) {
          console.error("Error loading PDF:", error);
          setMaxPage(0);
        }
      })();
    } else {
      setMaxPage(1);
    }
  };

  const extractTextFromPdf = async (pdfFile: File, pageRange: string) => {
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdfDocument = await getDocument(arrayBuffer).promise;
      const totalPages = pdfDocument.numPages;
      const [start, end] = pageRange.split("-").map((num) => parseInt(num, 10));

      if (start < 1 || end > totalPages || start > end) {
        setExtractedText("Invalid page range.");
        return;
      }

      let extracted = "";
      for (let i = start; i <= end; i++) {
        const page = await pdfDocument.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((item: any) => item.str).join(" ");
        extracted += `Page ${i}:\n${pageText}\n\n`;
      }

      setExtractedText(extracted);
      if(onExtractionComplete) onExtractionComplete(extracted);
    } catch (error) {
      console.error("Error extracting text:", error);
      setExtractedText("Failed to extract text.");
    }
  };

  const handleExtractText = () => {
    if (pdfFile && startPage && endPage) {
      extractTextFromPdf(pdfFile, `${startPage}-${endPage}`);
    } else {
      setExtractedText("Please select a file and specify a valid page range.");
    }
  };

  const handleReset = () => {
    setStartPage("");
    setEndPage("");
    setExtractedText("");
  };

  return (
    <div className="mx-auto p-6 space-y-6">
      <Back />
      <h2 className="text-lg font-bold text-primary">This section is where you upload a pdf file and text is extracted from it. review it carefully and proceeed to the next step. if the extracted text is not good, upload again and retry the process.</h2>

      <label className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center cursor-pointer hover:bg-[#f4fff0] transition">
        <UploadCloud className="h-10 w-10 text-gray-500" />
        <span className="mt-2 text-sm text-gray-600">Click to upload a PDF file</span>
        <input type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
      </label>

      {pdfFile && <p className="text-sm text-gray-700">Selected File: {pdfFile.name}</p>}

      <div className="flex items-center gap-4">
        <div>
          <div className="">
            <Label>Start Page</Label>
            <Select value={startPage} onValueChange={setStartPage}>
              <SelectTrigger className="w-[100px] border rounded p-2">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {[...Array(maxPage)].map((_, index) => {
                  const page = (index + 1).toString();
                  return (
                    <SelectItem key={page} value={page}>
                      {page}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-2 mx-4">
          <span>to</span>
        </div>
        <div>
          <div className="">
            <Label>End Page</Label>
            <Select value={endPage} onValueChange={setEndPage}>
              <SelectTrigger className="w-[100px] border rounded p-2">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {[...Array(maxPage)].map((_, index) => {
                  const page = (index + 1).toString();
                  return (
                    <SelectItem key={page} value={page}>
                      {page}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Button onClick={handleExtractText} className="w-full">
        Extract Text
      </Button>

      {extractedText && (
        <>
          <Textarea
            value={extractedText}
            onChange={(e) => setExtractedText(e.target.value)}
            className="w-full p-4 mt-4 border rounded text-gray-600 whitespace-pre-wrap font-bold"
            style={{ fontFamily: "'Arial', sans-serif" }}
            rows={20}
          />
          <div className="flex items-center gap-8 mt-4">
            <Button onClick={handleReset} className="bg-destructive">Retry</Button>
            <Button onClick={onGenerate} className="w-fit">Generate</Button>
            <Button onClick={onExtract} className="w-fit">Extract</Button>
          </div>
        </>
      )}
    </div>
  );
};

export default PdfExtractor;
