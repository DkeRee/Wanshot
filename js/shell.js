const NORMAL_SHELL = 4;

class HitParticle {
	constructor(x, y) {
		//particle body (IT IS A SQUARE)
		this.side = 7;

		//particle info
		this.x = x;
		this.y = y;
		this.angle = (Math.floor(Math.random() * 360)) * Math.PI / 180;
		this.opacity = 1;
		this.speed = 7;
		this.explode = false;

		//RED, ORANGE, YELLOW
		this.possibleColors = ["#ED4245", "#FFA500", "#FFBF00"];
		this.color = this.possibleColors[Math.floor(Math.random() * this.possibleColors.length)];
	}

	update() {
		//GOAL: move particle in random angle while it slowly fades and slows

		//update position
		this.x += this.speed * Math.cos(this.angle);
		this.y += this.speed * Math.sin(this.angle);

		//update opacity and speed
		this.opacity -= 0.08;
		this.speed -= 0.05;

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

class TrailParticle {
	constructor(x, y) {
		//particle body (IT IS A CIRCLE)
		this.radius = 5;

		//particle info
		this.x = x;
		this.y = y;
		this.opacity = 1;
		this.expansionRate = 1;
		this.explode = false;

		//color in rgba to support opacity
		this.color = `#888888`;
	}

	update() {
		//GOAL: make particle expand until it fades

		//expand
		this.radius += this.expansionRate;

		//slow expansion rate down
		this.expansionRate -= 0.01;

		//lower opacity
		this.opacity -= 0.08;
	
		//check for deletion
		if (this.opacity <= 0) {
			this.explode = true;
		}
	}

	render() {
		//RENDER PARTICLE
		ctx.fillStyle = hexToRgbA(this.color, this.opacity);
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
		ctx.fill();
	}
}

class Shell {
	constructor(x, y, bulletType, angle, tankID) {
		//body
		this.width = 10;
		this.height = 7;
		this.color = "#D3D3D3";
		this.explode = false;

		//particles
		this.hitParticles = [];
		this.trailParticles = [];

		//particle delay
		this.trailParticleDelay = 0;

		//bullet info
		this.x = x;
		this.y = y;
		this.angle = angle;
		this.speed = bulletType;
		this.tankID = tankID;
		this.id = Math.floor(Math.random() * 100000);
		this.ricochet = 0;

		this.makeHitParticles();
	}

	makeHitParticles() {
		//MAKE 50 HIT PARTICLES
		for (var i = 0; i < 50; i++) {
			this.hitParticles.push(new HitParticle(this.x, this.y));
		}
	}

	//COLLISION CHECKS
	shellWithShell() {
		for (var i = 0; i < STAGE_CACHE.shells.length; i++) {
			const otherShell = STAGE_CACHE.shells[i];

			if (SAT(this, otherShell) && this.id !== otherShell.id) {
				//SHELL COLLIDED WITH OTHER SHELL

				//explode this shell
				this.makeHitParticles();
				otherShell.makeHitParticles();

				//explode other shell
				this.explode = true;
				otherShell.explode = true;

			}
		}
	}

	shellWithPlayer() {
		const player = STAGE_CACHE.player;

		if (SAT(this, player.tank) && !player.dead) {
			//SHELL COLLIDED WITH PLAYER AND PLAYER IS NOT DEAD

			//explode this shell
			this.makeHitParticles();
			this.explode = true;

			//explode player tank
			player.explode();

			//start intermission
			INTERMISSION = true;

			//add tank grave
			STAGE_CACHE.graves.push(new Grave(player.tank.x, player.tank.y, player.tank.color));
		}
	}

	update() {
		//UPDATE PARTICLES IF PLAYER IS NOT DEAD
		if (!STAGE_CACHE.player.dead) {
			//HIT PARTICLES
			for (var i = 0; i < this.hitParticles.length; i++) {
				const particle = this.hitParticles[i];

				//DELETE PARTICLE
				if (particle.explode) {
					this.hitParticles.splice(i, 1);
					continue;
				}

				particle.update();
			}

			//TRAIL PARTICLES
			for (var i = 0; i < this.trailParticles.length; i++) {
				const particle = this.trailParticles[i];

				//DELETE PARTICLE
				if (particle.explode) {
					this.trailParticles.splice(i, 1);
					continue;
				}

				particle.update();
			}

			//ADD TRAIL PARTICLE AFTER DELAY
			this.trailParticleDelay++;

			if (this.trailParticleDelay > 5) {
				this.trailParticleDelay = 0;
				this.trailParticles.push(new TrailParticle(this.x, this.y));
			}

			this.x += this.speed * Math.cos(this.angle);
			this.y += this.speed * Math.sin(this.angle);

			//COLLISIONS

			//LEFT AND RIGHT WALL
			if (this.x - this.width / 2 <= 0 || this.x + this.width / 2 >= CANVAS_WIDTH) {
				this.angle = Math.PI - this.angle;
				this.x += this.speed * Math.cos(this.angle);			
				
				this.makeHitParticles();
				this.ricochet++;
			}

			//TOP AND BOTTOM WALL
			if (this.y - this.height / 2 <= 0 || this.y + this.height / 2 >= CANVAS_HEIGHT) {
				this.angle = 2 * Math.PI - this.angle;
				this.y += this.speed * Math.sin(this.angle);

				this.makeHitParticles();
				this.ricochet++;
			}

			this.shellWithShell();
			this.shellWithPlayer();

			//MARK SHELL TO DELETE
			if (this.speed == NORMAL_SHELL && this.ricochet >= 2) {

				this.makeHitParticles();
				this.explode = true;
			}
		}
	}

	render() {
		//RENDER TRAIL PARTICLE
		for (var i = 0; i < this.trailParticles.length; i++) {
			this.trailParticles[i].render();
		}

		//RENDER SHELL
		ctx.save();

		ctx.translate(this.x, this.y);
		ctx.rotate(this.angle);

		ctx.fillStyle = this.color;
		ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);

		ctx.restore();

		//RENDER HIT PARTICLE
		for (var i = 0; i < this.hitParticles.length; i++) {
			this.hitParticles[i].render();
		}
	}
}