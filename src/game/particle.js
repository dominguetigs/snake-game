export class Particle {
  constructor(engine, position, color, size, velocity) {
    this.engine = engine;
    this.position = position;
    this.color = color;
    this.size = Math.abs(size / 1.5);
    this.gravity = -0.2;
    this.velocity = velocity;
  }

  draw() {
    const { x, y } = this.position;

    this.engine.canvas.ctx.shadowColor = this.color;
    this.engine.canvas.ctx.shadowBlur = 0;
    this.engine.canvas.ctx.globalCompositeOperation = 'lighter';
    this.engine.canvas.ctx.fillStyle = this.color;
    this.engine.canvas.ctx.fillRect(x, y, this.size, this.size);
    this.engine.canvas.ctx.globalCompositeOperation = 'source-over';
  }

  update() {
    this.size -= 0.2;
    this.position.add(this.velocity);
    this.velocity.y -= this.gravity;
  }
}
