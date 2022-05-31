class TankParticle {
	constructor(x, y, tankColor) {
		//particle body (IT IS A SQUARE)
		this.side = 20;

		//particle info
		this.x = x;
		this.y = y;
		this.angle = (Math.floor(Math.random() * 360)) * Math.PI / 180;
		this.opacity = 1;
		this.speed = 10;
		this.explode = false;

		//RED, ORANGE, GREY
		this.possibleColors = ["#ED4245", "#FFA500", "#808080", tankColor];
		this.color = this.possibleColors[Math.floor(Math.random() * this.possibleColors.length)];
	}

	update() {
		//GOAL: move particle in random angle while it slowly fades and slows

		//update position
		this.x += this.speed * Math.cos(this.angle);
		this.y += this.speed * Math.sin(this.angle);

		//update opacity and speed
		this.opacity -= 0.05;
		this.speed -= 0.3;

		//check for deletion
		if (this.opacity <= 0) {
			this.explode = true;
		}
	}

	render() {
		//RENDER PARTICLE
		ctx.save();

		ctx.translate(this.x, this.y);
		ctx.rotate(this.angle);

		//color in rgba to support opacity
		ctx.fillStyle = hexToRgbA(this.color, this.opacity);
		ctx.fillRect(this.side / -2, this.side / -2, this.side, this.side);

		ctx.restore();
	}
}

//TANK TRACKS
class Track {
	constructor(x, y, angle) {
		//body
		this.width = 4;
		this.height = 7;
		this.color = "grey";

		//track info
		this.x = x;
		this.y = y;
		this.angle = angle;
	}

	render() {
		ctx.save();

		ctx.translate(this.x, this.y);
		ctx.rotate(this.angle);

		ctx.fillStyle = this.color;

		//LEFT WHEEL TRACK
		ctx.fillRect(this.width / -2, (this.height / -2) - this.height / 2, this.width, this.height);
		//RIGHT WHEEL TRACK
		ctx.fillRect(this.width / -2, (this.height / 2) + this.height / 1.5, this.width, this.height);

		ctx.restore();
	}
}

//GRAVE MARKER
class Grave {
	constructor(x, y, color) {
		//body
		this.width = 10;
		this.height = 30;

		//grave info
		this.x = x;
		this.y = y;
		this.color = color;
	}

	render() {
		ctx.fillStyle = this.color;

		//right tilted mark
		ctx.save();

		ctx.translate(this.x, this.y);
		ctx.rotate(-45 * Math.PI / 180);

		ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);

		ctx.restore();

		//left tilted mark
		ctx.save();

		ctx.translate(this.x, this.y);
		ctx.rotate(45 * Math.PI / 180);

		ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);

		ctx.restore();
	}
}

//TANK CONSTRUCTOR
class Tank {
	constructor(x, y, angle, turretAngle, color, sideColor, speed) {
		//body
		this.width = 45;
		this.height = 35;
		this.turretBaseSide = 20;
		this.turretNozzleWidth = 20;
		this.turretNozzleHeight = 10;

		//particles done this way to delay particle a bit
		this.tankExplosion = false;
		this.explosionRingCount = 0;
		this.explosionParticleDelay = 0;
		this.explosionParticles = [];

		//tank info
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.angle = angle;
		this.turretAngle = turretAngle;
		this.color = color;
		this.sideColor = sideColor;
	}

	explodeTank() {
		this.tankExplosion = true;
	}

	shoot(targetCoords, shellType, tankID) {
		const angle = Math.atan2(targetCoords.y - this.y, targetCoords.x - this.x);
		const initialBoost = 40;
		STAGE_CACHE.shells.push(new Shell(this.x + (initialBoost * Math.cos(angle)), this.y + (initialBoost * Math.sin(angle)), shellType, angle, tankID));
	}

	trackUpdate() {
		STAGE_CACHE.tracks.push(new Track(this.x, this.y, this.angle));
	}

	updateBody(targetCoords) {
		//update tank explosion particles
		if (this.tankExplosion) {

			//increase delay
			this.explosionParticleDelay += 1;

			if (this.explosionParticleDelay > 0) {
				//push new ring of 50 particles
				for (var i = 0; i < 50; i++) {
					this.explosionParticles.push(new TankParticle(this.x, this.y, this.color));	
				}
				this.explosionRingCount++;
				this.explosionParticleDelay = 0;

			}

			if (this.explosionRingCount == 8) {
				//stop explosion/reset
				this.tankExplosion = false;
				this.explosionRingCount = 0;
				this.explosionParticleDelay = 0;
			}
		}

		for (var i = 0; i < this.explosionParticles.length; i++) {
			const particle = this.explosionParticles[i];

			//DELETE PARTICLE
			if (particle.opacity <= 0) {
				this.explosionParticles.splice(i, 1);
				continue;
			}

			particle.update();
		}

		//update turret angle
		this.turretAngle = Math.atan2(targetCoords.y - this.y, targetCoords.x - this.x);
	}

	render(isDead) {
		//RENDER THIS IF TANK IS STILL ALIVE//
		if (!isDead) {
			ctx.save();

			ctx.translate(this.x, this.y);
			ctx.rotate(this.angle);

			//DRAW TANK BASE//		
			ctx.fillStyle = this.color;
			ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);

			//DRAW TANK SIDES//
			
			//WHEELS
			ctx.fillStyle = this.sideColor;

			//left wheel
			ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height / 5);

			//right wheel
			ctx.fillRect(this.width / -2, this.height / 3, this.width, this.height / 5);

			ctx.restore();

			ctx.save();

			//DRAW TURRET//
			ctx.translate(this.x, this.y);
			ctx.rotate(this.turretAngle);
			ctx.lineWidth = 5;
			ctx.fillStyle = this.color;
			ctx.strokeStyle = "black";

			//turret base
			ctx.strokeRect(this.turretBaseSide / -2, this.turretBaseSide / -2, this.turretBaseSide, this.turretBaseSide);
			ctx.fillRect(this.turretBaseSide / -2, this.turretBaseSide / -2, this.turretBaseSide, this.turretBaseSide);

			//turret nozzle
			ctx.strokeRect(this.turretNozzleWidth / 2, this.turretNozzleHeight / -2, this.turretNozzleWidth, this.turretNozzleHeight);
			ctx.fillRect(this.turretNozzleWidth / 2, this.turretNozzleHeight / -2, this.turretNozzleWidth, this.turretNozzleHeight);

			ctx.restore();
		}

		//RENDER THIS IF TANK IS STILL ALIVE OR DEAD//

		//RENDER TANK EXPLOSION PARTICLES
		for (var i = 0; i < this.explosionParticles.length; i++) {
			this.explosionParticles[i].render();
		}
	}
}
