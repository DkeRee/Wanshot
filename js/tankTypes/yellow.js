class YellowTank extends Bot {
	constructor(x, y, angle) {
		const speed = 150;
		const rotationSpeed = degreesToRadians(10);
		const stun = -5;
		const shellCap = 1;
		const shellCooldown = -80;
		const frm = -3;
		const stopAndTurn = degreesToRadians(30);
		const uTurn = degreesToRadians(170);
		const updateTargetCount = -3;
		const shellSensitivity = 400;
		const abortNonmove = false;
		const turretRotationSpeed = degreesToRadians(3);
		const turretArcSize = degreesToRadians(95);
		const shellType = NORMAL_SHELL
		const shellBounceAmount = 1;
		const color = "#FEE75C";
		const turretColor = "#FEE75C";
		const sideColor = "#B0896B";
		const tankID = Math.floor(Math.random() * 100000);
		const tankType = YELLOW_TANK;

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

		this.mineMax = 3;
		this.mineCount = 3;
	}

	walk() {
		super.walk();
		this.targetAngle = betterAtan2(this.centerY - STAGE_CACHE.player.centerY, this.centerX - STAGE_CACHE.player.centerX) + Math.PI;
	}

	update() {
		super.update();

		if (!this.dead && !INTERMISSION) {
			if (this.mineCount < this.mineMax) {
				this.mineCount += deltaTime;
			} else {
				super.layMine();
				this.mineCount = 0;
			}
		}
	}
}