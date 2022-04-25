const React = require("react");
import { drawGL } from "../gl/gl";
import { useEffect, useRef } from "react";
import { ImageCanvasProps } from "../types/props";

export const ImageCanvas = (props: ImageCanvasProps) => {
  const { images, currentShader } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasElem = <canvas ref={canvasRef}></canvas>;

  useEffect(() => {
    const targetImages = images.filter((data) => data.isDrawing);
    if (targetImages.length > 0 && canvasRef.current != null) {
      const canvas = canvasRef.current;
      canvas.setAttribute("width", `${window.innerWidth}`);
      canvas.setAttribute("height", `${window.innerHeight}`);
      drawGL(canvas, targetImages, currentShader);
    }
  }, [images]);

  return canvasElem;
};
