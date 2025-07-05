"use client";

import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ExportDropdownProps {
  onExportCSV: () => void;
  onExportJSON: () => void;
}

export function ExportDropdown({ onExportCSV, onExportJSON }: ExportDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          title="Export data"
        >
          Export
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onExportCSV}>
          Export to CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onExportJSON}>
          Export to JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
