class TankParticle {
	constructor(x, y, tankColor) {
		//particle body (IT IS A SQUARE)
		this.side = TANK_PARTICLE_SIDE;

		//particle info
		this.x = x;
		this.y = y;
		this.centerX = this.x + this.side / 2;
		this.centerY = this.y + this.side / 2;
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

		this.centerX = this.x + this.side / 2;
		this.centerY = this.y + this.side / 2;

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

//TANK TRACKS
class Track {
	constructor(x, y, angle) {
		//body
		this.width = TRACK_WIDTH;
		this.height = TRACK_HEIGHT;
		this.color = "grey";

		//track info
		this.x = x;
		this.y = y;
		this.centerX = this.x + this.width / 2;
		this.centerY = this.y + this.height / 2;
		this.angle = angle;
	}

	render() {
		ctx.shadowBlur = 5;
		ctx.shadowColor = this.color;
		ctx.save();

		ctx.translate(this.centerX, this.centerY);
		ctx.rotate(this.angle);

		ctx.fillStyle = this.color;

		//LEFT WHEEL TRACK
		ctx.fillRect(this.width / -2, (this.height / -2) - this.height / 2, this.width, this.height);
		//RIGHT WHEEL TRACK
		ctx.fillRect(this.width / -2, (this.height / 2) + this.height / 1.5, this.width, this.height);

		ctx.restore();
		ctx.shadowBlur = 0;
	}
}

//GRAVE MARKER
class Grave {
	constructor(x, y, color) {
		//body
		this.width = GRAVE_WIDTH;
		this.height = GRAVE_HEIGHT;

		//grave info
		this.x = x;
		this.y = y;
		this.centerX = this.x + this.width / 2;
		this.centerY = this.y + this.height / 2;
		this.color = color;
	}

	render() {
		ctx.shadowBlur = 5;
		ctx.shadowColor = this.color;
		ctx.fillStyle = this.color;

		//right tilted mark
		ctx.save();

		ctx.translate(this.centerX, this.centerY);
		ctx.rotate(-45 * Math.PI / 180);

		ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);

		ctx.restore();

		//left tilted mark
		ctx.save();

		ctx.translate(this.centerX, this.centerY);
		ctx.rotate(45 * Math.PI / 180);

		ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);

		ctx.restore();
		ctx.shadowBlur = 0;
	}
}

//TANK CONSTRUCTOR
class Tank {
	constructor(x, y, angle, turretAngle, color, sideColor, speed) {
		//body
		this.width = TANK_WIDTH;
		this.height = TANK_HEIGHT;
		this.turretBaseSide = 20;
		this.turretNozzleWidth = 20;
		this.turretNozzleHeight = 10;

		//particles done this way to delay particle a bit
		this.tankExplosion = false;
		this.explosionRingCount = 0;
		this.explosionParticleDelay = 0;
		this.explosionParticles = [];

		//tank info
		this.x = x
		this.y = y;
		this.centerX = this.x + this.width / 2;
		this.centerY = this.y + this.height / 2;
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
		const angle = Math.atan2(targetCoords.y - this.centerY, targetCoords.x - this.centerX);
		const initialBoost = 40;
		STAGE_CACHE.shells.push(new Shell(this.centerX - SHELL_WIDTH / 2 + (initialBoost * Math.cos(angle)), this.centerY - SHELL_HEIGHT / 2 + (initialBoost * Math.sin(angle)), shellType, angle, tankID));
	}

	trackUpdate() {
		STAGE_CACHE.tracks.push(new Track(this.centerX - TRACK_WIDTH / 2, this.centerY - TRACK_HEIGHT / 2, this.angle));
	}

	tankWithTile() {
		for (var i = 0; i < STAGE_CACHE.tiles.length; i++) {
			const tile = STAGE_CACHE.tiles[i];

			if (SAT(this, tile)) {
				console.log("hi")
			}
		}
	}

	updateBody(targetCoords) {
		this.centerX = this.x + this.width / 2;
		this.centerY = this.y + this.height / 2;

		this.tankWithTile();

		//update tank explosion particles
		if (this.tankExplosion) {

			//increase delay
			this.explosionParticleDelay += 1;

			if (this.explosionParticleDelay > 0) {
				//push new ring of 50 particles
				for (var i = 0; i < 50; i++) {
					this.explosionParticles.push(new TankParticle(this.centerX - TANK_PARTICLE_SIDE / 2, this.centerY - TANK_PARTICLE_SIDE / 2, this.color));	
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
		this.turretAngle = Math.atan2(targetCoords.y - this.centerY, targetCoords.x - this.centerX);
	}

	render(isDead) {
		//RENDER THIS IF TANK IS STILL ALIVE//
		if (!isDead) {
			ctx.shadowBlur = 3;
			ctx.shadowBlur = this.color;
			ctx.save();

			ctx.translate(this.centerX, this.centerY);
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
			ctx.translate(this.centerX, this.centerY);
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
			ctx.shadowBlur = 0;
		}

		//RENDER THIS IF TANK IS STILL ALIVE OR DEAD//

		//RENDER TANK EXPLOSION PARTICLES
		for (var i = 0; i < this.explosionParticles.length; i++) {
			this.explosionParticles[i].render();
		}
	}
}
