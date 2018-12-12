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

import VertexArray from './VertexArray';
import IndexBuffer from './IndexBuffer';
import Shader from './Shader';

export default class Renderer {
  
  public constructor(private readonly gl: WebGL2RenderingContext) {}

  public getRenderingContext(): WebGL2RenderingContext {
    return this.gl;
  }

  /**
   * Draw triangle based data via WebGL.
   * @param {VertexArray} va - VertexArray to bind.
   * @param {IndexBuffer} ib - IndexBuffer to bind.
   * @param {Shader} shader - Shader program to bind.
   */
  public draw(va: VertexArray, ib: IndexBuffer, shader: Shader): void {
    shader.bind();
    va.bind();
    ib.bind();
    this.gl.drawElements(this.gl.TRIANGLES, ib.getCount(), this.gl.UNSIGNED_INT, 0);
  }

  public enableCulling(): void {
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.cullFace(this.gl.BACK);
  }

  public disableCulling(): void {
    this.gl.disable(this.gl.CULL_FACE);
  }
}
