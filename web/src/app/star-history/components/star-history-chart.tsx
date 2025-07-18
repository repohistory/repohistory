"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import { Check, Clipboard, Loader } from "lucide-react";
import { toast } from "sonner";

const COLORS = [
  "#f862d3",
  "#f86262",
  "#f88d62",
  "#f8d862",
  "#b5f862",
  "#62f888",
  "#62C3F8",
  "#6278f8",
  "#b562f8",
];

const BACKGROUND_COLORS = [
  "#0D1117", // GitHub dark
  "#FFFFFF",
];

interface StarHistoryChartProps {
  initialOwner: string;
  initialRepo: string;
  fullName: string;
}

export function StarHistoryChart({ initialOwner, initialRepo, fullName }: StarHistoryChartProps) {
  const router = useRouter();
  const [owner, setOwner] = useState(initialOwner);
  const [repo, setRepo] = useState(initialRepo);
  const [copied, setCopied] = useState(false);
  const [background, setBackground] = useState<string>("0D1117");
  const [type, setType] = useState<string>("Date");
  const [color, setColor] = useState<string>("f86262");
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isCustomizing, setIsCustomizing] = useState(false);

  const handleGenerate = () => {
    if (owner && repo) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set("owner", owner);
      newUrl.searchParams.set("repo", repo);
      router.push(newUrl.toString());

      setIsImageLoading(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleGenerate();
    }
  };

  const isValidColor = color && /^[0-9A-Fa-f]{6}$/.test(color);
  const imageUrl = `/api/svg?repo=${fullName}&type=${type}&background=${background}${isValidColor ? `&color=${color}` : ''}`;
  const markdownCode = `[![Star History Chart](${process.env.NEXT_PUBLIC_SITE_URL}${imageUrl})](${process.env.NEXT_PUBLIC_SITE_URL}/star-history)`;

  const copyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(markdownCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Copied to clipboard! You can now paste it to your README.md");
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex justify-center flex-wrap items-center gap-2">
            <div className="flex items-center gap-2">
              <Input
                placeholder="facebook"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-40"
              />
              <span className="text-muted-foreground text-xl">/</span>
              <Input
                placeholder="react"
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-40"
              />
            </div>
            <Button
              onClick={handleGenerate}
              disabled={!owner || !repo || fullName === `${owner}/${repo}`}
            >
              Generate
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="relative">
              {isImageLoading && (
                <div className="absolute bg-[#0D1116] inset-0 w-full aspect-[800/533] border rounded-lg flex items-center justify-center z-10">
                  <div className="flex flex-col items-center gap-2">
                    <Loader className="h-5 w-5 animate-spin text-white" />
                  </div>
                </div>
              )}
              {isCustomizing && !isImageLoading && (
                <div className="absolute inset-0 bg-black/50 border rounded-lg flex items-center justify-center z-10">
                  <div className="flex flex-col items-center gap-2">
                    <Loader className="h-5 w-5 animate-spin text-white" />
                  </div>
                </div>
              )}
              <Image
                src={imageUrl}
                unoptimized
                alt="Star History Chart"
                width={800}
                height={533}
                className={`w-full border rounded-lg transition-all duration-300 ${isImageLoading ? 'opacity-0' : isCustomizing ? 'opacity-100 brightness-50' : 'opacity-100'
                  }`}
                onLoad={() => {
                  setIsImageLoading(false);
                  setIsCustomizing(false);
                }}
                onError={() => {
                  setIsImageLoading(false);
                  setIsCustomizing(false);
                }}
              />
            </div>
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
                  <div className="bg-muted px-3 rounded">
                    <div className="text-xs overflow-hidden">
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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h4 className="text-sm font-medium">Customization</h4>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-4">
              <div className="text-muted-foreground text-sm">Color</div>
              <Input
                placeholder="#f86262"
                type="text"
                value={`#${color}`}
                onChange={(e) => {
                  const value = e.target.value.replace('#', '');
                  const isValid = value.length === 6 && /^[0-9A-Fa-f]{6}$/.test(value);
                  if (isValid) {
                    setColor(value);
                    setIsCustomizing(true);
                  } else if (value.length <= 6) {
                    setColor(value);
                  }
                }}
                maxLength={7}
              />
              <div className="grid grid-cols-7 gap-2">
                {COLORS.map((presetColor) => {
                  const isSelected = color === presetColor.replace("#", "");
                  return (
                    <button
                      key={presetColor}
                      onClick={() => {
                        setColor(presetColor.replace("#", ""));
                        setIsCustomizing(true);
                      }}
                      className="w-8 h-8 rounded-full cursor-pointer transition-all hover:scale-105 relative flex items-center justify-center"
                      style={{ backgroundColor: presetColor }}
                      title={presetColor}
                    >
                      {isSelected && (
                        <Check className="w-4 h-4 text-black" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="space-y-4">
              <div className="text-muted-foreground text-sm">Background Color</div>
              <Input
                placeholder="#0D1117"
                type="text"
                value={`#${background}`}
                onChange={(e) => {
                  const value = e.target.value.replace('#', '');
                  const isValid = value.length === 6 && /^[0-9A-Fa-f]{6}$/.test(value);
                  if (isValid) {
                    setBackground(value);
                    setIsCustomizing(true);
                  } else if (value.length <= 6) {
                    setBackground(value);
                  }
                }}
                maxLength={7}
              />
              <div className="flex gap-2">
                {BACKGROUND_COLORS.map((presetBackground) => {
                  const isSelected = background === presetBackground.replace("#", "");
                  return (
                    <button
                      key={presetBackground}
                      onClick={() => {
                        setBackground(presetBackground.replace("#", ""));
                        setIsCustomizing(true);
                      }}
                      className="w-8 h-8 rounded-full cursor-pointer transition-all hover:scale-105 relative flex items-center justify-center border border-muted-foreground"
                      style={{ backgroundColor: presetBackground }}
                      title={presetBackground === "#0D1117" ? "GitHub Dark" : "White"}
                    >
                      {isSelected && (
                        <Check className={`w-4 h-4 ${presetBackground === "#0D1117" ? "text-white" : "text-black"}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-muted-foreground text-sm">Chart Type</div>
              <Select defaultValue={type} onValueChange={(value) => {
                setType(value);
                setIsCustomizing(true);
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Date">Date</SelectItem>
                  <SelectItem value="Timeline">Timeline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
