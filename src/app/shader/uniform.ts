import { PartsType, UniformSchema } from "../../gl/types/schemas";
import { CanvasWindow } from "../types/window";
import { Widget } from "../types/widget";

export const updateUniforms = (canvasWindow: CanvasWindow) => {
  const updateUniform = (widget: Widget, uniforms: UniformSchema[]) => {
    const targetNames = uniforms.map((uni) => uni.variableName);
    widget.uniforms = widget.uniforms?.filter(
      (uni) => !targetNames.includes(uni.variableName)
    );
    widget.uniforms?.push(...uniforms);
  };

  let uniforms: UniformSchema[] = [];
  canvasWindow.widgets.map((widget) => {
    switch (widget.partsType) {
      case "image":
      case "point":
        uniforms = updateSimpleUniforms(
          canvasWindow,
          widget.row[0],
          widget.col[0]
        );
        updateUniform(widget, uniforms);
        break;
      case "line":
        uniforms = updateSimpleLineUniforms(
          canvasWindow,
          widget.row,
          widget.col
        );
        updateUniform(widget, uniforms);
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
      variableName: "minPos[0]",
      data: [left, bottom],
    },
    {
      variableName: "maxPos[0]",
      data: [right, top],
    },
  ];
};

const updateSimpleLineUniforms = (
  canvasWindow: CanvasWindow,
  rows: number[],
  cols: number[]
): UniformSchema[] => {
  return rows
    .map((row, idx) => {
      return updateSimpleUniforms(canvasWindow, row, cols[idx]).map(
        (schema) => {
          schema.variableName = `${schema.variableName}[${idx}]`;
          return schema;
        }
      );
    })
    .flat();
};
