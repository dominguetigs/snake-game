import { Observable } from '../utils/observable.js';

export class Controls {
  globalTouch = [];
  offset = [];

  constructor(engine) {
    this.engine = engine;
    this.keyDownObservable = new Observable();
    this.touchObservable = new Observable();
    this.resizeObservable = new Observable();
    this.init();
  }

  init() {
    this.engine.canvas.canvas.addEventListener(
      'touchstart',
      this.touchStart.bind(this),
      {
        passive: false,
      }
    );
    this.engine.canvas.canvas.addEventListener(
      'touchmove',
      this.touchMove.bind(this),
      {
        passive: false,
      }
    );
    this.engine.canvas.canvas.addEventListener(
      'touchend',
      this.touchEnd.bind(this),
      {
        passive: false,
      }
    );
    window.addEventListener('keydown', this.keyEventLogger.bind(this));
    window.addEventListener('keyup', this.keyEventLogger.bind(this));
    window.addEventListener('resize', this.resizeWindow.bind(this));
  }

  touchStart(e) {
    e.preventDefault();

    const touch = e.touches[0];

    this.globalTouch = [touch.pageX, touch.pageY];
  }

  touchMove(e) {
    e.preventDefault();

    const touch = e.touches[0];

    this.offset = [
      touch.pageX - this.globalTouch[0],
      touch.pageY - this.globalTouch[1],
    ];
  }

  touchEnd(e) {
    e.preventDefault();

    if (Math.abs(this.offset[0]) > Math.abs(this.offset[1])) {
      this.touchObservable.notifyAll([
        this.offset[0] / Math.abs(this.offset[0]),
        0,
      ]);
    } else {
      this.touchObservable.notifyAll([
        0,
        this.offset[1] / Math.abs(this.offset[1]),
      ]);
    }
  }

  keyEventLogger(e) {
    const { key, type } = e;
    this.keyDownObservable.notifyAll({ key, type });
  }

  resizeWindow() {
    this.resizeObservable.notifyAll();
  }
}
