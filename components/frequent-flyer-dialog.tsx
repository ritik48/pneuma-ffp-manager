"use client";

import { Dispatch, SetStateAction, useEffect } from "react";
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

  const {
    data: ratioData,
    isLoading: ratioDataLoading,
    isError: ratioError,
  } = useQuery<RatioDataType[]>({
    retry: 2,
    enabled: open && isEdit,
    queryKey: ["program-ratios", program?._id],
    queryFn: () => fetchRatioData(program!._id!),
    staleTime: 10 * 60 * 1000,
  });

  const {
    data: creditCards,
    isLoading: creditCardsLoading,
    isError: creditCardError,
  } = useQuery<ClientCreditCard[]>({
    queryKey: ["credit-cards"],
    retry: 2,
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
          ratioError={creditCardError || ratioError}
          onSubmit={onSubmit}
          creditCards={creditCards || []}
        />
      </DialogContent>
    </Dialog>
  );
}
