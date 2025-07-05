"use client";

import { useState } from "react";
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
import { ChevronDown, ChevronUp, Pencil, Plus } from "lucide-react";
import { ClientFrequentFlyerProgram } from "@/app/_models/frequent-flyer-program.model";
import { useQuery } from "@tanstack/react-query";
import { fetchFrequentFlyerPrograms } from "@/actions";
import { DeleteFrequentFlyer } from "./delete-frequent-flyer";
import { FrequentFlyerDialogWrapper } from "./frequent-flyer-dialog-wrapper";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { FrequentFlyerToggle } from "./toggle-frequent-flyer-program";
import { ClipLoader } from "react-spinners";

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
    retry: 2,
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
    <div className="space-y-4 px-3">
      <div className="flex justify-between items-center">
        <h1 className="sm:text-xl sm:w-full w-1/3 font-semibold">
          Frequent Flyer Programs{" "}
          <span className="text-xs text-muted-foreground">({total})</span>
        </h1>
        <FrequentFlyerDialogWrapper queryKey={queryKey}>
          Add Program <Plus />
        </FrequentFlyerDialogWrapper>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center mt-[100px]">
          <ClipLoader size={30} className="mx-auto" color="#b5b5b5" />
        </div>
      )}

      {isError && !isLoading && (
        <div className="flex justify-center items-center mt-[100px]">
          <p className="text-red-500 text-xs sm:text-sm">
            Error while fetching the programs.
          </p>
        </div>
      )}
      {!isError && !isLoading && total === 0 && (
        <div className="flex justify-center items-center mt-[100px]">
          <p className="font-semibold text-xs sm:text-sm">
            You don't have any programs yet. Create One.
          </p>
        </div>
      )}
      {!isError && !isLoading && total > 0 && (
        <>
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
                      <Avatar>
                        <AvatarImage
                          className="object-contain w-10 h-10 rounded-full"
                          src={`${ffp.assetName}`}
                          alt="@shadcn"
                        />
                        <AvatarFallback>
                          {ffp.name[0].toUpperCase() +
                            ffp.name[1]?.toUpperCase() || ""}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <FrequentFlyerToggle
                        initialEnabled={ffp.enabled}
                        id={ffp._id}
                        queryKey={queryKey}
                      />
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">
                      {format(new Date(ffp.createdAt), "PPP p")}
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">
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
        </>
      )}
    </div>
  );
}
