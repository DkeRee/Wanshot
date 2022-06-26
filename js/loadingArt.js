class ArtTank {
	constructor(x, y, sizeFactor, angle, turretAngle, color, sideColor) {
		this.x = x;
		this.y = y;
		this.width = 45 * sizeFactor;
		this.height = 35 * sizeFactor;
		this.turretBaseSide = 20 * sizeFactor;
		this.turretNozzleWidth = 20 * sizeFactor;
		this.turretNozzleHeight = 10 * sizeFactor;
		this.angle = angle * Math.PI / 180;
		this.turretAngle = turretAngle * Math.PI / 180;
		this.color = color;
		this.sideColor = sideColor;
	}

	render(opacity) {
		ctx.shadowBlur = 10;
		ctx.shadowColor = hexToRgbA(this.color, opacity);

		ctx.save();

		//translates to center x and y
		ctx.translate(this.x, this.y);
		ctx.rotate(this.angle);

		//DRAW TANK BASE//		
		ctx.fillStyle = hexToRgbA(this.color, opacity);
		ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);

		//DRAW TANK SIDES//
				
		//WHEELS
		ctx.fillStyle = hexToRgbA(this.sideColor, opacity);

		//left wheel
		ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height / 5);

		//right wheel
		ctx.fillRect(this.width / -2, this.height / 3, this.width, this.height / 5);

		ctx.restore();

		ctx.save();

		//DRAW TURRET//
		ctx.translate(this.x, this.y);
		ctx.rotate(this.turretAngle);
		ctx.lineWidth = 10;
		ctx.fillStyle = hexToRgbA(this.color, opacity);
		ctx.strokeStyle = hexToRgbA("#000000", opacity);

		//turret base
		ctx.strokeRect(this.turretBaseSide / -2, this.turretBaseSide / -2, this.turretBaseSide, this.turretBaseSide);
		ctx.fillRect(this.turretBaseSide / -2, this.turretBaseSide / -2, this.turretBaseSide, this.turretBaseSide);

		//turret nozzle
		ctx.strokeRect(this.turretNozzleWidth / 2, this.turretNozzleHeight / -2, this.turretNozzleWidth, this.turretNozzleHeight);
		ctx.fillRect(this.turretNozzleWidth / 2, this.turretNozzleHeight / -2, this.turretNozzleWidth, this.turretNozzleHeight);

		ctx.restore();

		ctx.shadowBlur = 0;
	}
}

function loadingArt(opacity) {
	blueArtTank.render(opacity);
	redArtTank.render(opacity);
	greenArtTank.render(opacity);
	yellowArtTank.render(opacity);

	ctx.shadowBlur = 10;
	ctx.shadowColor = hexToRgbA("#ED4245", opacity);

	ctx.font = "130px UniSansHeavy";
	ctx.fillStyle = hexToRgbA("#ffff80", opacity);

	ctx.lineWidth = 3;
	ctx.strokeStyle = hexToRgbA("#ED4245", startLogoOpacity);

	ctx.textAlign = "center";
	ctx.fillText("WANKLE", canvas.width / 2, (canvas.height / 2) + 40);
	ctx.strokeText("WANKLE", canvas.width / 2, (canvas.height / 2) + 40);

	ctx.shadowBlur = 0;
}