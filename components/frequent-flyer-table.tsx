"use client";

import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { format } from "date-fns";
// import { createFrequentFlyerProgram } from "@/actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ChevronDown,
  ChevronUp,
  Pencil,
  PencilIcon,
  Plus,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ClientFrequentFlyerProgram } from "@/app/_models/frequent-flyer-program.model";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchFrequentFlyerPrograms } from "@/actions";
import { DeleteFrequentFlyer } from "./delete-frequent-flyer";
import { FrequentFlyerDialogWrapper } from "./frequent-flyer-dialog-wrapper";
import { FFPFormSchema } from "./frequent-flyer-form";
import Image from "next/image";

export default function FrequentFlyerClientTable() {
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const ITEMS_PER_PAGE = 10;

  // Fetch data with React Query
  const ffpKey = "frequent-flyer-program";
  const queryKey = [ffpKey, page, sortField, sortOrder];

  const { data, isLoading, isError, error } = useQuery<{
    programs: ClientFrequentFlyerProgram[];
    total: number;
  }>({
    queryKey,
    queryFn: () =>
      fetchFrequentFlyerPrograms({
        page,
        sortField,
        sortOrder,
        items_per_page: ITEMS_PER_PAGE,
      }),
    placeholderData: (prev) => prev,
    staleTime: 6 * 1000,
  });

  const programs = data?.programs || [];
  const total = data?.total || 0;

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setPage(1);
  };

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Frequent Flyer Programs</h1>
        <FrequentFlyerDialogWrapper queryKey={queryKey}>
          Add Program <Plus />
        </FrequentFlyerDialogWrapper>
      </div>
      <div className="max-h-[calc(100vh-200px)] overflow-auto">
        <Table className="overflow-auto h-full w-full">
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => toggleSort("name")}>
                Name{" "}
                {sortField === "name" &&
                  (sortOrder === "asc" ? (
                    <ChevronUp className="inline w-4 h-4" />
                  ) : (
                    <ChevronDown className="inline w-4 h-4" />
                  ))}
              </TableHead>
              <TableHead>Logo</TableHead>
              <TableHead>Enabled</TableHead>
              <TableHead onClick={() => toggleSort("createdAt")}>
                Created
              </TableHead>
              <TableHead>Modified</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {programs.map((ffp) => (
              <TableRow key={ffp._id}>
                <TableCell>{ffp.name}</TableCell>
                <TableCell>
                  <Image
                    src={`${ffp.assetName || "/placeholder.svg"}`}
                    alt="logo"
                    width={40}
                    height={40}
                  />
                </TableCell>
                <TableCell>
                  <Switch checked={ffp.enabled} disabled />
                </TableCell>
                <TableCell>
                  {format(new Date(ffp.createdAt), "PPP p")}
                </TableCell>
                <TableCell>
                  {format(new Date(ffp.modifiedAt), "PPP p")}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <FrequentFlyerDialogWrapper
                      program={ffp}
                      queryKey={queryKey}
                    >
                      <Pencil />
                    </FrequentFlyerDialogWrapper>
                    <DeleteFrequentFlyer
                      id={ffp._id}
                      page={page}
                      sortField={sortField}
                      sortOrder={sortOrder}
                      queryKey={queryKey}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
              />
            </PaginationItem>
            <PaginationItem>
              Page {page} of {totalPages}
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
