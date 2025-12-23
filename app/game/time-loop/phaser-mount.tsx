"use client";

import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
import { TimeLoopScene } from "@/lib/game/timeLoop/TimeLoopScene";

export default function PhaserMount() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (gameRef.current) return;

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: containerRef.current,
      backgroundColor: "#000000",
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 960,
        height: 540,
      },
      fps: { target: 60, forceSetTimeOut: true },
      scene: [TimeLoopScene],
    });

    gameRef.current = game;

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return <div ref={containerRef} className="h-[540px] w-full" />;
}
