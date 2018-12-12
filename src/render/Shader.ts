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

import { mat4 } from 'gl-matrix';
import Renderer from './Renderer';

export default class Shader {
  
  private readonly gl: WebGL2RenderingContext;
  private id: WebGLProgram = null;
  private readonly uniformLocationCache: Map<string, WebGLUniformLocation> = new Map();

  constructor(renderer: Renderer) {
    this.gl = renderer.getRenderingContext();
  }

  /**
   * Parse the shader programs from files.
   * 
   * @param vsFilepath vertex shader filepath.
   * @param fsFilepath fragment shader filepath.
   * @returns shader loading Promise.
   */
  public async parseShader(vsFilepath: string, fsFilepath: string): Promise<void> {
    let vsSource: string;
    let fsSource: string;

    return Promise.all([
        fetch(vsFilepath).then(res => res.text().then(txt => vsSource = txt)),
        fetch(fsFilepath).then(res => res.text().then(txt => fsSource = txt))
      ]
    ).then(() => {
      this.id = this.initShaderProgram(vsSource, fsSource);
    });
  }

  /**
   * Initialize a shader program, so WebGL knows how to draw our data.
   * 
   * @param vsSource the vertex shader source code.
   * @param fsSource the fragment shader source code.
   */
  private initShaderProgram(vsSource: string, fsSource: string): WebGLProgram {
    const vertexShader = this.loadShader(this.gl.VERTEX_SHADER, vsSource);
    const fragmentShader = this.loadShader(this.gl.FRAGMENT_SHADER, fsSource);
    
    // Create the shader program
    const shaderProgram: WebGLProgram = this.gl.createProgram();
    this.gl.attachShader(shaderProgram, vertexShader);
    this.gl.attachShader(shaderProgram, fragmentShader);
    this.gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert
    if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
      console.log('Unable to initialize the shader program: ' + this.gl.getProgramInfoLog(shaderProgram));
      return null;
    }

    return shaderProgram;
  }

  /**
   * Creates a shader of the given type, uploads the source and compiles it.
   * @param type - Shader type.
   * @param source - Source code.
   */
   private loadShader(type: GLenum, source: string): WebGLShader {
    const shader = this.gl.createShader(type);

    // Send the source to the shader object
    this.gl.shaderSource(shader, source);

    // Compile the shader program
    this.gl.compileShader(shader);

    // See if it compiled successfully
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.log('An error occurred compiling the shaders: ' + this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  public bind(): void {
    this.gl.useProgram(this.id);
  }

  public unbind(): void {
    this.gl.useProgram(null);
  }

  public clean(): void {
    this.gl.deleteProgram(this.id);
  }

  /**
   * Set a uniform to an integer value.
   * 
   * @param name the uniform name.
   * @param value the value.
   */
  public setUniform1i(name: string, value: number): void {
    this.gl.uniform1i(this.getUniformLocation(name), value);
  }

  /**
   * Set a uniform to a float value.
   * 
   * @param name the uniform name.
   * @param value the value.
   */
  public setUniform1f(name: string, value: number): void {
    this.gl.uniform1f(this.getUniformLocation(name), value);
  }

  /**
   * Set a uniform to a float vector of size 4.
   * 
   * @param name the uniform name.
   * @param x the first value of the vector.
   * @param y the second value of the vector.
   * @param z the third value of the vector.
   * @param w the fourth value of the vector.
   */
  public setUniform4f(name: string, x: number, y: number, z: number, w: number): void {
    this.gl.uniform4f(this.getUniformLocation(name), x, y, z, w);
  }

  /**
   * Set a uniform to a matrix.
   *
   * @param name the uniform name.
   * @param matrix the matrix.
   */
  public setUniformMat4f(name: string, matrix: mat4): void {
    this.gl.uniformMatrix4fv(this.getUniformLocation(name), false, matrix);
  }

  /**
   * Returns the uniform location of an specified uniform.
   * The location is retrieved from the cache if it is stored,
   * otherwise it is obtained from WebGL and then cached.
   *
   * @param name the uniform name.
   * @returns the uniform location.
   */
  private getUniformLocation(name: string): WebGLUniformLocation {
    if (this.uniformLocationCache.has(name)) {
      return this.uniformLocationCache.get(name);
    }

    const location = this.gl.getUniformLocation(this.id, name);
    if (location === -1) {
      console.log(`Warning: uniform '${name}' doesn't exist!`);
    }

    this.uniformLocationCache.set(name, location);
    return location;
  }
}