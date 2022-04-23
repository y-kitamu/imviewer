const React = require("react");
import { drawGL } from "../gl";
import { useEffect, useRef } from "react";
import { ImageCanvasProps } from "../types/props";

export const ImageCanvas = (props: ImageCanvasProps) => {
  const { image } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasElem = <canvas ref={canvasRef}></canvas>;

  useEffect(() => {
    if (image != null && canvasRef.current != null) {
      console.log("useEffect");
      const canvas = canvasRef.current;
      canvas.setAttribute("width", `${window.innerWidth}`);
      canvas.setAttribute("height", `${window.innerHeight}`);
      drawGL(canvas, image);
    }
  }, [image]);

  return canvasElem;
};
