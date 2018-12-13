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

export class VertexBufferElement {
  
  public constructor(private readonly type: GLenum, private readonly count: number, private readonly normalized: boolean) {}

  public getType(): GLenum {
    return this.type;
  }

  public getCount(): number {
    return this.count;
  }

  public isNormalized(): boolean {
    return this.normalized;
  }

  public static getSizeOfType(gl: WebGL2RenderingContext, type: GLenum): number {
    switch (type) {
      case gl.FLOAT: return 4;
      case gl.UNSIGNED_INT: return 4;
      case gl.UNSIGNED_BYTE: return 1;
    }

    console.log('getSizeOfType: unknown type');
    return 0;
  }
}

export default class VertexBufferLayout {

  private readonly elements: VertexBufferElement[] = [];
  private stride: number = 0;

  public constructor(private readonly gl: WebGL2RenderingContext) {}

  public getElements(): VertexBufferElement[] {
    return this.elements;
  }

  public getStride(): number {
    return this.stride;
  }

  public pushFloat(count: number): void {
    this.elements.push(new VertexBufferElement(
      this.gl.FLOAT, count, false
    ));
    this.stride += count * VertexBufferElement.getSizeOfType(this.gl, this.gl.FLOAT);
  }

  public pushInt(count: number): void {
    this.elements.push(new VertexBufferElement(
      this.gl.UNSIGNED_INT, count, false
    ));
    this.stride += count * VertexBufferElement.getSizeOfType(this.gl, this.gl.UNSIGNED_INT);
  }

  public pushByte(count: number): void {
    this.elements.push(new VertexBufferElement(
      this.gl.UNSIGNED_BYTE, count, true
    ));
    this.stride += count * VertexBufferElement.getSizeOfType(this.gl, this.gl.UNSIGNED_BYTE);
  }
}
