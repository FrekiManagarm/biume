"use client";

import { useMemo } from "react";
import { useQueryStates } from "nuqs";
import { reportsSearchParsers } from "@/app/(main)/dashboard/reports/search-params";
import { AdvancedReport } from "@/lib/schemas/advancedReport/advancedReport";
import { AdvancedReportsTable } from ".";

interface ReportsPageClientProps {
  reports: AdvancedReport[];
}

export function ReportsPageClient({ reports }: ReportsPageClientProps) {
  const [
    { search: searchQuery, status: statusFilter, page: currentPage },
    setQuery,
  ] = useQueryStates(reportsSearchParsers, {
    shallow: false,
  });

  // Assure une page minimale à 1
  const safePage = useMemo(
    () => (currentPage < 1 ? 1 : currentPage),
    [currentPage],
  );

  return (
    <AdvancedReportsTable
      reports={reports}
      searchQuery={searchQuery}
      statusFilter={statusFilter}
      currentPage={safePage}
      onSearchChange={(v) => setQuery({ search: v })}
      onStatusChange={(v) => setQuery({ status: v })}
      onPageChange={(p) => setQuery({ page: p })}
    />
  );
}

export default ReportsPageClient;
