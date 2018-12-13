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
import { isPowerOf2 } from '../math/MathUtils';

export default class Texture {

  private readonly id: WebGLTexture;

  private reflectivity: number = 0;
  private shineDamper: number = 1;

  /**
   * 
   * @param gl the rendering context.
   * @param filepath the filepath to the image file.
   */
  public constructor(private readonly gl: WebGL2RenderingContext, private readonly filepath: string) {
    this.id = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.id);
    // Temporal texture data until loaded
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,    // Target
      0,                // Level
      this.gl.RGBA,          // Internal format
      1,                // Width
      1,                // Height
      0,                // Border
      this.gl.RGBA,          // Source format
      this.gl.UNSIGNED_BYTE, // Source type
      new Uint8Array([0, 0, 255, 255])
    );
  }

  public getFilepath(): string {
    return this.filepath;
  }

  public getReflectivity(): number {
    return this.reflectivity;
  }

  public setReflectivity(reflectivity: number): void {
    this.reflectivity = reflectivity;
  }

  public getShineDamper(): number {
    return this.shineDamper;
  }

  public setShineDamper(shineDamper: number): void {
    this.shineDamper = shineDamper;
  }

  /**
   * Stores the pixel data of an image in the OpenGL texture.
   * 
   * @param image the image data of the texture.
   */
  public loadImage(image: ImageBitmap | HTMLImageElement): void {
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.id);
    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, 1); // 1 == true
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,   
      this.gl.RGBA,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      image
    );

    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
      this.gl.generateMipmap(this.gl.TEXTURE_2D);
    } else {
      // Turn of mips and set wrapping to clamp to edge
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    }
  }

  public bind(slot: number = 0): void {
    this.gl.activeTexture(this.gl.TEXTURE0 + slot);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.id);
  }

  public unbind(): void {
    this.gl.bindTexture(this.gl.TEXTURE_2D, 0);
  }

  public clean(): void {
    this.gl.deleteTexture(this.id);
  }

  /**
   * Reads the images of the textures from file and loads them to OpenGL.
   * 
   * @param textures the textures to load.
   */
  public static load(textures: Texture[]): Promise<{}> {
    return Promise.all(
      textures.map(texture => Texture.loadImage(texture))
    );
  }

  /**
   * Reads the image of a texture from file and loads it to OpenGL.
   * 
   * @param texture the texture to load.
   */
  static loadImage(texture: Texture): Promise<{}> {
    const path = texture.getFilepath();

    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        texture.loadImage(image);
        resolve(image);
      };
      image.onerror = () => reject(image);
      image.src = path;
    });
  }
}
