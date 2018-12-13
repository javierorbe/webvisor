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
import Entity from '../scene/Entity';
import { createTransformationMatrix } from '../math/MathUtils';

export default class Renderer {
  
  public constructor(private readonly gl: WebGL2RenderingContext) {
    // gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0); // Black color
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL); // Farther objects will be obscured by nearer objects
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

  public getRenderingContext(): WebGL2RenderingContext {
    return this.gl;
  }

  public draw(va: VertexArray, ib: IndexBuffer, shader: Shader): void;
  public draw(entity: Entity, shader: Shader): void;

  public draw(firstParam: VertexArray | Entity, secondParam: IndexBuffer | Shader, thirdParam?: Shader) {
    if (firstParam instanceof Entity && secondParam instanceof Shader) {
      const entity: Entity = firstParam;
      const shader: Shader = secondParam;

      shader.bind();
      entity.getModel().getVertexArray().bind();
      entity.getModel().getIndexBuffer().bind();

      shader.setUniformMat4f(
        'transformationMatrix',
        createTransformationMatrix(entity.getPosition(), entity.getRotation(), entity.getScale())
        );
      this.gl.drawElements(this.gl.TRIANGLES, entity.getModel().getIndexBuffer().getCount(), this.gl.UNSIGNED_INT, 0);

      entity.getModel().getIndexBuffer().unbind();
      entity.getModel().getVertexArray().unbind();
      shader.unbind();
    } else if (firstParam instanceof VertexArray && secondParam instanceof IndexBuffer) {
      const va: VertexArray = firstParam;
      const ib: IndexBuffer = secondParam;
      const shader: Shader = thirdParam;

      shader.bind();
      va.bind();
      ib.bind();

      this.gl.drawElements(this.gl.TRIANGLES, ib.getCount(), this.gl.UNSIGNED_INT, 0);

      ib.unbind();
      va.unbind();
      shader.unbind();
    }
  }

  /**
   * Draw triangle based data via WebGL.
   * @param {VertexArray} va - VertexArray to bind.
   * @param {IndexBuffer} ib - IndexBuffer to bind.
   * @param {Shader} shader - Shader program to bind.
   */
  /*
  public draw(va: VertexArray, ib: IndexBuffer, shader: Shader): void {
    shader.bind();
    va.bind();
    ib.bind();

    this.gl.drawElements(this.gl.TRIANGLES, ib.getCount(), this.gl.UNSIGNED_INT, 0);

    ib.unbind();
    va.unbind();
    shader.unbind();
  }

  /**
   * 
   * @param entity 
   * @param shader 
   */
  /*
  public draw(entity: Entity, shader: Shader): void {
    
  }
  */

  public enableCulling(): void {
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.cullFace(this.gl.BACK);
  }

  public disableCulling(): void {
    this.gl.disable(this.gl.CULL_FACE);
  }
}
