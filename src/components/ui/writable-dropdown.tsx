"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Input } from "./input";

interface OriginalOption {
  value: string;
  label: string;
}
interface Option {
  value: null | string; //null for other
  label: string;
}

export function WritableDropdown({
  options: originalOptions,
  required = false,
  value: outerValue,
  defaultValue = "",
  onValueChange,
  isWritable = true,
}: {
  options: OriginalOption[];
  required?: boolean;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  isWritable?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const commandListRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (commandListRef.current) {
      commandListRef.current.scrollTop = 0;
    }
  }, [open]);

  const initiallyIsOther =
    isWritable && //is writable
    (outerValue || defaultValue) && //has a value or default value prop thats not undefined
    !originalOptions.find((o) => o.value === (outerValue || defaultValue)); // not among the options

  const [isOther, setIsOther] = React.useState(initiallyIsOther);
  const [localValue, setLocalValue] = React.useState<string>(defaultValue);

  const value = outerValue === undefined ? localValue : outerValue;
  const setValue = (v: string) => {
    setLocalValue(v);
    if (onValueChange) onValueChange(v);
  };

  const options: Option[] = [...originalOptions];
  if (isWritable) options.push({ value: null, label: "-- Other --" });

  const optionToString = (o: Option) =>
    JSON.stringify({ value: o.value, label: o.label });
  const stringToOption = (s: string) => JSON.parse(s) as Option;

  return (
    <>
      <div className=" flex flex-col items-center relative">
        <input
          value={value}
          required={required}
          className="w-1 h-1 absolute opacity-0 left-0"
          tabIndex={-1}
          onChange={() => {}}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full flex justify-between"
            >
              {isOther && "Other: "}
              {!value && !isOther && "Select"}
              {value &&
                !isOther &&
                options.find((o) => o.value === value)?.label}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className=" p-0 border rounded">
            <Command>
              <CommandInput
                placeholder="Search ..."
                onValueChange={() => {
                  if (commandListRef.current) {
                    commandListRef.current.scrollTop = 0;
                  }
                }}
              />
              <CommandList ref={commandListRef}>
                <CommandEmpty>Not found.</CommandEmpty>
                <CommandGroup>
                  {options.map((o) => (
                    <CommandItem
                      key={o.value + o.label}
                      //so that labels are searchable
                      value={o === null ? undefined : optionToString(o)}
                      onSelect={(currentValue) => {
                        const o = stringToOption(currentValue);
                        if (o.value === null) {
                          setValue("");
                          setIsOther(true);
                        } else if (o.value === value) {
                          setValue("");
                          setIsOther(false);
                        } else {
                          setIsOther(false);
                          setValue(o.value);
                        }

                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === o.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {o.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {isOther && (
          <>
            <div className="border h-3"></div>
            <Input
              className="rounded-lg"
              value={value}
              placeholder="Write here..."
              onChange={(e) => setValue(e.target.value)}
            />
          </>
        )}
      </div>
    </>
  );
}
