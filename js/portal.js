class PortalParticle {
	constructor(x, y, color, portalRadius) {
		//particle body (IT IS A SQUARE)
		this.side = PORTAL_PARTICLE_SIDE * (portalRadius / 110);

		//particle info
		this.x = x;
		this.y = y;
		this.centerX = this.x + this.side / 2;
		this.centerY = this.y + this.side / 2;
		this.angle = (Math.floor(Math.random() * 360)) * Math.PI / 180;
		this.opacity = 1;
		this.speed = 75 * portalRadius;
		this.explode = false;

		this.color = color;
	}

	update() {
		//GOAL: Make particles of different size spew out in random directions, slowing to a halt and laying there

		this.speed /= 120 * deltaTime;
		this.opacity -= 0.7 * deltaTime;

		//update position
		this.x += this.speed * Math.cos(this.angle) * deltaTime;
		this.y += this.speed * Math.sin(this.angle) * deltaTime;

		this.centerX = this.x + this.side / 2;
		this.centerY = this.y + this.side / 2;

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

class Portal {
	constructor(x, y, color, content, fontSize, portalSpeed) {
		this.radius = PORTAL_RADIUS;
		this.fontSize = fontSize;
		this.x = x;
		this.y = y;
		this.color = color;
		this.content = content;

		this.radiusGrowth = 10;
		this.portalSpeed = portalSpeed;

		this.shrinkDelay = 0;
		this.shrinkDelayCap = 0.5;

		this.entering = false;
		this.lerpCenter = false;
		this.lerpShrink = false;
		this.centerAngle = Math.atan2(this.y - CANVAS_HEIGHT / 2, this.x - CANVAS_WIDTH / 2);

		this.bobForward = true;
		this.bobCap = 0.5;
		this.bob = 0;

		this.particleDelay = 0;
		this.particleDelayCap = 0.07;
		this.particles = [];

		//for SAT collision
		this.angle = 0;
	}

	fizz() {
		//produce 50 portal particles
		for (var i = 0; i < 30; i++) {
			this.particles.push(new PortalParticle(this.x - PORTAL_PARTICLE_SIDE / 2, this.y - PORTAL_PARTICLE_SIDE / 2, this.color, this.radius));
		}
	}

	isTouched() {
		//if it is touching the player
		if (SAT_POLYGON_CIRCLE(STAGE_CACHE.player, this)) {
			//produce 50 portal particles
			for (var i = 0; i < 30; i++) {
				this.particles.push(new PortalParticle(this.x - PORTAL_PARTICLE_SIDE / 2, this.y - PORTAL_PARTICLE_SIDE / 2, this.color, this.radius));
			}

			//start chain reaction
			this.entering = true;
			this.lerpCenter = true;

			playSound(portalEnter);

			return true;
		}
		return false;
	}

	update() {
		//shrink
		if (this.lerpShrink) {
			this.shrinkDelay += deltaTime;

			//if the delay timer has counted down, start the shrinking
			if (this.shrinkDelay > this.shrinkDelayCap) {
				this.radius -= this.radiusGrowth;
				this.radiusGrowth /= 80 * deltaTime;

				if (this.radius < 0) {
					this.radius = 0;
					this.lerpShrink = false;

					//start intermission
					intermissionStatus = INTERMISSION_WON;
					INTERMISSION = true;
				}
			}
		}

		//move to center
		if (this.lerpCenter) {
			//lerp grow
			this.radius += this.radiusGrowth;
			this.radiusGrowth /= 73 * deltaTime;

			//lerp to center
			this.x -= this.portalSpeed * Math.cos(this.centerAngle);
			this.y -= this.portalSpeed * Math.sin(this.centerAngle);
			this.portalSpeed /= 70 * deltaTime;

			if (this.radiusGrowth <= 0.05) {
				this.radiusGrowth = 40;
				this.lerpCenter = false;

				this.fizz();

				this.lerpShrink = true;
			}
		}

		//make portal bob in idle animation
		if (!this.entering) {
			if (this.bobForward) {
				this.bob += deltaTime;

				if (this.bob > this.bobCap) {
					this.bobForward = false;
				}
			} else {
				this.bob -= deltaTime;

				if (this.bob < -this.bobCap) {
					this.bobForward = true;
				}
			}

			this.y += this.bob;
		}

		//update particles
		this.particleDelay += deltaTime;

		if (this.particleDelay > this.particleDelayCap) {
			this.particleDelay = 0;
			this.particles.push(new PortalParticle(this.x - PORTAL_PARTICLE_SIDE / 2, this.y - PORTAL_PARTICLE_SIDE / 2, this.color, this.radius));
		}

		
		for (var i = 0; i < this.particles.length; i++) {
			const particle = this.particles[i];

			if (particle.opacity <= 0) {
				this.particles.splice(i, 1);

				continue;
			}

			particle.update();
		}
	}

	render() {
		//render portal particles
		for (var i = 0; i < this.particles.length; i++) {
			this.particles[i].render();
		}

		//render portal
		ctx.shadowBlur = 20;
		ctx.shadowColor = this.color;

		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
		ctx.fill();

		//render content
		ctx.font = `${this.fontSize * this.radius * 0.3}px UniSansHeavy`;
		ctx.textAlign = "center";
		ctx.fillStyle = hexToRgbA("#505050", 0.6);
		ctx.fillText(this.content, this.x, this.y + 20 * ((this.radius * this.fontSize) / 160));

		ctx.shadowBlur = 0;
	}
}