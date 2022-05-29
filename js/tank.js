//TANK TRACKS
class Track {
	constructor(x, y, bodyAngle) {
		//body
		this.width = 4;
		this.height = 7;
		this.color = "grey";

		//track info
		this.x = x;
		this.y = y;
		this.bodyAngle = bodyAngle;
	}

	render() {
		ctx.save();

		ctx.translate(this.x, this.y);
		ctx.rotate(this.bodyAngle);

		ctx.fillStyle = this.color;

		//LEFT WHEEL TRACK
		ctx.fillRect(this.width / -2, (this.height / -2) - this.height / 2, this.width, this.height);
		//RIGHT WHEEL TRACK
		ctx.fillRect(this.width / -2, (this.height / 2) + this.height / 1.5, this.width, this.height);

		ctx.restore();
	}
}

//TANK CONSTRUCTOR
class Tank {
	constructor(x, y, bodyAngle, turretAngle, color, sideColor, speed) {
		//body
		this.width = 45;
		this.height = 35;
		this.turretBaseSide = 20;
		this.turretNozzleWidth = 20;
		this.turretNozzleHeight = 10;

		//tank info
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.bodyAngle = bodyAngle;
		this.turretAngle = turretAngle;
		this.color = color;
		this.sideColor = sideColor;
	}

	shoot(targetCoords, shellType, tankID) {
		const angle = Math.atan2(targetCoords.y - this.y, targetCoords.x - this.x);
		STAGE_CACHE.shells.push(new Shell(this.x + (this.speed * 20 * Math.cos(angle)), this.y + (this.speed * 20 * Math.sin(angle)), shellType, angle, tankID));
	}

	updateBody(targetCoords) {
		this.turretAngle = Math.atan2(targetCoords.y - this.y, targetCoords.x - this.x);
	}

	trackUpdate() {
		STAGE_CACHE.tracks.push(new Track(this.x, this.y, this.bodyAngle));
	}

	render() {
		ctx.save();

		ctx.translate(this.x, this.y);
		ctx.rotate(this.bodyAngle);

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
		ctx.translate(this.x, this.y);
		ctx.rotate(this.turretAngle);
		ctx.lineWidth = 5;
		ctx.fillStyle = this.color;
		ctx.strokeStyle = "black";

		//turret base
		ctx.strokeRect(this.turretBaseSide / -2, this.turretBaseSide / -2, this.turretBaseSide, this.turretBaseSide);
		ctx.fillRect(this.turretBaseSide / -2, this.turretBaseSide / -2, this.turretBaseSide, this.turretBaseSide);

		//turret nozzle
		ctx.strokeRect(this.turretNozzleWidth / 2, this.turretNozzleHeight / -2, this.turretNozzleWidth, this.turretNozzleHeight);
		ctx.fillRect(this.turretNozzleWidth / 2, this.turretNozzleHeight / -2, this.turretNozzleWidth, this.turretNozzleHeight);

		ctx.restore();

	}
}
