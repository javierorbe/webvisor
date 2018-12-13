import { vec3, mat4 } from 'gl-matrix';
import Log from './logger/Log';
import Renderer from './render/Renderer';
import Texture from './render/Texture';
import Shader from './render/Shader';
import { toRadians } from './math/MathUtils';
import Keyboard from './Keyboard';
import Camera from './scene/Camera';
import Entity from './scene/Entity';
import TexturedModel from './models/TexturedModel';

const log: Log = new Log();

let renderer: Renderer;
let shader: Shader;

const entities: Set<Entity> = new Set();

window.addEventListener('load', load);

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
  shader = new Shader(renderer);

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
    entities.add(new Entity(model, vec3.fromValues(0, 0, -5), vec3.fromValues(0, 0, 0), 1));
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

  requestAnimationFrame(() => draw(gl, camera));
}

function draw(gl: WebGL2RenderingContext, camera: Camera) {
  clear(gl);

  camera.move();
  entities.forEach(e => e.increaseRotation(0.01, 0.01, 0));

  shader.bind();
  // Load view matrix
  shader.setUniformMat4f('viewMatrix', camera.createViewMatrix());

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
  shader.setUniformMat4f('projectionMatrix', projectionMatrix);
  shader.unbind();
}

function clear(gl: WebGL2RenderingContext) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}
