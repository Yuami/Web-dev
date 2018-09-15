var socket = io('http://localhost:2000');
socket.on('connect', function () {
});
socket.on('event', function (data) {
});
socket.on('disconnect', function () {
});

document.addEventListener('DOMContentLoaded', () => {
    // This is the bare minimum JavaScript. You can opt to pass no arguments to setup.
    const player = new Plyr('#player');

    // Bind event listener
    function on(selector, type, callback) {
        document.querySelector(selector).addEventListener(type, callback, false);
    }

    player.on('playing', () => {
        socket.emit('pPlay', {});
    });

    player.on('pause', () => {
        socket.emit('pPause', {});
    });

    player.on('progress', () => {
        if (player.buffered === 0) {
            socket.emit('pPause', {})
        } else {
            socket.emit('pPlay');
        }
    });

    let lastTime = player.currentTime;

    player.on('timeupdate', () => {
        let time = player.currentTime;
        if (lastTime > time || time - 3 > lastTime)
            socket.emit('pTimeChange', time);

        lastTime = time;
    });

    socket.on('play', () => {
        player.play();
    });

    socket.on('pause', () => {
        player.pause();
    });

    socket.on('timeChange', (time) => {
        player.currentTime = time;
    });

    // Play
    on('.js-play', 'click', () => {
        player.play();
    });

    // Pause
    on('.js-pause', 'click', () => {
        player.pause();
    });

    // Stop
    on('.js-stop', 'click', () => {
        player.stop();
    });

    // Rewind
    on('.js-rewind', 'click', () => {
        player.rewind();
    });

    // Forward
    on('.js-forward', 'click', () => {
        player.forward();
    });
});