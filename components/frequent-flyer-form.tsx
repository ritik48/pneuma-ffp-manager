"use client";

import { useEffect } from "react";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ClipLoader } from "react-spinners";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash } from "lucide-react";
import { ClientCreditCard } from "@/app/_models/credit-card.model";
import { ClientFrequentFlyerProgram } from "@/app/_models/frequent-flyer-program.model";
import { ImageUploadInput } from "./image-upload-input";

export type RatioDataType = {
  _id: string;
  ratio: number;
  archived: boolean;
  programId: ClientFrequentFlyerProgram;
  creditCardId: ClientCreditCard;
};

interface FrequentflyerProgramFormProps {
  creditCards: ClientCreditCard[];
  onSubmit: (data: FFPFormSchema) => void;
  ratioData?: RatioDataType[];
  ratioLoading: boolean;
  program?: ClientFrequentFlyerProgram;
}

export const frequentFlyerProgramFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  assetName: z
    .custom<FileList>()
    .optional()
    .refine((file) => !file || file.length === 1),
  enabled: z.boolean(),
  ratios: z.array(
    z.object({
      creditCardId: z.string().min(1, "Select a credit card"),
      ratio: z.coerce.number().min(0.01, "Must be a positive number"),
    })
  ),
});

export type FFPFormSchema = z.infer<typeof frequentFlyerProgramFormSchema>;

export function FrequentFlyerForm({
  creditCards,
  ratioData,
  ratioLoading,
  onSubmit,
  program,
}: FrequentflyerProgramFormProps) {
  const initialRatios =
    ratioData?.map((item) => ({
      creditCardId: item.creditCardId._id,
      ratio: item.ratio,
    })) || [];

  const form = useForm<FFPFormSchema>({
    resolver: zodResolver(frequentFlyerProgramFormSchema),
    defaultValues: {
      name: program?.name || "",
      assetName: undefined,
      enabled: program?.enabled ?? true,
      ratios: initialRatios,
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "ratios",
  });

  // we have to do this as the ratio are fetched asynchronously, and default values are set only once
  useEffect(() => {
    form.setValue("ratios", initialRatios);
  }, [ratioLoading]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.error("Validation errors:", errors); // add this!
        })}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Program Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="assetName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Program Logo</FormLabel>
              <FormControl>
                <ImageUploadInput
                  value={field.value}
                  onChange={field.onChange}
                  existingImageUrl={program?.assetName}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="enabled"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-3">
              <FormLabel>Enabled</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {ratioLoading ? (
          <div className="text-sm text-center my-4">Loading ratios...</div>
        ) : (
          <>
            {" "}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Manage Ratios</h3>
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-center">
                  <FormField
                    control={form.control}
                    name={`ratios.${index}.creditCardId` as const}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Credit Card" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {creditCards.map((card) => (
                              <SelectItem key={card._id} value={card._id}>
                                {card.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`ratios.${index}.ratio` as const}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="Ratio"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => remove(index)}
                    size="icon"
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() => append({ creditCardId: "", ratio: 0 })}
              >
                <Plus className="w-4 h-4 mr-2" /> Add Ratio
              </Button>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {form.getValues("name") ? "Update Program" : "Create Program"}{" "}
              {isSubmitting && <ClipLoader size={14} color="#b5b5b5" />}
            </Button>
          </>
        )}
      </form>
    </Form>
  );
}
