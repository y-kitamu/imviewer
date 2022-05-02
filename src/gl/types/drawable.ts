import { WidgetSchema } from "./schemas";
import { Internal as shader } from "./shader";

export namespace Internal {
  export type Drawable = {
    widget: WidgetSchema;
    shader: shader.Shader;
    numVertex: number;
    vertexBuffer: WebGLBuffer;
    uniformBlockBuffers?: WebGLBuffer[];
    textures: { [key: string]: string }; // key : filePath, value: variable name
  };
}
