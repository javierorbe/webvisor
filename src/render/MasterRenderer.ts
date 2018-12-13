import StaticShader from "../shaders/StaticShader";
import Renderer from "./Renderer";
import Shader from "../shaders/Shader";
import TexturedModel from "../models/TexturedModel";
import Entity from "../scene/Entity";
import Light from "../scene/Light";
import Camera from "../scene/Camera";

export default class MasterRenderer {

  private readonly renderer: Renderer;
  private readonly shader: StaticShader;

  private readonly modelCache: Map<TexturedModel, Set<Entity>> = new Map();

  public constructor(private readonly gl: WebGL2RenderingContext) {
    this.renderer = new Renderer(gl);
    this.shader = new StaticShader(gl);
  }

  public getRenderer(): Renderer {
    return this.renderer;
  }

  public getStaticShader(): StaticShader {
    return this.shader;
  }

  public render(sun: Light, camera: Camera): void {
    this.clear();
    
    this.shader.bind();
    this.shader.loadLight(sun);
    this.shader.loadViewMatrix(camera);

    this.renderer.render(this.modelCache, this.shader);
    
    this.modelCache.clear();
  }

  public processEntity(entity: Entity) {
    if (this.modelCache.has(entity.getModel())) {
      this.modelCache.get(entity.getModel()).add(entity);
    } else {
      this.modelCache.set(entity.getModel(), new Set([entity]));
    }
  }

  public clear(): void {
    this.gl.clearColor(0.0, 0.0, 0.5, 1.0);
    this.gl.clearDepth(1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }
}