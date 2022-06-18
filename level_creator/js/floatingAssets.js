const TANK_WIDTH = 43;
const TANK_HEIGHT = 33;

function rectangleCollision(rectA, rectB) {
	if (rectA.x < rectB.x + rectB.width) {
		if (rectA.x + rectA.width > rectB.x) {
			if (rectA.y < rectB.y + rectB.height) {
				if (rectA.y + rectA.height > rectB.y) {
					return true;
				}
			}
		}
	}
	return false
}

function transRect(rect) {
	const newRect = {
		x: rect.x,
		y: rect.y,
		width: rect.width,
		height: rect.height
	}
	
	//if vertical angle
	if (rect.angle !== 0 || rect.angle !== -Math.PI) {
		//vertical angle
		//rotate 90 degrees
		const distX = rect.centerX - rect.x;
		const distY = rect.centerY - rect.y;

		const newX = -distY;
		const newY = distX;

		newRect.x = rect.centerX + newX;
		newRect.y = rect.centerY - newY;

		newRect.width = rect.height;
		newRect.height = rect.width;
	}

	return newRect;
}

function isCollidingWithSurroundingBlocks(rect) {
	const newRect = transRect(rect);

	if (newRect.x <= 0 || newRect.x + newRect.width >= CANVAS_WIDTH || newRect.y <= 0 || newRect.y + newRect.height >= CANVAS_HEIGHT) {
		return true;
	}

	//check surrounding blocks
	for (var i = 0; i < grid.length; i++) {
		//hit a grid box that is marked
		if (rectangleCollision(newRect, grid[i]) && grid[i].marked) {
			return true;
		}
	}

	return false;
}

function checkTankDeletion() {
	//check player
	if (player) {
		const transPlayer = transRect(player.tank);

		if ((transPlayer.x <= mouse.x && mouse.x <= transPlayer.x + transPlayer.width) && (transPlayer.y <= mouse.y && mouse.y <= transPlayer.y + transPlayer.height)) {
			player.hovering = true;

			//colliding manages the color scheme
			player.tank.colliding = true;
		} else {
			player.hovering = false;

			//colliding manages the color scheme
			player.tank.colliding = false;
		}
	}

	//check enemy
	for (var i = 0; i < exportedEnemies.length; i++) {
		//(this.x <= mouse.x && mouse.x <= this.x + this.side) && (this.y <= mouse.y && mouse.y <= this.y + this.side)
		const enemy = exportedEnemies[i];
		const rect = enemy.tank;

		const trans = transRect(rect);

		//check if mouse is on enemy tank to delete
		if ((trans.x <= mouse.x && mouse.x <= trans.x + trans.width) && (trans.y <= mouse.y && mouse.y <= trans.y + trans.height)) {
			enemy.hovering = true;

			//colliding manages the color scheme
			rect.colliding = true;
		} else {
			enemy.hovering = false;

			//colliding manages the color scheme
			rect.colliding = false;
		}
	}
}

function tankCollision(rect) {
	const newRect = transRect(rect);

	//player collision
	if (player) {
		if (rectangleCollision(newRect, transRect(player.tank))) {
			return true;
		}
	}

	for (var i = 0; i < exportedEnemies.length; i++) {
		const enemy = exportedEnemies[i];

		//enemy collision
		if (rectangleCollision(newRect, transRect(enemy.tank))) {
			return true;
		}
	}

	return false;
}

//tank renders
class Tank {
	constructor(x, y, angle, color, turretColor, sideColor, opacity) {
		//body
		this.width = TANK_WIDTH;
		this.height = TANK_HEIGHT;
		this.turretBaseSide = 19;
		this.turretNozzleWidth = 21;
		this.turretNozzleHeight = 10;

		//tank info
		this.x = x
		this.y = y;
		this.centerX = this.x + this.width / 2;
		this.centerY = this.y + this.height / 2;
		this.angle = angle;

		//colliding?
		this.colliding = false;

		//opacity
		this.opacity = opacity;

		//colors of the tank
		this.color = hexToRgbA(color, this.opacity);
		this.turretColor = hexToRgbA(turretColor, this.opacity);
		this.sideColor = hexToRgbA(sideColor, this.opacity);
	}

	update() {
		//update coords
		this.x = mouse.x - TANK_WIDTH / 2;
		this.y = mouse.y - TANK_HEIGHT / 2;

		//update center
		this.centerX = this.x + this.width / 2;
		this.centerY = this.y + this.height / 2;
	}

	render() {
		ctx.shadowBlur = 3;
		ctx.shadowColor = this.color;

		//draw tank
		ctx.save();

		ctx.translate(this.centerX, this.centerY);
		ctx.rotate(this.angle);

		//if tank is colliding with something
		if (this.colliding) {
			ctx.shadowBlur = 50;
			ctx.shadowColor = "#FF6863";
			ctx.strokeStyle = hexToRgbA("#FF6863", this.opacity);
			ctx.lineWidth = 5;
			ctx.strokeRect(this.width / -2, this.height / -2, this.width, this.height);

			ctx.fillStyle = hexToRgbA("#FF6863", 0.8);
			ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
		}

		//DRAW TANK BASE//		
		ctx.fillStyle = this.color;
		ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);

		//DRAW TANK SIDES//
			
		//WHEELS
		ctx.fillStyle = this.sideColor;

		//left wheel
		ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height / 5);

		//right wheel
		ctx.fillRect(this.width / -2, this.height / 3, this.width, this.height / 5);

		ctx.restore();

		ctx.save();

		//DRAW TURRET//
		ctx.translate(this.centerX, this.centerY);
		ctx.rotate(this.angle);
		ctx.lineWidth = 3;
		ctx.strokeStyle = hexToRgbA("#000000", this.opacity);

		ctx.shadowBlur = 20;
		ctx.shadowColor = this.color;

		//turret base
		ctx.fillStyle = this.turretColor;
		ctx.strokeRect(this.turretBaseSide / -2, this.turretBaseSide / -2, this.turretBaseSide, this.turretBaseSide);
		ctx.fillRect(this.turretBaseSide / -2, this.turretBaseSide / -2, this.turretBaseSide, this.turretBaseSide);

		//turret nozzle
		ctx.fillStyle = this.turretColor;
		ctx.strokeRect(this.turretNozzleWidth / 2, this.turretNozzleHeight / -2, this.turretNozzleWidth, this.turretNozzleHeight);
		ctx.fillRect(this.turretNozzleWidth / 2, this.turretNozzleHeight / -2, this.turretNozzleWidth, this.turretNozzleHeight);

		ctx.restore();
		ctx.shadowBlur = 0;
	}

	renderShadow() {
		ctx.save();

		ctx.translate(this.centerX - 5, this.centerY + 5);
		ctx.rotate(this.angle);

		ctx.fillStyle = SHADOW;
		ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);

		ctx.restore();
	}
}

class Player {
	constructor(opacity, angle) {
		this.tank = new Tank(mouse.x - TANK_WIDTH / 2, mouse.y - TANK_HEIGHT / 2, angle, "#224ACF", "#1E42B8", "#0101BA", opacity);
		this.hovering = false;
		this.content = PLAYER;
	}
}

class BrownTank {
	constructor(opacity, angle) {
		this.tank = new Tank(mouse.x - TANK_WIDTH / 2, mouse.y - TANK_HEIGHT / 2, angle, "#966A4B", "#8C6346", "#B0896B", opacity);
		this.hovering = false;
		this.content = BROWN_TANK;
	}
}

class GreyTank {
	constructor(opacity, angle) {
		this.tank = new Tank(mouse.x - TANK_WIDTH / 2, mouse.y - TANK_HEIGHT / 2, angle, "#4A4A4A", "#4D4D4D", "#B0896B", opacity);
		this.hovering = false;
		this.content = GREY_TANK;
	}
}

class YellowTank {
	constructor(opacity, angle) {
		this.tank = new Tank(mouse.x - TANK_WIDTH / 2, mouse.y - TANK_HEIGHT / 2, angle, "#DEC951", "#C4B248", "#B0896B", opacity);
		this.hovering = false;
		this.content = YELLOW_TANK;
	}
}

class PinkTank {
	constructor(opacity, angle) {
		this.tank = new Tank(mouse.x - TANK_WIDTH / 2, mouse.y - TANK_HEIGHT / 2, angle, "#B82A55", "#B02951", "#B0896B", opacity);
		this.hovering = false;
		this.content = PINK_TANK;
	}
}

class TealTank {
	constructor(opacity, angle) {
		this.tank = new Tank(mouse.x - TANK_WIDTH / 2, mouse.y - TANK_HEIGHT / 2, angle, "#154734", "#0E4732", "#B0896B", opacity);
		this.hovering = false;
		this.content = TEAL_TANK;
	}
}

class PurpleTank {
	constructor(opacity, angle) {
		this.tank = new Tank(mouse.x - TANK_WIDTH / 2, mouse.y - TANK_HEIGHT / 2, angle, "#934A9E", "#80408A", "#B0896B", opacity);
		this.hovering = false;
		this.content = PURPLE_TANK;
	}
}

var placed = false;
function updateFloatingAssets() {
	//only update floating assets if you are not editing blocks
	if (!holding) {
		placed = false;
	}

	//prevent mass clicking
	if (!placed) {
		if (!editingBlocks) {

			var unpause = false;

			//flags tanks for deletion
			checkTankDeletion();

			//deletes the player
			if (player) {
				if (player.hovering) {
					floating_cache.pause = true;

					if (holding) {
						player = null;
						unpause = true;
						placed = true;
					}
				} else {
					floating_cache.pause = false;
				}
			}

			//deletes the enemies
			for (var i = 0; i < exportedEnemies.length; i++) {
				const enemy = exportedEnemies[i];

				if (enemy.hovering) {
					floating_cache.pause = true;

					if (holding) {
						exportedEnemies.splice(i, 1);
						unpause = true;
						placed = true;
					}

					break;
				} else {
					floating_cache.pause = false;
				}
			}

			//if floating cache isn't paused (don't update)
			if (!floating_cache.pause) {
				floating_cache.content.tank.update();

				//if floating cache is not colliding with surrounding blocks && other tanks
				if (!isCollidingWithSurroundingBlocks(floating_cache.content.tank) && !tankCollision(floating_cache.content.tank)) {
					floating_cache.content.tank.colliding = false;
					if (holding) {
						placed = true;
						if (floating_cache.content.content == PLAYER) {
							player = new Player(1, floating_cache.content.tank.angle);
						} else {
							switch(floating_cache.content.content) {
								case BROWN_TANK:
									exportedEnemies.push(new BrownTank(1, floating_cache.content.tank.angle));
									break;
								case GREY_TANK:
									exportedEnemies.push(new GreyTank(1, floating_cache.content.tank.angle));
									break;
								case YELLOW_TANK:
									exportedEnemies.push(new YellowTank(1, floating_cache.content.tank.angle));
									break;
								case PINK_TANK:
									exportedEnemies.push(new PinkTank(1, floating_cache.content.tank.angle));
									break;
								case TEAL_TANK:
									exportedEnemies.push(new TealTank(1, floating_cache.content.tank.angle));
									break;
								case PURPLE_TANK:
									exportedEnemies.push(new PurpleTank(1, floating_cache.content.tank.angle));
									break;
							}
						}
					}
				} else {
					floating_cache.content.tank.colliding = true;
				}
			}

			if (unpause) {
				floating_cache.pause = false;
				unpause = false;
			}
		}
	}	
}

function renderFloatingAssets() {
	if (player) {
		player.tank.renderShadow();
		player.tank.render();
	}

	for (var i = 0; i < exportedEnemies.length; i++) {
		exportedEnemies[i].tank.renderShadow();
		exportedEnemies[i].tank.render();
	}

	//only render floating cache if it exists and it isn't paused. this also means that you are not editing blocks.
	if (floating_cache.content) {
		if (!floating_cache.pause) {
			floating_cache.content.tank.renderShadow();
			floating_cache.content.tank.render();
		}
	}
}