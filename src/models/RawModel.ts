import VertexArray from '../render/VertexArray';
import IndexBuffer from '../render/IndexBuffer';

export default class RawModel {

  private va: VertexArray;
  private ib: IndexBuffer;

  public constructor(private readonly filepath: string) {}

  public getFilepath(): string {
    return this.filepath;
  }

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
