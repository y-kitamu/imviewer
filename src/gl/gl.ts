import { CanvasWindow } from "../types/window";
import { Drawable } from "../types/drawable";
import { SimpleImageShader } from "./simple_image_shader";

export const SHADERS = {
  simple_image: SimpleImageShader,
};

export const drawGL = (
  canvas: HTMLCanvasElement,
  canvasWindow: CanvasWindow
) => {
  const gl = canvas?.getContext("webgl2");
  if (!gl) {
    console.log("WebGL unavailable");
    return;
  }

  const windowsDrawables: (Drawable | undefined)[][][] =
    canvasWindow.widgets.map((rowWidgets) =>
      rowWidgets.map((widgets) =>
        widgets.map((widget) => {
          const program = compileShader(gl, widget.shader.shaderPath);
          if (program == undefined) {
            return;
          }
          const abuf = widget.shader.arrayBuffer;
          return {
            widget: widget,
            program: program,
            buffers: abuf.prepareBuffer(gl, widget),
            textures: abuf.prepareTexture
              ? abuf.prepareTexture(gl, widget)
              : [],
            ubuffers: widget.shader.uniformBuffer.prepareBuffer(
              gl,
              program,
              widget
            ),
          };
        })
      )
    );

  const render = () => {
    gl.clearColor(0, 0, 0, 0);

    windowsDrawables.forEach((rowDrawables) => {
      rowDrawables.forEach((drawables) => {
        drawables.forEach((drawable) => {
          if (drawable == undefined) {
            return;
          }
          const { widget, program, buffers, textures, ubuffers } = drawable;
          // bind buffers
          widget.shader.arrayBuffer.drawBuffer(gl, buffers, textures);
          widget.shader.uniformBuffer.updateBuffer(gl, widget, ubuffers);
          widget.shader.uniformBuffer.drawBuffer(gl, ubuffers);
          gl.useProgram(program);
          // draw
          gl.drawArrays(widget.renderMode, 0, widget.numVertex);
          // post process
          widget.shader.arrayBuffer.unbind(gl);
          gl.useProgram(null);
        });
      });
    });
    requestAnimationFrame(render);
  };
  requestAnimationFrame(render);
};

const compileShader = (
  gl: WebGL2RenderingContext,
  shaderPath: string
): WebGLProgram | undefined => {
  const createShader = (
    shaderType: number,
    shaderSource: string
  ): WebGLShader | undefined => {
    const shader = gl.createShader(shaderType);
    if (!shader) {
      console.log("Failed to create shader");
      return;
    }
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert(
        "An error occurred compiling the shaders : " +
          gl.getShaderInfoLog(shader)
      );
      gl.deleteShader(shader);
      return;
    }
    return shader;
  };

  const vertShaderSource = require(`${shaderPath}.vert`);
  const fragShaderSource = require(`${shaderPath}.frag`);
  const vertexShader = createShader(gl.VERTEX_SHADER, vertShaderSource);
  if (!vertexShader) {
    return;
  }
  const fragShader = createShader(gl.FRAGMENT_SHADER, fragShaderSource);
  if (!fragShader) {
    gl.deleteShader(vertexShader);
    return;
  }
  const program = gl.createProgram();
  if (!program) {
    console.log("Failed to create gl program.");
    return;
  }
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragShader);
  gl.linkProgram(program);
  return program;
};
