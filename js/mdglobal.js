/*
 * Mitchell Douma
 */

var currentScore = 0;

var gunSound = new Audio();
var quacking = new Audio();
var music = new Audio();

var muteEffects = false;

function calculateScore(score) {
    currentScore += score;
    document.getElementById("score").innerHTML = currentScore;
}

function playQuacking() {
    quacking.src = 'sounds/quacking.mp3';
    if (!muteEffects) {
        quacking.addEventListener('ended', function () {
            this.currentTime = 0;
            this.play();
        }, false);

        quacking.play();
    }
}

function playMusic() {
    music.src = 'sounds/music.wav';
    music.addEventListener('ended', function () {
        this.currentTime = 0;
        this.play();
    }, false);
    music.play();
}

function toggleMuteMusic() {
    if ($("#mdMusic").is(":checked")) {
        playMusic();
    } else {
        music.pause();
    }
}

function toggleMuteSound() {
    if ($("#mdSound").is(":checked")) {
        muteEffects = false;
    } else {
        muteEffects = true;
    }
}

function playGunShot() {
    gunSound.src = 'sounds/gunSound.mp3';
    if (!muteEffects) {
        gunSound.play();
    }
}

function gotoGame() {
    $(location).prop('href', '#gamePage');
}
function gotoControls() {
    $(location).prop('href', '#controlPage');
}
function gotoOptions() {
    $(location).prop('href', '#optionsPage');
}
function gotoAbout() {
    $(location).prop('href', '#aboutPage');
}

function init() {
    $("#mdPlayGame").on("click", gotoGame);
    $("#mdControls").on("click", gotoControls);
    $("#mdOptions").on("click", gotoOptions);
    $("#mdAbout").on("click", gotoAbout);

    $("#mdMusic").on("click", toggleMuteMusic);
    $("#mdSound").on("click", toggleMuteSound);

    $("#homePage").on("mouseenter", toggleMuteMusic);
    if (!muteEffects) {
        $("#gamePage").on("pageshow", playQuacking);
    }
    
    $("#gamePage").on("click", playGunShot);
}


$(document).ready(function () {
    init();
});
