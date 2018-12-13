import RawModel from './RawModel';
import Texture from '../render/Texture';
import Renderer from '../render/Renderer';
import OBJLoader from '../render/OBJLoader';

export default class TexturedModel extends RawModel {

  /**
   * Construct a TexturedModel.
   * 
   * @param texture the texture of the model.
   * @param filepath the filepath to the .obj file of the model.
   */
  constructor(private readonly texture: Texture, filepath: string) {
    super(filepath);
  }

  public getTexture(): Texture {
    return this.texture;
  }

  /**
   * Load the object and image data for an array of models.
   * 
   * @param renderer the renderer attached to this model.
   * @param models the models to load.
   */
  public static load(renderer: Renderer, models: TexturedModel[]): Promise<any>[] {
    const promises: Promise<any>[] = [];
    
    models.forEach(model => {
      promises.push(
        Texture.loadImage(model.getTexture()),
        OBJLoader.loadModel(renderer, model)
        )
    });

    return promises;
  }
}