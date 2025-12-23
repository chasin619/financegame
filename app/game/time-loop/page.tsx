"use client";

import React from "react";
import dynamic from "next/dynamic";

const PhaserGame = dynamic(() => import("./phaser-mount"), { ssr: false });

export default function TimeLoopPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Time-Loop Mode</h1>
            <p className="mt-1 text-sm text-gray-600">
              Survive the week. Learn the pattern. Reset. Improve.
            </p>
          </div>

          <a
            href="/"
            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow hover:bg-gray-50"
          >
            ← Back to options
          </a>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="rounded-2xl bg-white shadow">
            <div className="border-b px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-900">Week Simulator</div>
                <div className="text-xs text-gray-500">MVP • 1 room • 7 days • auto reset</div>
              </div>
            </div>

            <div className="p-3">
              <div className="relative overflow-hidden rounded-xl bg-black">
                <PhaserGame />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="text-base font-semibold text-gray-900">How to play</h2>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              <li>• A week lasts ~90 seconds.</li>
              <li>• You'll get 2–3 decision prompts. Pick fast.</li>
              <li>• Cash helps now. Debt/stress haunts later.</li>
              <li>• End of Sunday → reset. Knowledge stays.</li>
            </ul>

            <div className="mt-6 rounded-xl bg-gray-50 p-4">
              <div className="text-xs font-semibold text-gray-600">Product-owner note</div>
              <div className="mt-2 text-sm text-gray-700">
                This mode is designed to teach <span className="font-medium">pattern recognition</span>, not math.
                If players say "one more try," it's working.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
