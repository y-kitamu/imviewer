import { Matrix4 } from "three";
import { SHADER_DIR } from "./constants";
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
import { _calcNumberOfVertices, _getRenderMode } from "./internal/utility";
import { _drawVertices, _prepareVertices } from "./internal/vertex";
import { Internal as Idrawable } from "./types/drawable";
import { WidgetSchema } from "./types/schemas";
import { Internal as Ishader } from "./types/shader";

// Internal states

const loadedImages = new (class {
  _images: { [fileBasename: string]: Ishader.TextureProperty } = {};
  has = (fileBasename: string) => fileBasename in this._images;
  get = (fileBasename: string) => this._images[fileBasename];
  add = (fileBasename: string, texture: Ishader.TextureProperty) => {
    this._images[fileBasename] = texture;
  };
  remove = (gl: WebGL2RenderingContext, fileBasename: string) => {
    gl.deleteTexture(this._images[fileBasename]);
    delete this._images[fileBasename];
  };
})();

const compiledShaders = new (class {
  _shaders: { [key: string]: Ishader.Shader } = {};
  has = (shaderStem: string) =>
    shaderStem.replace(SHADER_DIR, "") in this._shaders;
  get = (shaderStem: string) =>
    this._shaders[shaderStem.replace(SHADER_DIR, "")];
  add = (shaderStem: string, shader: Ishader.Shader) => {
    this._shaders[shaderStem.replace(SHADER_DIR, "")] = shader;
  };
})();

const drawables = new (class {
  _drawables: { [key: string]: Idrawable.Drawable } = {};
  has = (id: string) => id in this._drawables;
  add = (drawable: Idrawable.Drawable) => {
    this._drawables[drawable.widget.id] = drawable;
  };
  get = (id: string) => this._drawables[id];
  all = () => Object.keys(this._drawables);
  remove = (gl: WebGL2RenderingContext, id: string) => {
    gl.deleteBuffer(this._drawables[id].vertexBuffer);
    this._drawables[id]?.uniformBlockBuffers?.forEach((buffer) =>
      gl.deleteBuffer(buffer)
    );
    delete this._drawables[id];
  };
})();

// Interface to other libraries

/**
 * Parse and compile shader script.
 * Return sampler variables needed to create drawable.
 * @param gl
 * @param shaderPath stem of the shader scripts' path.
 * @returns {string[]} List of variable names of samplers defined in shader scripts.
 */
export const loadShader = (
  gl: WebGL2RenderingContext,
  shaderPath: string
): string[] => {
  console.log(`Start loading shader : ${shaderPath}`);
  const stem = shaderPath.replace(SHADER_DIR, "");
  if (compiledShaders.has(stem)) {
    return compiledShaders
      .get(stem)
      .property.samplers.map((sampler) => sampler.name);
  }
  const property = _parseShader(shaderPath);
  const program = _compileShader(gl, shaderPath);
  compiledShaders.add(stem, { property, program });
  const samplerNames = property.samplers.map((sampler) => sampler.name);
  console.log("Finish loading shader.");
  console.log(property);
  return samplerNames;
};

/**
 * Get sampler variable names in shader source code `shaderPath`.
 * @param shaderPath Target shader source path (exclude extension)
 * @returns (string[]) List of sampler variable names.
 */
export const getSamplerNames = (shaderPath: string): string[] => {
  const shader = compiledShaders.get(shaderPath);
  if (shader == undefined) {
    const property = _parseShader(shaderPath);
    console.log(`Can not find shader : ${shaderPath}`);
    return property.samplers.map((sampler) => sampler.name);
  }
  return shader.property.samplers.map((sampler) => sampler.name);
};

/**
 */
export const isImageLoaded = (fileBasename: string) => {
  return loadedImages.has(fileBasename);
};

/**
 * Create texture (load image data to gpu) and register to `loadedImages`.
 * @param gl
 * @param fileBasename Basename of the image file
 * @param image
 */
export const loadImage = (
  gl: WebGL2RenderingContext,
  fileBasename: string,
  image: HTMLImageElement
) => {
  if (loadedImages.has(fileBasename)) {
    return;
  }
  const texture = _prepareTexture(gl, image);
  loadedImages.add(fileBasename, texture);
  console.log(`add image : basename = ${fileBasename},`);
  console.log(texture);
};

/**
 * Create drawable (which contains everything needed for draw-call) and register to `drawables`.
 * @param gl
 * @param widget
 * @param textures  key: variable name, value : file basename
 */
export const createDrawable = (
  gl: WebGL2RenderingContext,
  widget: WidgetSchema,
  textures: { [key: string]: string | undefined }
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
  const numVertex = _calcNumberOfVertices(
    shader.property.vertices[0],
    widget.vertices
  );
  const vertexBuffer = _prepareVertices(
    gl,
    widget.vertices,
    shader.property.vertices
  );
  const drawable: Idrawable.Drawable = {
    widget,
    shader,
    numVertex,
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
  console.log("create drawable : ");
  console.log(drawable);
};

/**
 * Remove drawable of id = `widgetId` from current drawables.
 * @param gl
 * @param widgetId
 */
export const removeDrawable = (
  gl: WebGL2RenderingContext,
  widgetId: string
) => {
  if (drawables.has(widgetId)) {
    drawables.remove(gl, widgetId);
  }
};

/**
 * Draw all objects registered in `drawables`.
 * @param gl
 */
export const draw = (gl: WebGL2RenderingContext) => {
  gl.clearColor(0, 0, 0, 0);
  for (const key of drawables.all()) {
    const drawable = drawables.get(key);
    gl.useProgram(drawable.shader.program);

    const property = drawable.shader.property;
    _drawVertices(gl, property.vertices, drawable.vertexBuffer);
    if (drawable.widget.uniforms != undefined) {
      _drawUniformVariables(
        gl,
        drawable.shader.program,
        drawable.widget.uniforms,
        property.uniforms
      );
    } else if (property.uniforms.length > 0) {
      throw new Error(
        `Uniform variables are empty : widget.id = ${drawable.widget.id}`
      );
    }

    if (drawable.uniformBlockBuffers) {
      _drawUniformBlocks(
        gl,
        property.uniformBlocks,
        drawable.uniformBlockBuffers
      );
    }
    const textures = [];
    for (const key in drawable.textures) {
      const fileBasename = drawable.textures[key];
      if (fileBasename != undefined && loadedImages.has(fileBasename)) {
        textures.push(loadedImages.get(fileBasename));
      }
    }
    _drawTexture(gl, textures);
    const renderMode = _getRenderMode(gl, drawable.widget.renderMode);
    gl.drawArrays(renderMode, 0, drawable.numVertex);

    gl.useProgram(null);
  }
};
