import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FileDown } from "lucide-react";

interface ExportAllDataProps {
  fullName: string;
  repoId: number;
}

export function ExportAllData({ fullName, repoId }: ExportAllDataProps) {
  const repoSlug = fullName.replace('/', '-');

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="secondary" size="icon" className="size-9">
            <a
              href={`/api/export/${repoId}?format=csv&repo=${encodeURIComponent(fullName)}`}
              download={`${repoSlug}-data.zip`}
            >
              <FileDown />
            </a>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Export all your data into CSV format</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
