import { _compileShader } from "./internal/compiler";
import { _parseShader } from "./internal/parser";
import { _drawTexture, _prepareTexture } from "./internal/texture";
import {
  _drawUniformVariables,
  _prepareUniformVariables,
} from "./internal/uniform";
import {
  _drawUniformBlocks,
  _prepareUniformBlocks,
} from "./internal/uniformBlock";
import { _drawVertices, _prepareVertices } from "./internal/vertex";
import { Drawable } from "./types/drawable";
import { WidgetSchema } from "./types/schemas";
import { Shader } from "./types/shader";

const loadedImages = new (class {
  _images: { [filePath: string]: WebGLTexture } = {};
  has = (filePath: string) => filePath in this._images;
  get = (filePath: string) => this._images[filePath];
  add = (filePath: string, texture: WebGLTexture) => {
    this._images[filePath] = texture;
  };
  remove = (gl: WebGL2RenderingContext, filePath: string) => {
    gl.deleteTexture(this._images[filePath]);
    delete this._images[filePath];
  };
})();

const compiledShaders = new (class {
  _shaders: { [key: string]: Shader } = {};
  has = (shaderPath: string) => shaderPath in this._shaders;
  get = (shaderPath: string) => this._shaders[shaderPath];
  add = (shaderPath: string, shader: Shader) => {
    this._shaders[shaderPath] = shader;
  };
})();

const drawables = new (class {
  _drawables: { [key: string]: Drawable } = {};
  has = (id: string) => id in this._drawables;
  add = (drawable: Drawable) => {
    this._drawables[drawable.widget.id] = drawable;
  };
  get = (id: string) => this._drawables[id];
  all = () => this._drawables;
  remove = (gl: WebGL2RenderingContext, id: string) => {
    gl.deleteBuffer(this._drawables[id].vertexBuffer);
    this._drawables[id]?.uniformBlockBuffers?.forEach((buffer) =>
      gl.deleteBuffer(buffer)
    );
    delete this._drawables[id];
  };
})();

export const loadShader = (gl: WebGL2RenderingContext, shaderPath: string) => {
  const property = _parseShader(shaderPath);
  const program = _compileShader(gl, shaderPath);
  compiledShaders.add(shaderPath, { property, program });
};

export const loadImage = (
  gl: WebGL2RenderingContext,
  filePath: string,
  image: HTMLImageElement
) => {
  if (loadedImages.has(filePath)) {
    return;
  }
  const texture = _prepareTexture(gl, image);
  loadedImages.add(filePath, texture);
};

export const createDrawable = (
  gl: WebGL2RenderingContext,
  widget: WidgetSchema,
  textures: { [key: string]: string } // key : filePath, value: variable name
) => {
  if (!compiledShaders.has(widget.shaderPath)) {
    throw new Error(`Compiled shader is not found : ${widget.shaderPath}`);
  }
  if (widget.vertices == undefined) {
    throw new Error(`Vertices is empty at widget : ${widget.id}`);
  }
  if (drawables.has(widget.id)) {
    return;
  }

  const shader = compiledShaders.get(widget.shaderPath);
  const vertexBuffer = _prepareVertices(
    gl,
    widget.vertices,
    shader.property.vertices
  );
  const drawable: Drawable = {
    widget,
    shader,
    vertexBuffer,
    textures,
  };
  if (widget.uniforms != undefined) {
    _prepareUniformVariables(gl, widget.uniforms, shader.property.uniforms);
  }
  if (widget.unifromBlocks != undefined) {
    drawable.uniformBlockBuffers = _prepareUniformBlocks(
      gl,
      widget.unifromBlocks,
      shader.property.uniformBlocks
    );
  }
  drawables.add(drawable);
};

export const draw = (gl: WebGL2RenderingContext) => {
  for (const key in drawables.all()) {
    const drawable = drawables.get(key);
    const property = drawable.shader.property;
    _drawVertices(gl, property.vertices, drawable.vertexBuffer);
    if (drawable.widget.uniforms != undefined) {
      _drawUniformVariables(gl, drawable.widget.uniforms, property.uniforms);
    }
    if (drawable.widget.unifromBlocks) {
      _drawUniformBlocks(
        gl,
        drawable.widget.unifromBlocks,
        property.uniformBlocks
      );
    }
    _drawTexture(gl, property.samplers, drawable.textures);
  }
};
