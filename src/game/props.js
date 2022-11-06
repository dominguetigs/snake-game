import { AssetsLoader } from '../utils/assetsLoader.js';
import { Vector } from '../utils/physics.js';
import { Utils } from '../utils/utils.js';

import { COLORS } from './constants/colors.js';
import { MAPS } from './constants/maps.js';

export class Props {
  wallStyle = 'wall4';
  map = MAPS.MAP_8;
  coordinates = [];
  coordinatesVectors = [];

  constructor(engine) {
    this.engine = engine;
    this.update();
  }

  update() {
    const { x: tilesX, y: tilesY } = this.engine.canvas.getTiles();

    const {
      map,
      hasBoundary,
      hasSpaceX,
      hasSpaceY,
      spacePercentageX,
      spacePercentageY,
    } = this.map;

    this.coordinates = [];

    if (map.length > 0) {
      const { x: screenCenterX, y: screenCenterY } =
        this.engine.canvas.getScreenCenter();

      const mapCenterX = Math.floor(map[0].length / 2);
      const mapCenterY = Math.floor(map.length / 2);

      const diffX = Math.floor((tilesX - map[0].length) * spacePercentageX);
      const diffY = Math.floor((tilesY - map.length) * spacePercentageY);

      const spaceDx = hasSpaceX ? diffX + (diffX % 2) : 0;
      const spaceDy = hasSpaceY ? diffY + (diffY % 2) : 0;

      const resultMap = [
        ...this._setSpaces(spaceDx, spaceDy, mapCenterX, mapCenterY, map),
      ];

      const startY = screenCenterY - Math.floor(resultMap.length / 2);

      for (let y = 0; y < resultMap.length; y++) {
        for (let x = 0; x < resultMap[y].length; x++) {
          const startX = screenCenterX - Math.floor(resultMap[y].length / 2);

          if (resultMap[y][x]) {
            this.coordinates.push([startX + x, startY + y]);
            this.coordinatesVectors.push(
              new Vector(
                (startX + x) * this.engine.tileSize,
                (startY + y) * this.engine.tileSize
              )
            );
          }
        }
      }
    }

    if (hasBoundary) {
      const upLimit = 0;
      const rightLimit = this.engine.width / this.engine.tileSize - 1;
      const downLimit = this.engine.height / this.engine.tileSize - 1;
      const leftLimit = 0;

      for (let x = 0; x < tilesX; x++) {
        for (let y = 0; y < tilesY; y++) {
          if (
            y === upLimit ||
            x === rightLimit ||
            y === downLimit ||
            x === leftLimit
          ) {
            this.coordinates.push([x, y]);
          }
        }
      }
    }
  }

  draw() {
    /* if (AssetsLoader.imageHasLoaded(this.wallStyle)) {
      for (const coordinates of this.coordinates) {
        const [x, y] = coordinates;

        this.engine.canvas.ctx.drawImage(
          AssetsLoader.images[this.wallStyle],
          x * this.engine.tileSize,
          y * this.engine.tileSize,
          this.engine.tileSize,
          this.engine.tileSize
        );
      }
    } */

    this.engine.canvas.ctx.fillStyle = COLORS.props;

    for (const coordinates of this.coordinates) {
      const [x, y] = coordinates;

      this.engine.canvas.ctx.fillRect(
        x * this.engine.tileSize,
        y * this.engine.tileSize,
        this.engine.tileSize,
        this.engine.tileSize
      );
    }
  }

  _setSpaces(spaceDx, spaceDy, centerX, centerY, map) {
    let resultMap = [];

    const spaceX = Utils.getFillArray(spaceDx);
    const spaceY = Utils.getFillArray(
      spaceDy,
      Utils.getFillArray(map[0].length + spaceX.length)
    );

    for (let y = 0; y < map.length; y++) {
      const currentMx = map[y];

      resultMap.push([
        ...currentMx.slice(0, centerX),
        ...spaceX,
        ...currentMx.slice(centerX),
      ]);
    }

    resultMap = [
      ...resultMap.slice(0, centerY),
      ...spaceY,
      ...resultMap.slice(centerY),
    ];

    return resultMap;
  }
}
