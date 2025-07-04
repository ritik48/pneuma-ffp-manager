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
import { ChevronDown, ChevronUp, PencilIcon, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { ClientFrequentFlyerProgram } from "@/app/_models/frequent-flyer-program.model";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchFrequentFlyerPrograms } from "@/actions";
import { DeleteFrequentFlyer } from "./delete-frequent-flyer";

export default function FrequentFlyerClientTable() {
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [open, setOpen] = useState(false);

  const ITEMS_PER_PAGE = 10;
  const queryClient = useQueryClient();

  // Fetch data with React Query

  const queryKey = "frequent-flyer-programs";

  const { data, isLoading, isError, error } = useQuery<{
    programs: ClientFrequentFlyerProgram[];
    total: number;
  }>({
    queryKey: [queryKey, page, sortField, sortOrder],
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
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Frequent Flyer</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Frequent Flyer Program</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Program Name"
                // value={form.name}
                // onChange={(e) =>
                //   setForm((f) => ({ ...f, name: e.target.value }))
                // }
              />
              <Input
                placeholder="Logo file name"
                // value={form.assetName}
                // onChange={(e) =>
                //   setForm((f) => ({ ...f, assetName: e.target.value }))
                // }
              />
              {/* <Button onClick={handleSubmit} disabled={isPending}>
                {isPending ? "Adding..." : "Submit"}
              </Button> */}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
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
              <TableCell>{ffp.assetName}</TableCell>
              <TableCell>
                <Switch checked={ffp.enabled} disabled />
              </TableCell>
              <TableCell>{format(new Date(ffp.createdAt), "PPP p")}</TableCell>
              <TableCell>{format(new Date(ffp.modifiedAt), "PPP p")}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <PencilIcon />
                  </Button>
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
