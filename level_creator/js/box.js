class Box {
	constructor(x, y, boxSize) {
		this.side = boxSize;
		this.hovered = false;
		this.marked = false;
		this.clicked = false;
		this.x = x;
		this.y = y;

		//block content
		this.content = null;

		this.id = Math.floor(Math.random() * 100000);
	}

	update() {
		//mouse collision
		if ((this.x <= mouse.x && mouse.x <= this.x + this.side) && (this.y <= mouse.y && mouse.y <= this.y + this.side)) {
			//if this is first time hovering && wasn't marked
			if (!this.hovered && !this.marked) {
				//decide what content it is
				switch (currAsset) {
					case BLOCK:
						this.content = new Block(this.x, this.y, 0.5);
						break;
				}
			}

			this.hovered = true;

			//mark or unmark
			if (holding) {
				if (!this.clicked) {
					if (!this.marked) {
						//place tile
						this.marked = true;
						this.content.opacity = 1;

						var exportString;

						switch (this.id) {
							case BLOCK:
								exportString = `new Block(${this.x}, ${this.y})`;
								break;
						}

						exportedBlocks[this.id] = exportString;
					} else {
						//unplace tile
						this.marked = false;
						this.content.opacity = 0.5;
						delete exportedBlocks[this.id];
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
	}

	render() {
		if (this.content) {
			this.content.render();
		}

		ctx.beginPath();
		ctx.rect(this.x, this.y, this.side, this.side);
		ctx.stroke();
	}
}