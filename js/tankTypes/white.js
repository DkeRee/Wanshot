class SuperpowerParticles {
	constructor(x, y) {
		//particle body (IT IS A SQUARE)
		this.maxSide = SUPERPOWER_PARTICLE_SIDE;
		this.side = 0;

		this.x = x;
		this.y = y;
		this.centerX = this.x + this.side / 2;
		this.centerY = this.y + this.side / 2;
		this.angle = (Math.floor(Math.random() * 360)) * Math.PI / 180;
		this.opacity = 1;
		this.speed = 150;
		this.explode = false;

		this.color = "#DBDBDB";
	}

	update() {
		//GOAL: move particle in random angle while it slowly fades and slows

		//update position
		this.x += this.speed * Math.cos(this.angle) * deltaTime;
		this.y += this.speed * Math.sin(this.angle) * deltaTime;

		this.centerX = this.x + this.side / 2;
		this.centerY = this.y + this.side / 2;

		//update side (make it slowly expand from 0)
		this.maxSide /= 2;
		this.side += this.maxSide;

		//update opacity and speed
		this.opacity -= 0.5 * deltaTime;
		this.speed -= 1 * deltaTime;

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

class WhiteTank extends Bot {
	constructor(x, y, angle) {
		const speed = 140;
		const rotationSpeed = degreesToRadians(10);
		const stun = -5;
		const shellCap = 6;
		const shellCooldown = -15;
		const frm = -3;
		const stopAndTurn = degreesToRadians(30);
		const uTurn = degreesToRadians(170);
		const updateTargetCount = -3
		const shellSensitivity = 600;
		const abortNonmove = true;
		const turretRotationSpeed = degreesToRadians(3);
		const turretArcSize = degreesToRadians(95);
		const shellType = NORMAL_SHELL;
		const shellBounceAmount = 1;
		const color = "#DBDBDB";
		const turretColor = "#CFCFCF";
		const sideColor = "#B0896B";
		const tankID = Math.floor(Math.random() * 100000);
		const tankType = WHITE_TANK;

		super(
			x,
			y,
			angle,
			speed,
			rotationSpeed,
			stun,
			shellCap,
			shellCooldown,
			frm,
			stopAndTurn,
			uTurn,
			updateTargetCount,
			shellSensitivity,
			abortNonmove,
			turretRotationSpeed,
			turretArcSize,
			shellType,
			shellBounceAmount,
			color,
			turretColor,
			sideColor,
			tankID,
			tankType
			);

		this.invisibleParticles = [];
	}

	turnInvisible() {
		this.invisible = true;

		//make 15 invisible particles
		for (var i = 0; i < 15; i++) {
			this.invisibleParticles.push(new SuperpowerParticles(this.centerX - SUPERPOWER_PARTICLE_SIDE / 2, this.centerY - SUPERPOWER_PARTICLE_SIDE / 2));
		}
	}

	update() {
		super.update();

		//update superpower particles
		for (var i = 0; i < this.invisibleParticles.length; i++) {
			this.invisibleParticles[i].update();
		}
	}

	render() {
		//if tank isn't invisible
		if (!this.invisible) {
			super.render();
		}

		//render explosion particles
		for (var i = 0; i < this.explosionParticles.length; i++) {
			this.explosionParticles[i].render();
		}

		//render superpower particles
		for (var i = 0; i < this.invisibleParticles.length; i++) {
			this.invisibleParticles[i].render();
		}
	}

	renderShadow() {
		if (!this.invisible) {
			super.renderShadow();
		}
	}
}