"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Clipboard } from "lucide-react";

interface ShareImageProps {
  fullName: string;
}

export function ShareImage({ fullName }: ShareImageProps) {
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState<string>("dark");
  const [type, setType] = useState<string>("Date");
  const [transparent, setTransparent] = useState<string>("false");
  const [color, setColor] = useState<string>("");

  const imageUrl = `/api/svg?repo=${fullName}&type=${type}&theme=${theme}&transparent=${transparent}${color ? `&color=${color}` : ''}`;
  const markdownCode = `[![Star History Chart](${window.origin}${imageUrl})](https://repohistory.com)`;

  const copyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(markdownCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-6">
      <Image
        src={imageUrl}
        unoptimized
        alt="Star History Chart"
        width={800}
        height={533}
        className="w-full border rounded-lg"
      />
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium">Click to copy markdown</h4>
        </div>
        <div className="flex items-center">
          <Button
            variant="secondary"
            size="icon"
            onClick={copyMarkdown}
            className="w-full cursor-copy"
            asChild
          >
            <div className="bg-muted px-3 max-w-xl rounded">
              <div className="text-xs overflow-x-auto py-5">
                <code className="whitespace-nowrap">{markdownCode}</code>
              </div>
              {copied ? (
                <Check className="h-4 w-4 animate-in fade-in-0 zoom-in-95 duration-200" />
              ) : (
                <Clipboard className="h-4 w-4 animate-in fade-in-0 zoom-in-95 duration-200" />
              )}
            </div>
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium">Customization</h4>
        </div>
        <div className="flex gap-4">
          <div className="space-y-1">
            <div className="text-muted-foreground text-sm">Theme</div>
            <Select defaultValue={theme} onValueChange={setTheme}>
              <SelectTrigger className="w-[8rem]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <div className="text-muted-foreground text-sm">Chart Type</div>
            <Select defaultValue={type} onValueChange={setType}>
              <SelectTrigger className="w-[8rem]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Date">Date</SelectItem>
                <SelectItem value="Timeline">Timeline</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <div className="text-muted-foreground text-sm">Transparent</div>
            <Select defaultValue={transparent} onValueChange={setTransparent}>
              <SelectTrigger className="w-[8rem]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false">False</SelectItem>
                <SelectItem value="true">True</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <div className="text-muted-foreground text-sm">Color (HEX)</div>
            <Input
              placeholder="62C3F8"
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-[8rem]"
              maxLength={6}
            />
          </div>
        </div>
        <div className="flex gap-4"></div>
      </div>
    </div>
  );
}
