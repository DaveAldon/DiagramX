"use client";
import { useState, useEffect, useLayoutEffect } from "react";

const useIsomorphicLayout =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);
  useIsomorphicLayout(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
};
