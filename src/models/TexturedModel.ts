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

import RawModel from './RawModel';
import Texture from '../render/Texture';
import Renderer from '../render/Renderer';
import OBJLoader from '../render/OBJLoader';

export default class TexturedModel extends RawModel {

  /**
   * Construct a TexturedModel.
   * 
   * @param texture the texture of the model.
   * @param filepath the filepath to the .obj file of the model.
   */
  constructor(private readonly texture: Texture, filepath: string) {
    super(filepath);
  }

  public getTexture(): Texture {
    return this.texture;
  }

  /**
   * Load the object and image data for an array of models.
   * 
   * @param renderer the renderer attached to this model.
   * @param models the models to load.
   */
  public static load(renderer: Renderer, models: TexturedModel[]): Promise<any>[] {
    const promises: Promise<any>[] = [];
    
    models.forEach(model => {
      promises.push(
        Texture.loadImage(model.getTexture()),
        OBJLoader.loadModel(renderer, model)
        )
    });

    return promises;
  }
}