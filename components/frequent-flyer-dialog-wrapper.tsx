import { useState } from "react";
import { FrequentFlyerFormDialog } from "./frequent-flyer-dialog";
import { ClientFrequentFlyerProgram } from "@/app/_models/frequent-flyer-program.model";
import { Button } from "./ui/button";
import { FFPFormSchema } from "./frequent-flyer-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { addFrequentFlyerProgram, updateFrequentFlyerProgram } from "@/actions";

export function FrequentFlyerDialogWrapper({
  program,
  children,
  queryKey,
}: {
  program?: ClientFrequentFlyerProgram;
  children: React.ReactNode;
  queryKey: (string | number)[];
}) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const addProgram = async (formData: FormData) => {
    const res = await addFrequentFlyerProgram(formData);

    queryClient.setQueryData<{
      programs: ClientFrequentFlyerProgram[];
      total: number;
    }>(queryKey, (oldData) => {
      if (!oldData) return { programs: [], total: 0 };
      return {
        programs: [res, ...oldData.programs],
        total: oldData.total + 1,
      };
    });

    queryClient.invalidateQueries({ queryKey: ["frequent-flyer-program"] });
    setOpen(false);
  };

  const updateProgram = async (formData: FormData) => {
    formData.append("id", program!._id);
    const res = await updateFrequentFlyerProgram(formData);

    queryClient.setQueryData<{
      programs: ClientFrequentFlyerProgram[];
      total: number;
    }>(queryKey, (oldData) => {
      console.log({ res, oldData });
      if (!oldData) return { programs: [], total: 0 };

      const updatedP = oldData.programs.map((p) =>
        p._id === program?._id ? res : p
      );

      console.log({ updatedP });

      return {
        programs: updatedP,
        total: oldData.total,
      };
    });

    // invalidate the ratios for the updated ffp
    queryClient.invalidateQueries({
      queryKey: ["program-ratios", program!._id],
    });
    setOpen(false);
  };

  const onSubmit = async (value: FFPFormSchema) => {
    const formData = new FormData();
    formData.append("name", value.name);
    formData.append("enabled", String(value.enabled));

    if (value.assetName && value.assetName.length > 0) {
      formData.append("image", value.assetName[0]);
    }

    formData.append("ratios", JSON.stringify(value.ratios));

    if (!program) {
      await addProgram(formData);
    } else {
      await updateProgram(formData);
    }
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
