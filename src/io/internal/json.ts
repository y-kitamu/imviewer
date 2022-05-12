import { Matrix4 } from "three";
import { Widget } from "../../app/types/widget";
import { JsonSchema } from "../types/io";
import {
  DEFAULT_RENDER_MODE,
  DEFAULT_SHADERS,
  MVP_VARNAME,
} from "../constants";

export const _convertJsonSchemaToWidget = (
  schema: JsonSchema,
  row: number | number[],
  col: number | number[],
  mvpMats: { [key: string]: Matrix4 },
  uniforms: { variableName: string; data: number[] }[] = []
): Widget => {
  if (typeof row == "number") {
    row = [row];
  }
  if (typeof col == "number") {
    col = [col];
  }

  uniforms.push(
    ...Object.keys(mvpMats).map((key) => {
      return {
        variableName: key,
        data: mvpMats![key].elements,
      };
    })
  );
  const id = schema.schemaId
    ? `${schema.schemaId + String(Math.random())}`
    : String(Math.random());

  return {
    id,
    renderMode: schema.renderMode || DEFAULT_RENDER_MODE[schema.partsType],
    shaderPath: DEFAULT_SHADERS[schema.partsType],
    vertices: schema.datas,
    uniforms,
    partsType: schema.partsType,
    row: row,
    col: col,
    mvpMats,
    textures: {},
  };
};

export const _convertJsonSchemaToLine = (
  schema: JsonSchema,
  row: number[],
  col: number[],
  mvpMatsArr: { [key: string]: Matrix4 }[]
): Widget => {
  if (row.length < 2 || col.length < 2 || mvpMatsArr.length < 2) {
    throw new Error(
      "Invalid argument : length of `row`, `col` and `mvpMatsArr`" +
        " must be equal or greater than 2."
    );
  }
  const mvpMats = {
    [MVP_VARNAME + "[0]"]: mvpMatsArr[0][MVP_VARNAME],
    [MVP_VARNAME + "[1]"]: mvpMatsArr[1][MVP_VARNAME],
  };
  return _convertJsonSchemaToWidget(schema, row, col, mvpMats);
};
