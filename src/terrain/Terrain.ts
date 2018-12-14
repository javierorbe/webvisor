import RawModel from "../models/RawModel";
import Texture from "../render/Texture";
import VertexArray from "../render/VertexArray";
import IndexBuffer from "../render/IndexBuffer";
import VertexBuffer from "../render/VertexBuffer";
import VertexBufferLayout from "../render/VertexBufferLayout";

export default class Terrain {

  private static readonly SIZE: number = 800;
  private static readonly VERTEX_COUNT: number = 128;

  private x: number;
  private z: number;
  private model: RawModel;

  public constructor(gl: WebGL2RenderingContext, gridX: number, gridZ: number, private readonly texture: Texture) {
    this.x = gridX * Terrain.SIZE;
    this.z = gridZ * Terrain.SIZE;
    this.model = Terrain.generateTerrain(gl);
  }

  public getX(): number {
    return this.x;
  }

  public getZ(): number {
    return this.z;
  }

  public getModel(): RawModel {
    return this.model;
  }

  public getTexture(): Texture {
    return this.texture;
  }

  private static generateTerrain(gl: WebGL2RenderingContext): RawModel {
    const data: number[] = [];
    const indices: number[] = [];

    for (let i = 0; i < Terrain.VERTEX_COUNT; i++) {
      for (let j = 0; j < Terrain.VERTEX_COUNT; j++) {
        data.push(
          // Vertex position
          (j / (Terrain.VERTEX_COUNT - 1)) * Terrain.SIZE,
          0,
          (i / (Terrain.VERTEX_COUNT - 1)) * Terrain.SIZE,

          // Texture coordinates
          (j / (Terrain.VERTEX_COUNT - 1)),
          (i / (Terrain.VERTEX_COUNT - 1)),

          // Normal
          0,
          1,
          0
        );
      }
    }

    for (let gridZ = 0; gridZ < Terrain.VERTEX_COUNT - 1; gridZ++) {
      for (let gridX = 0; gridX < Terrain.VERTEX_COUNT - 1; gridX++) {
        const topLeft = (gridZ * Terrain.VERTEX_COUNT) + gridX;
        const topRight = topLeft + 1;
        const bottomLeft = ((gridZ + 1) * Terrain.VERTEX_COUNT) + gridX;
        const bottomRight = bottomLeft + 1;

        indices.push(
          topLeft,
          bottomLeft,
          topRight,
          topRight,
          bottomLeft,
          bottomRight
        );
      }
    }

    const va = new VertexArray(gl);
    const ib = new IndexBuffer(gl, indices, indices.length);

    const layout = new VertexBufferLayout(gl);
    layout.pushFloat(3);
    layout.pushFloat(2);
    layout.pushFloat(3);
    va.addBuffer(new VertexBuffer(gl, data), layout);

    return new RawModel(va, ib);
  }
}