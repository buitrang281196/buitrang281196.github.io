const WIDTH = 1400;
const HEIGHT = 800;
const PARTICLE_SIZE = 7;
const PARTICLE_CHANGE_SIZE_SPEED = 0.1;
const PARTICLE_SPEED = 10;
const PARTICLE_CHANGE_SPEED = 0.3;
const ACCELERATION = 0.15;
const DOT_CHANGE_SIZE_SPEED = 0.05;
const DOT_CHANGE_ALPHA_SPEED = 0.05;
const PARTICLE_MIN_SPEED = 10;
const NUMBER_PARTICLE_PER_BULLET = 25;

class particle {
    constructor(bullet, deg) {
        this.bullet = bullet;
        this.ctx = bullet.ctx;
        this.deg = deg;
        this.x = this.bullet.x;
        this.y = this.bullet.y;
        this.color = this.bullet.color;
        this.size = PARTICLE_SIZE;
        this.speed = Math.random() * 4 + PARTICLE_MIN_SPEED;
        this.speedX = 0;
        this.speedY = 0;
        this.fallSpeed = 0;


        this.dots = [];
        // {
        //     x: 10,
        //     y: 10, 
        //     alpha: 1,
        //     size: 10
        // }


    }

    update() {

        this.speed -= PARTICLE_CHANGE_SPEED;
        if (this.speed < 0) {
            this.speed = 0;
        }

        this.fallSpeed += ACCELERATION;

        this.speedX = this.speed * Math.cos(this.deg);
        this.speedY = this.speed * Math.sin(this.deg) + this.fallSpeed;

        this.x += this.speedX;
        this.y += this.speedY;

        if (this.size > PARTICLE_CHANGE_SIZE_SPEED) {
            this.size -= PARTICLE_CHANGE_SIZE_SPEED;
        }

        if (this.size > 0) {
            this.dots.push({
                x: this.x,
                y: this.y,
                alpha: 1,
                size: this.size
            });
        }

        this.dots.forEach(dot => {
            dot.size -= DOT_CHANGE_SIZE_SPEED;
            dot.alpha -= DOT_CHANGE_ALPHA_SPEED;
        });

        this.dots = this.dots.filter(dot => {
            return dot.size > 0;
        });

        if (this.dots.length == 0) {
            this.remove();
        };

    }

    remove() {
        this.bullet.particles.splice(this.bullet.particles.indexOf(this), 1);
    };

    draw() {
        this.dots.forEach(dot => {
            this.ctx.fillStyle = 'rgba(' + this.color + ',' + dot.alpha + ')';
            this.ctx.beginPath();
            this.ctx.arc(dot.x, dot.y, dot.size, 0, 2 * Math.PI);
            this.ctx.fill();
        })
    }
}

class bullet {
    constructor(fireworks) {
        this.fireworks = fireworks;
        this.ctx = fireworks.ctx;
        this.x = Math.random() * WIDTH / 2;
        this.y = Math.random() * HEIGHT / 2;
        this.color = Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255);


        this.particles = [];


        // creat one particle //
        let bullerDeg = Math.PI * 2 / NUMBER_PARTICLE_PER_BULLET;
        for (let i = 0; i < NUMBER_PARTICLE_PER_BULLET; i++) {

            let newPaticle = new particle(this, i * bullerDeg);
            this.particles.push(newPaticle);
        }

    }

    remove() {
        this.fireworks.bullets.splice(this.fireworks.bullets.indexOf(this), 1);
    };

    update() {
        if (this.particles.length == 0) {
            this.remove();
        }
        this.particles.forEach(particle => particle.update());
    }

    draw() {
        this.particles.forEach(particle => particle.draw());
    }
}


class fireworks {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = WIDTH;
        this.canvas.height = HEIGHT;


        document.body.appendChild(this.canvas);

        // this.ctx.fillText('Thành Xinh Gái', 100, 1300);
        var self = this;
        // this.ctx.background = 'url(images/mylove.jpg)';
        this.image = null;
        this.audio = true;
        this.text = '';
        // this.loadImage();
        // this.background = new Image();
        // this.background.src = 'images/mylove.jpg';
        // this.background.onload = function() {
        //         this.ctx.drawImage(this.background, 0, 0);
        //     }
        // -----------------------------------------

        // this.audio = new Audio('sound/wedding.mp3')

        // -----------------------------------------

        this.bullets = [];

        setInterval(() => {
            let newBullet = new bullet(this);
            this.bullets.push(newBullet);
        }, 1000)

        this.loadImage();

        this.loop();

        this.clickMusic();

        this.addText();

    }


    loop() {
        this.bullets.forEach(bullet => bullet.update());
        this.draw();
        // console.log(this.draw());
        setTimeout(() => this.loop(), 20)
    }

    clearScreen() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, WIDTH, HEIGHT);

        // let img = new Image();
        // img.src = 'images/mylove.jpg';
        // img.onload = function() {
        //     var c = document.querySelector('canvas');
        //     this.ctx.fillStyle = this.ctx.createPattern(img, 'repeat');
        // }
    }


    draw() {
        this.clearScreen();

        this.ctx.fillText('Thành Xinh Gái', 100, 1300);

        this.ctx.drawImage(this.image, 0, 0, WIDTH, HEIGHT - 200);
        // this.ctx.fillText('Thành Xinh Gái', 100, 1300);
        // console.log(this.ctx.fillText('Thành Xinh Gái', 10, 50))
        // console.log(this.ctx.fillText('Thành Xinh Gái', 10, 50))
        // console.log(this.ctx.drawImage(this.image, 0, 0, WIDTH, HEIGHT - 200))


        // var background = new Image();
        // background.src = "images/mylove.jpg";
        // // background.onload = function() {
        // //     this.ctx.drawImage(background, 0, 0);
        // // }
        // this.loadImage();

        this.bullets.forEach(bullet => bullet.draw());
    }

    clickMusic() {
        const screen = document.querySelector('canvas');
        screen.addEventListener('click', () => {
            var audio = new Audio('sound/wedding.mp3');
            if (this.audio == true) {
                audio.play();
                this.audio = false;
            };
        });
        // var audio = new Audio('sound/wedding.mp3');
        // audio.addEventListener("canplaythrough", event => {
        //     /* the audio is now playable; play it if permissions allow */
        //     audio.play();
        // });
    }

    addText() {
        const textCanvas = document.querySelector('canvas').getContext('2d');
        textCanvas.fillText('xin chao', 20, 1300);
    }

    loadImage() {
        this.image = new Image();
        this.image.src = "images/mylove.jpg"
            // console.log(this.image);
    }

}


var f = new fireworks()