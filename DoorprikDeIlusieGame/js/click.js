class Circle {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  get x() {
    return this._x;
  }
  get y() {
    return this._y;
  }
  get radius() {
    return this._radius;
  }
  get color() {
    return this._color;
  }

  set x(value) {
    this._x = value;
  }
  set y(value) {
    this._y = value;
  }
  set radius(value) {
    this._radius = value;
  }
  set color(value) {
    this._color = value;
  }
}

class Game {
  constructor(width, height) {
    this.circles = [];
    this.colors = ['red', 'blue', 'green', 'black', 'yellow'];
    this.numberOfRedBalls = 8;
    this.numberOfSeconds = 0;
    this.width = width;
    this.height = height;
    this.numberOfSecondsRecord = Number.MAX_VALUE;
    this.createCircles();
  }

  get circles() {
    return this._circles;
  }
  get colors() {
    return this._colors;
  }
  get numberOfRedBalls() {
    return this._numberOfRedBalls;
  }
  get numberOfSeconds() {
    return this._numberOfSeconds;
  }
  get width() {
    return this._width;
  }
  get height() {
    return this._height;
  }

  set circles(value) {
    this._circles = value;
  }
  set colors(value) {
    this._colors = value;
  }
  set numberOfRedBalls(value) {
    this._numberOfRedBalls = value;
  }
  set numberOfSeconds(value) {
    this._numberOfSeconds = value;
  }
  set width(value) {
    this._width = value;
  }
  set height(value) {
    this._height = value;
  }

  createCircles() {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < this._colors.length; j++) {
        const radius = Math.floor(Math.random() * (20 - 10 + 1)) + 10;
        const circle = new Circle(0, 0, radius, this._colors[j]);
        this._circles.push(circle);
      }
    }
  }

  randomizeCircles() {
    this._circles.forEach((value, index, array) => {
      value.x = Math.floor(Math.random() * this.width);
      value.y = Math.floor(Math.random() * this.height);
    });
  }

  checkClick(x, y) {
    for (let i = 0; i < this.circles.length; i++) {
      const distance = Math.sqrt(
        Math.pow(this.circles[i].x - x, 2) + Math.pow(this.circles[i].y - y, 2)
      );
      if (
        distance <= this.circles[i].radius &&
        this.circles[i].color === 'red'
      ) {
        this.circles.splice(i, 1);
        this.numberOfRedBalls--;
        return true;
      }
    }
    return false;
  }

  checkEndGame() {
    return this.numberOfRedBalls === 0;
  }
}

class GameComponent {
  constructor(window) {
    this.window = window;
    this.cv = window.document.getElementById('gameCanvas');
    this.ctx = this._cv.getContext('2d');
    this.game = new Game(this._cv.width, this._cv.height);
    this.timer = null;
    this.record = 0;
    this.storage = window.localStorage;
  }

  get window() {
    return this._window;
  }
  get cv() {
    return this._cv;
  }
  get ctx() {
    return this._ctx;
  }
  get game() {
    return this._game;
  }
  get timer() {
    return this._timer;
  }
  get record() {
    return this._record;
  }
  get storage() {
    return this._storage;
  }

  set window(value) {
    this._window = value;
  }
  set cv(value) {
    this._cv = value;
  }
  set ctx(value) {
    this._ctx = value;
  }
  set game(value) {
    this._game = value;
  }
  set timer(value) {
    this._timer = value;
  }
  set record(value) {
    this._record = value;
  }
  set storage(value) {
    this._storage = value;
  }

  drawGame() {
    this._ctx.clearRect(0, 0, this._cv.width, this._cv.height);
    this.drawCircles();
    this.showNumberRedBalls();
  }

  drawCircles() {
    this._game.randomizeCircles();
    this._game.circles.forEach((value, index, array) => {
      this._ctx.beginPath();
      this._ctx.arc(
        this._game.circles[index].x,
        this._game.circles[index].y,
        this._game.circles[index].radius,
        0,
        2 * Math.PI,
        false
      );
      this._ctx.fillStyle = this._game.circles[index].color;
      this._ctx.fill();
      this._ctx.closePath();
    });
  }

  showNumberRedBalls() {
    document.getElementById('rb').innerHTML = this._game.numberOfRedBalls;
  }

  startChronometer() {
    this._timer = this._window.setTimeout(() => {
      document.getElementById('time').innerHTML = this.formatTime(
        this._game.numberOfSeconds++
      );
      this.startChronometer();
    }, 1000);
  }

  stopChronometer() {
    this._timer = this._window.clearTimeout(this._timer);
  }

  stopGame() {
    this.stopChronometer();
    this._cv.onclick = null;
    if (this._game.numberOfSeconds < this._game.numberOfSecondsRecord) {
      this._game.numberOfSecondsRecord = this._game.numberOfSeconds;
      this._record = this._game.numberOfSecondsRecord;
      this.setRecordInStorage();
      document.getElementById('record').innerHTML = this.formatTime(this._record);
    }
  }

  getRecordFromStorage() {
    this._record = 0;
    if (this._storage.getItem('record')) {
      this._record = JSON.parse(this._storage.getItem('record'));
    }
  }

  setRecordInStorage() {
    try {
      this._storage.setItem('record', JSON.stringify(this._record));
    } catch (e) {
      if (e == QUOTA_EXCEEDED_ERR) alert('Not enough space!');
    }
  }

  formatTime(time) {
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    return minutes + ':' + seconds;
  }
}

function init() {
  const gameComponent = new GameComponent(this);
  if (!gameComponent.storage) {
    //browser ondersteunt geen storage
    alert('no storage available. ');
    document.getElementById('gameCanvas').disabled = true;
    return;
  }

  gameComponent.drawGame();
  gameComponent.startChronometer();
  gameComponent.getRecordFromStorage();
  const time = gameComponent.storage.getItem('record');
  if (time == NaN || time == undefined) {
    document.getElementById('record').innerHTML = 'No record available';
  } else {
    gameComponent._game.numberOfSecondsRecord = time;
    document.getElementById('record').innerHTML = gameComponent.formatTime(time);
  }
  gameComponent.cv.onclick = event => {
    const xco = event.pageX - gameComponent.cv.offsetLeft;
    const yco = event.pageY - gameComponent.cv.offsetTop;
    gameComponent.game.checkClick(xco, yco);
    gameComponent.drawGame();

    if (gameComponent.game.checkEndGame()) {
      gameComponent.stopGame();
    }
  };
}

window.onload = () => {
  init();
};
