//TANK TYPES
class Player {
	constructor(x, y, bodyAngle, turretAngle) {
		this.tank = new Tank(x, y, bodyAngle, turretAngle, "#224ACF", "#0101BA", 1.7);
		this.tankID = PLAYER_ID;

		//makes tank "shock" aka pause for a split second due to recoil from shot
		this.shellShock = 0;

		//delays shell spamming
		this.shellDelay = 0;

		//caps number of shells to be shot/keeps track of how many shells are shot by this tank
		this.shellShot = 0;
		this.keys = {};
	}

	update() {
		//update tankBody
		this.tank.updateBody(MOUSE_POS);

		//update shellShock
		this.shellShock++;

		//update shellDelay
		this.shellDelay++;

		//update movement
		const xInc = this.tank.speed * Math.cos(this.tank.bodyAngle);
		const yInc = this.tank.speed * Math.sin(this.tank.bodyAngle);

		const leftSide = this.tank.x - this.tank.width / 2;
		const rightSide = this.tank.x + this.tank.width / 2;
		const bottomSide = this.tank.y + this.tank.height / 2;
		const topSide = this.tank.y - this.tank.height / 2;

		//if tank is NOT SHELLSHOCKED
		if (this.shellShock > 0) {
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
				this.tank.bodyAngle -= 0.05;
			}

			//left rotation
			if (this.keys[68] || this.keys[39]) {
				this.tank.bodyAngle += 0.05;
			}
		}
	}

	shoot() {
		//delay shell fire rate && cap shell amount
		if (this.shellDelay > 7 && this.shellShot < 5) {
			this.shellShock = -5;
			this.shellShot++;
			this.shellDelay = 0;

			this.tank.shoot(MOUSE_POS, NORMAL_SHELL, this.tankID);		
		}
	}

	trackUpdate() {
		this.tank.trackUpdate();
	}

	render() {
		this.tank.render();
	}
}
