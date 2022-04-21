export const drawGL = (canvas: HTMLCanvasElement) => {
  const gl = canvas?.getContext("webgl");
  if (!gl) {
    console.log("WebGL unavailable");
    return;
  }

  const array = [];
};
