export class Utils {
  static raffle(min = 0, max = 1) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  static raffleCoordinate(
    minX = 0,
    maxX = 1,
    minY = 0,
    maxY = 1,
    excludes = []
  ) {
    const [coordinateX, coordinateY] = [
      Utils.raffle(minX, maxX),
      Utils.raffle(minY, maxY),
    ];

    if (excludes?.length > 0) {
      if (
        excludes.some(
          (coordinate) =>
            coordinate[0] === coordinateX && coordinate[1] === coordinateY
        )
      ) {
        return this.raffleCoordinate(minX, maxX, minY, maxY, excludes);
      }
    }

    return [coordinateX, coordinateY];
  }

  static getOrientation(reference1, reference2) {
    if (reference1 > reference2) {
      return 1;
    }

    if (reference1 < reference2) {
      return -1;
    }

    return 0;
  }

  static getFillArray(count = 0, fillWith = 0) {
    return Array(count).fill(fillWith);
  }

  static isMobileDevice() {
    return /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
  }

  static isPortraitOrientation() {
    return !!window.matchMedia('(orientation: portrait)').matches;
  }

  static generateRandomPositions(configs, maxPositions = 10) {
    const { width, height, tileSize } = configs;

    return [...Array(maxPositions)].map((_) => {
      return [
        this.raffle(0, width / tileSize - tileSize / 2),
        this.raffle(0, height / tileSize - tileSize / 2),
      ];
    });
  }

  static randHue() {
    return ~~(Math.random() * 360);
  }
}
