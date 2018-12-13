import { vec3, mat4 } from 'gl-matrix';
import Log from './logger/Log';
import Renderer from './render/Renderer';
import Texture from './render/Texture';
import Shader from './shaders/Shader';
import { toRadians } from './math/MathUtils';
import Keyboard from './input/Keyboard';
import Camera from './scene/Camera';
import Entity from './scene/Entity';
import TexturedModel from './models/TexturedModel';
import Light from './scene/Light';
import StaticShader from './shaders/StaticShader';

const log: Log = new Log();

let renderer: Renderer;
let shader: StaticShader;

const entities: Set<Entity> = new Set();
let light: Light;

function load(): void {
  const canvas = document.getElementById('canvas');

  if (!(canvas instanceof HTMLCanvasElement)) {
    throw new Error('The provided element is not a canvas element.');
  }

  const gl = canvas.getContext('webgl2');

  if (!(gl instanceof WebGL2RenderingContext)) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    throw new Error('Unable to initialize WebGL. Your browser or machine may not support it.');
  }

  log.info(gl.getParameter(gl.VERSION));
  
  renderer = new Renderer(gl);
  shader = new StaticShader(renderer);

  const model = new TexturedModel(new Texture(renderer, './res/white.png'), './res/dragon.obj');

  Promise.all([ // Load data from files
    // Load shaders
    shader.parseShader(
      './shaders/vertexShader.glsl',
      './shaders/fragmentShader.glsl'
    ),
    // Load texture and model data
    ...TexturedModel.load(renderer, [
      model
    ])
  ]).then(() => {
    entities.add(new Entity(model, vec3.fromValues(0, 0, -25), vec3.fromValues(0, 0, 0), 1));
    start(canvas, gl);
  });
}

function start(canvas: HTMLCanvasElement, gl: WebGL2RenderingContext) {
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  loadProjectionMatrix(shader, canvas);

  // bind a texture
  // shader.bind();
  // shader.setUniform1i('uTexture', 0); // 0 = texture slot
  // entity.getModel().getTexture().bind();
  // shader.unbind();

  Keyboard.init();
  const camera = new Camera();
  light = new Light(vec3.fromValues(0, 0, -20), vec3.fromValues(0.9, 0.9, 0.9));

  requestAnimationFrame(() => draw(gl, camera));
}

function draw(gl: WebGL2RenderingContext, camera: Camera) {
  renderer.clear();

  camera.move();
  entities.forEach(e => e.increaseRotation(0, 0.005, 0));

  shader.bind();
  shader.loadViewMatrix(camera);
  shader.loadLight(light);

  // Draw entities
  entities.forEach((entity) => renderer.draw(entity, shader));

  requestAnimationFrame(() => draw(gl, camera));
}

function loadProjectionMatrix(shader: Shader, canvas: HTMLCanvasElement) {
  const projectionMatrix = mat4.perspective(
    mat4.create(),
      toRadians(70), // fov
      canvas.width / canvas.height, // aspect ratio
      0.1, // near
      1000 // far
    );

  shader.bind();
  shader.setUniformMat4f('uProjectionMatrix', projectionMatrix);
  shader.unbind();
}

window.addEventListener('load', load);
