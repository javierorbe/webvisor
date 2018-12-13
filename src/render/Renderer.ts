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
import Shader from '../shaders/Shader';
import Entity from '../scene/Entity';
import StaticShader from '../shaders/StaticShader';
import TexturedModel from '../models/TexturedModel';
import { createTransformationMatrix, toRadians } from '../math/MathUtils';

export default class Renderer {
  
  public constructor(private readonly gl: WebGL2RenderingContext) {
    // Farther objects will be obscured by nearer objects
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    // Don't render triangles facing away from the camera
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    gl.clearColor(1.0, 1.0, 1.0, 1.0); // Black color
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

  public getRenderingContext(): WebGL2RenderingContext {
    return this.gl;
  }

  public render(modelCache: Map<TexturedModel, Set<Entity>>, shader: StaticShader) {
    modelCache.forEach((entities, model) => {
      model.getVertexArray().bind();
      model.getIndexBuffer().bind();
      shader.loadShineVariables(model.getTexture().getShineDamper(), model.getTexture().getReflectivity());

      entities.forEach((entity) => {
        shader.setUniformMat4f(
          'uTransformationMatrix',
          createTransformationMatrix(entity.getPosition(), entity.getRotation(), entity.getScale())
          );
        this.gl.drawElements(this.gl.TRIANGLES, model.getIndexBuffer().getCount(), this.gl.UNSIGNED_INT, 0);
      });
    });
  }

  /*
  public draw(va: VertexArray, ib: IndexBuffer, shader: Shader): void;
  public draw(entity: Entity, shader: StaticShader): void;

  public draw(firstParam: VertexArray | Entity, secondParam: IndexBuffer | Shader, thirdParam?: Shader) {
    if (firstParam instanceof Entity && secondParam instanceof StaticShader) {
      const entity: Entity = firstParam;
      const shader: StaticShader = secondParam;

      shader.bind();

      const model = entity.getModel();

      model.getVertexArray().bind();
      model.getIndexBuffer().bind();

      shader.loadShineVariables(model.getTexture().getShineDamper(), model.getTexture().getReflectivity());

      shader.setUniformMat4f(
        'uTransformationMatrix',
        createTransformationMatrix(entity.getPosition(), entity.getRotation(), entity.getScale())
        );
      this.gl.drawElements(this.gl.TRIANGLES, model.getIndexBuffer().getCount(), this.gl.UNSIGNED_INT, 0);

      model.getIndexBuffer().unbind();
      model.getVertexArray().unbind();
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
  */

  public enableCulling(): void {
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.cullFace(this.gl.BACK);
  }

  public disableCulling(): void {
    this.gl.disable(this.gl.CULL_FACE);
  }

  public loadProjectionMatrix(shader: Shader, fov: number, canvasWidth: number, canvasHeight: number, nearPlane: number, farPlane: number): void {
    const projectionMatrix = mat4.perspective(
      mat4.create(),
        toRadians(fov),
        canvasWidth / canvasHeight, // aspect ratio
        nearPlane,
        farPlane
      );
  
    shader.bind();
    shader.setUniformMat4f('uProjectionMatrix', projectionMatrix);
  }
}
