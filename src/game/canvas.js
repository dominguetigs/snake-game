export class Canvas {
  canvas;
  ctx;

  constructor(engine) {
    this.engine = engine;
    this.build();
  }

  build() {
    this.canvas = document.createElement('canvas');
    document.getElementById('canvas').appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
  }

  getTiles() {
    return {
      x: this.engine.width / this.engine.tileSize,
      y: this.engine.height / this.engine.tileSize,
    };
  }

  getScreenCenter() {
    const { x: tilesX, y: tilesY } = this.getTiles();

    return {
      x: Math.floor(tilesX / 2),
      y: Math.floor(tilesY / 2),
    };
  }
}
