"use client";

import { useTransition } from "react";
import { Switch } from "@/components/ui/switch";
import { updateFrequentFlyerProgramStatus } from "@/actions";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { ClientFrequentFlyerProgram } from "@/app/_models/frequent-flyer-program.model";
import { ClipLoader } from "react-spinners";

export function FrequentFlyerToggle({
  id,
  initialEnabled,
  queryKey,
}: {
  id: string;
  initialEnabled: boolean;
  queryKey: any;
}) {
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();

  const onChange = (checked: boolean) => {
    startTransition(async () => {
      try {
        await updateFrequentFlyerProgramStatus(id, checked);
        toast.success("Status updated!");

        // optimistic update
        queryClient.setQueryData<{
          programs: ClientFrequentFlyerProgram[];
          total: number;
        }>(queryKey, (oldData) => {
          if (!oldData) return { programs: [], total: 0 };

          const updatedP = oldData.programs.map((p) =>
            p._id === id ? { ...p, enabled: checked } : p
          );

          return {
            programs: updatedP,
            total: oldData.total,
          };
        });

        queryClient.invalidateQueries({ queryKey: [queryKey] });
      } catch (err: any) {
        toast.error("Failed to update status.");
        console.error(err);
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={initialEnabled}
        disabled={isPending}
        onCheckedChange={onChange}
      />
      {isPending && <ClipLoader size={14} color="#b5b5b5" />}
    </div>
  );
}
