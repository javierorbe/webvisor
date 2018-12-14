import Terrain from "../terrain/Terrain";
import TerrainShader from "../shaders/TerrainShader";
import { createTransformationMatrix } from "../math/MathUtils";
import { vec3 } from "gl-matrix";

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

export default class TerrainRenderer {

  public constructor(private readonly gl: WebGL2RenderingContext, private readonly shader: TerrainShader) {}

  public render(terrains: Set<Terrain>): void {
    terrains.forEach((terrain) => {
      const model = terrain.getModel();
      const texture = terrain.getTexture();

      model.getVertexArray().bind();
      model.getIndexBuffer().bind();
      
      texture.bind();
      this.shader.loadShineVariables(texture.getShineDamper(), texture.getReflectivity());
      this.shader.setUniformMat4f(
        'uTransformationMatrix',
        createTransformationMatrix(vec3.fromValues(terrain.getX(), 0, terrain.getZ()), vec3.fromValues(0, 0, 0), 1)
        );
      
      this.gl.drawElements(this.gl.TRIANGLES, model.getIndexBuffer().getCount(), this.gl.UNSIGNED_INT, 0);

      model.getVertexArray().unbind();
      model.getIndexBuffer().unbind();
    });
  }
}
