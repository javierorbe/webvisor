/**
 * @license
 * Copyright (c) 2018 Javier Orbe
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { vec3, mat4 } from 'gl-matrix';

export function isPowerOf2(value: number): boolean {
  return (value & (value - 1)) == 0;
}

export function toRadians(degrees: number): number {
  return degrees * Math.PI / 180;
}

export function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

/**
 * 
 * @param translation 
 * @param rx the angle in radians to rotate around the X axis.
 * @param ry the angle in radians to rotate around the Y axis.
 * @param rz the angle in radians to rotate around the Z axis.
 * @param scale 
 */
export function createTransformationMatrix(translation: vec3, rotation: vec3, scale: number) {
  const matrix = mat4.create(); // identity matrix

  mat4.translate(matrix, matrix, translation);

  mat4.rotate(matrix, matrix, rotation[0], vec3.fromValues(1, 0, 0));
  mat4.rotate(matrix, matrix, rotation[1], vec3.fromValues(0, 1, 0));
  mat4.rotate(matrix, matrix, rotation[2], vec3.fromValues(0, 0, 1));
  
  mat4.scale(matrix, matrix, vec3.fromValues(scale, scale, scale));

  return matrix;
}


