//self -> Stage
//canvas -> canvas element

class Stage {
	constructor() {
		this.player = new Player(1, 0);
		this.exportedEnemies = [];
		this.exportedBlocks = [];
		this.exportedPits = [];

		this.player.tank.centerX = CANVAS_WIDTH / 2;
		this.player.tank.centerY = CANVAS_HEIGHT / 2;
	}

	clearSelf() {
		this.exportedEnemies = [];
		this.exportedBlocks = [];
		this.exportedPits = [];
	}

	loadSelfChunk(data) {
		this.clearSelf();

		//player
		mouse = {
			x: data.player.tank.centerX,
			y: data.player.tank.centerY
		};
		this.player = new Player(1, data.player.tank.angle);
		
		//enemies
		for (var i = 0; i < data.enemies.length; i++) {
			mouse = {
				x: data.enemies[i].tank.centerX,
				y: data.enemies[i].tank.centerY
			};

			switch (data.enemies[i].content) {
				case BROWN_TANK:
					this.exportedEnemies.push(new BrownTank(1, data.enemies[i].tank.angle));
					break;
				case GREY_TANK:
					this.exportedEnemies.push(new GreyTank(1, data.enemies[i].tank.angle))
					break;
				case YELLOW_TANK:
					this.exportedEnemies.push(new YellowTank(1, data.enemies[i].tank.angle))
					break;
				case PINK_TANK:
					this.exportedEnemies.push(new PinkTank(1, data.enemies[i].tank.angle))
					break;
				case TEAL_TANK:
					this.exportedEnemies.push(new TealTank(1, data.enemies[i].tank.angle))
					break;
				case PURPLE_TANK:
					this.exportedEnemies.push(new PurpleTank(1, data.enemies[i].tank.angle))
					break;
				case WHITE_TANK:
					this.exportedEnemies.push(new WhiteTank(1, data.enemies[i].tank.angle))
					break;
				case GREEN_TANK:
					this.exportedEnemies.push(new GreenTank(1, data.enemies[i].tank.angle))
					break;
				case BLACK_TANK:
					this.exportedEnemies.push(new BlackTank(1, data.enemies[i].tank.angle))
					break;
				case ORANGE_TANK:
					this.exportedEnemies.push(new OrangeTank(1, data.enemies[i].tank.angle))
					break;
				case BLURPLE_TANK:
					this.exportedEnemies.push(new BlurpleTank(1, data.enemies[i].tank.angle))
					break;
				case VIOLET_TANK:
					this.exportedEnemies.push(new VioletTank(1, data.enemies[i].tank.angle))
					break;
				case TAN_TANK:
					this.exportedEnemies.push(new TanTank(1, data.enemies[i].tank.angle))
					break;						
			}
		}
		
		//no need to worry about null in the static assets!

		//blocks
		for (var i = 0; i < data.blocks.length; i++) {
			//update export

			if (data.blocks[i].content.kind == REGULAR_BLOCK) {
				const regularBlock = new Block(data.blocks[i].x, data.blocks[i].y, 1, REGULAR_BLOCK);
				
				//update display
				grid[data.blocks[i].id].marked = true;
				grid[data.blocks[i].id].blockType = REGULAR_BLOCK;
				grid[data.blocks[i].id].content = regularBlock;

				this.exportedBlocks[data.blocks[i].id] = grid[data.blocks[i].id];
			} else {
				const looseBlock = new Block(data.blocks[i].x, data.blocks[i].y, 1, LOOSE_BLOCK);
				
				//update display
				grid[data.blocks[i].id].marked = true;
				grid[data.blocks[i].id].blockType = LOOSE_BLOCK;
				grid[data.blocks[i].id].content = looseBlock;

				this.exportedBlocks[data.blocks[i].id] = grid[data.blocks[i].id];
			}
		}

		//pits
		for (var i = 0; i < data.pits.length; i++) {
			//update export
			const pit = new Pit(data.pits[i].x, data.pits[i].y, 1);

			//update display
			grid[data.pits[i].id].marked = true;
			grid[data.pits[i].id].blockType = PIT;
			grid[data.pits[i].id].content = pit;

			this.exportedPits[data.pits[i].id] = grid[data.pits[i].id];
		}
	}

	//make sure to change campaignIndex before calling this
	loadCanvasBlocks() {
		//blocks
		for (var blockID in this.exportedBlocks) {
			const block = this.exportedBlocks[blockID];

			if (block.content.kind == REGULAR_BLOCK) {
				const regularBlock = new Block(block.x, block.y, 1, REGULAR_BLOCK);

				//update display
				grid[block.id].marked = true;
				grid[block.id].blockType = REGULAR_BLOCK;
				grid[block.id].content = regularBlock;
			} else {
				const looseBlock = new Block(block.x, block.y, 1, LOOSE_BLOCK);
				
				//update display
				grid[block.id].marked = true;
				grid[block.id].blockType = LOOSE_BLOCK;
				grid[block.id].content = looseBlock;
			}
		}

		//pits
		for (var pitID in this.exportedPits) {
			const pit = this.exportedPits[pitID];

			grid[pit.id].marked - true;
			grid[pit.id].blockType = PIT;
			grid[pit.id].content = pit;
		}
	}
}