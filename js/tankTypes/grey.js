class GreyTank extends Bot {
	constructor(x, y, angle) {
		const speed = 80;
		const rotationSpeed = degreesToRadians(5);
		const stun = -5;
		const shellCap = 1;
		const shellCooldown = -500;
		const frm = -3;
		const stopAndTurn = degreesToRadians(70);
		const uTurn = degreesToRadians(120);
		const updateTargetCount = -5;
		const shellSensitivity = 150;
		const abortNonmove = false;
		const turretRotationSpeed = degreesToRadians(2);
		const turretArcSize = degreesToRadians(90);
		const shellType = NORMAL_SHELL;
		const shellBounceAmount = 1;
		const color = "#4A4A4A";
		const turretColor = "#4D4D4D";
		const sideColor = "#B0896B";
		const tankID = Math.floor(Math.random() * 100000);
		const tankType = GREY_TANK;

		super(
			x,
			y,
			angle,
			speed,
			rotationSpeed,
			stun,
			shellCap,
			shellCooldown,
			frm,
			stopAndTurn,
			uTurn,
			updateTargetCount,
			shellSensitivity,
			abortNonmove,
			turretRotationSpeed,
			turretArcSize,
			shellType,
			shellBounceAmount,
			color,
			turretColor,
			sideColor,
			tankID,
			tankType
			);
	}
}