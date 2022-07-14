//block renders
class Splotch {
	constructor(x, y, side, kind) {
		this.side = side;
		this.x = x;
		this.y = y;

		if (kind == REGULAR_BLOCK) {
			//light orange-brown
			this.color = "#C2995D";
		} else {
			//very light red
			this.color = "#FF8A73";
		}
	}

	render(opacity, ctx) {
		ctx.shadowBlur = 10;
		ctx.shadowColor = hexToRgbA(this.color, opacity);
		ctx.fillStyle = hexToRgbA(this.color, opacity);
		ctx.fillRect(this.x, this.y, this.side, this.side);
		ctx.shadowBlur = 0;
	}
}

class Block {
	constructor(x, y, opacity, kind) {
		//block decor
		this.splotches = [];

		this.width = boxSize;
		this.height = boxSize
		this.x = x;
		this.y = y;
		this.kind = kind;
		this.opacity = opacity;

		if (this.kind == REGULAR_BLOCK) {
			this.color = "#967748";
		} else {
			this.color = "#B54B44";
		}

		//randomly generate 2 splotches
		for (var i = 0; i < 2; i++) {
			this.splotches.push(new Splotch(this.x + Math.floor(Math.random() * this.width / 1.4), this.y + Math.floor(Math.random() * this.height / 1.4), Math.floor(Math.random() * this.width / 3) + 2, kind));
		}
	}

	render(ctx) {
		//fill in block
		ctx.shadowBlur = 1;
		ctx.shadowColor = SHADOW;
		ctx.fillStyle = hexToRgbA(this.color, this.opacity);
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.shadowBlur = 0;

		//render splotches
		for (var i = 0; i < this.splotches.length; i++) {
			this.splotches[i].render(this.opacity, ctx);
		}
	}
}

//pit renders
class Pit {
	constructor(x, y, opacity) {
		//square hitbox
		this.width = boxSize;
		this.height = boxSize;
		this.angle = 0;
		this.x = x;
		this.y = y;

		//circle structure
		this.centerX = this.x + this.width / 2;
		this.centerY = this.y + this.height / 2;
		this.radius = this.width / 2.5;
		this.opacity = opacity;
		this.color = "#3D3D3D";
	}

	render(ctx) {
		//render pit
		ctx.shadowBlur = 5;
		ctx.shadowColor = hexToRgbA(this.color, this.opacity);
		ctx.fillStyle = hexToRgbA(this.color, this.opacity);
		ctx.beginPath();
		ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI, false);
		ctx.fill();
		ctx.shadowBlur = 0;
	}
}