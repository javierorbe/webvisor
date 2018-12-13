import { vec3, mat4 } from 'gl-matrix';
import Log from './logger/Log';
import Texture from './render/Texture';
import Keyboard from './input/Keyboard';
import Camera from './scene/Camera';
import Entity from './scene/Entity';
import TexturedModel from './models/TexturedModel';
import Light from './scene/Light';
import MasterRenderer from './render/MasterRenderer';
import { randomInRange } from './math/MathUtils';

const log: Log = new Log();

let renderer: MasterRenderer;
const entities: Set<Entity> = new Set();
let light: Light;
let dragon: Entity;

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
  
  renderer = new MasterRenderer(gl);

  const defaultTexture = new Texture(gl, './res/white.png');
  const dragonModel = new TexturedModel(defaultTexture, './res/dragon.obj');
  defaultTexture.setShineDamper(10);
  defaultTexture.setReflectivity(1);

  const boxModel = new TexturedModel(new Texture(gl, './res/box.png'), './res/box.obj');

  dragon = new Entity(dragonModel, vec3.fromValues(0, 0, -25), vec3.fromValues(0, 0, 0), 1);
  entities.add(dragon);

  for (let i = 0; i < 300; i++) {
    entities.add(new Entity(
      boxModel,
      vec3.fromValues(randomInRange(-40, 40), randomInRange(-40, 40), randomInRange(-40, 40)),
      vec3.fromValues(randomInRange(0, 360), randomInRange(0, 360), randomInRange(0, 360)),
      1
      ));
  }

  Promise.all([ // Load data from files
    // Load shaders
    renderer.getStaticShader().parseShader(
      './shaders/vertexShader.glsl',
      './shaders/fragmentShader.glsl'
    ),
    // Load texture and model data
    ...TexturedModel.load(gl, [
      dragonModel,
      boxModel
    ])
  ]).then(() => {
    start(canvas, gl);
  });
}

function start(canvas: HTMLCanvasElement, gl: WebGL2RenderingContext) {
  renderer.getRenderer().loadProjectionMatrix(renderer.getStaticShader(), 70, canvas.width, canvas.height, 0.1, 1000);

  Keyboard.init();
  const camera = new Camera();
  light = new Light(vec3.fromValues(0, 0, -20), vec3.fromValues(1, 1, 1));

  requestAnimationFrame(() => draw(gl, camera));
}

function draw(gl: WebGL2RenderingContext, camera: Camera) {
  renderer.clear();

  camera.move();
  dragon.increaseRotation(0, 0.005, 0);

  entities.forEach((entity) => renderer.processEntity(entity));
  renderer.render(light, camera);

  requestAnimationFrame(() => draw(gl, camera));
}

window.addEventListener('load', load);
