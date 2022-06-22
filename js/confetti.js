class Confetti {
	constructor(x, y) {
		//particle body (IT IS A SQUARE)
		this.side = CONFETTI_PARTICLE_SIDE;

		//particle info
		this.x = x;
		this.y = y;
		this.angle = (Math.floor(Math.random() * 360)) * Math.PI / 180;
		this.max = 30000;
		this.min = 10000;
		this.speed = Math.floor(Math.random() * (this.max - this.min + 1) + this.min);
		this.opacity = 1;
		this.centerX = this.x + this.side / 2;
		this.centerY = this.y + this.side / 2;

		//delete particle
		this.explode = false;

		//RED, ORANGE, YELLOW, GREEN, BLUE, PURPLE
		this.possibleColors = ["#ED4245", "#FFA500", "#FEE75C", "#3AB02E", "#2A5BFF", "#934A9E"];
		this.color = this.possibleColors[Math.floor(Math.random() * this.possibleColors.length)];
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