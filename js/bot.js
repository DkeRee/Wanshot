const REGULAR_MOVE = degreesToRadians(5);

class Bot extends Tank {
	constructor(
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
		updateTarget,
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
		tankType) {
			super(
				x, 
				y, 
				angle, 
				angle, 
				stun, 
				shellCap, 
				shellCooldown, 
				color, 
				turretColor, 
				sideColor, 
				speed, 
				rotationSpeed, 
				tankID, 
				tankType);

			this.targetTurretRot = 0;
			this.move = true;
			this.dodging = false;
			this.updateTargetCount = 0;
			this.closest = null;
			this.closestAngle = 0;
			this.targetAngle = 0;

			//all the other little information
			this.stopAndTurn = stopAndTurn;
			this.uTurn = uTurn;
			this.frequencyRegularMove = frm;
			this.updateTargetCount = updateTarget;
			this.shellSensitivity = shellSensitivity;
			this.abortNonmove = abortNonmove;
			this.turretRotationSpeed = turretRotationSpeed;
			this.turretArcSize = turretArcSize;
			this.shellType = shellType;
			this.shellBounceAmount = shellBounceAmount;
	}

	dodgeShells() {
		var closeShell = null;
		var closestDist = Infinity;

		for (var i = 0; i < STAGE_CACHE.shells.length; i++) {
			var shell = STAGE_CACHE.shells[i];
			var dist = getMagnitude(this.centerX - shell.centerX, this.centerY - shell.centerY);

			if (dist < closestDist) {
				closeShell = shell;
				closestDist = dist;
			}
		}

		var doDodge = this.closest == null ? true : (closeShell !== this.closest) || (closeShell == this.closest 
			&& closeShell.angle !== this.closestAngle);

		if (doDodge && closestDist < this.shellSensitivity && !closeShell.peace) {
			this.closest = closeShell;
			this.closestAngle = closeShell.angle;

			var shellVector = new xy(Math.cos(this.closest.angle), Math.sin(this.closest.angle));
			var tankVector = new xy(Math.cos(this.angle), Math.sin(this.angle));

			var resultant = normalizeVector(new xy(shellVector.x - tankVector.x, shellVector.y - tankVector.y));

			var dotNow = dotProduct(shellVector, tankVector);
			var dotNext = dotProduct(shellVector, resultant);

			var angleToResultant = betterAtan2(resultant.y, resultant.x);

			if (dotNow > 0 && dotNext > 0 && angleToResultant > Math.PI) {
				angleToResultant -= Math.PI;
			}

			this.targetAngle = angleToResultant;
			this.dodging = true;

			return true;
		}

		return false;
	}

	maneuverTiles() {
		var tileCount = 0;
		var tileVector = new xy(0, 0);
		var closestDist = Infinity;

		for (var i = 0; i < STAGE_CACHE.tiles.length; i++) {
			var tile = STAGE_CACHE.tiles[i];
			var dist = getMagnitude(this.centerX - tile.centerX, this.centerY - tile.centerY);

			if (dist < closestDist) {
				tileCount++;
				tileVector.x += Math.cos(this.centerX - tile.centerX);
				tileVector.y += Math.sin(this.centerY - tile.centerY);
				closestDist = dist;
			}
		}

		tileVector.x /= tileCount;
		tileVector.y /= tileCount;

		if (closestDist < 200) {
			var tankVector = new xy(Math.cos(this.angle), Math.sin(this.angle));

			var dot = dotProduct(tileVector, tankVector);
			var tileVectorMag = getMagnitude(tileVector.x, tileVector.y);
			var tankVectorMag = getMagnitude(tankVector.x, tankVector.y);

			var angleBetweenVectors = Math.acos(dot / (tileVectorMag * tankVectorMag));

			if (dot > 0 && angleBetweenVectors < Math.PI / 2) {
				this.targetAngle += (Math.PI / 2 - angleBetweenVectors) / 5;
				this.dodging = true;

				return true;
			}
		}

		return false;
	}

	walk() {
		var change = Math.random() * degreesToRadians(6);
		this.targetAngle += Math.random() > 0.5 ? change : -change;
		this.targetAngle %= 2 * Math.PI;
	}

	findTarget() {
		if (this.updateTargetCount < 0) {
			this.updateTargetCount++;
		} else if (!this.dodging) {
			this.updateTargetcount = this.updateTarget;

			if (this.dodgeShells()) {
				return;
			} else if (this.maneuverTiles()) {
				return;
			} else {
				this.walk();
			}
		}
	}

	followTarget() {
		var diff = this.targetAngle - this.angle;
		var diffOther = 2 * Math.PI - diff;

		if (diff >= 0) {
			if (diff < diffOther) {
				if (!this.move) {
					this.angle += this.rotationSpeed;
				}

				if (this.move && this.frequencyRegularMoveCount == 0) {
					this.angle += REGULAR_MOVE;
				}
			} else {
				if (!this.move) {
					this.angle -= this.rotationSpeed;
				}

				if (this.move && this.frequencyRegularMoveCount == 0) {
					this.angle -= REGULAR_MOVE;
				}
			}
		} else {
			diff = Math.abs(diff);
			diffOther = 2 * Math.PI - diff;

			if (diff < diffOther) {
				if (!this.move) {
					this.angle -= this.rotationSpeed;
				}

				if (this.move && this.frequencyRegularMoveCount == 0) {
					this.angle -= REGULAR_MOVE;
				}
			} else {
				if (!this.move) {
					this.angle += this.rotationSpeed;
				}

				if (this.move && this.frequencyRegularMoveCount == 0) {
					this.angle += REGULAR_MOVE;
				}
			}
		}

		if (this.frequencyRegularMoveCount < 0) {
			this.frequencyRegularMoveCount++;
		} else {
			this.frequencyRegularMoveCount = this.frequencyRegularMove;
		}

		diff = diff < diffOther ? diff : diffOther;

		if (this.dodging && diff <= degreesToRadians(5)) {
			this.dodging = false;
		}

		if (diff >= this.stopAndTurn) {
			this.move = false;
		} else {
			this.move = true;
		}

		if (this.xInc && this.yInc) {
			if (this.move || this.abortNonmove) {
				this.x += this.xInc;
				this.y += this.yInc;
			}
		}
	}

	updateMovement() {
		if (this.speed > 0) {
			//not a stationary tank
			this.findTarget();
			this.followTarget();
		}
	}

	findNewTurretRot() {
		var player = STAGE_CACHE.player;
		var angleToPlayer = betterAtan2(this.centerY - player.centerY, this.centerX - player.centerX) + Math.PI;

		var randOffset = Math.random() * this.turretArcSize;
		angleToPlayer += Math.random() > 0.5 ? randOffset : -randOffset;

		angleToPlayer %= 2 * Math.PI;

		this.targetTurretRot = angleToPlayer;
	}

	moveTurret() {
		var diff = this.targetTurretRot - this.turretAngle;
		var diffOther = 2 * Math.PI - diff;

		if (diff >= 0) {
			if (diff < diffOther) {
				//+
				this.turretAngle += this.turretRotationSpeed;
			} else {
				//-
				this.turretAngle -= this.turretRotationSpeed;
			}
		} else {
			diff = Math.abs(diff);
			diffOther = 2 * Math.PI - diff;

			if (diff < diffOther) {
				//-
				this.turretAngle -= this.turretRotationSpeed;
			} else {
				//+
				this.turretAngle += this.turretRotationSpeed;
			}
		}

		diff = diff < diffOther ? diff : diffOther;

		if (diff <= degreesToRadians(40)) {
			this.findNewTurretRot();
		}
	}

	shouldFire(ray) {
		const perpAngle = getPerpAngle(this.turretAngle);
		const Cos = Math.cos(perpAngle) * SHELL_HEIGHT * MOBILE_RAY_OFFSET;
		const Sin = Math.sin(perpAngle) * SHELL_HEIGHT * MOBILE_RAY_OFFSET;
		
		//left ray
		const leftRay = new Ray(new xy(ray.pointA.x + Cos, ray.pointA.y + Sin), new xy(ray.pointB.x + Cos, ray.pointB.y + Sin));
		
		//right ray
		const rightRay = new Ray(new xy(ray.pointA.x - Cos, ray.pointA.y - Sin), new xy(ray.pointB.x - Cos, ray.pointB.y - Sin));

		//leftCast
		const leftCast = castToPlayer(leftRay, this.turretAngle, this.shellBounceAmount, true, this.tankID, this.shellSensitivity, null);

		//rightCast
		const rightCast = castToPlayer(rightRay, this.turretAngle, this.shellBounceAmount, true, this.tankID, this.shellSensitivity, null);

		//if either ray collide with player, lock on. If there are no walls, shoot!
		return leftCast && rightCast;
	}

	manageShoot() {
		const shootCoordinates = new xy(1000 * Math.cos(this.turretAngle) + this.centerX, 1000 * Math.sin(this.turretAngle) + this.centerY);
		const ray = new Ray(new xy(this.centerX, this.centerY), shootCoordinates);
		if (this.shouldFire(ray)) {
			super.shoot(this.shellType);
		}
	}

	updateTurret() {
		this.manageShoot();
		this.moveTurret();
	}

	update() {
		if (!STAGE_CACHE.player.dead && !this.dead) {
			this.updateTurret();
			this.updateMovement();
		}
		super.update();
	}

	explode() {
		super.explode();

		//start intermission
		//the last enemy tank has been killed, you win this match!
		if (checkGameOver()) {
			intermissionStatus = INTERMISSION_WON;
			INTERMISSION = true;
		}
	}
}