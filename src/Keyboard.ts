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

export default class Keyboard {
  
  private static up: boolean = false;
  private static down: boolean = false;
  private static left: boolean = false;
  private static right: boolean = false;

  public static init() {
    window.addEventListener('keydown', (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW':
          Keyboard.up = true;
          break;
        case 'KeyS':
          Keyboard.down = true;
          break;
        case 'KeyA':
          Keyboard.left = true;
          break;
        case 'KeyD':
          Keyboard.right = true;
          break;
      }
    });

    window.addEventListener('keyup', (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW':
          Keyboard.up = false;
          break;
        case 'KeyS':
          Keyboard.down = false;
          break;
        case 'KeyA':
          Keyboard.left = false;
          break;
        case 'KeyD':
          Keyboard.right = false;
          break;
      }
    });
  }

  public static isUp(): boolean {
    return Keyboard.up;
  }

  public static isDown(): boolean {
    return Keyboard.down;
  }

  public static isLeft(): boolean {
    return Keyboard.left;
  }

  public static isRight(): boolean {
    return Keyboard.right;
  }
}