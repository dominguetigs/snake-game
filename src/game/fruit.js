import { Utils } from '../utils/utils.js';
import { Physics, Vector } from '../utils/physics.js';

export class Fruit {
  constructor(engine) {
    this.engine = engine;
    this.setup();
  }

  setup() {
    this.size = this.engine.tileSize;
    this.color = `hsl(${~~(Math.random() * 360)}, 100%, 50%)`;

    this.position = this._randomPosition();

    this.engine.controls.resizeObservable.subscribe(
      this.handleResize.bind(this)
    );
  }

  handleResize() {
    const [diffX, diffY] = [
      this.position.x % this.engine.tileSize,
      this.position.y % this.engine.tileSize,
    ];

    this.position.add({ x: -diffX, y: -diffY });
    this.size = this.engine.tileSize;
  }

  update() {
    const randomPosition = this._randomPosition();

    for (const path of this.engine.snake.history) {
      if (
        Physics.isCollision(
          new Vector(randomPosition.x, randomPosition.y),
          path
        )
      ) {
        return this.update();
      }
    }

    this.color = `hsl(${Utils.randHue()}, 100%, 50%)`;
    this.position = randomPosition;
  }

  draw() {
    const { x, y } = this.position;

    this.engine.canvas.ctx.globalCompositeOperation = 'lighter';
    this.engine.canvas.ctx.shadowBlur = 20;
    this.engine.canvas.ctx.shadowColor = this.color;
    this.engine.canvas.ctx.fillStyle = this.color;
    this.engine.canvas.ctx.fillRect(x, y, this.size, this.size);
    this.engine.canvas.ctx.globalCompositeOperation = 'source-over';
    this.engine.canvas.ctx.shadowBlur = 0;
  }

  _randomPosition() {
    let foundAcceptedRandomPosition = false;
    let vectorPosition = null;

    while (!foundAcceptedRandomPosition) {
      const [tilesX, tilesY] = this.engine.tiles;
      const randomX = ~~(Math.random() * tilesX) * this.size;
      const randomY = ~~(Math.random() * tilesY) * this.size;

      vectorPosition = new Vector(randomX, randomY);

      const hasSomeCollision = Physics.checkCollisions(
        vectorPosition,
        this.engine.props.coordinatesVectors
      );

      if (!hasSomeCollision) {
        foundAcceptedRandomPosition = true;
      }
    }

    return vectorPosition;
  }
}
