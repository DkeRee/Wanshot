class BlockParticle {
	constructor(x, y) {
		//particle body (IT IS A SQUARE)
		this.side = TILE_PARTICLE_SIDE;

		//particle info
		this.x = x;
		this.y = y;
		this.centerX = this.x + this.side / 2;
		this.centerY = this.y + this.side / 2;
		this.angle = (Math.floor(Math.random() * 360)) * Math.PI / 180;
		this.opacity = 1;
		this.speed = 100;
		this.explode = false;

		//LIGHT RED, RED, BROWN, GREY, YELLOW
		this.possibleColors = ["#FF8A73", "#B54B44", "#967748", "#808080", "#FFBF00"];
		this.color = this.possibleColors[Math.floor(Math.random() * this.possibleColors.length)];
	}

	update() {
		//if player ISNT dead, update particles
		if (!STAGE_CACHE.player.dead) {
			//GOAL: Make particles of different size spew out in random directions, slowing to a halt and laying there

			this.speed /= 2;
			this.opacity -= 0.01;

			//update position
			this.x += this.speed * Math.cos(this.angle);
			this.y += this.speed * Math.sin(this.angle);

			this.centerX = this.x + this.side / 2;
			this.centerY = this.y + this.side / 2;

			if (this.opacity <= 0) {
				this.explode = true;
			}
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

class Splotch {
	constructor(x, y, side, kind) {
		this.side = side;
		this.x = x;
		this.y = y;

		if (kind == REGULAR_BLOCK) {
			//light orange-brown
			this.color = "rgba(194, 153, 93, 0.5)";
		} else {
			//very light red
			this.color = "rgba(255, 138, 115, 0.5)";
		}
	}

	render() {
		ctx.shadowBlur = 10;
		ctx.shadowColor = this.color;
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.side, this.side);
		ctx.shadowBlur = 0;
	}
}

class Block {
	constructor(x, y, kind) {
		//block decor
		this.splotches = [];

		this.id = Math.floor(Math.random() * 100000);
		this.width = TILE_WIDTH;
		this.height = TILE_HEIGHT;
		this.angle = 0;
		this.kind = kind;
		this.x = x;
		this.y = y;
		this.centerX = this.x + this.width / 2;
		this.centerY = this.y + this.height / 2;
		this.explode = false;

		if (this.kind == REGULAR_BLOCK) {
			this.color = "#967748";
		} else {
			this.color = "#B54B44";
		}

		//randomly generate 2 splotches
		for (var i = 0; i < 2; i++) {
			this.splotches.push(new Splotch(this.x + Math.floor(Math.random() * this.width / 1.4), this.y + Math.floor(Math.random() * this.height / 1.4), Math.floor(Math.random() * this.width / 3) + 2, this.kind));
		}
	}

	render() {
		//fill in block
		ctx.shadowBlur = 1;
		ctx.shadowColor = "black";
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.shadowBlur = 0;

		//render splotches
		for (var i = 0; i < this.splotches.length; i++) {
			this.splotches[i].render();
		}
	}

	renderShadow() {
		//render shadow
		ctx.fillStyle = SHADOW;
		ctx.fillRect(this.x - 5, this.y + 5, this.width, this.height);
	}
}

class Pit {
	constructor(x, y) {
		//square hitbox
		this.width = TILE_WIDTH;
		this.height = TILE_HEIGHT;
		this.angle = 0;
		this.x = x;
		this.y = y;

		//circle structure
		this.centerX = this.x + this.width / 2;
		this.centerY = this.y + this.height / 2;
		this.radius = this.width / 2.5;
		this.color = "#2E2E2E";
	}

	render() {
		//render pit
		ctx.shadowBlur = 5;
		ctx.shadowColor = this.color;
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI, false);
		ctx.fill();
		ctx.shadowBlur = 0;
	}

	renderShadow() {
		//render shadow
		ctx.fillStyle = SHADOW;
		ctx.beginPath();
		ctx.arc(this.centerX - 5, this.centerY + 5, this.radius, 0, 2 * Math.PI, false);
		ctx.fill();
	}
}