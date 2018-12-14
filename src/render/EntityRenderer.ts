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

import Entity from '../scene/Entity';
import StaticShader from '../shaders/StaticShader';
import TexturedModel from '../models/TexturedModel';
import { createTransformationMatrix } from '../math/MathUtils';

export default class EntityRenderer {
  
  public constructor(private readonly gl: WebGL2RenderingContext, private readonly shader: StaticShader) {}

  public getRenderingContext(): WebGL2RenderingContext {
    return this.gl;
  }

  public render(modelCache: Map<TexturedModel, Set<Entity>>) {
    this.enableCulling();

    modelCache.forEach((entities, model) => {
      model.getVertexArray().bind();
      model.getIndexBuffer().bind();
      
      model.getTexture().bind();
      this.shader.loadShineVariables(model.getTexture().getShineDamper(), model.getTexture().getReflectivity());
      
      entities.forEach((entity) => {
        this.shader.setUniformMat4f(
          'uTransformationMatrix',
          createTransformationMatrix(entity.getPosition(), entity.getRotation(), entity.getScale())
          );
        this.gl.drawElements(this.gl.TRIANGLES, model.getIndexBuffer().getCount(), this.gl.UNSIGNED_INT, 0);
      });
      
      model.getVertexArray().unbind();
      model.getIndexBuffer().unbind();
    });

    this.disableCulling();
  }

  // Don't render triangles facing away from the camera
  public enableCulling(): void {
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.cullFace(this.gl.BACK);
  }

  public disableCulling(): void {
    this.gl.disable(this.gl.CULL_FACE);
  }
}
