import { vec3 } from "gl-matrix";
import TexturedModel from "../models/TexturedModel";

export default class Entity {

  constructor(
    private readonly model: TexturedModel,
    private readonly position: vec3,
    private readonly rotation: vec3,
    private readonly scale: number
    ) {}

  public getModel(): TexturedModel {
    return this.model;
  }

  public getPosition(): vec3 {
    return this.position;
  }

  public setPosition(x: number, y: number, z: number): void {
    vec3.set(this.position, x, y, z)
  }

  public increasePosition(dx: number, dy: number, dz: number): void {
    vec3.add(this.position, this.position, vec3.fromValues(dx, dy, dz));
  }

  public getRotation(): vec3 {
    return this.rotation;
  }

  public setRotation(x: number, y: number, z: number): void {
    vec3.set(this.rotation, x, y, z)
  }

  public increaseRotation(dx: number, dy: number, dz: number): void {
    vec3.add(this.rotation, this.rotation, vec3.fromValues(dx, dy, dz));
  }

  public getScale(): number {
    return this.scale;
  }
}