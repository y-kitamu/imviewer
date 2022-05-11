const React = require("react");
import { useEffect, useRef } from "react";
import { Matrix4 } from "three";
import { draw, loadShader } from "../../gl/gl";
import { DEFAULT_SHADERS } from "../../gl/constants";
import { ImageCanvasProps } from "../types/props";
import { updateOnFocusByMousePosition } from "../cruds/canvas_window";
import { updateMVPMatrix } from "../cruds/widget";

export const ImageCanvas = (props: ImageCanvasProps) => {
  const { refCanvas, canvasWindow } = props;
  const isMouseDown = useRef<boolean>(false);

  const handleWheel = (e: React.WheelEvent) => {
    updateOnFocusByMousePosition(canvasWindow, e);
    const delta = new Matrix4();
    if (e.deltaY > 0) {
      delta.makeScale(0.9, 0.9, 1.0);
    } else if (e.deltaY < 0) {
      delta.makeScale(1.1, 1.1, 1.0);
    }
    updateMVPMatrix(canvasWindow, delta);
  };
  const handleMouseDown = (e: React.MouseEvent) => {
    isMouseDown.current = true;
  };
  const handleMouseUp = (e: React.MouseEvent) => {
    isMouseDown.current = false;
  };
  const handleMouseMove = (e: React.MouseEvent) => {};

  useEffect(() => {
    if (refCanvas.current == null) {
      console.error("Failed to get canvas ref.");
      return;
    }
    const canvas = refCanvas.current;
    canvas.setAttribute("width", `${window.innerWidth}`);
    canvas.setAttribute("height", `${window.innerHeight}`);

    const gl = refCanvas.current.getContext("webgl2");
    if (gl == null) {
      console.error("Failed to get GL context.");
      return;
    }
    DEFAULT_SHADERS.map((shaderStem) => {
      loadShader(gl, shaderStem);
    });

    if (gl == null) {
      return;
    }
    const render = () => {
      draw(gl);
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  }, []);

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
