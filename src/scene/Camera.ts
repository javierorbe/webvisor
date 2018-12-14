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
import SmoothNumber from '../math/SmoothNumber';
import { toRadians } from '../math/MathUtils';

export default abstract class Camera {

  protected readonly position: vec3 = vec3.fromValues(0, 0, 0); // x, y, z
  protected readonly rotation: vec3 = vec3.fromValues(0, 0, 0); // pitch, yaw, roll 

  public constructor(private readonly fov: number, private readonly aspectRatio, private readonly nearPlane: number, private readonly farPlane: number, protected readonly angleAroundOrigin: SmoothNumber, protected readonly distanceFromOrigin: SmoothNumber) {}

  public getFov(): number {
    return this.fov;
  }

  public getPosition(): vec3 {
    return this.position;
  }

  public setPosition(x: number, y: number, z: number): void {
    vec3.set(this.position, x, y, z);
  }

  public getPitch(): number {
    return this.rotation[0];
  }

  public getYaw(): number {
    return this.rotation[1];
  }

  public getRoll(): number {
    return this.rotation[2];
  }

  public abstract update(): void;

  public abstract calculateZoom(): void;

  public createViewMatrix(): mat4 {
    const matrix = mat4.create();

    mat4.rotate(matrix, matrix, toRadians(this.rotation[0]), [1, 0, 0]);
    mat4.rotate(matrix, matrix, toRadians(this.rotation[1]), [0, 1, 0]);
    mat4.rotate(matrix, matrix, toRadians(this.rotation[2]), [0, 0, 1]);

    const negativePos = vec3.fromValues(-this.position[0], -this.position[1], -this.position[2]);
    mat4.translate(matrix, matrix, negativePos);

    return matrix;
  }

  public createProjectionMatrix(): mat4 {
    return mat4.perspective(
      mat4.create(),
        toRadians(this.fov),
        this.aspectRatio, // aspect ratio
        this.nearPlane,
        this.farPlane
      );
  }
}
