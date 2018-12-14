import { vec3 } from 'gl-matrix';
import Log from './logger/Log';
import Texture from './render/Texture';
import Keyboard from './input/Keyboard';
import Camera from './scene/Camera';
import Entity from './scene/Entity';
import TexturedModel from './models/TexturedModel';
import Light from './scene/Light';
import MasterRenderer from './render/MasterRenderer';
import { randomInRange } from './math/MathUtils';
import DroneCamera from './scene/DroneCamera';
import Terrain from './terrain/Terrain';

const log: Log = new Log();

let renderer: MasterRenderer;
const entities: Set<Entity> = new Set();
const terrains: Set<Terrain> = new Set();
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

  window.addEventListener('resize', () => resize(gl), false);
  resize(gl);

  renderer = new MasterRenderer(gl, 70, canvas.width / canvas.height, 0.1, 1000);

  const defaultTexture = new Texture(gl, './res/white.png');
  const dragonModel = new TexturedModel(defaultTexture, './res/dragon.obj');
  defaultTexture.setShineDamper(10);
  defaultTexture.setReflectivity(1);
  dragon = new Entity(dragonModel, vec3.fromValues(0, 0, -25), vec3.fromValues(0, 0, 0), 1);
  entities.add(dragon);

  const treeModel = new TexturedModel(new Texture(gl, './res/tree.png'), './res/tree.obj');
  for (let i = 0; i < 150; i++) {
    entities.add(new Entity(
      treeModel,
      vec3.fromValues(randomInRange(-40, 40), 0, randomInRange(-40, 40)),
      vec3.fromValues(0, 0, 0),
      2
    ));
  }

  const boxModel = new TexturedModel(new Texture(gl, './res/box.png'), './res/box.obj');
  for (let i = 0; i < 20; i++) {
    entities.add(new Entity(
      boxModel,
      vec3.fromValues(randomInRange(-40, 40), 0.75, randomInRange(-40, 40)),
      vec3.fromValues(0, randomInRange(0, 360), 0),
      1
      ));
  }

  const grassTexture: Texture = new Texture(gl, './res/grass.png');
  terrains.add(new Terrain(gl, 0, 0, grassTexture));
  terrains.add(new Terrain(gl, 0, -1, grassTexture));
  terrains.add(new Terrain(gl, -1, -1, grassTexture));
  terrains.add(new Terrain(gl, -1, 0, grassTexture));

  Promise.all([ // Load data from files
    // Load shaders
    renderer.getStaticShader().parseShader(),
    renderer.getTerrainShader().parseShader(),
    // Load texture and model data
    ...TexturedModel.load(gl, [
      dragonModel,
      boxModel,
      treeModel
    ]),
    ...Texture.load([
      grassTexture
    ])
  ]).then(() => {
    start(gl);
  });
}

function start(gl: WebGL2RenderingContext): void {
  const camera = new DroneCamera();
  camera.setPosition(0, 10, 0);
  renderer.loadProjectionMatrix(camera);

  light = new Light(vec3.fromValues(0, 25, 0), vec3.fromValues(1, 1, 1));

  Keyboard.init();
  requestAnimationFrame((timestamp) => draw(gl, timestamp, camera));
}

let lastTime = 0;
const maxTime = 1 / 30;

function draw(gl: WebGL2RenderingContext, timestamp: number, camera: Camera): void {
  let dt: number = (timestamp - lastTime);

  if (dt > maxTime) {
    dt = maxTime;
  }

  renderer.clear();
  camera.update();

  {
    dragon.increaseRotation(0, 0.005, 0);
    terrains.forEach((terrain) => renderer.processTerrain(terrain));
    entities.forEach((entity) => renderer.processEntity(entity));
  }
  
  renderer.render(light, camera);

  requestAnimationFrame((timestamp) => draw(gl, timestamp, camera));
}

function resize(gl: WebGL2RenderingContext) {
  const canvas = gl.canvas;

  var ratio = canvas.width / canvas.height;
  var canvasHeight = window.innerHeight;
  var canvasWidth = canvasHeight * ratio;
  if(ratio != (16 / 9)){
      canvasWidth = window.innerWidth;
      canvasHeight = canvasWidth / (16 / 9);
  }

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
}

window.addEventListener('load', load);
