// hooks/useAnimationControl.ts
import { useState, useEffect, useRef } from "react";

export function useAnimationControl() {
  const [activeBox, setActiveBox] = useState<"yellow" | "blue">("yellow");
  const [position, setPosition] = useState<"offscreen" | "center" | "exit">("offscreen");
  const isPausedRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const animateBoxes = async () => {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      while (isMounted) {
        // Pause check
        while (isPausedRef.current && isMounted) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        setActiveBox("yellow");
        setPosition("offscreen");
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Pause check
        while (isPausedRef.current && isMounted) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        setPosition("center");
        await new Promise((resolve) => setTimeout(resolve, 10000));

        // Pause check
        while (isPausedRef.current && isMounted) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        setPosition("exit");
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Repeat same pattern for blue section
        while (isPausedRef.current && isMounted) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        setActiveBox("blue");
        setPosition("offscreen");
        await new Promise((resolve) => setTimeout(resolve, 100));

        setPosition("center");
        await new Promise((resolve) => setTimeout(resolve, 10000));

        while (isPausedRef.current && isMounted) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

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
        return "-translate-x-full";
      case "center":
        return "translate-x-0";
      case "exit":
        return "-translate-x-full";
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