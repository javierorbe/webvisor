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

import Shader from './Shader';
import Camera from '../scene/Camera';
import Light from '../scene/Light';

export default class StaticShader extends Shader {

  public loadViewMatrix(camera: Camera): void {
    this.setUniformMat4f('uViewMatrix', camera.createViewMatrix());
  }

  public loadLight(light: Light): void {
    this.setUniformVec3f('uLightPosition', light.getPosition());
    this.setUniformVec3f('uLightColor', light.getColor());
  }

  public loadShineVariables(damper: number, reflectivity: number) {
    this.setUniform1f('uShineDamper', damper);
    this.setUniform1f('uReflectivity', reflectivity);
  }
 }