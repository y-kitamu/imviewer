import { Internal } from "../types/shader";

const textureIndex = new (class {
  _index = 0;
  get = () => this._index;
  update = () => this._index++;
})();

export const _prepareTexture = (
  gl: WebGL2RenderingContext,
  image: HTMLImageElement
): Internal.TextureProperty => {
  const textureEnum = `TEXTURE${textureIndex.get()}`;
  if (!(textureEnum in WebGL2RenderingContext)) {
    throw new Error(`Invalid textureId = ${textureEnum}`);
  }
  const textureId = gl[textureEnum as keyof WebGL2RenderingContext] as number;
  gl.activeTexture(textureId);
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
  return {
    id: textureId,
    obj: texture,
  };
};

export const _drawTexture = (
  gl: WebGL2RenderingContext,
  textures: Internal.TextureProperty[]
) => {
  for (const texture of textures) {
    gl.activeTexture(texture.id);
    gl.bindTexture(gl.TEXTURE_2D, texture.obj);
  }
};
