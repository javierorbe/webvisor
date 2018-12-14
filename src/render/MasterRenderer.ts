import StaticShader from "../shaders/StaticShader";
import EntityRenderer from "./EntityRenderer";
import TexturedModel from "../models/TexturedModel";
import Entity from "../scene/Entity";
import Light from "../scene/Light";
import Camera from "../scene/Camera";
import { mat4 } from "gl-matrix";
import { toRadians } from "../math/MathUtils";
import TerrainShader from "../shaders/TerrainShader";
import TerrainRenderer from "./TerrainRenderer";
import Terrain from "../terrain/Terrain";

export default class MasterRenderer {

  private readonly entityRenderer: EntityRenderer;
  private readonly terrainRenderer: TerrainRenderer;

  private readonly staticShader: StaticShader;
  private readonly terrainShader: TerrainShader;

  private readonly projectionMatrix: mat4 = mat4.create();

  private readonly entities: Map<TexturedModel, Set<Entity>> = new Map();
  private readonly terrains: Set<Terrain> = new Set();

  public constructor(private readonly gl: WebGL2RenderingContext, fov: number, aspectRatio: number, nearPlane: number, farPlane: number) {
    this.staticShader = new StaticShader(gl, './shaders/vertexShader.glsl', './shaders/fragmentShader.glsl');
    this.terrainShader = new TerrainShader(gl, './shaders/terrainVertexShader.glsl', './shaders/terrainFragmentShader.glsl');

    this.entityRenderer = new EntityRenderer(gl, this.staticShader);
    this.terrainRenderer = new TerrainRenderer(gl, this.terrainShader);

    mat4.perspective(this.projectionMatrix, toRadians(fov), aspectRatio, nearPlane, farPlane);

    // Farther objects will be obscured by nearer objects
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    gl.clearColor(1.0, 1.0, 1.0, 1.0); // Black color
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

  public getEntityRenderer(): EntityRenderer {
    return this.entityRenderer;
  }

  public getStaticShader(): StaticShader {
    return this.staticShader;
  }

  public getTerrainShader(): TerrainShader {
    return this.terrainShader;
  }

  public render(sun: Light, camera: Camera): void {
    this.clear();
    
    this.staticShader.bind();
    this.staticShader.loadLight(sun);
    this.staticShader.loadViewMatrix(camera);
    this.entityRenderer.render(this.entities);
    this.staticShader.unbind();

    this.terrainShader.bind();
    this.terrainShader.loadLight(sun);
    this.terrainShader.loadViewMatrix(camera);
    this.terrainRenderer.render(this.terrains);
    this.terrainShader.unbind();

    this.entities.clear();
    this.terrains.clear();
  }

  public clear(): void {
    this.gl.clearColor(0.0, 0.0, 0.95, 1.0);
    this.gl.clearDepth(1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

  public processEntity(entity: Entity): void {
    if (this.entities.has(entity.getModel())) {
      this.entities.get(entity.getModel()).add(entity);
    } else {
      this.entities.set(entity.getModel(), new Set([entity]));
    }
  }

  public processTerrain(terrain: Terrain): void {
    this.terrains.add(terrain);
  }

  public loadProjectionMatrix(camera: Camera): void {  
    this.staticShader.bind();
    this.staticShader.setUniformMat4f('uProjectionMatrix', this.projectionMatrix);

    this.terrainShader.bind();
    this.terrainShader.setUniformMat4f('uProjectionMatrix', this.projectionMatrix);
  }
}