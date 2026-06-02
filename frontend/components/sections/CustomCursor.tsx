"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;

    if (!cursor || !ring) {
      return;
    }

    let frame = 0;
    let mx = 0;
    let my = 0;
    let rx = 0;
    let ry = 0;

    const handleMove = (event: MouseEvent) => {
      mx = event.clientX;
      my = event.clientY;
    };

    const animate = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      cursor.style.left = `${mx}px`;
      cursor.style.top = `${my}px`;
      ring.style.left = `${rx}px`;
      ring.style.top = `${ry}px`;
      frame = window.requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", handleMove);
    frame = window.requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", handleMove);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div className="cursor" ref={cursorRef} />
      <div className="cursor-ring" ref={ringRef} />
    </>
  );
}
