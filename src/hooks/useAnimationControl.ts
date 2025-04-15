// hooks/useAnimationControl.ts
import { useState, useEffect, useRef } from "react";

export function useAnimationControl() {
  const [activeBox, setActiveBox] = useState<"yellow" | "blue">("yellow");
  const [position, setPosition] = useState<"offscreen" | "center" | "exit">("offscreen");
  const isPausedRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const animateBoxes = async () => {
      // Initial delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      while (isMounted) {
        // Yellow panel animation (weather)
        setActiveBox("yellow");
        setPosition("offscreen");
        await new Promise((resolve) => setTimeout(resolve, 100));
        
        if (!isMounted) break;
        setPosition("center");
        await new Promise((resolve) => setTimeout(resolve, 8000));
        
        if (!isMounted) break;
        setPosition("exit");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        if (!isMounted) break;
        
        // Blue panel animation (flight)
        setActiveBox("blue");
        setPosition("offscreen");
        await new Promise((resolve) => setTimeout(resolve, 100));
        
        if (!isMounted) break;
        setPosition("center");
        await new Promise((resolve) => setTimeout(resolve, 8000));
        
        if (!isMounted) break;
        setPosition("exit");
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    };

    animateBoxes();

    return () => {
      isMounted = false;
    };
  }, []);

  const getTransformClass = () => {
    switch (position) {
      case "offscreen":
        return "-translate-x-full"; // Start from right side
      case "center":
        return "translate-x-0"; // Centered position
      case "exit":
        return "-translate-x-full"; // Exit to left side
      default:
        return "translate-x-full";
    }
  };

  return {
    activeBox,
    position,
    getTransformClass,
    isPausedRef,
  };
}