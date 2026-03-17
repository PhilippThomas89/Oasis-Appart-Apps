"use client";

import React from "react";

export function DnaHelix() {
  // Generates the double helix SVG paths
  const points = 60;
  const width = 200;
  const height = 800;
  const amplitude = 60;
  const centerX = width / 2;

  const strand1: string[] = [];
  const strand2: string[] = [];
  const connectors: React.ReactElement[] = [];

  for (let i = 0; i <= points; i++) {
    const y = (i / points) * height;
    const phase = (i / points) * Math.PI * 6;
    const x1 = centerX + Math.sin(phase) * amplitude;
    const x2 = centerX + Math.sin(phase + Math.PI) * amplitude;

    if (i === 0) {
      strand1.push(`M ${x1} ${y}`);
      strand2.push(`M ${x2} ${y}`);
    } else {
      strand1.push(`L ${x1} ${y}`);
      strand2.push(`L ${x2} ${y}`);
    }

    // Connector lines between strands (every 3rd point)
    if (i % 3 === 0 && i > 0 && i < points) {
      connectors.push(
        <line
          key={i}
          x1={x1}
          y1={y}
          x2={x2}
          y2={y}
          stroke="rgba(16, 185, 129, 0.15)"
          strokeWidth="1.5"
        />
      );
    }
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Multiple helices at different positions */}
      {[
        { left: "5%", opacity: 0.4, delay: "0s", scale: 1 },
        { left: "25%", opacity: 0.25, delay: "-3s", scale: 0.8 },
        { left: "50%", opacity: 0.3, delay: "-6s", scale: 1.1 },
        { left: "75%", opacity: 0.2, delay: "-9s", scale: 0.9 },
        { left: "90%", opacity: 0.35, delay: "-2s", scale: 1 },
      ].map((config, idx) => (
        <div
          key={idx}
          className="absolute top-0 h-full animate-dna-scroll"
          style={{
            left: config.left,
            opacity: config.opacity,
            animationDelay: config.delay,
            transform: `scaleX(${config.scale})`,
          }}
        >
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="h-[200%] w-32"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id={`grad1-${idx}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
                <stop offset="30%" stopColor="#10b981" stopOpacity="1" />
                <stop offset="70%" stopColor="#10b981" stopOpacity="1" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
              <linearGradient id={`grad2-${idx}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#34d399" stopOpacity="0" />
                <stop offset="30%" stopColor="#34d399" stopOpacity="1" />
                <stop offset="70%" stopColor="#34d399" stopOpacity="1" />
                <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
              </linearGradient>
            </defs>
            {connectors}
            <path
              d={strand1.join(" ")}
              fill="none"
              stroke={`url(#grad1-${idx})`}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d={strand2.join(" ")}
              fill="none"
              stroke={`url(#grad2-${idx})`}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      ))}

      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={`p${i}`}
          className="absolute h-1 w-1 rounded-full bg-emerald-400/20 animate-float-particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${6 + Math.random() * 6}s`,
          }}
        />
      ))}
    </div>
  );
}
