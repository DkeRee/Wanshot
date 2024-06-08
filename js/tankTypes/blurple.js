class BlurpleTank extends Bot {
constructor(x, y, angle) {
		const speed = 140;
		const rotationSpeed = degreesToRadians(10);
		const stun = -10;
		const shellCap = 2;
		const shellCooldown = -40;
		const frm = -3;
		const stopAndTurn = degreesToRadians(30);
		const uTurn = degreesToRadians(170);
		const updateTargetCount = -3
		const shellSensitivity = 600;
		const abortNonmove = false;
		const turretRotationSpeed = degreesToRadians(3);
		const turretArcSize = degreesToRadians(95);
		const shellType = TELE_SHELL;
		const shellBounceAmount = 1;
		const color = "#7481F7";
		const turretColor = "#6A76E3";
		const sideColor = "#B0896B";
		const tankID = Math.floor(Math.random() * 100000);
		const tankType = BLURPLE_TANK;

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