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

import Renderer from './Renderer';
import VertexBuffer from './VertexBuffer';
import VertexBufferLayout, { VertexBufferElement } from './VertexBufferLayout';

export default class VertexArray {

  private readonly id: WebGLVertexArrayObject;

  public constructor(private readonly gl: WebGL2RenderingContext) {
    this.id = this.gl.createVertexArray();
  }

  public addBuffer(vb: VertexBuffer, layout: VertexBufferLayout): void {
    this.bind();
    vb.bind();

    const elements: VertexBufferElement[] = layout.getElements();
    let offset = 0;
    for (let i = 0; i < elements.length; i++) {
      const element: VertexBufferElement = elements[i];
      this.gl.enableVertexAttribArray(i);
      this.gl.vertexAttribPointer(i, element.getCount(), element.getType(), element.isNormalized(), layout.getStride(), offset);
      offset += element.getCount() * VertexBufferElement.getSizeOfType(this.gl, element.getType());
    }
  }

  public bind(): void {
    this.gl.bindVertexArray(this.id);
  }

  public unbind(): void {
    this.gl.bindVertexArray(null);
  }

  public clean(): void {
    this.gl.deleteVertexArray(this.id);
  }
}
