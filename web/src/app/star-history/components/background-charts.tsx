"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface ChartPosition {
  id: string;
  src: string;
  x: number;
  y: number;
  rotation: number;
}

export function BackgroundCharts() {
  const [charts, setCharts] = useState<ChartPosition[]>([]);

  useEffect(() => {
    const chartFiles = [
      "/chart1.png",
      "/chart3.png",
      "/chart4.png",
      "/chart5.png",
      "/chart6.png"
    ];

    // Predefined positions for even distribution
    const predefinedPositions = [
      { x: 20, y: 20, rotation: -15 },
      { x: 45, y: 85, rotation: 8 },
      { x: 80, y: 75, rotation: -18 },
      { x: 10, y: 85, rotation: -20 },
      { x: 70, y: 20, rotation: 15 },
    ];

    const positions: ChartPosition[] = chartFiles.map((src, index) => ({
      id: `${index}`,
      src,
      x: predefinedPositions[index].x,
      y: predefinedPositions[index].y,
      rotation: predefinedPositions[index].rotation,
    }));

    setCharts(positions);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {charts.map((chart) => (
        <div
          key={chart.id}
          className="absolute"
          style={{
            left: `${chart.x}%`,
            top: `${chart.y}%`,
            transform: `translate(-50%, -50%) rotate(${chart.rotation}deg)`,
            opacity: 0.5,
          }}
        >
          <Image
            src={chart.src}
            alt=""
            width={400}
            height={250}
            className="select-none w-80 scale-130 h-auto"
            quality={100}
          />
        </div>
      ))}
    </div>
  );
}
