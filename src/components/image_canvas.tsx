const React = require("react");
import { useEffect, useRef } from "react";
import { ImageCanvasProps } from "../types/props";

export const ImageCanvas = (props: ImageCanvasProps) => {
  const canvas = useRef(null);
  const canvasElem = <canvas ref={canvas}></canvas>;

  useEffect(() => {
    if (canvas.current != null) {
      console.log("Draw canvas");
    }
  }, []);

  return canvasElem;
};
