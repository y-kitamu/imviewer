import { SamplerProperty } from "../types/shader";

export const _prepareTexture = (
  gl: WebGL2RenderingContext,
  image: HTMLImageElement
) => {
  const texture = gl.createTexture();
  if (texture == null) {
    throw new Error("Failed to create texture");
  }
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MIN_FILTER,
    gl.LINEAR_MIPMAP_NEAREST
  );
  gl.generateMipmap(gl.TEXTURE_2D);
  return texture;
};

export const _drawTexture = (
  gl: WebGL2RenderingContext,
  samplerProperties: SamplerProperty[],
  textures: { [key: string]: WebGLTexture }
) => {
  if (samplerProperties.length != textures.length) {
    throw new Error(
      `Assertion failed (number of texture) : ${samplerProperties.length} != ${textures.length}`
    );
  }
  for (let i = 0; i < samplerProperties.length; i++) {
    const sampler = samplerProperties[i];
    gl.activeTexture(sampler.location);
    gl.bindTexture(gl.TEXTURE_2D, textures[i]);
  }
};
