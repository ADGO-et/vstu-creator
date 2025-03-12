import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MdLanguage } from "react-icons/md";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { langs } from "@/constants/lang";

export default function LangChooser() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentId = i18n.language;

  return (
    <Select
      onOpenChange={setIsOpen}
      value={currentId}
      onValueChange={(id) => {
        i18n.changeLanguage(id);
        localStorage.setItem("lang", id);
      }}
    >
      <SelectTrigger
        className={`w-min border-none  rounded-full  py-0 px-1
          ${isOpen ? "" : "text-primary"} `}
      >
        <SelectValue placeholder="Lang" />
      </SelectTrigger>
      <SelectContent>
        {langs.map((lang) => (
          <SelectItem key={lang.id} value={lang.id}>
            <div className="flex gap-1 items-center">
              <MdLanguage className="text-lg" />
              <span>
                {isOpen ? lang.name : lang.name.slice(0, 2).toUpperCase()}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
