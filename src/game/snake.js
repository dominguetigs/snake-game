import { Particle } from './particle.js';
import { Physics, Vector } from '../utils/physics.js';

import { COLORS } from './constants/colors.js';

export class Snake {
  constructor(engine) {
    this.engine = engine;

    this.engine.controls.resizeObservable.subscribe(
      this.handleResize.bind(this)
    );

    this.engine.controls.keyDownObservable.subscribe(
      this.handleKeyPressed.bind(this)
    );

    this.engine.controls.touchObservable.subscribe(
      this.handleTouched.bind(this)
    );

    this.size = this.engine.tileSize;
    this.position = this._randomPosition();
    this.direction = new Vector(0, -this.engine.tileSize);
    this.history = [];
    this.color = '#212121';
    this.delay = 3;
    this.total = 1;
    this.particle = {
      instances: [],
      count: 30,
    };
    this.crashed = false;

    this.primaryKeys = {
      ArrowUp: 'ArrowUp',
      ArrowRight: 'ArrowRight',
      ArrowDown: 'ArrowDown',
      ArrowLeft: 'ArrowLeft',
    };

    this.secondaryKeys = {
      w: 'ArrowUp',
      d: 'ArrowRight',
      s: 'ArrowDown',
      a: 'ArrowLeft',
    };

    this.validKeys = {
      ...this.primaryKeys,
      ...this.secondaryKeys,
    };

    this.keys = {
      ArrowUp: () => {
        if (!this.directions.isDown()) {
          this.direction = new Vector(0, -this.size);
        }
      },
      ArrowRight: () => {
        if (!this.directions.isLeft()) {
          this.direction = new Vector(this.size, 0);
        }
      },
      ArrowDown: () => {
        if (!this.directions.isUp()) {
          this.direction = new Vector(0, this.size);
        }
      },
      ArrowLeft: () => {
        if (!this.directions.isRight()) {
          this.direction = new Vector(-this.size, 0);
        }
      },
    };

    this.directions = {
      isUp: () => this.direction.y === -this.size,
      isRight: () => this.direction.x === this.size,
      isDown: () => this.direction.y === this.size,
      isLeft: () => this.direction.x === -this.size,
    };

    this.coordinates = {
      upLimit: () => 0,
      rightLimit: () => this.engine.width,
      downLimit: () => this.engine.height,
      leftLimit: () => 0,
    };
  }

  handleResize() {
    const [diffX, diffY] = [
      this.position.x % this.engine.tileSize,
      this.position.y % this.engine.tileSize,
    ];

    if (this.directions.isUp()) {
      this.direction = new Vector(0, -this.engine.tileSize);
    } else if (this.directions.isRight()) {
      this.direction = new Vector(this.engine.tileSize, 0);
    } else if (this.directions.isDown()) {
      this.direction = new Vector(0, this.engine.tileSize);
    } else if (this.directions.isLeft()) {
      this.direction = new Vector(-this.engine.tileSize, 0);
    }

    this.position.add({ x: -diffX, y: -diffY });
    this.size = this.engine.tileSize;
  }

  handleKeyPressed({ key, type }) {
    const validKeys = this.validKeys;
    const keyPressedFn = this.keys[validKeys[key]];

    if (keyPressedFn && type === 'keydown') {
      this.engine.isPlaying = true;
      keyPressedFn();
    }
  }

  handleTouched(touches) {
    const touch = new Vector(...touches);
    touch.mult(this.size, this.size);

    const { x, y } = touch;

    if (
      (y === -this.size && !this.directions.isDown()) ||
      (x === this.size && !this.directions.isLeft()) ||
      (y === this.size && !this.directions.isUp()) ||
      (x === -this.size && !this.directions.isRight())
    ) {
      this.direction = new Vector(x, y);
      this.engine.isPlaying = true;
    }
  }

  selfCollision() {
    for (const history of this.history) {
      if (Physics.isCollision(this.position, history)) {
        this.collisionSplash();
        this.crashed = true;
      }
    }
  }

  walls() {
    const { x, y } = this.position;

    if (y < this.coordinates.upLimit()) {
      this.position.y = this.coordinates.downLimit() - this.size;
    } else if (x + this.size > this.coordinates.rightLimit()) {
      this.position.x = this.coordinates.leftLimit();
    } else if (y + this.size > this.coordinates.downLimit()) {
      this.position.y = this.coordinates.upLimit();
    } else if (x < this.coordinates.leftLimit()) {
      this.position.x = this.coordinates.rightLimit() - this.size;
    }
  }

  selfMove() {
    const { x, y } = this.position;

    if (
      this.directions.isUp() &&
      y === this.coordinates.upLimit() + this.size
    ) {
      this.direction = new Vector(this.size, 0);
    } else if (
      this.directions.isRight() &&
      x === this.coordinates.rightLimit() - 2 * this.size
    ) {
      this.direction = new Vector(0, this.size);
    } else if (
      this.directions.isDown() &&
      y === this.coordinates.downLimit() - 2 * this.size
    ) {
      this.direction = new Vector(-this.size, 0);
    } else if (
      this.directions.isLeft() &&
      x === this.coordinates.leftLimit() + this.size
    ) {
      this.direction = new Vector(0, -this.size);
    }
  }

  collisionSplash() {
    const snakeBody = [this.position, ...this.history];

    for (const position of snakeBody) {
      for (let i = 0; i < this.particle.count; i++) {
        const velocity = new Vector(
          Math.random() * 6 - 3,
          Math.random() * 6 - 3
        );
        const startPosition = new Vector(position.x, position.y);

        this.particle.instances.push(
          new Particle(
            this.engine,
            startPosition,
            this.color,
            this.size,
            velocity
          )
        );
      }
    }
  }

  garbageCollector() {
    for (let i = 0; i < this.particle.instances.length; i++) {
      if (this.particle.instances[i].size <= 0) {
        this.particle.instances.splice(i, 1);
      }
    }
  }

  update() {
    this.walls();

    if (!this.engine.isGameOver && !this.engine.isPaused) {
      if (!this.engine.isPlaying) {
        this.selfMove();
      }

      if (!this.crashed && !this.delay--) {
        const { position: foodPosition } = this.engine.fruit;
        const { coordinatesVectors: coordinates } = this.engine.props;

        if (Physics.isCollision(this.position, foodPosition)) {
          this.engine.gui.score();
          this.engine.fruit.update();
          this.total++;
        }

        if (Physics.checkCollisions(this.position, coordinates)) {
          this.collisionSplash();
          this.crashed = true;
        }

        this.history[this.total - 1] = new Vector(
          this.position.x,
          this.position.y
        );

        for (let i = 0; i < this.total - 1; i++) {
          this.history[i] = this.history[i + 1];
        }

        this.position.add(this.direction);
        this.delay = 3;

        if (this.total > 3) {
          this.selfCollision();
        }
      }
    }

    for (const particle of this.particle.instances) {
      particle.update();
    }

    this.garbageCollector();
  }

  draw() {
    if (!this.crashed) {
      const { x: headX, y: headY } = this.position;

      this.engine.canvas.ctx.fillStyle = this.color;
      this.engine.canvas.ctx.shadowBlur = 30;
      this.engine.canvas.ctx.shadowColor = 'rgba(255, 255, 255, .3)';
      this.engine.canvas.ctx.fillRect(headX, headY, this.size, this.size);
      this.engine.canvas.ctx.shadowBlur = 0;

      if (this.total >= 2) {
        for (const history of this.history) {
          const { x, y } = history;

          this.engine.canvas.ctx.lineWidth = 1;
          this.engine.canvas.ctx.fillStyle = this.color;
          this.engine.canvas.ctx.fillRect(x, y, this.size, this.size);
        }
      }
    }

    for (const particle of this.particle.instances) {
      particle.draw();
    }

    if (this.crashed && this.particle.instances.length === 0) {
      this.engine.isGameOver = true;
      this.crashed = false;
    }
  }

  _randomPosition() {
    const [tilesX, tilesY] = this.engine.tiles;
    const randomX = ~~(Math.random() * tilesX) * this.size;
    const randomY = ~~(Math.random() * tilesY) * this.size;
    return new Vector(randomX, randomY);
  }
}
