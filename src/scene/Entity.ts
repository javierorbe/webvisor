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

import { vec3 } from "gl-matrix";
import TexturedModel from "../models/TexturedModel";

export default class Entity {

  constructor(
    private readonly model: TexturedModel,
    private readonly position: vec3,
    private readonly rotation: vec3,
    private readonly scale: number
    ) {}

  public getModel(): TexturedModel {
    return this.model;
  }

  public getPosition(): vec3 {
    return this.position;
  }

  public setPosition(x: number, y: number, z: number): void {
    vec3.set(this.position, x, y, z)
  }

  public increasePosition(dx: number, dy: number, dz: number): void {
    vec3.add(this.position, this.position, vec3.fromValues(dx, dy, dz));
  }

  public getRotation(): vec3 {
    return this.rotation;
  }

  public setRotation(x: number, y: number, z: number): void {
    vec3.set(this.rotation, x, y, z)
  }

  public increaseRotation(dx: number, dy: number, dz: number): void {
    vec3.add(this.rotation, this.rotation, vec3.fromValues(dx, dy, dz));
  }

  public getScale(): number {
    return this.scale;
  }
}