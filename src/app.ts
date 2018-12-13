import { vec3, mat4 } from 'gl-matrix';
import Log from './logger/Log';
import Renderer from './render/Renderer';
import Texture from './render/Texture';
import TextureLoader from './render/TextureLoader';
import Shader from './render/Shader';
import VertexArray from './render/VertexArray';
import VertexBuffer from './render/VertexBuffer';
import VertexBufferLayout from './render/VertexBufferLayout';
import IndexBuffer from './render/IndexBuffer';
import { toRadians, createTransformationMatrix } from './math/MathUtils';
import Keyboard from './Keyboard';
import Camera from './scene/Camera';
import OBJLoader from './render/OBJLoader';
import RawModel from './render/RawModel';

const log: Log = new Log();

let renderer: Renderer;
let shader: Shader;

let texture: Texture;
let model: RawModel = new RawModel();

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

  // gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0); // Establecer el color base en negro, totalmente opaco
  gl.enable(gl.DEPTH_TEST); // Habilitar prueba de profundidad
  gl.depthFunc(gl.LEQUAL); // Objetos cercanos opacan objetos lejanos
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Limpiar el buffer de color asi como el de profundidad
  
  renderer = new Renderer(gl);

  texture = new Texture(renderer, './res/rabbit.png');

  shader = new Shader(renderer);
  shader.parseShader(
    './shaders/vertexShader.glsl',
    './shaders/fragmentShader.glsl'
  )
  .then(() => TextureLoader.load([
    texture
  ]))
  .then(() => OBJLoader.loadObjModel(renderer, './res/rabbit.obj', model))
  .then(() => start(canvas, gl));
}

function start(canvas: HTMLCanvasElement, gl: WebGL2RenderingContext) {
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  const projectionMatrix = mat4.perspective(
    mat4.create(),
      toRadians(70), // fov
      canvas.width / canvas.height, // aspect ratio
      0.1, // near
      1000 // far
    );
  const view = mat4.create();
  mat4.translate(view, view, vec3.fromValues(-100, 0, 0));
  
  shader.bind();
  texture.bind();
  shader.setUniform1i('uTexture', 0); // 0 = texture slot
  shader.setUniformMat4f('projectionMatrix', projectionMatrix);

  /*
  va.unbind();
  vb.unbind();
  ib.unbind();
  */
  shader.unbind();

  Keyboard.init();
  const camera = new Camera();

  let increment = 0;

  function draw() {
    clear(gl);

    camera.move();

    shader.bind();

    {
      shader.setUniformMat4f('viewMatrix', camera.createViewMatrix());
      shader.setUniformMat4f('transformationMatrix', createTransformationMatrix(vec3.fromValues(0, 0, -5), increment, increment / 2, 0, 1));
      renderer.draw(model.getVertexArray(), model.getIndexBuffer(), shader);
    }

    increment += 0.01;

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
}

function clear(gl: WebGL2RenderingContext) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}
