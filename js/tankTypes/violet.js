class ProtectionBubble {
	constructor(x, y, tankID) {
		//violet tank's protection bubble :D

		this.x = x;
		this.y = y;
		this.tankID = tankID;
		this.color = "#FF19F8";
		this.radius = VIOLET_PROTECTION_RADIUS;
	}

	update(x, y) {
		//move zone with tank!
		this.x = x;
		this.y = y;
	}

	render() {
		ctx.shadowBlur = 10;
		ctx.shadowColor = hexToRgbA(this.color, 0.1);
		ctx.fillStyle = hexToRgbA(this.color, 0.1);
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
		ctx.fill();
		ctx.shadowBlur = 0;
	}
}

class VioletTank extends Bot {
	constructor(x, y, angle) {
		const speed = 50;
		const rotationSpeed = degreesToRadians(5);
		const stun = -5;
		const shellCap = 1;
		const shellCooldown = -700;
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
		const color = "#FF19F8";
		const turretColor = "#B512B0";
		const sideColor = "#B0896B";
		const tankID = Math.floor(Math.random() * 100000);
		const tankType = VIOLET_TANK;

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

	update() {
		super.update();

		if (!INTERMISSION) {
			//update protection zone
			for (var i = 0; i < STAGE_CACHE.violetProtection.length; i++) {
				const bubble = STAGE_CACHE.violetProtection[i];

				//found this violet tank's protection bubble :)
				if (bubble.tankID == this.tankID) {
					if (this.dead) {
						STAGE_CACHE.violetProtection.splice(i, 1);
						continue;
					}

					bubble.update(this.centerX, this.centerY);
				}
			}
		}
	}
}