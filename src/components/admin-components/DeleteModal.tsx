import { Button } from "@/components/ui/button";
import { MdDelete } from "react-icons/md";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UseMutationResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import ErrorMessage from "../status/ErrorMessage";

export function DeleteModal({
  // Todo: add during integraion
  query,
  name = "",
}: {
  query?: UseMutationResult<any, AxiosError, any>;
  name?: string;
}) {
  const [open, setOpen] = useState(false);
  const { isPending, error, isSuccess, mutate } = query || {
    isPending: false,
    error: null,
    isSuccess: false,
    mutate: () => {},
  };
  useEffect(() => {
    if (isSuccess) setOpen(false);
  }, [isSuccess]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={"sm"} variant={"ghost"} className="hover:bg-destructive">
          <MdDelete />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Are you sure to delete {name} ?</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p className="text-center text-foreground/70">
            This action is irreversible
          </p>
        </div>
        <DialogFooter className="flex flex-col gap-6">
          <div className="flex gap-6">
            <Button
              onClick={() => setOpen(false)}
              className="flex-1"
              variant={"outline"}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant={"destructive"}
              className="flex-1"
              onClick={mutate}
              isLoading={isPending}
            >
              Delete
            </Button>
          </div>

          <ErrorMessage error={error} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
