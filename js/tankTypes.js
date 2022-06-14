function checkGameOver() {
	for (var i = 0; i < STAGE_CACHE.enemies.length; i++) {
		//game is not over if an enemy tank is still alive
		if (!STAGE_CACHE.enemies[i].dead) {
			return false;
		}
	}
	return true;
}

//TANK TYPES
//color code: bodyColor, turretColor, sideColor
class Player {
	constructor(x, y, angle, turretAngle) {
		//ID
		this.tankID = PLAYER_ID;

		this.tank = new Tank(x, y, angle, turretAngle, "#224ACF", "#1E42B8", "#0101BA", 100, 3, this.tankID);
		this.dead = false;

		//makes tank "shock" aka pause for a split second due to recoil from shot or mine
		this.tankShock = 0;

		//delays shell spamming
		this.shellDelay = 0.1;

		//caps number of shells to be shot/keeps track of how many shells are shot by this tank
		this.shellShot = 0;

		//caps number of mines layed
		this.mineLayed = 0;

		//delays mine spamming
		this.mineDelay = 50;

		this.keys = {};
	}

	update() {
		//update tankBody
		this.tank.updateBody();

		//update turret angle
		this.tank.turretAngle = Math.atan2(MOUSE_POS.y - this.tank.centerY, MOUSE_POS.x - this.tank.centerX);

		//update shellShock
		this.tankShock += deltaTime;

		//update shellDelay
		this.shellDelay += deltaTime;

		//update mineDelay
		this.mineDelay += deltaTime;

		//update movement
		const xInc = this.tank.speed * Math.cos(this.tank.angle) * deltaTime;
		const yInc = this.tank.speed * Math.sin(this.tank.angle) * deltaTime;

		const leftSide = this.tank.x;
		const rightSide = this.tank.x + this.tank.width;
		const bottomSide = this.tank.y + this.tank.height;
		const topSide = this.tank.y;

		//if tank is NOT SHELLSHOCKED and isn't dead
		if (this.tankShock > 0 && !this.dead) {
			//up
			if (this.keys[87] || this.keys[38]) {
				//IF NOT CROSSING OVER LEFT OR RIGHT SIDE AKA WITHIN BOUNDS
				if (leftSide + xInc >= 0 && rightSide + xInc <= CANVAS_WIDTH) {
					//update tank position
					this.tank.x += xInc;
				}
				//IF NOT CROSSING OVER TOP OR BOTTOM AKA WITHIN BOUNDS
				if (topSide + yInc >= 0 && bottomSide + yInc <= CANVAS_HEIGHT) {
					this.tank.y += yInc;
				}
			}

			//down
			if (this.keys[83] || this.keys[40]) {
				//IF NOT CROSSING OVER LEFT OR RIGHT SIDE AKA WITHIN BOUNDS
				if (leftSide - xInc >= 0 && rightSide - xInc <= CANVAS_WIDTH) {
					this.tank.x -= xInc;
				}
				//IF NOT CROSSING OVER TOP OR BOTTOM AKA WITHIN BOUNDS
				if (topSide - yInc >= 0 && bottomSide - yInc <= CANVAS_HEIGHT) {
					this.tank.y -= yInc;
				}
			}

			//right rotation
			if (this.keys[65] || this.keys[37]) {
				this.tank.angle -= this.tank.rotationSpeed * deltaTime;
			}

			//left rotation
			if (this.keys[68] || this.keys[39]) {
				this.tank.angle += this.tank.rotationSpeed * deltaTime;
			}

			//check for keybind for laying mines
			if (this.keys[32]) {
				//lay mine
				this.layMine();
				delete this.keys[32];
			}
		}

		//update particles
		this.tank.updateParticles();
	}
	
	explode() {
		//die
		this.dead = true;
		this.tank.explodeTank();

		//start intermission
		INTERMISSION = true;

		//add grave
		STAGE_CACHE.graves.push(new Grave(this.tank.centerX - GRAVE_WIDTH / 2, this.tank.centerY - GRAVE_HEIGHT / 2, this.tank.color));
	}

	shoot() {
		//delay shell fire rate && cap shell amount && isn't dead
		if (this.shellDelay > 0.1 && this.shellShot < 5 && !this.dead) {
			this.tankShock = -0.1;
			this.shellShot++;
			this.shellDelay = 0;

			this.tank.shoot(MOUSE_POS, NORMAL_SHELL, this.tankID);		
		}
	}

	layMine() {
		if (this.mineLayed < 2 && this.mineDelay > 2) {
			this.tankShock = -0.2;
			this.mineLayed++;
			this.mineDelay = 0;

			this.tank.layMine(this.tankID);
		}
	}

	trackUpdate() {
		if (!this.dead) {
			this.tank.trackUpdate();			
		}
	}

	render() {
		this.tank.render(this.dead);
	}

	renderShadow() {
		this.tank.renderShadow(this.dead);
	}
}

class BrownTank {
	constructor(x, y, angle, turretAngle) {
		//ID
		this.tankID = Math.floor(Math.random() * 100000);

		this.tank = new Tank(x, y, angle, turretAngle, "#966A4B", "#8C6346", "#B0896B", 0, 0, this.tankID);
		this.tankType = BROWN_TANK;
		this.bounces = 1;
		this.dead = false;

		//(90 * deltaTime) == 1.5 deg
		this.getNewGoal = true;
		this.goalRot = turretAngle * Math.PI / 180;
		this.noise = false;
		this.noiseDelay = 0;
		this.noiseAmount = 0.5;
		this.turretRotation = 90 * deltaTime * Math.PI / 180;
		this.shellDelay = 10;
	}

	//cast a ray to player
	castToPlayer(ray, angle, bouncesLeft, firstShot, collidedTileID) {
		//check for comrade collisions overall. If a ray has a comrade collision it should not be taken
		const comradeCollision = getComradeCollisions(ray, angle, firstShot, this.tankID);

		if (!comradeCollision.reflection) {
			if (bouncesLeft > 0) {
				const wallCollision = getWallCollisions(ray, angle, collidedTileID);

				if (wallCollision.reflection) {
					return this.castToPlayer(wallCollision.reflection.newRay, wallCollision.reflection.newAngle, bouncesLeft - 1, false, wallCollision.id);
				} else {
					const borderCollision = getBorderCollisions(ray, angle);
					return this.castToPlayer(borderCollision.reflection.newRay, borderCollision.reflection.newAngle, bouncesLeft - 1, false, borderCollision.id);
				}
			} else {
				//must hit player on last round
				const playerCollision = getPlayerCollisions(ray, angle);

				if (playerCollision.reflection) {
					//check if any walls are in the way
					const wallCollision = getWallCollisions(new Ray(ray.pointA, new xy(STAGE_CACHE.player.tank.x, STAGE_CACHE.player.tank.y)), angle, collidedTileID);

					if (!wallCollision.reflection) {
						//no walls are in the way!
						return {
							detectPlayer: true,
							noWalls: true
						};
					} else {
						//some walls are in the way :(
						return {
							detectPlayer: true,
							noWalls: false
						}
					}
				} else {
					//doesn't hit player :(
					return {
						detectPlayer: false,
						noWalls: false
					}
				}
			}
		} else {
			return {
				detectPlayer: false,
				noWalls: false
			}
		}
	}

	//fires two rays on each corner of a shell to determine if shell should be fired
	shouldFire(ray) {
		const perpAngle = getPerpAngle(ray);
		const Cos = Math.cos(perpAngle) * SHELL_WIDTH / 1.3;
		const Sin = Math.sin(perpAngle) * SHELL_WIDTH / 1.3;
		
		//left ray
		const leftRay = new Ray(new xy(ray.pointA.x + Cos, ray.pointA.y + Sin), new xy(ray.pointB.x + Cos, ray.pointB.y + Sin));
		
		//right ray
		const rightRay = new Ray(new xy(ray.pointA.x - Cos, ray.pointA.y - Sin), new xy(ray.pointB.x - Cos, ray.pointB.y - Sin));

		//leftCast
		const leftCast = this.castToPlayer(leftRay, this.tank.turretAngle, this.bounces, true, null);

		//rightCast
		const rightCast = this.castToPlayer(rightRay, this.tank.turretAngle, this.bounces, true, null);

		//if either ray collide with player, lock on. If there are no walls, shoot!

		if (leftCast.detectPlayer || rightCast.detectPlayer) {
			this.noise = true;
		}

		if (leftCast.detectPlayer && rightCast.detectPlayer) {
			if (leftCast.noWalls && rightCast.noWalls) {
				return true;
			}
		}
	}

	update() {
		if (!STAGE_CACHE.player.dead && !this.dead) {
			//update limiters
			this.shellDelay += deltaTime;

			//update tankbody
			this.tank.updateBody();	

			//rotate until it reaches goal (player hit), once it reaches goal activate some noise to avoid pinpoint accuracy

			//if the turret rotation is currently bigger than the goal rotation, make it go backwards

			//add some noise so that it swings once it locks on
			if (this.noise) {
				this.noiseDelay += deltaTime;

				if (this.noiseDelay > this.noiseAmount) {
					this.noiseDelay = 0;
					this.turretRotation *= -1;
					this.noise = false;
				} else {
					if (Math.floor(Math.random() * 1000) > 985) {
						this.turretRotation *= -1;
					}
				}
			}

			this.tank.turretAngle += this.turretRotation;

			const shootCoordinates = new xy(1000 * Math.cos(this.tank.turretAngle) + this.tank.centerX, 1000 * Math.sin(this.tank.turretAngle) + this.tank.centerY);

			const ray = new Ray(new xy(this.tank.centerX, this.tank.centerY), shootCoordinates);

			//check if ray hits player after exhausting all ricochetes
			//brown tank shoots normal bullet. it can only ricochet once
			if (this.shouldFire(ray) && this.shellDelay > 10) {
				//it found the ray to fire upon
				this.shellDelay = 0;
				this.tank.shoot(shootCoordinates, NORMAL_SHELL, this.tankID);
			}
		}

		//update particles
		this.tank.updateParticles();
	}

	trackUpdate() {
		if (!this.dead) {
			this.tank.trackUpdate();
		}
	}

	explode() {
		//die
		this.dead = true;
		this.tank.explodeTank();

		//start intermission
		//the last enemy tank has been killed, you win this match!
		if (checkGameOver()) {
			INTERMISSION = true;
		}

		//add grave
		STAGE_CACHE.graves.push(new Grave(this.tank.centerX - GRAVE_WIDTH / 2, this.tank.centerY - GRAVE_HEIGHT / 2, this.tank.color));
	}

	render() {
		this.tank.render(this.dead);
	}

	renderShadow() {
		this.tank.renderShadow(this.dead);
	}
}
