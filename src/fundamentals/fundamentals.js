class SceneObject {
  constructor(engine) {
    this.engine = engine;
  }

  setup() {}
  updateTouch(type, mx, my) {}
  update() {}
  draw() {}
}

class Button extends SceneObject {
  constructor(engine) {
    super(engine);
    this.position = [0, 0];
    this.text = '';
    this.fontSize = 12;
    this.gravity = [0, 0];
    this.fillColor = color(0, 0, 0);
    this.pressing = false;
    this.callback = null;
  }

  setCallback(c) {
    this.callback = c;
  }

  setPosition(x, y) {
    this.position = [x, y];
  }

  calculateRect(offset = 0) {
    textSize(this.fontSize);

    const w = textWidth(this.text);
    const h = this.fontSize;

    const x = this.position[0] - this.gravity[0] * w;
    const y = offset + this.position[1] - this.gravity[1] * h;

    return [x, y, x + w, y + h];
  }

  checkCollision(tx, ty) {
    textSize(this.fontSize);
    const w = textWidth(this.text);
    const h = this.fontSize;

    const x = this.position[0] - this.gravity[0] * w;
    const y = this.position[1] - this.gravity[1] * h;

    return tx >= x && tx < x + w && ty >= y && ty < y + h;
  }

  setText(text) {
    this.text = text;
  }

  setFontSize(size) {
    this.fontSize = size;
  }

  setFillColor(color) {
    this.fillColor = color;
  }

  setGravity(gx, gy) {
    this.gravity = [gx, gy];
  }

  updateTouch(type, mx, my) {
    if (type == 0) {
      if (this.checkCollision(mx, my)) {
        this.pressing = true;
      }
    } else if (type == 2) {
      if (this.checkCollision(mx, my) && this.pressing) {
        if (this.callback) this.callback();
      }
      this.pressing = false;
    }
  }

  draw(canvas) {
    const recta = this.calculateRect();

    if (this.pressing) {
      canvas.drawRectText(recta, this.fontSize - 5, this.fillColor, this.text);
    } else {
      canvas.drawRectText(recta, this.fontSize, this.fillColor, this.text);
    }
  }
}

class Scene {
  constructor(engine) {
    this.engine = engine;
    this.objects = [];
    this.properties = null;
  }

  getEngine() {
    return this.engine;
  }

  createObject(scheme) {
    const object = new scheme(this.engine);
    object.setup();
    this.objects.push(object);
    return object;
  }

  setProperties(p) {
    this.properties = p;
    this.objects = [];
    this.setup();
  }

  getProperties() {
    if (this.properties) return this.properties;
    return this.engine.getProperties();
  }

  setup() {}

  updateTouch(type, mx, my) {
    for (const object of this.objects) {
      object.updateTouch(type, mx, my);
    }
  }

  update() {
    for (const object of this.objects) {
      object.update();
    }
  }

  draw(canvas) {
    for (const object of this.objects) {
      object.draw(canvas);
    }
  }
}

class Canvas {
  constructor(engine) {
    const windowSize = engine.getProperties().getWindowSize();
    createCanvas(...windowSize);
    this.engine = engine;
    this.opacity = 1;
  }

  drawRectText(rect, fontSize, color, t) {
    textSize(fontSize);
    color.setAlpha(this.opacity * 255);

    fill(color);
    const tw = textWidth(t);
    const th = fontSize;

    const w = rect[2] - rect[0];
    const h = rect[3] - rect[1];

    const x = rect[0] + (w - tw) / 2;
    const y = rect[1] + (h - th) / 2;

    text(t, x, y + fontSize);
  }

  drawText(x, y, fontSize, color, t) {
    textSize(fontSize);
    color.setAlpha(this.opacity * 255);
    fill(color);
    text(t, x, y + fontSize);
  }

  setOpacity(o) {
    this.opacity = o;
  }

  clean() {
    background(0, 0, 0);
  }
}

class Properties {
  constructor(windowWidth, windowHeight) {
    this.windowWidth = windowWidth;
    this.windowHeight = windowHeight;
  }

  getWindowSize() {
    return [this.windowWidth, this.windowHeight];
  }
}

class Engine {
  setup(windowWidth, windowHeight) {
    this.properties = new Properties(windowWidth, windowHeight);
    this.canvas = new Canvas(this);
    this.touchEvents = [];
    this.transitionTo = null;
  }

  getProperties() {
    return this.properties;
  }

  setScene(scene) {
    scene = new scene(this);
    scene.setup();
    this.transitionTo = [scene, 0];
  }

  updateState() {
    this.updateTouch();
    this.update();
    this.draw();
  }

  touchEvent(eventType, mx, my) {
    this.touchEvents.push([eventType, mx, my]);
  }

  updateTouch() {
    if (this.scene) {
      for (const touch of this.touchEvents) {
        this.scene.updateTouch(...touch);
      }
    }
    //
    this.touchEvents = [];
  }

  update() {
    //
    if (this.transitionTo) {
      console.log(this.transitionTo[1]);
      this.transitionTo[1]++;
      if (this.transitionTo[1] >= 10) {
        this.scene = this.transitionTo[0];
        this.transitionTo = null;
      }
    }
    //
    if (this.scene) this.scene.update();
  }

  draw() {
    this.canvas.clean();

    if (this.transitionTo) {
      const opacidadeA = this.transitionTo[1] / 10.0;
      const opacidadeB = 1 - opacidadeA;

      if (this.scene) {
        this.canvas.setOpacity(opacidadeB);
        this.scene.draw(this.canvas);
      }

      this.canvas.setOpacity(opacidadeA);
      this.transitionTo[0].draw(this.canvas);
    } else {
      this.canvas.setOpacity(1);
      if (this.scene) this.scene.draw(this.canvas);
    }
  }
}

////  JOGO

class SceneGame extends Scene {
  constructor(engine) {
    super(engine);
  }

  setup() {
    super.setup();

    background(0, 0, 0);

    let windowSize = this.getProperties().getWindowSize();

    //
    this.newGameButton = this.createObject(Button);
    this.newGameButton.setText('Voltar');
    this.newGameButton.setFontSize(50);
    this.newGameButton.setPosition(windowSize[0] / 2, windowSize[1] / 2);
    this.newGameButton.setFillColor(color(255, 0, 0));
    this.newGameButton.setGravity(0.5, 0.5);
    this.newGameButton.setCallback(() => {
      this.getEngine().setScene(SceneTitle);
    });
  }

  updateTouch(type, mx, my) {
    super.updateTouch(type, mx, my);
  }

  draw(canvas) {
    super.draw(canvas);

    //

    //
  }
}

class SceneTitle extends Scene {
  constructor(engine) {
    super(engine);
  }

  setup() {
    super.setup();

    background(0, 0, 0);

    let windowSize = this.getProperties().getWindowSize();

    //
    this.newGameButton = this.createObject(Button);
    this.newGameButton.setText('New Game');
    this.newGameButton.setFontSize(50);
    this.newGameButton.setPosition(windowSize[0] / 2, windowSize[1] / 2);
    this.newGameButton.setFillColor(color(255, 0, 0));
    this.newGameButton.setGravity(0.5, 0.5);
    this.newGameButton.setCallback(() => {
      this.getEngine().setScene(SceneGame);
    });

    //
    this.quitButton = this.createObject(Button);
    this.quitButton.setText('Quit');
    this.quitButton.setFontSize(50);
    this.quitButton.setPosition(windowSize[0] / 2, windowSize[1] / 2 + 100);
    this.quitButton.setFillColor(color(255, 0, 0));
    this.quitButton.setGravity(0.5, 0.5);
    this.quitButton.setCallback(() => {
      console.log('CLICOU B');
    });
  }

  updateTouch(type, mx, my) {
    super.updateTouch(type, mx, my);
  }

  draw(canvas) {
    super.draw(canvas);

    //

    //
  }
}

// Wrapper
let engine = new Engine();

function setup() {
  engine.setup(windowWidth, windowHeight);
  engine.setScene(SceneTitle);
}

function draw() {
  engine.updateState();
}

function touchStarted() {
  engine.touchEvent(0, mouseX, mouseY);
}

function touchMoved() {
  engine.touchEvent(1, mouseX, mouseY);
}

function touchEnded() {
  engine.touchEvent(2, mouseX, mouseY);
}
