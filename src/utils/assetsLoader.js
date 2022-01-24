export class AssetsLoader {
  _images = {};

  set images(images) {
    this._images = images;
  }

  get images() {
    return this._images;
  }

  static loadImage(identifier, imagePath) {
    if (!this.images?.[identifier]) {
      const image = new Image();
      image.src = imagePath;

      image.crossOrigin = 'anonymous'; // REMOVE IF SAME DOMAIN!

      image.onload = () => {
        this.images = {
          ...this.images,
          [identifier]: image,
        };
      };

      image.onerror = () => {
        console.log(`Error to render image in path ${imagePath}`);
      };
    }
  }

  static imageHasLoaded(imageIdentifier) {
    return !!this.images?.[imageIdentifier];
  }

  static imagesHasLoaded(imageIdentifiers) {
    return imageIdentifiers.every(this.imageHasLoaded.bind(this));
  }
}
