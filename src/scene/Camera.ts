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
import Keyboard from '../input/Keyboard';
import { toRadians } from '../math/MathUtils';

export default class Camera {
  
  private static readonly CAMERA_VELOCITY = 0.05;

  private position: vec3 = vec3.fromValues(0, 0, 0);
  private pitch: number = 0;
  private yaw: number = 0;
  private roll: number = 0;

  public move(): void {
    if (Keyboard.isPressed('KeyW')) { // Forward
      vec3.add(this.position, this.position, vec3.fromValues(0, 0, -Camera.CAMERA_VELOCITY));
    }
    if (Keyboard.isPressed('KeyS')) { // Backward
      vec3.add(this.position, this.position, vec3.fromValues(0, 0, Camera.CAMERA_VELOCITY));
    }
    if (Keyboard.isPressed('KeyA')) { // Left
      vec3.add(this.position, this.position, vec3.fromValues(-Camera.CAMERA_VELOCITY, 0, 0));
    }
    if (Keyboard.isPressed('KeyD')) { // Right
      vec3.add(this.position, this.position, vec3.fromValues(Camera.CAMERA_VELOCITY, 0, 0));
    }
    if (Keyboard.isPressed('Space')) { // Up
      vec3.add(this.position, this.position, vec3.fromValues(0, Camera.CAMERA_VELOCITY, 0));
    }
    if (Keyboard.isPressed('ShiftLeft')) { // Down
      vec3.add(this.position, this.position, vec3.fromValues(0, -Camera.CAMERA_VELOCITY, 0));
    }
  }

  public createViewMatrix(): mat4 {
    const matrix = mat4.create();

    mat4.rotate(matrix, matrix, toRadians(this.pitch), [1, 0, 0]);
    mat4.rotate(matrix, matrix, toRadians(this.yaw), [0, 1, 0]);
    mat4.rotate(matrix, matrix, toRadians(this.roll), [0, 0, 1]);

    const negativePos = vec3.fromValues(-this.position[0], -this.position[1], -this.position[2]);
    mat4.translate(matrix, matrix, negativePos);

    return matrix;
  }
}
