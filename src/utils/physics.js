export class Physics {
  // TODO: Remover método depois
  static checkCollision(x1, y1, x2, y2) {
    return x1 === x2 && y1 === y2;
  }

  static isCollision(vector1, vector2) {
    return vector1.x === vector2.x && vector1.y === vector2.y;
  }

  static checkCollisions(x1, y1, coordinates = []) {
    return coordinates.some(([x, y]) => this.checkCollision(x1, y1, x, y));
  }
}

export class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(vector) {
    this.x += vector.x;
    this.y += vector.y;

    return this;
  }

  mult(vector) {
    if (vector instanceof Vector) {
      this.x *= vector.x;
      this.y *= vector.y;
    } else {
      this.x *= vector;
      this.y *= vector;
    }

    return this;
  }
}
