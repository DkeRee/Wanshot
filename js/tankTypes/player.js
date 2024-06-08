class Piss {
	constructor(x, y, angle) {
		this.radius = PISS_RADIUS;
		this.angle = angle + (Math.random() < 0.5 ? Math.random() * 15 : -Math.random() * 15) * Math.PI / 180;
		this.x = x;
		this.y = y;
		this.color = "#FEF600";
		this.opacity = 1;
		this.speed = 8000;
	}

	update() {
		//if player ISNT dead, update particles
		if (!STAGE_CACHE.player.dead) {
			//GOAL: Make particles of different size spew out in direction of player, slowing to a halt and laying there

			this.speed /= 120 * deltaTime;
			this.opacity -= 4 * deltaTime;

			//update position
			this.x += this.speed * Math.cos(this.angle) * deltaTime;
			this.y += this.speed * Math.sin(this.angle) * deltaTime;

			if (this.opacity <= 0) {
				this.explode = true;
			}
		}
	}

	render() {
		//RENDER PARTICLE
		ctx.shadowBlur = 10;
		ctx.shadowColor = this.color;

		//color in rgba to support opacity
		ctx.fillStyle = hexToRgbA(this.color, this.opacity);
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
		ctx.fill();

		ctx.shadowBlur = 0;
	}
}

//color code: bodyColor, turretColor, sideColor
class Player extends Tank {
	constructor(x, y, angle, turretAngle) {
		super(x, y, angle, turretAngle, -5, 5, -5, "#224ACF", "#1E42B8", "#0101BA", 100, 3, PLAYER_ID, PLAYER_ID);

		//FOR SOUND PLAYING
		this.moving = false;

		//caps number of mines layed
		this.mineLayed = 0;

		//delays mine spamming
		this.mineDelay = 50;

		this.keys = {};

		//bruh
		this.pee = false;
		this.pissStream = [];
	}

	update() {
		//update tankBody
		super.update();

		//update turret angle
		this.turretAngle = Math.atan2(MOUSE_POS.y - this.centerY, MOUSE_POS.x - this.centerX);

		//update mineDelay
		this.mineDelay += deltaTime;

		var isUp = false;
		var isDown = false;

		//if tank is NOT SHELLSHOCKED and isn't dead
		if (!this.dead) {
			//up
			if (this.keys[87] || this.keys[38]) {
				this.x += this.xInc;
				this.y += this.yInc;
				isUp = true;
			}

			//down
			if (this.keys[83] || this.keys[40]) {
				this.x -= this.xInc;
				this.y -= this.yInc;
				isDown = true;
			}

			//update moving trackers
			if ((isUp == false && isDown == false) || (isUp == true && isDown == true)) {
				this.moving = false;
			} else {
				this.moving = true;
			}

			//right rotation
			if (this.keys[65] || this.keys[37]) {
				this.angle -= this.rotationSpeed * deltaTime;
			}

			//left rotation
			if (this.keys[68] || this.keys[39]) {
				this.angle += this.rotationSpeed * deltaTime;
			}

			//check for keybind for laying mines
			if (this.keys[32]) {
				//lay mine
				super.layMine();
				delete this.keys[32];
			}
		}

		//update RGB if toggled
		if (SETTING_RGB) {
			const rate = deltaTime * 900;

			if (rgb.r > 0 && rgb.b == 0) {
				rgb.r -= rate;
				rgb.g += rate;
			}

			if (rgb.g > 0 && rgb.r == 0) {
				rgb.g -= rate;
				rgb.b += rate;
			}

			if (rgb.b > 0 && rgb.g == 0) {
				rgb.r += rate;
				rgb.b -= rate;
			}
		}

		//update pee hee hee (i am mickhel jeckson;!!(real))
		if (this.pee && !this.dead) {
			this.pissStream.push(new Piss(this.centerX, this.centerY, this.angle));
		}

		for (var i = 0; i < this.pissStream.length; i++) {
			const pee = this.pissStream[i];

			if (pee.explode) {
				//DELETE PARTICLE
				this.pissStream.splice(i, 1);
				continue;
			}

			pee.update();
		}
	}
	
	explode() {
		//die
		super.explode();

		//start intermission
		intermissionStatus = INTERMISSION_RETRY;
		INTERMISSION = true;
	}

	shoot() {
		if (!INTERMISSION && !this.dead) {
			super.shoot(NORMAL_SHELL);		
		}
	}

	layMine() {
		if (this.mineLayed < 2 && this.mineDelay > 2 && !INTERMISSION && !this.dead) {
			this.tankShock = -0.2;
			this.mineLayed++;
			this.mineDelay = 0;

			this.layMine(this.tankID);
		}
	}

	render() {
		//auuuuhh
		for (var i = 0; i < this.pissStream.length; i++) {
			this.pissStream[i].render();
		}

		//render headlights if player isn't dead && player wants headlights
		if (!this.dead && SETTING_HEADLIGHTS) {
			ctx.shadowBlur = 100;

			ctx.shadowColor = "#FEE75C";
			ctx.fillStyle = hexToRgbA("#FEE75C", 0.13);

			const heart = new xy(this.centerX, this.centerY);
			const offset = 30 * Math.PI / 180;

			ctx.beginPath();
			ctx.moveTo(heart.x, heart.y);
			ctx.arc(heart.x, heart.y, 70, this.angle - offset, this.angle + offset);
			ctx.lineTo(heart.x, heart.y);
			ctx.closePath();
			ctx.fill();

			ctx.shadowBlur = 0;
		}

		if (SETTING_RGB) {
			super.renderRGB();
		} else {
			super.render();			
		}
	}
}