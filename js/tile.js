class Splotch {
	constructor(x, y, side) {
		this.side = side;
		this.x = x;
		this.y = y;
		this.color = "rgba(194, 153, 93, 0.5)";
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
	constructor(x, y) {
		//block decor
		this.splotches = [];

		this.width = TILE_WIDTH;
		this.height = TILE_HEIGHT;
		this.angle = 0;
		this.x = x;
		this.y = y;
		this.color = "#967748";

		//randomly generate 6 splotches
		for (var i = 0; i < 2; i++) {
			this.splotches.push(new Splotch(this.x + Math.floor(Math.random() * this.width / 1.4), this.y + Math.floor(Math.random() * this.height / 1.4), Math.floor(Math.random() * this.width / 3) + 2));
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