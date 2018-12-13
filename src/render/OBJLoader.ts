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

import { vec2, vec3 } from 'gl-matrix';
import Renderer from './Renderer';
import VertexArray from './VertexArray';
import VertexBufferLayout from './VertexBufferLayout';
import VertexBuffer from './VertexBuffer';
import IndexBuffer from './IndexBuffer';
import RawModel from '../models/RawModel';

export default class OBJLoader {

  // TODO: optimize loadObjModel

  public static loadModels(gl: WebGL2RenderingContext, models: RawModel[]) {
    return Promise.all(
      models.map((model) => OBJLoader.loadModel(gl, model))
    );
  }

  /**
   * Read an .obj file and load the data to a model.
   * 
   * @param gl the rendering context.
   * @param model the model where the data will be loaded.
   */
  public static async loadModel(gl: WebGL2RenderingContext, model: RawModel): Promise<void> {
    const vertices: vec3[] = [];
    const textures: vec2[] = [];
    const normals: vec3[] = [];

    const indicesArray: number[] = [];
    const texturesArray = [];
    const normalsArray = [];
    
    const res = await fetch(model.getFilepath());
    const txt = await res.text();
    const allLines = txt.split(/\r\n|\n/);
    
    allLines.forEach((line) => {
      const currentLine = line.split(' ');
      if (line.startsWith('v ')) {
        vertices.push(vec3.fromValues(
          Number(currentLine[1]),
          Number(currentLine[2]),
          Number(currentLine[3])
          ));
      } else if (line.startsWith('vt ')) {
        textures.push(vec2.fromValues(
          Number(currentLine[1]),
          Number(currentLine[2])
          ));
      } else if (line.startsWith('vn ')) {
        normals.push(vec3.fromValues(
          Number(currentLine[1]),
          Number(currentLine[2]),
          Number(currentLine[3])
          ));
      } else if (line.startsWith('f ')) {
        const vertex1 = currentLine[1].split('/');
        const vertex2 = currentLine[2].split('/');
        const vertex3 = currentLine[3].split('/');
        this.processVertex(vertex1, indicesArray, textures, normals, texturesArray, normalsArray);
        this.processVertex(vertex2, indicesArray, textures, normals, texturesArray, normalsArray);
        this.processVertex(vertex3, indicesArray, textures, normals, texturesArray, normalsArray);
      }
    });

    const verticesArray = [];
    let vertexPointer = 0;
    vertices.forEach(vector => {
      verticesArray[vertexPointer++] = vector[0];
      verticesArray[vertexPointer++] = vector[1];
      verticesArray[vertexPointer++] = vector[2];
    });

    const data: number[] = [];
    let pointer1 = 0;
    let pointer2 = 0;
    let pointer3 = 0;
    const dataSize = Math.floor(verticesArray.length / 3);
    for (let i = 0; i < dataSize; i++) {
      data.push(
        verticesArray[pointer1++],
        verticesArray[pointer1++],
        verticesArray[pointer1++],
        texturesArray[pointer2++],
        texturesArray[pointer2++],
        normalsArray[pointer3++],
        normalsArray[pointer3++],
        normalsArray[pointer3++]);
    }

    const va = new VertexArray(gl);
    const vb = new VertexBuffer(gl, data);
    const layout = new VertexBufferLayout(gl);
    layout.pushFloat(3);
    layout.pushFloat(2);
    layout.pushFloat(3);
    va.addBuffer(vb, layout);

    const ib = new IndexBuffer(gl, indicesArray, indicesArray.length);
    model.load(va, ib);
  }

  /**
   * 
   * @param vertexData 
   * @param indices 
   * @param textures 
   * @param normals 
   * @param texturesArray 
   * @param normalsArray 
   */
  private static processVertex(vertexData: string[], indices: number[], textures: vec2[], normals: vec3[], texturesArray: number[], normalsArray: number[]): void {
    const currentVertexPosition = Number(vertexData[0]) - 1;
    indices.push(currentVertexPosition);
    const currentTexture = textures[Number(vertexData[1]) - 1];
    texturesArray[currentVertexPosition * 2] = currentTexture[0];
    texturesArray[currentVertexPosition * 2 + 1] = currentTexture[1];
    const currentNormal = normals[Number(vertexData[2]) - 1];
    normalsArray[currentVertexPosition * 3] = currentNormal[0];
    normalsArray[currentVertexPosition * 3 + 1] = currentNormal[1];
    normalsArray[currentVertexPosition * 3 + 2] = currentNormal[2];
  }
}
