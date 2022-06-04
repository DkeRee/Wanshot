class Block {
	constructor(x, y) {
		this.side = 50;
		this.x = x;
		this.y = y;
		this.color = "#9C7C4B";
	}

	render() {
		//fill in block
		ctx.shadowBlur = 5;
		ctx.shadowColor = "black";
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.side, this.side);
		ctx.shadowBlur = 0;
	}
}