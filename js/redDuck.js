/*
 * Mitchell Douma
 */
(function () {

    var duck;
    var duckImage = new Image();
    var canvas;
    var dead = false;
    var positionX = 0;
    var positionY = 0;
    var shot = new Audio();
    var thud = new Audio();

    function gameLoop() {
        window.requestAnimationFrame(gameLoop);

        duck.update();
        duck.render();
    }

    //start game loop as soon as sprite sheet loads
    duckImage.addEventListener("load", gameLoop);
    duckImage.src = "images/redDuckSprites.png";
    shot.src = "sounds/quak.mp3";
    thud.src = "sounds/thud.mp3";

    function sprite(options) {

        var that = {};

        var directionX = false;
        var directionY = false;
        var frameIndex = 4,
            tickCount = 0,
            ticksPerFrame = 15;
        numberOfFrames = options.numberOfFrames || 1;

        var deadCount = 0;

        that.context = options.context;
        that.width = options.width;
        that.height = options.height;
        that.image = options.image;

        that.loop = options.loop;

        that.update = function () {

            tickCount += 1;

            if (tickCount > ticksPerFrame) {

                tickCount = 0;

                if (positionX >= window.innerWidth) {
                    directionX = false;
                    frameIndex = 8;
                }
                if (positionX <= 0) {
                    directionX = true;
                    frameIndex = 0;
                }
                if (positionY >= window.innerHeight) {
                    directionY = false;
                }
                if (positionY <= 0) {
                    directionY = true;
                }

                if (dead) {
                    frameIndex = 12;
                    deadCount += 1;
                    if(deadCount > 2){
                        frameIndex = 13;
                        positionY += 20;
                    }
                    if (positionY >= window.innerHeight){
                        if(!muteEffects){
                            thud.play();
                        }  
                        spawnDuck();
                    }
                }
                else {
                    if (directionX) {
                        if (frameIndex < 3) {
                            frameIndex += 1;
                        }
                        else {
                            frameIndex = 0;
                        }
                        positionX += 15;
                    }
                    else if (!directionX) {
                        if (frameIndex < 7) {
                            frameIndex += 1;
                        }
                        else {
                            frameIndex = 4;
                        }
                        positionX -= 15;
                    }
                    if (!directionY) {
                        positionY -= 20;
                    }
                    else if (directionY) {
                        positionY += 20;
                    }
                }          
            }
            //console.log(positionX);
        };

        that.render = function () {

            //clear canvas   
            if(dead){
                that.context.clearRect(positionX, positionY - 20, that.width, that.height);
            }
            if (directionY) {
                that.context.clearRect(positionX - 15, positionY - 20, that.width, that.height);
            }
            else {
                that.context.clearRect(positionX - 15, positionY + 20, that.width, that.height);
            }

            // Draw the animation
            that.context.drawImage(
                that.image,
                frameIndex * that.width / numberOfFrames,
                0,
                that.width / numberOfFrames,
                that.height,
                positionX,
                positionY,
                that.width / numberOfFrames,
                that.height);
        };
        that.getFrameWidth = function () {
            return that.width / numberOfFrames;
        };
        return that;
    }

    function destroyDuck(destroyedDuck) {
        if(duck === destroyedDuck){
         //   duck = null;
        }
    }

    function spawnDuck() {
        dead = false;
        duck = sprite({
            context: canvas.getContext("2d"),
            width: 490,
            height: 34,
            image: duckImage,
            numberOfFrames: 14,
            ticksPerFrame: 4,
        });
        positionX = Math.random() * (window.innerWidth - 1) + 1;
        positionY = Math.random() * (window.innerHeight - 1) + 1;
    }

    function getElementPosition(element) {
        var parentOffset;
        var position = {
            x: element.offsetLeft,
            y: element.offsetTop
        };
        if (element.offsetParent) {
            parentOffset = getElementPosition(element.offsetParent);
            position.x += parentOffset.x;
            position.y += parentOffset.y;
        }
        return position
    }
    function tap(e) {
        var location = {};
        var distance;
        var position = getElementPosition(canvas);
        var tapX = e.targetTouches ? e.targetTouches[0].pageX : e.pageX;
        var tapY = e.targetTouches ? e.targetTouches[0].pageY : e.pageY;
        var canvasScaleRatio = canvas.width / canvas.offsetWidth;
        var distanceX;
        var distanceY;
        location.x = (tapX - position.x) * canvasScaleRatio;
        location.y = (tapY - position.y) * canvasScaleRatio;

        distanceX = (positionX + duck.getFrameWidth()) - location.x;
        distanceY = (positionY + duck.getFrameWidth()) - location.y;
        distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        if (distance < duck.getFrameWidth()) {
            dead = true;
            if(!muteEffects){
                shot.play();
            }
            calculateScore(20);
        }    
       // destroyDuck(duck);
        //setTimeout(spawnDuck, 1000);

    }

    canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    spawnDuck();

    gameLoop();

    canvas.addEventListener("touchstart", tap);
    canvas.addEventListener("mousedown", tap);
}());