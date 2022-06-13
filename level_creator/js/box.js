class Box {
	constructor(x, y, boxSize, index) {
		this.side = boxSize;
		this.hovered = false;
		this.marked = false;
		this.clicked = false;
		this.x = x;
		this.y = y;

		//width and height for easy collision checking
		this.width = boxSize;
		this.height = boxSize;

		//block content
		this.content = null;

		this.id = index;
		this.blockType = null;
	}

	update() {
		//if i am currently editing the blocks, and not for example tanks that doesn't rely on grid
		if (editingBlocks) {
			//mouse collision
			if ((this.x <= mouse.x && mouse.x <= this.x + this.side) && (this.y <= mouse.y && mouse.y <= this.y + this.side)) {
				//if this is first time hovering && wasn't marked
				if (!this.marked) {
					//decide what content it is
					switch (currAsset) {
						case REGULAR_BLOCK:
							this.blockType = REGULAR_BLOCK;
							this.content = new Block(this.x, this.y, 0.5, REGULAR_BLOCK);
							break;
						case LOOSE_BLOCK:
							this.blockType = LOOSE_BLOCK;
							this.content = new Block(this.x, this.y, 0.5, LOOSE_BLOCK);
							break;
						case PIT:
							this.blockType = PIT;
							this.content = new Pit(this.x, this.y, 0.5);
							break;
					}
				}

				this.hovered = true;

				//mark or unmark
				if (holding) {
					console.log(exportedBlocks)
					if (!this.clicked) {
						if (!this.marked) {
							//place tile
							this.marked = true;
							this.content.opacity = 1;

							var exportString;

							switch (this.blockType) {
								case REGULAR_BLOCK:
									exportString = `new Block(${this.x}, ${this.y}, ${REGULAR_BLOCK})`;
									exportedBlocks[this.id] = exportString;
									break;
								case LOOSE_BLOCK:
									exportString = `new Block(${this.x}, ${this.y}, ${LOOSE_BLOCK})`;
									exportedBlocks[this.id] = exportString;
									break;
								case PIT:
									exportString = `new Pit(${this.x}, ${this.y})`;
									exportedPits[this.id] = exportString;
									break;
							}
						} else {
							switch (this.blockType) {
								case REGULAR_BLOCK:
									delete exportedBlocks[this.id];
									break;
								case LOOSE_BLOCK:
									delete exportedBlocks[this.id];
									break;
								case PIT:
									delete exportedPits[this.id];
									break;
							}

							//unplace tile
							this.marked = false;
							this.blockType = null;
							this.content.opacity = 0.5;
						}
					}

					this.clicked = true;
				}
			} else {
				this.hovered = false;
				this.clicked = false;

				if (!this.marked) {
					this.content = null;
				}
			}
		} else {
			//clear all unmarked blocks to clear up for floating asset editing
			if (!this.marked) {
				this.content = null;
			}
		}
	}

	render() {
		if (this.content) {
			this.content.render();
		}

		if (this.marked && this.hovered && !this.clicked) {
			ctx.fillStyle = "rgba(237, 66, 69, 0.5)";
			ctx.fillRect(this.x, this.y, this.side, this.side);
		} else {
			ctx.fillStyle = "transparent";
		}

		ctx.beginPath();
		ctx.rect(this.x, this.y, this.side, this.side);
		ctx.stroke();
	}
}