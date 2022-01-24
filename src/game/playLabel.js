import { Utils } from '../utils/utils.js';

import { COLORS } from './constants/colors.js';
import { LABELS } from './constants/labels.js';

export class PlayLabel {
  text = '';

  constructor(engine) {
    this.engine = engine;
    this.color = '#212121';
  }

  update() {
    if (Utils.isMobileDevice()) {
      if (Utils.isPortraitOrientation()) {
        // TODO: Apply rule that block game in portrait mode
        // this.text = LABELS['playLabel']['messages']['portrait'];
        this.text = LABELS.playLabel.messages.landscape;
      } else {
        this.text = LABELS.playLabel.messages.landscape;
      }
    } else {
      this.text = LABELS.playLabel.messages.pc;
    }
  }

  draw() {
    if (!this.engine.isPlaying) {
      this.engine.canvas.ctx.fillStyle = this.color;
      this.engine.canvas.ctx.font = `${this.engine.tileSize * 1.3}px Arial`;
      this.engine.canvas.ctx.fillText(
        this.text,
        this.engine.width / 2 -
          this.engine.canvas.ctx.measureText(this.text).width / 2,
        this.engine.height / 2
      );
    }
  }
}
