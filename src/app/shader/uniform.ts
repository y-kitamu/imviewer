import { PartsType, UniformSchema } from "../../gl/types/schemas";
import { CanvasWindow } from "../types/window";

export const updateUniforms = (canvasWindow: CanvasWindow) => {
  canvasWindow.widgets.map((widget) => {
    switch (widget.partsType) {
      case "image":
      case "point":
        const uniforms = updateSimpleUniforms(
          canvasWindow,
          widget.row[0],
          widget.col[0]
        );
        const targetNames = uniforms.map((uni) => uni.variableName);
        widget.uniforms = widget.uniforms?.filter(
          (uni) => !targetNames.includes(uni.variableName)
        );
        widget.uniforms?.push(...uniforms);
        break;
      case "line":
        break;
    }
  });
  return [];
};

const updateSimpleUniforms = (
  canvasWindow: CanvasWindow,
  row: number,
  col: number
): UniformSchema[] => {
  const { nrows, ncols } = canvasWindow;

  const left = (2.0 * col) / ncols - 1.0;
  const right = (2.0 * (col + 1)) / ncols - 1.0;
  const top = 1.0 - (2.0 * row) / nrows;
  const bottom = 1.0 - (2.0 * (row + 1)) / nrows;

  return [
    {
      variableName: "minPos",
      data: [left, bottom],
    },
    {
      variableName: "maxPos",
      data: [right, top],
    },
  ];
};
