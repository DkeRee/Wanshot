class SuperpowerParticles {
	constructor(x, y) {
		//particle body (IT IS A SQUARE)
		this.maxSide = SUPERPOWER_PARTICLE_SIDE;
		this.side = 0;

		this.x = x;
		this.y = y;
		this.centerX = this.x + this.side / 2;
		this.centerY = this.y + this.side / 2;
		this.angle = (Math.floor(Math.random() * 360)) * Math.PI / 180;
		this.opacity = 1;
		this.speed = 200;
		this.explode = false;

		this.color = "#DBDBDB";
	}

	update() {
		//GOAL: move particle in random angle while it slowly fades and slows

		//update position
		this.x += this.speed * Math.cos(this.angle) * deltaTime;
		this.y += this.speed * Math.sin(this.angle) * deltaTime;

		this.centerX = this.x + this.side / 2;
		this.centerY = this.y + this.side / 2;

		//update side (make it slowly expand from 0)
		this.maxSide /= 2;
		this.side += this.maxSide;

		//update opacity and speed
		this.opacity -= 0.5 * deltaTime;
		this.speed -= 1 * deltaTime;

		//check for deletion
		if (this.opacity <= 0) {
			this.explode = true;
		}
	}

	render() {
		//RENDER PARTICLE
		ctx.shadowBlur = 5;
		ctx.shadowColor = this.color;
		ctx.save();

		ctx.translate(this.centerX, this.centerY);
		ctx.rotate(this.angle);

		//color in rgba to support opacity
		ctx.fillStyle = hexToRgbA(this.color, this.opacity);
		ctx.fillRect(this.side / -2, this.side / -2, this.side, this.side);

		ctx.restore();
		ctx.shadowBlur = 0;
	}
}

class WhiteTank {
	constructor(x, y, angle, turretAngle) {
		//ID
		this.tankID = Math.floor(Math.random() * 100000);

		this.tank = new Tank(x, y, angle, turretAngle, "#DBDBDB", "#CFCFCF", "#B0896B", 130, 1, this.tankID);
		this.tankType = WHITE_TANK;
		this.bounces = 1;
		this.dead = false;

		//special power! Invisibility!
		this.invisible = false;
		this.invisibleParticles = [];

		//movement update

		//mines that are remembered
		this.mineMemory = [];
		this.mineDelay = 5;
		this.mineDelayCap = 7;

		//makes tank "shock" aka pause for a split second due to recoil from shot or mine
		this.tankShock = 0;
		this.tankRotation = 0;
		this.uTurning = false;
		this.tankRotationDelay = 0;
		this.tankRotationCap = 0.05;

		//turret update
		this.shellDetectionRadius = 250;

		//lock on to player
		this.goalRot = turretAngle * Math.PI / 180;

		//(60 * deltaTime) == 1 deg
		this.noise = false;
		this.noiseDelay = 0;
		this.noiseAmount = 0.2;
		this.turretRotation = 200 * deltaTime * Math.PI / 180;
		this.shellDelay = 0.35;
		this.shellShot = 0;
	}

	turnInvisible() {
		this.invisible = true;

		//make 15 invisible particles
		for (var i = 0; i < 15; i++) {
			this.invisibleParticles.push(new SuperpowerParticles(this.tank.centerX - SUPERPOWER_PARTICLE_SIDE / 2, this.tank.centerY - SUPERPOWER_PARTICLE_SIDE / 2));
		}
	}

	//cast a ray to player
	castToPlayer(ray, angle, bouncesLeft, firstShot, collidedSideID) {
		//check for comrade collisions overall. If a ray has a comrade collision it should not be taken
		const comradeCollision = getComradeCollisions(ray, angle, firstShot, this.tankID);

		if (!comradeCollision.reflection) {
			//it doesn't matter how many bounces are left, it matters if the tank is still alive. check for incoming shells and remove the threat
			const shellCollision = getShellCollisions(ray, angle);

			//check if shell is within a certain target radius, aka close enough for it to be a threat
			if (shellCollision.dist <= this.shellDetectionRadius) {
				//check if any walls are in the way
				const wallCollision = getWallCollisions(new Ray(ray.pointA, shellCollision.reflection.point), angle, collidedSideID);

				if (!wallCollision.reflection) {
					//no walls are in the way!

					/*technically did not detect player, but that's what i will use for object detection*/
					return {
						detectPlayer: true,
						noWalls: true
					};
				}

				//if there was a wall collision, then continue normally
			}

			const playerCollision = getPlayerCollisions(ray, angle);

			if (bouncesLeft > 0) {
				//found a player collision before hitting 0 bounces!
				if (playerCollision.reflection) {
					//check if any walls are in the way
					const wallCollision = getWallCollisions(new Ray(ray.pointA, playerCollision.reflection.point), angle, collidedSideID);

					if (!wallCollision.reflection) {
						//no walls are in the way!
						return {
							detectPlayer: true,
							noWalls: true
						};
					} else {
						//bounce off the wall we have detected!
						return this.castToPlayer(wallCollision.reflection.newRay, wallCollision.reflection.newAngle, bouncesLeft - 1, false, wallCollision.id);
					}
				} else {
					const wallCollision = getWallCollisions(ray, angle, collidedSideID);

					if (wallCollision.reflection) {
						return this.castToPlayer(wallCollision.reflection.newRay, wallCollision.reflection.newAngle, bouncesLeft - 1, false, wallCollision.id);
					} else {
						const borderCollision = getBorderCollisions(ray, angle, collidedSideID);

						//terminate
						if (!borderCollision.reflection) return {
							detectPlayer: false,
							noWalls: false
						};

						return this.castToPlayer(borderCollision.reflection.newRay, borderCollision.reflection.newAngle, bouncesLeft - 1, false, borderCollision.id);
					}
				}
			} else {
				//must hit player on last round
				if (playerCollision.reflection) {
					//check if any walls are in the way
					const wallCollision = getWallCollisions(new Ray(ray.pointA, playerCollision.reflection.point), angle, collidedSideID);

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
						};
					}
				} else {
					//doesn't hit player :(
					return {
						detectPlayer: false,
						noWalls: false
					};
				}
			}
		} else {
			return {
				detectPlayer: false,
				noWalls: false
			};
		}
	}

	shouldFire(ray) {
		const perpAngle = getPerpAngle(this.tank.angle);
		const Cos = Math.cos(perpAngle) * SHELL_HEIGHT * MOBILE_RAY_OFFSET;
		const Sin = Math.sin(perpAngle) * SHELL_HEIGHT * MOBILE_RAY_OFFSET;
		
		//left ray
		const leftRay = new Ray(new xy(ray.pointA.x + Cos, ray.pointA.y + Sin), new xy(ray.pointB.x + Cos, ray.pointB.y + Sin));
		
		//right ray
		const rightRay = new Ray(new xy(ray.pointA.x - Cos, ray.pointA.y - Sin), new xy(ray.pointB.x - Cos, ray.pointB.y - Sin));

		//leftCast
		const leftCast = this.castToPlayer(leftRay, this.tank.turretAngle, this.bounces, true, null);

		//rightCast
		const rightCast = this.castToPlayer(rightRay, this.tank.turretAngle, this.bounces, true, null);

		//if either ray collide with player, lock on. If there are no walls, shoot!

		if (leftCast.detectPlayer && rightCast.detectPlayer) {
			if (leftCast.noWalls && rightCast.noWalls) {
				this.try = 0;
				return true;
			}
		}
	}

	matchMineID(mineID) {
		for (var i = 0; i < this.mineMemory.length; i++) {
			if (this.mineMemory[i] == mineID) {
				return {
					i: i
				};
			}
		}

		return false;
	}

	dodgeMines() {
		for (var i = 0; i < STAGE_CACHE.mines.length; i++) {
			const mine = STAGE_CACHE.mines[i];

			if (SAT_POLYGON_CIRCLE(this.tank, {
				x: mine.x,
				y: mine.y,
				radius: MINE_EXPLOSION_RADIUS * 2
			})) {
				//if we have not already dodged this mine
				if (!this.matchMineID(mine.id)) {
					this.mineMemory.push(mine.id);

					//hit a 180 babyyy
					this.tankRotation = 10800 * deltaTime * this.tank.rotationSpeed * Math.PI / 180;
				}
			} else {
				const mineImprint = this.matchMineID(mine.id);
				
				//if we are no longer touching the mine but we remember it, forget about the mine
				if (mineImprint) {
					this.mineMemory.splice(mineImprint.i, 1);
				}
			}
		}
	}

	checkIfClose() {
		//check if we're too close to another tank
		for (var i = 0; i < STAGE_CACHE.enemies.length; i++) {
			const enemy = STAGE_CACHE.enemies[i];

			//if we're not looking at the same tank
			if (enemy.tankID !== this.tankID) {
				const thisCoord = new xy(this.tank.centerX, this.tank.centerY);
				const comradeCoord = new xy(enemy.tank.centerX, enemy.tank.centerY);
				if (getRayLength(thisCoord, comradeCoord) <= MINE_EXPLOSION_RADIUS * 1.8) {
					return true;
				}
			}
		}

		//check if we're too cloe to another mine
		for (var i = 0; i < STAGE_CACHE.mines.length; i++) {
			const mine = STAGE_CACHE.mines[i];

			const thisCoord = new xy(this.tank.centerX, this.tank.centerY);
			const mineCoord = new xy(mine.x, mine.y);

			if (getRayLength(thisCoord, mineCoord) <= MINE_EXPLOSION_RADIUS * 2) {
				return true;
			}
		}

		return false;
	}

	dodgeShells() {
		for (var i = 0; i < STAGE_CACHE.shells.length; i++) {
			const shell = STAGE_CACHE.shells[i];
			
			//if the shell is not diminishing
			if (!shell.diminish) {
				const tankCoord = new xy(this.tank.centerX, this.tank.centerY);
				const shellCoord = new xy(shell.centerX, shell.centerY);

				const shellDist = getRayLength(tankCoord, shellCoord);

				//if the shell is getting too close and it is going to hit the tank, avoid!
				if (shellDist <= this.shellDetectionRadius) {
					const shellEndPoint = new xy(shellCoord.x + Math.cos(shell.angle) * 1000, shellCoord.y + Math.sin(shell.angle) * 1000);

					//extend the tank's width to make the tanks predict ahead of time (funny idea!)
					const tankClone = {...this.tank};
					tankClone.width += 20;

					const intersection = singleShellCollision(new Ray(shellCoord, shellEndPoint), tankClone);

					if (intersection.reflection) {
						if (intersection.side == 0 || intersection.side == 3) {
							//sharp turn left, left or bottom
							this.tankRotation = 1100 * deltaTime * this.tank.rotationSpeed * Math.PI / 180;
						} else {
							//sharp turn right, right or top
							this.tankRotation = -1100 * deltaTime * this.tank.rotationSpeed * Math.PI / 180;
						}

						return true;
					}
				}
			}
		}
	}

	getRandomBodyRot() {
		//return a random rotation for the tank to travel with in radians
		const max = 500;
		const min = -500;
		return ((Math.random() * (max - min) + min) * deltaTime * this.tank.rotationSpeed) * Math.PI / 180;
	}

	update() {
		if (!STAGE_CACHE.player.dead && !this.dead) {
			//update limiters
			this.shellDelay += deltaTime;
			this.mineDelay += deltaTime;

			//update tankShock
			this.tankShock += deltaTime;

			//update tank angle
			this.tankRotationDelay += deltaTime;

			//update tankbody
			this.tank.updateBody();

			if (this.tankRotationDelay > this.tankRotationCap) {
				this.tankRotationDelay = 0;
				this.tank.angle += this.tankRotation;

				//do not let regular movement affect movement when dodging shells
				if (!this.dodgeShells()) {
					const foreignCollision = getForeignCollisions(this.tank);
					if (foreignCollision) {
						//about to collide, don't idle
						switch (foreignCollision) {
							case U_TURN:
								this.tankRotation = -2400 * deltaTime * this.tank.rotationSpeed * Math.PI / 180;
								if (!this.uTurning) {
									this.uTurning = true;
									this.tank.speed /= 2;
								}
								break;
							case TURN_LEFT:
								//5 degrees
								this.tankRotation = 300 * deltaTime * this.tank.rotationSpeed * Math.PI / 180;
								if (this.uTurning) {
									this.uTurning = false;
									this.tank.speed *= 2;
								}
								break;
							case TURN_RIGHT:
								//-5 degrees
								this.tankRotation = -300 * deltaTime * this.tank.rotationSpeed * Math.PI / 180;
								if (this.uTurning) {
									this.uTurning = false;
									this.tank.speed *= 2;
								}
								break;
						}
					} else {
						if (this.uTurning) {
							this.uTurning = false;
							this.tank.speed *= 2;
						}

						this.tankRotation = this.getRandomBodyRot();
					}
				}

				this.dodgeMines();
			}

			//update movement if tank is not shocked!
			if (this.tankShock > 0) {
				const xInc = this.tank.speed * Math.cos(this.tank.angle) * deltaTime;
				const yInc = this.tank.speed * Math.sin(this.tank.angle) * deltaTime;

				this.tank.x += xInc;
				this.tank.y += yInc;
			}

			//update turret
			this.goalRot = Math.atan2(STAGE_CACHE.player.tank.y - this.tank.y, STAGE_CACHE.player.tank.x - this.tank.x);

			//adjust angles to stay with bounds
			if (Math.sign(this.goalRot) !== 1) {
				this.goalRot += 2 * Math.PI;
			}

			if (Math.sign(this.tank.turretAngle) !== 1) {
				this.tank.turretAngle += 2 * Math.PI;
			}

			this.goalRot %= 2 * Math.PI;
			this.tank.turretAngle %= 2 * Math.PI;

			this.tank.turretAngle += this.turretRotation;

			//noise to make turret swing
			if (this.noise) {
				this.noiseDelay += deltaTime;

				if (this.noiseDelay > this.noiseAmount) {
					this.noiseDelay = 0;
					this.turretRotation *= -1;
					this.noise = false;
				}
			} else {
				//check if goalRot has been met :)
				if (this.tank.turretAngle < this.goalRot) {
					//if this used to be under...
					if (this.tank.turretAngle + (5 * Math.PI / 180) >= this.goalRot) {
						this.noise = true;
					}
				} else {
					//if this used to be over...
					if (this.tank.turretAngle - (5 * Math.PI / 180) <= this.goalRot) {
						this.noise = true;
					}
				}
			}

			//update mine laying if the mine delay is bigger than the cap and if we are not close to any other enemy tanks
			if (this.mineDelay > this.mineDelayCap && !this.checkIfClose()) {
				this.tankShock = -0.1;
				this.mineDelay = 0;

				this.tank.layMine(this.tankID);
			}

			//update shooting
			const shootCoordinates = new xy(1500 * Math.cos(this.tank.turretAngle) + this.tank.centerX, 1500 * Math.sin(this.tank.turretAngle) + this.tank.centerY);

			const ray = new Ray(new xy(this.tank.centerX, this.tank.centerY), shootCoordinates);

			//white tanks shoot up to 5 shells rapidly
			if (this.shouldFire(ray) && this.shellDelay > 0.3 && this.shellShot < 5) {
				//it found the ray to fire upon
				this.shellShot++;
				this.shellDelay = 0;
				this.tankShock = -0.1;
				this.tank.shoot(shootCoordinates, NORMAL_SHELL, this.tankID);
			}
			
		}

		//update superpower particles
		for (var i = 0; i < this.invisibleParticles.length; i++) {
			const particle = this.invisibleParticles[i];

			if (particle.explode) {
				//DELETE PARTICLE
				this.invisibleParticles.splice(i, 1);
				continue;
			}

			particle.update();
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
		//if tank isn't invisible
		if (!this.invisible) {
			this.tank.render(this.dead);
		} else {
			//render explosion particles
			for (var i = 0; i < this.tank.explosionParticles.length; i++) {
				this.tank.explosionParticles[i].render();
			}
		}

		//render superpower particles
		for (var i = 0; i < this.invisibleParticles.length; i++) {
			this.invisibleParticles[i].render();
		}
	}

	renderShadow() {
		//if tank isn't invisible
		if (!this.invisible) {
			this.tank.renderShadow(this.dead);	
		}
	}
}