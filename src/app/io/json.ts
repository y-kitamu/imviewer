import { UniformSchema } from "../../gl/types/schemas";
import { Widget } from "../types/window";
import { JsonSchema } from "../types/json";
import { DEFAULT_RENDER_MODE, DEFAULT_SHADERS } from "../constants";

export const loadJson = (inputFile: File) =>
  new Promise<Widget>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const text = event.target?.result;
      if (text == null) {
        return;
      }
      try {
        const json: JsonSchema = JSON.parse(text as string);
        resolve(convertJsonSchemaToWidget(json));
      } catch (e) {
        reject(e);
      }
    };
    reader.readAsText(inputFile);
  });

export const convertJsonSchemaToWidget = (schema: JsonSchema): Widget => {
  const shaderPath = DEFAULT_SHADERS[schema.partsType];
  const renderMode = schema.renderMode
    ? schema.renderMode
    : DEFAULT_RENDER_MODE[schema.partsType];

  const uniforms = [];
  switch (schema.partsType) {
    case "image" || "point" || "arrow":
      uniforms.push(getDefaultMVPMatSchema());
      break;
    case "point":
      uniforms.push(getDefaultMVPMatSchema("mvp[0]"));
      uniforms.push(getDefaultMVPMatSchema("mvp[1]"));
      break;
  }

  return {
    id: String(Math.random()),
    partsType: schema.partsType,
    renderMode,
    shaderPath,
    vertices: schema.datas,
    uniforms,
    textures: {},
  };
};

const getDefaultMVPMatSchema = (variableName = "mvp"): UniformSchema => {
  // prettier-ignore
  return {
    variableName,
    data: [
      1.0, 0.0, 0.0, 0.0,
      0.0, 1.0, 0.0, 0.0,
      0.0, 0.0, 1.0, 0.0,
    ]
  };
};
