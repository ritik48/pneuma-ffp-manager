"use client";

import { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useQuery } from "@tanstack/react-query";
import { ClientFrequentFlyerProgram } from "@/app/_models/frequent-flyer-program.model";
import { ClientCreditCard } from "@/app/_models/credit-card.model";
import { fetchCreditCards, fetchRatioData } from "@/actions";
import { FrequentFlyerForm, RatioDataType } from "./frequent-flyer-form";
// import { fetchProgramRatios } from "@/lib/api";

export function FrequentFlyerFormDialog({
  program,
  open,
  onOpenChange,
  onSubmit,
}: {
  program?: ClientFrequentFlyerProgram;
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  onSubmit: (data: any) => void;
}) {
  const isEdit = !!program?._id;

  const { data: ratioData, isLoading: ratioDataLoading } = useQuery<
    RatioDataType[]
  >({
    enabled: open && isEdit,
    queryKey: ["program-ratios", program?._id],
    queryFn: () => fetchRatioData(program!._id!),
    staleTime: 5 * 60 * 1000,
  });

  const { data: creditCards, isLoading: creditCardsLoading } = useQuery<
    ClientCreditCard[]
  >({
    queryKey: ["credit-cards"],
    queryFn: fetchCreditCards,
    enabled: open,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Frequent Flyer" : "Add Frequent Flyer"}
          </DialogTitle>
        </DialogHeader>

        <FrequentFlyerForm
          program={program}
          ratioData={ratioData}
          ratioLoading={ratioDataLoading || creditCardsLoading}
          onSubmit={onSubmit}
          creditCards={creditCards || []}
        />
      </DialogContent>
    </Dialog>
  );
}
