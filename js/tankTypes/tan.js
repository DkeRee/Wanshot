class TanTank extends Bot {
	constructor(x, y, angle) {
		const speed = 140;
		const rotationSpeed = degreesToRadians(10);
		const stun = -40;
		const shellCap = 5;
		const shellCooldown = -25;
		const frm = -3;
		const stopAndTurn = degreesToRadians(30);
		const uTurn = degreesToRadians(170);
		const updateTargetCount = -3
		const shellSensitivity = 600;
		const abortNonmove = false;
		const turretRotationSpeed = degreesToRadians(3);
		const turretArcSize = degreesToRadians(95);
		const shellType = MISSLE;
		const shellBounceAmount = 0;
		const color = "#D2B48C";
		const turretColor = "#B89D7A";
		const sideColor = "#B0896B";
		const tankID = Math.floor(Math.random() * 100000);
		const tankType = TAN_TANK;

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

		this.offset = degreesToRadians(90);
	}

	manageShoot() {
		const shootCoordinates = new xy(1000 * Math.cos(this.turretAngle) + this.centerX, 1000 * Math.sin(this.turretAngle) + this.centerY);
		const ray = new Ray(new xy(this.centerX, this.centerY), shootCoordinates);
		if (this.shouldFire(ray)) {
			this.shoot(this.shellType);
		}
	}

	shoot(shellType) {
		if (super.isAbleToShoot()) {
			const initialBoost = 20;
			
			//play shell sound
			switch(shellType) {
				case NORMAL_SHELL:
					playSound(normalShoot);
					break;
				case MISSLE:
					playSound(missleShoot);
					break;
				case ULTRA_MISSLE:
					playSound(ultraMissleShoot);
					break;
				case TELE_SHELL:
					playSound(teleShot);
					break;
			}

			this.stunCount = this.stun;
			this.shellCooldownCount = this.shellCooldown;
			this.shellShot++;

			var leftAngle = this.turretAngle + this.offset;
			var rightAngle = this.turretAngle - this.offset;

			//shoot
			STAGE_CACHE.shells.push(new Shell(this.centerX - SHELL_WIDTH / 2 + (initialBoost * Math.cos(this.turretAngle)), this.centerY - SHELL_HEIGHT / 2 + (initialBoost * Math.sin(this.turretAngle)), shellType, this.turretAngle, this.tankID));
			STAGE_CACHE.shells.push(new Shell(this.centerX - SHELL_WIDTH / 2 + (initialBoost * Math.cos(leftAngle)), this.centerY - SHELL_HEIGHT / 2 + (initialBoost * Math.sin(leftAngle)), shellType, this.turretAngle, this.tankID));
			STAGE_CACHE.shells.push(new Shell(this.centerX - SHELL_WIDTH / 2 + (initialBoost * Math.cos(rightAngle)), this.centerY - SHELL_HEIGHT / 2 + (initialBoost * Math.sin(rightAngle)), shellType, this.turretAngle, this.tankID));
		}
	}
}
