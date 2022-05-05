import { UniformSchema } from "../../gl/types/schemas";
import { Widget } from "../types/widget";
import { ImageProperty, JsonSchema } from "../types/io";
import { DEFAULT_RENDER_MODE, DEFAULT_SHADERS } from "../constants";
import { Matrix4 } from "three";

export const loadJson = (inputFile: File) =>
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

export const convertJsonSchemaToWidget = (
  schema: JsonSchema,
  imageProperty: ImageProperty,
  mvpMats: { [key: string]: Matrix4 } = {},
  row: number = 0,
  col: number = 0
): Widget => {
  const shaderPath = DEFAULT_SHADERS[schema.partsType];
  const renderMode = schema.renderMode
    ? schema.renderMode
    : DEFAULT_RENDER_MODE[schema.partsType];

  switch (schema.partsType) {
    case "image" || "point" || "arrow":
      if (mvpMats["mvp"] == undefined) {
        mvpMats["mvp"] = new Matrix4();
      }
      break;
    case "line":
      if (mvpMats["mvp[0]"] == undefined) {
        mvpMats["mvp[0]"] = new Matrix4();
      }
      if (mvpMats["mvp[1]"] == undefined) {
        mvpMats["mvp[1]"] = new Matrix4();
      }
      break;
  }
  const scale = Math.max(imageProperty.width, imageProperty.height);
  const uniforms = getUniformSchema(mvpMats, scale);

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

export const getUniformSchema = (
  mvpMats: { [key: string]: Matrix4 },
  scale: number,
  uniforms: UniformSchema[] = []
): UniformSchema[] => {
  return [];
};
