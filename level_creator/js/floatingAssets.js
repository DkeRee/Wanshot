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

function isCollidingWithSurroundingBlocks(rect) {
	const newRect = {};
	//check wall
	if (rect.angle == 0 || rect.angle == -Math.PI) {
		//horizontal angle
		newRect.x = rect.x;
		newRect.y = rect.y;
		newRect.width = rect.width;
		newRect.height = rect.height;		

		if (rect.x <= 0 || rect.x + rect.width >= CANVAS_WIDTH || rect.y <= 0 || rect.y + rect.height >= CANVAS_HEIGHT) {
			return true;
		}
	} else {
		//vertical angle
		//rotate 90 degrees
		const distX = rect.centerX - rect.x;
		const distY = rect.centerY - rect.y;

		const newX = -distY;
		const newY = distX;

		const transX = rect.centerX + newX;
		const transY = rect.centerY - newY;

		const transWidth = rect.height;
		const transHeight = rect.width;

		newRect.x = transX;
		newRect.y = transY;
		newRect.width = transWidth;
		newRect.height = transHeight;

		if (transX <= 0 || transX + transWidth >= CANVAS_WIDTH || transY <= 0 || transY + transHeight >= CANVAS_HEIGHT) {
			return true;
		}
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
		this.content = PLAYER;
		this.placed = false;
	}
}

function updateFloatingAssets() {
	//only update floating assets if you are not editing blocks
	if (!editingBlocks) {
		floating_cache.tank.update();

		//if floating cache is not colliding with surrounding blocks
		if (!isCollidingWithSurroundingBlocks(floating_cache.tank)) {
			floating_cache.tank.colliding = false;
			if (holding) {
				if (floating_cache.content == PLAYER) {
					player = new Player(1, floating_cache.tank.angle);
				}
			}
		} else {
			floating_cache.tank.colliding = true;
		}
	}
}

function renderFloatingAssets() {
	//only render floating cache if it exists. this also means that you are not editing blocks.
	if (floating_cache) {
		floating_cache.tank.renderShadow();
		floating_cache.tank.render();
	}

	if (player) {
		player.tank.render();
	}
}