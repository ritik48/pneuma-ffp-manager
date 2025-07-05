import { useState } from "react";
import { FrequentFlyerFormDialog } from "./frequent-flyer-dialog";
import { ClientFrequentFlyerProgram } from "@/app/_models/frequent-flyer-program.model";
import { Button } from "./ui/button";
import { PencilIcon } from "lucide-react";
import { FFPFormSchema } from "./frequent-flyer-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { addFrequentFlyerProgram } from "@/actions";

export function FrequentFlyerDialogWrapper({
  program,
  children,
}: {
  program?: ClientFrequentFlyerProgram;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { mutate: addFrequentFlyerProgramMutation, isPending } = useMutation({
    mutationFn: addFrequentFlyerProgram,
    onSuccess: (newProgram) => {
      // Option 1: Invalidate and refetch
      // queryClient.invalidateQueries({
      //   queryKey: ["frequent-flyer-programs"],
      // });

      queryClient.setQueryData(["frequent-flyer-program"], (old: any) => {
        return old ? [...old, newProgram] : [newProgram];
      });

      // Option 2: Optimistic update
      // queryClient.setQueryData(
      //   ["frequent-flyer-programs"],
      //   (old: ClientFrequentFlyerProgram[] | undefined) =>
      //     old ? [...old, newProgram] : [newProgram]
      // );

      // Show success feedback
      toast.success("Program added successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add program");
      console.error("Error adding program:", error);
    },
  });

  const onSubmit = async (value: FFPFormSchema) => {
    const formData = new FormData();
    formData.append("name", value.name);
    formData.append("enabled", String(value.enabled));

    if (value.assetName && value.assetName.length > 0) {
      formData.append("image", value.assetName[0]); // The actual File
    }

    formData.append("ratios", JSON.stringify(value.ratios));

    const res = await addFrequentFlyerProgram(formData);
    console.log("Added Program:", res);
  };

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        {children}
      </Button>
      <FrequentFlyerFormDialog
        open={open}
        onOpenChange={setOpen}
        program={program}
        onSubmit={(data: any) => onSubmit(data)}
      />
    </>
  );
}
