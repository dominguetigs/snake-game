import { Canvas } from './canvas.js';
import { Controls } from './controls.js';
import { GUI } from './gui.js';

import { Snake } from './snake.js';
import { Fruit } from './fruit.js';
import { PlayLabel } from './playLabel.js';

import { AssetsLoader } from '../utils/assetsLoader.js';

import { RATIO } from './constants/constants.js';
import { Utils } from '../utils/utils.js';

export class Engine {
  snake;
  fruit;
  playLabel;

  constructor() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.tileSize = 0;
    this.tiles = 0;
    this.isPlaying = false;
    this.isPaused = false;
    this.isGameOver = false;
    this.initialized = false;

    this.canvas = new Canvas(this);
    this.controls = new Controls(this);
    this.gui = new GUI(this);

    this.requestAnimationFrameId = null;
  }

  init() {
    this.setup();
    this.start();
    this.run();
  }

  setup() {
    this.calculateDimension();
    this.controls.resizeObservable.subscribe(
      this.calculateDimension.bind(this)
    );

    if (Utils.isMobileDevice()) {
      // TODO: Verificar como bloqueia rotação do celular depois
    }

    // Event Listeners
    this.gui.domPlayGame.addEventListener(
      'click',
      this.start.bind(this),
      false
    );

    this.gui.domPauseGame.addEventListener(
      'click',
      this.pause.bind(this),
      false
    );

    this.gui.domResetGame.addEventListener(
      'click',
      this.reset.bind(this),
      false
    );
  }

  run() {
    this.clear();

    if (!this.isGameOver) {
      this.drawGrid();
      this.update();
      this.draw();

      this.requestAnimationFrameId = window.requestAnimationFrame(
        this.run.bind(this)
      );
    } else {
      this.gameOver();
    }
  }

  clear() {
    this.canvas.ctx.clearRect(0, 0, this.width, this.height);
  }

  gameOver() {
    this.gui.maxScore =
      this.gui.scoreValue > this.gui.maxScore
        ? this.gui.scoreValue
        : this.gui.maxScore;

    this.canvas.ctx.fillStyle = this.gui.style.getPropertyValue('--game-over');
    this.canvas.ctx.textAlign = 'center';
    this.canvas.ctx.font = 'bold 32px Poppins, sans-serif';
    this.canvas.ctx.fillText('GAME OVER', this.width / 2, this.height / 2);
    this.canvas.ctx.font = '16px Poppins, sans-serif';
    this.canvas.ctx.fillText(
      `SCORE   ${this.gui.scoreValue}`,
      this.width / 2,
      this.height / 2 + 60
    );
    this.canvas.ctx.fillText(
      `MAXSCORE   ${this.gui.maxScore}`,
      this.width / 2,
      this.height / 2 + 80
    );
  }

  update() {
    this.snake.update();
    this.playLabel.update();
  }

  draw() {
    this.snake.draw();
    this.fruit.draw();
    this.playLabel.draw();
  }

  start() {
    if (!this.initialized) {
      this.snake = new Snake(this);
      this.fruit = new Fruit(this);
      this.playLabel = new PlayLabel(this);

      this.initialized = true;
    }

    this.gui.play();
    this.isPlaying = false;
    this.isPaused = false;
    this.isGameOver = false;
  }

  reset() {
    this.gui.reset();
    this.initialized = false;
    this.start();
    window.cancelAnimationFrame(this.requestAnimationFrameId);
    this.run();
  }

  pause() {
    this.gui.pause();
    this.isPaused = true;
  }

  addGround(identifier) {
    if (AssetsLoader.imageHasLoaded(identifier)) {
      this.canvas.ctx.drawImage(
        AssetsLoader.images[identifier],
        0,
        0,
        this.width,
        this.height
      );
    }
  }

  drawGrid() {
    const canvasGridColor = this.gui.style.getPropertyValue('--canvas-grid');
    this.canvas.ctx.lineWidth = 0.5;
    this.canvas.ctx.strokeStyle = canvasGridColor;
    this.canvas.ctx.shadowBlur = 0;

    for (let x = 0; x < this.width; x += this.tileSize) {
      for (let y = 0; y < this.height; y += this.tileSize) {
        this.canvas.ctx.strokeRect(x, y, this.tileSize, this.tileSize);
      }
    }
  }

  calculateDimension() {
    this.tileSize = this.calculateTileSize();
    this.tiles = this.calculateTiles();
    this.width = this.tiles[0] * this.tileSize;
    this.height = this.tiles[1] * this.tileSize;
    this.canvas.canvas.width = this.width;
    this.canvas.canvas.height = this.height;
  }

  calculateTileSize() {
    return Math.max(
      Math.floor(window.innerWidth / RATIO),
      Math.floor(window.innerHeight / RATIO)
    );
  }

  calculateTiles() {
    const [percentageX, percentageY] = Utils.isMobileDevice()
      ? [0.95, 0.75]
      : [0.65, 0.9];

    return [
      Math.floor((window.innerWidth * percentageX) / this.tileSize),
      Math.floor((window.innerHeight * percentageY) / this.tileSize),
    ];
  }
}
