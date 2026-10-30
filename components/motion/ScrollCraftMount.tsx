"use client";

import { useEffect } from "react";

type ScrollCraftInstance = {
  destroy: () => void;
};

type ScrollCraftEngine = {
  mount: (root: Element | Document, opts?: { lerp?: number }) => ScrollCraftInstance;
  reduce: boolean;
  instances: ScrollCraftInstance[];
};

declare global {
  interface Window {
    ScrollCraft?: ScrollCraftEngine;
  }
}

/**
 * Mounts the unmodified scroll-craft engine from /public/scrollcraft.js.
 * The engine is the mechanism: it is never edited per project, only mounted,
 * themed with tokens and driven by data attributes in the markup.
 */
export function ScrollCraftMount() {
  useEffect(() => {
    let instance: ScrollCraftInstance | undefined;
    let frame = 0;
    let attempts = 0;

    function start() {
      if (window.ScrollCraft) {
        instance = window.ScrollCraft.mount(document.body);
        return;
      }

      attempts += 1;
      if (attempts < 180) {
        frame = requestAnimationFrame(start);
      }
    }

    start();

    return () => {
      cancelAnimationFrame(frame);
      instance?.destroy();
    };
  }, []);

  return null;
}
