var five = require('johnny-five');
var board = new five.Board();
var interval = Number(process.argv[2]);

board.on('ready', function() {
  var leds = new five.Leds([3, 5, 6]),
    button = new five.Button(2),
    held = false,
    shutdown = 0,
    ledInterval = (interval * 60000) / leds.length

  resetTimer();

  function fadeLedIn (led) {
    leds[led].fade(20, ledInterval);
  };

  function timerIsDone (timer) {
    clearInterval(timer);
    leds.pulse({
      easing: 'linear',
      duration: 500,
      cuePoints: [0, 0.2, 0.4, 0.6, 0.8, 1],
      keyFrames: [0, 30, 0]
    });
  };

  function resetTimer() {
    shutdown = 0;
    held = false;
    var ledToFade = 0;
    shutdownTimer();

    fadeLedIn(ledToFade);
    ++ledToFade;

    var timer = setInterval(function () {
      if (ledToFade === leds.length) {
        timerIsDone(timer);
        return;
      }

      fadeLedIn(ledToFade);
      ++ledToFade;

    }, ledInterval);
  };

  function shutdownTimer () {
    leds.stop().off();
  }

  button.on('hold', function() {
    held = true;
    shutdownTimer();
  });

  button.on('release', function() {
    if (held) resetTimer();
  });

  button.on('press', function () {
    ++shutdown
    if (shutdown > 2) shutdownTimer();
  });
});
