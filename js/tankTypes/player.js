class Exhaust {
	constructor(side, x, y, angle) {
		this.possibleColors = ["#ED4245", "#FFA500", "#FFBF00"];

		this.color = this.possibleColors[Math.floor(Math.random() * this.possibleColors.length)];
		this.side = side;
		this.x = x;
		this.y = y;
		this.centerX = this.x + this.side / 2;
		this.centerY = this.y + this.side / 2;
		this.angle = angle;
		this.side;
		this.opacity = 1;
		this.delete = false;
	}

	update() {
		this.x -= 200 * Math.cos(this.angle) * deltaTime;
		this.y -= 200 * Math.sin(this.angle) * deltaTime;
		this.opacity -= 2 * deltaTime;

		this.centerX = this.x + this.side / 2;
		this.centerY = this.y + this.side / 2;

		if (this.opacity <= 0) {
			this.delete = true;
			return;
		}
	}

	render() {
		//RENDER PARTICLE
		ctx.shadowBlur = 5;
		ctx.shadowColor = this.color;
		ctx.save();

		ctx.translate(this.centerX, this.centerY);
		ctx.rotate(this.angle);

		//color in rgba to support opacity
		ctx.fillStyle = hexToRgbA(this.color, this.opacity);
		ctx.fillRect(this.side / -2, this.side / -2, this.side, this.side);

		ctx.restore();
		ctx.shadowBlur = 0;
	}
}

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

		//key pressed
		this.keys = {};

		//for classic wasd
		this.instaRotSpeed = degreesToRadians(5);

		//exhaust
		this.exhaustDelay = -1;
		this.exhaustDelayCount = 0;
		this.exhaustList = [];

		//bruh
		this.pee = false;
		this.pissStream = [];
	}

	angleControl() {
		var isUp = false;
		var isDown = false;

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
	}

	wasdControl() {
		const w = this.keys[87] || this.keys[38];
		const a = this.keys[68] || this.keys[39];
		const s = this.keys[83] || this.keys[40];
		const d = this.keys[65] || this.keys[37];

		//move if any key is being pressed
		if (w || a || s || d) {
			this.moving = true;
			this.x += this.xInc;
			this.y += this.yInc;

			//set angle to move to if a key or key combo is being pressed
			const wA = w ? degreesToRadians(90) : 0;
			const wN = w ? 1 : 0;
			const aA = a ? degreesToRadians(180) : 0;
			const aN = a ? 1 : 0;
			const sA = s ? degreesToRadians(270) : 0;
			const sN = s ? 1 : 0;

			const onlyOne = !(w && d) && (w || d);
			const dAngle = onlyOne ? (w ? 0 : 2 * Math.PI) : 0;
			const dA = d ? dAngle : 0;
			const dN = d ? 1 : 0;
			const goalRot = (((wA + aA + sA + dA) / (wN + aN + sN + dN)) + Math.PI) % (2 * Math.PI);

			//move to that angle
			var diff = goalRot - this.angle;
			var diffOther = 2 * Math.PI - diff;

			if (diff >= 0) {
				if (diff < diffOther) {
					//+
					this.angle += this.instaRotSpeed;
				} else {
					//-
					this.angle -= this.instaRotSpeed;
				}
			} else {
				diff = Math.abs(diff);
				diffOther = 2 * Math.PI - diff;

				if (diff < diffOther) {
					//-
					this.angle -= this.instaRotSpeed;
				} else {
					//+
					this.angle += this.instaRotSpeed;
				}
			}

			diff = diff < diffOther ? diff : diffOther;
			if (diff <= degreesToRadians(10)) {
				this.instaRotSpeed = degreesToRadians(1);
			} else {
				this.instaRotSpeed = degreesToRadians(12);
			}
		} else {
			this.moving = false;
		}
	}

	updateExhaust() {
		//create new exhaust if tank is not dead
		if (!this.dead && SETTING_EXHAUST) {
			if (this.exhaustDelayCount < 0) {
				this.exhaustDelayCount++;
			} else {
				this.exhaustDelayCount = this.exhaustDelay;

				const offset = Math.floor(Math.random() * TANK_HEIGHT / 3);
				const heightOffset = Math.random() > 0.5 ? offset : -offset;
				const randSide = Math.floor(Math.random() * 17);

				this.exhaustList.push(new Exhaust(randSide, (this.centerX - randSide / 2) + heightOffset, (this.centerY - randSide / 2) + heightOffset, this.angle));
			}
		}

		//update exhaust
		for (var i = 0; i < this.exhaustList.length; i++) {
			const exhaust = this.exhaustList[i];

			if (exhaust.delete) {
				this.exhaustList.splice(i, 1);
				continue;
			}

			exhaust.update();
		}
	}

	update() {
		//update tankBody
		super.update();

		//update exhaust
		this.updateExhaust();

		//update turret angle
		this.turretAngle = Math.atan2(MOUSE_POS.y - this.centerY, MOUSE_POS.x - this.centerX);

		//update mineDelay
		this.mineDelay += deltaTime;

		//if tank is NOT SHELLSHOCKED and isn't dead
		if (!this.dead) {

			//check for movement setting
			if (!SETTING_WASD) {
				this.angleControl();
			} else {
				this.wasdControl();
			}

			//check for keybind for laying mines
			if (this.keys[32]) {
				//lay mine
				this.layMine();
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
		if (this.mineLayed < 3 && this.mineDelay > 2 && !INTERMISSION && !this.dead) {
			this.mineLayed++;
			this.mineDelay = 0;

			super.layMine();
		}
	}

	render() {
		//auuuuhh
		for (var i = 0; i < this.pissStream.length; i++) {
			this.pissStream[i].render();
		}

		//render exhaust
		for (var i = 0; i < this.exhaustList.length; i++) {
			this.exhaustList[i].render();
		}

		if (SETTING_RGB) {
			super.renderRGB();
		} else {
			super.render();			
		}
	}
}