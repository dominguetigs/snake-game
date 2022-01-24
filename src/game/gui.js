export class GUI {
  constructor(engine) {
    this.engine = engine;
    this.domDayNightToggle = document.querySelector('.toggle');
    this.domRipple = document.querySelector('.ripple');
    this.domPlayGame = document.getElementById('play-game');
    this.domPauseGame = document.getElementById('pause-game');
    this.domResetGame = document.getElementById('reset-game');
    this.domGamePadIcon = document.getElementById('game-pad');
    this.domScoreVolumeMute = document.getElementById('volume-mute');
    this.domScoreVolumeUp = document.getElementById('volume-up');
    this.domScoreGame = document.getElementById('score');
    this.domGamePad = document.getElementById('game-pad-control');
    this.scoreValue = 0;
    this.maxScore = 0;
    this.style = getComputedStyle(document.body);

    // Event Listeners
    this.domDayNightToggle.addEventListener(
      'click',
      this.toggle.bind(this),
      false
    );

    this.domScoreVolumeMute.addEventListener(
      'click',
      this.volumeMute.bind(this),
      false
    );

    this.domScoreVolumeUp.addEventListener(
      'click',
      this.volumeUp.bind(this),
      false
    );

    this.domGamePadIcon.addEventListener(
      'click',
      this.toggleGamePad.bind(this),
      false
    );

    this.setup();
  }

  setup() {
    this.domPauseGame.classList.add('hidden');
    this.domPlayGame.classList.remove('hidden');
    this.domScoreVolumeMute.classList.add('hidden');
    this.domScoreGame.innerText = '00';
    this.scoreValue = 0;
  }

  toggleGamePad() {
    /* this.domGamePadIcon.classList.toggle('--desactive');
    this.domGamePad.classList.toggle('--desactive');
    this.engine.calculateDimension(); */
  }

  toggle() {
    this.domDayNightToggle.classList.add('animate');
    setTimeout(() => {
      this.domDayNightToggle.classList.toggle('active');
      this.domRipple.classList.toggle('active');
      document.documentElement.classList.toggle('theme-dark');

      this.engine.snake.color = this.style.getPropertyValue('--snake');
      this.engine.playLabel.color = this.style.getPropertyValue('--text');
    }, 150);
    setTimeout(() => this.domDayNightToggle.classList.remove('animate'), 300);
  }

  play() {
    this.domPlayGame.classList.toggle('hidden');
    this.domPauseGame.classList.toggle('hidden');
  }

  pause() {
    this.domPlayGame.classList.toggle('hidden');
    this.domPauseGame.classList.toggle('hidden');
  }

  reset() {
    this.setup();
  }

  volumeMute(e) {
    // e.preventDefault();
    this.domScoreVolumeMute.classList.toggle('hidden');
    this.domScoreVolumeUp.classList.toggle('hidden');
  }

  volumeUp(e) {
    // e.preventDefault();
    this.domScoreVolumeMute.classList.toggle('hidden');
    this.domScoreVolumeUp.classList.toggle('hidden');
  }

  score() {
    this.scoreValue++;
    this.domScoreGame.innerText = this.scoreValue.toString().padStart(2, '0');
  }
}
