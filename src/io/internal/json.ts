import { Matrix4 } from "three";
import { UniformSchema } from "../../gl/types/schemas";
import { Widget } from "../../app/types/widget";
import { ImageProperty, JsonSchema } from "../types/io";
import {
  DEFAULT_RENDER_MODE,
  DEFAULT_SHADERS,
  MVP_VARNAME,
  SCALE_VARNAME,
} from "../constants";

export const _loadJson = (inputFile: File) =>
  new Promise<JsonSchema[]>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const text = event.target?.result;
      if (text == null) {
        return;
      }
      try {
        let json: JsonSchema | JsonSchema[] = JSON.parse(text as string);
        if (!Array.isArray(json)) {
          json = [json];
        }
        resolve(json);
      } catch (e) {
        reject(e);
      }
    };
    reader.readAsText(inputFile);
  });

export const _convertJsonSchemaToPoint = (
  schema: JsonSchema,
  imageProperty: ImageProperty,
  row: number,
  col: number,
  scale?: { [key: string]: number },
  mvpMats?: { [key: string]: Matrix4 }
): Widget => {
  const shaderPath = DEFAULT_SHADERS[schema.partsType];
  const renderMode = schema.renderMode
    ? schema.renderMode
    : DEFAULT_RENDER_MODE[schema.partsType];

  if (mvpMats == undefined) {
    mvpMats = { [MVP_VARNAME]: new Matrix4() };
  }
  if (scale == undefined) {
    scale = {
      [SCALE_VARNAME]: Math.max(imageProperty.width, imageProperty.height),
    };
  }
  const uniforms = _getUniformSchema(mvpMats, scale);
  return {
    id: String(Math.random()),
    renderMode,
    shaderPath,
    vertices: schema.datas,
    uniforms,
    partsType: schema.partsType,
    row: [row],
    col: [col],
    scale,
    mvpMats,
    textures: {},
  };
};

export const _convertJsonSchemaToLine = (
  schema: JsonSchema,
  row: number[],
  col: number[],
  scaleArr: { [key: string]: number }[],
  mvpMatsArr: { [key: string]: Matrix4 }[]
): Widget => {
  if (
    row.length < 2 ||
    col.length < 2 ||
    scaleArr.length < 2 ||
    mvpMatsArr.length < 2
  ) {
    throw new Error(
      "Invalid argument : length of `row`, `col`, `scaleArr` and `mvpMatsArr`" +
        " must be equal or greater than 2."
    );
  }

  const shaderPath = DEFAULT_SHADERS[schema.partsType];
  const renderMode = schema.renderMode
    ? schema.renderMode
    : DEFAULT_RENDER_MODE[schema.partsType];

  const mvpMats = {
    [MVP_VARNAME + "[0]"]: mvpMatsArr[0][MVP_VARNAME],
    [MVP_VARNAME + "[1]"]: mvpMatsArr[1][MVP_VARNAME],
  };
  const scale = {
    [SCALE_VARNAME + "[0]"]: scaleArr[0][SCALE_VARNAME],
    [SCALE_VARNAME + "[1]"]: scaleArr[1][SCALE_VARNAME],
  };
  const uniforms = _getUniformSchema(mvpMats, scale);

  return {
    id: String(Math.random()),
    renderMode,
    shaderPath,
    vertices: schema.datas,
    uniforms,
    partsType: schema.partsType,
    row,
    col,
    scale,
    mvpMats,
    textures: {},
  };
};

export const _getUniformSchema = (
  mvpMats: { [key: string]: Matrix4 },
  scale: { [key: string]: number },
  uniforms: UniformSchema[] = []
): UniformSchema[] => {
  uniforms = uniforms.filter((uniform) => {
    return !(uniform.variableName in mvpMats || uniform.variableName in scale);
  });
  for (const key in mvpMats) {
    uniforms.push({
      variableName: key,
      data: mvpMats[key].elements,
    });
  }
  for (const key in scale) {
    uniforms.push({
      variableName: key,
      data: [scale[key]],
    });
  }
  return uniforms;
};
