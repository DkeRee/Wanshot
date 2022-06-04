class Block {
	constructor(x, y) {
		this.width = TILE_WIDTH;
		this.height = TILE_HEIGHT;
		this.angle = 0;
		this.x = x;
		this.y = y;
		this.color = "#9C7C4B";
	}

	render() {
		//fill in block
		ctx.shadowBlur = 5;
		ctx.shadowColor = "black";
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.shadowBlur = 0;
	}
}