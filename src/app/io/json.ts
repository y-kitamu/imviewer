import { WidgetSchema } from "../../gl/types/schemas";
import { DEFAULT_RENDER_MODE, DEFAULT_SHADERS } from "../constants";
import { JsonSchema, PartsType } from "../types/json";

export const loadJson = (inputFile: File) =>
  new Promise<{ [key: string]: any }>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const text = event.target?.result;
      if (text == null) {
        return;
      }
      try {
        resolve(JSON.parse(text as string));
      } catch (e) {
        reject(e);
      }
    };
    reader.readAsText(inputFile);
  });

export const convertJsonSchemaToWidget = (schema: JsonSchema): WidgetSchema => {
  const vertices = schema.datas;
  const shaderPath = DEFAULT_SHADERS[schema.partsType];
  const renderMode = schema.renderMode
    ? schema.renderMode
    : DEFAULT_RENDER_MODE[schema.partsType];
  const id = schema.partsType + shaderPath + renderMode;
};
