import { Matrix4 } from "three";
import { getSamplerNames } from "../gl/gl";
import { UniformSchema, VertexSchema } from "../gl/types/schemas";
import { Widget } from "../app/types/widget";
import { ImageProperty } from "./types/io";
import { DEFAULT_SHADERS } from "./constants";

export const getDefaultImageWidget = (
  shader: string = DEFAULT_SHADERS.image,
  row: number = 0,
  col: number = 0
): Widget => {
  const imageProperty: ImageProperty = {
    fileBasename: "",
    width: 1.0,
    height: 1.0,
  };

  const coords: CoordinateParams = {
    scale: 1.0,
    mvpMat: new Matrix4(),
  };

  const textures: { [key: string]: string | undefined } = {};
  const keys = getSamplerNames(shader);
  for (const key of keys) {
    if (!(key in textures)) {
      textures[key] = undefined;
    }
  }

  return {
    id: String(Math.random()),
    row,
    col,
    shaderPath: shader,
    renderMode: "TRIANGLE_STRIP",
    partsType: "image",
    textures,
    vertices: getImageVertices(imageProperty),
    uniforms: getImageUniforms(imageProperty, mvpMat),
    coords,
  };
};

export const getImageVertices = (
  imageProperty: ImageProperty
): VertexSchema[] => {
  const { width, height } = imageProperty;
  // prettier-ignore
  return [
      {
        variableName: "aPos",
        data: [
          -width, height, 0.0,
          -width, -height, 0.0,
          width, height, 0.0,
          width, -height, 0.0],
      },
      {
        variableName: "aTexCoord",
        data: [0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0],
      },
  ];
};

export const getImageUniforms = (
  imageProperty: ImageProperty,
  mvpMat: Matrix4 = new Matrix4()
): UniformSchema[] => {
  const { width, height } = imageProperty;
  return [
    {
      variableName: "scale",
      data: [Math.max(width, height)],
    },
    {
      variableName: "mvp",
      data: mvpMat.elements,
    },
  ];
};
