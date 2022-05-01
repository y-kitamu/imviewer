const React = require("react");
import { drawGL } from "../gl/gl";
import { useEffect, useRef } from "react";
import { ImageCanvasProps } from "../types/props";
import { Drawable } from "../types/drawable";

export const ImageCanvas = (props: ImageCanvasProps) => {
  const { refCanvasWindow } = props;
  const refCanvas = useRef<HTMLCanvasElement>(null);
  const isMouseDown = useRef<boolean>(false);

  const handleWheel = (e: React.WheelEvent) => {
    imageDatas.map((data) => {
      if (!data.isDrawing) {
        return;
      }
      const { mvpMat } = data;
      let scale = 1.0;
      switch (e.deltaMode) {
        case 0x00:
          scale = 0.003;
          break;
        case 0x01:
          scale = 0.01;
          break;
        case 0x02:
          scale = 0.1;
          break;
        default:
          console.log(`Invalid deltaMode value : ${e.deltaMode}`);
      }
      const delta = Math.max(1.0 - scale * e.deltaY, 0.0);
      mvpMat.elements[0] *= delta;
      mvpMat.elements[5] *= delta;
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isMouseDown.current = true;
  };
  const handleMouseUp = (e: React.MouseEvent) => {
    isMouseDown.current = false;
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown.current) {
      return;
    }
    imageDatas.map((data) => {
      if (!data.isDrawing) {
        return;
      }
      const { mvpMat } = data;
      const dx = (e.movementX / window.innerWidth) * 2.0;
      const dy = (e.movementY / window.innerHeight) * 2.0;
      mvpMat.elements[12] += dx;
      mvpMat.elements[13] -= dy;
    });
  };

  useEffect(() => {
    const targetImages = images.filter((data) => data.isDrawing);
    if (targetImages.length > 0 && refCanvas.current != null) {
      const canvas = refCanvas.current;
      canvas.setAttribute("width", `${window.innerWidth}`);
      canvas.setAttribute("height", `${window.innerHeight}`);
      drawGL(canvas, targetImages, currentShader);
    }
  }, [images]);

  return (
    <div
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <canvas ref={refCanvas}></canvas>
    </div>
  );
};
