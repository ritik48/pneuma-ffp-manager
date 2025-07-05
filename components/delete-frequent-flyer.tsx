import { Trash } from "lucide-react";
import { Button } from "./ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { ClientFrequentFlyerProgram } from "@/app/_models/frequent-flyer-program.model";
import { deleteFrequentFlyerProgram } from "@/actions";

interface DeleteFrequentFlyerProps {
  id: string;
  queryKey: (string | number)[];
  sortField: string;
  sortOrder: "asc" | "desc";
  page: number;
}

export function DeleteFrequentFlyer({
  id,
  queryKey,
  sortField,
  sortOrder,
  page,
}: DeleteFrequentFlyerProps) {
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    // Optimistic removal
    queryClient.setQueryData<{
      programs: ClientFrequentFlyerProgram[];
      total: number;
    }>(queryKey, (old) => {
      if (!old) return { programs: [], total: 0 };

      return {
        programs: old.programs.filter((ffp) => ffp._id !== id),
        total: old.total - 1,
      };
    });

    try {
      await deleteFrequentFlyerProgram(id);

      // clear complete cache
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    } catch (err) {
      console.error("Delete failed");
    }
  };

  return (
    <Button size="sm" variant="destructive" onClick={handleDelete}>
      <Trash />
    </Button>
  );
}
