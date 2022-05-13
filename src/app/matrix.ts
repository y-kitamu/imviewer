/**
 * Matrix operations
 */

import { Matrix4 } from "three";

/**
 * Create scale matrix
 * @param scaleX Scale factor of x-axis.
 * @param scaleY Scale factor of y-axis.
 * @param centerX Center of the scaling. Unit :  pixel. (left, top) = (0, 0)
 * @param centerY Center of the scaling. Unit :  pixel. (left, top) = (0, 0)
 */
export const scale = (
  scaleX: number,
  scaleY: number,
  centerX: number,
  centerY: number
): Matrix4 => {
  centerX -= window.innerWidth / 2.0;
  centerY -= window.innerHeight / 2.0;
  const pre = shift(-centerX, centerY);
  const post = shift(centerX, -centerY);
  const scale = new Matrix4();
  // prettier-ignore
  scale.set(scaleX, 0.0, 0.0, 0.0,
          0.0, scaleY, 0.0, 0.0,
          0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0);
  return post.multiply(scale.multiply(pre));
};

/**
 * @param deltaX Shift amount in x direction. (unit: Pixel)
 * @param deltaY shift amount in y direction. (unit: Pixel)
 */
export const shift = (deltaX: number, deltaY: number): Matrix4 => {
  const dx = (2.0 * deltaX) / window.innerWidth;
  const dy = (2.0 * deltaY) / window.innerHeight;
  const mat = new Matrix4();
  // prettier-ignore
  mat.set(1.0, 0.0, 0.0, dx,
          0.0, 1.0, 0.0, dy,
          0.0, 0.0, 1.0, 0.0,
          0.0, 0.0, 0.0, 1.0);
  return mat;
};
