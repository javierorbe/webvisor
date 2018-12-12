import VertexArray from './VertexArray';
import IndexBuffer from './IndexBuffer';

export default class RawModel {

  private va: VertexArray;
  private ib: IndexBuffer;

  public getVertexArray(): VertexArray {
    return this.va;
  }

  public getIndexBuffer(): IndexBuffer {
    return this.ib;
  }

  public load(va: VertexArray, ib: IndexBuffer): void {
    this.va = va;
    this.ib = ib;
  }
}