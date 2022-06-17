const U_TURN = 1;
const TURN_LEFT = 2;
const TURN_RIGHT = 3;

function checkGameOver() {
	for (var i = 0; i < STAGE_CACHE.enemies.length; i++) {
		//game is not over if an enemy tank is still alive
		if (!STAGE_CACHE.enemies[i].dead) {
			return false;
		}
	}
	return true;
}

function getRayLength(pointA, pointB) {
	return Math.sqrt(Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2));
}

function getPerpAngle(angle) {
	return angle - (Math.PI / 2);
}

function getRayIntersect(rayA, rayB) {
	const x1 = rayA.pointA.x;
	const y1 = rayA.pointA.y;
	const x2 = rayA.pointB.x;
	const y2 = rayA.pointB.y;
	const x3 = rayB.pointA.x;
	const y3 = rayB.pointA.y;
	const x4 = rayB.pointB.x;
	const y4 = rayB.pointB.y;

	var ua, ub, denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
    if (denom == 0) {
        return {
        	intersect: false,
        	point: null
        };
    }

    ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
    ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;

    if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
        return {
    		intersect: true,
    		point: new xy(x1 + ua * (x2 - x1), y1 + ua * (y2 - y1))
    	}
    } else {
    	return {
    		intersect: false,
    		point: null
    	}
    }
}

function reflectRay(ray, collider, angle, i) {
	const collision = getRayIntersect(ray, collider);

	if (collision.intersect) {
		var newRay;
		var newAngle;
		const intersectedPoint = collision.point;

		if (i == 0 || i == 2) {
			//this rebounded off the left or right wall
			newAngle = Math.PI - angle;
		} else {
			//this rebounded off the top or bottom wall
			newAngle = 2 * Math.PI - angle;
		}

		newRay = new Ray(new xy(intersectedPoint.x, intersectedPoint.y), new xy(1000 * Math.cos(newAngle) + intersectedPoint.x, 1000 * Math.sin(newAngle) + intersectedPoint.y));

		return {
			intersect: true,
			point: intersectedPoint,
			newRay: newRay,
			newAngle: newAngle
		}
	}

	return {
		intersect: false,
		point: null,
		newRay: null,
		newAngle: null
	}
}

function getWallCollisions(ray, angle, forbiddenTile) {
	const closestIntersection = {
		reflection: null,
		id: null,
		dist: Infinity
	};

	for (var i = 0; i < STAGE_CACHE.tiles.length; i++) {
		const tile = new Polygon(STAGE_CACHE.tiles[i]);
		const points = tile.vertexPoints;

		const edges = [
			new Ray(points.topLeft, points.bottomLeft), //left
			new Ray(points.topLeft, points.topRight), //top
			new Ray(points.topRight, points.bottomRight), //right
			new Ray(points.bottomLeft, points.bottomRight) //bottom
		];

		//avoid colliding with clipped tile
		if (forbiddenTile) {
			if (STAGE_CACHE.tiles[i].id == forbiddenTile) {
				continue;
			}
		}

		for (var o = 0; o < edges.length; o++) {
			const reflection = reflectRay(ray, edges[o], angle, o);

			if (reflection.intersect) {
				const rayLength = getRayLength(ray.pointA, reflection.point);
				if (rayLength < closestIntersection.dist) {
					closestIntersection.reflection = reflection;
					closestIntersection.id = STAGE_CACHE.tiles[i].id;
					closestIntersection.dist = rayLength;
				}
			}
		}
	}

	return closestIntersection;
}

function getPitCollisions(ray, angle) {
	const closestIntersection = {
		reflection: null,
		dist: Infinity
	};

	for (var i = 0; i < STAGE_CACHE.pits.length; i++) {
		const pit = new Polygon(STAGE_CACHE.pits[i]);
		const points = pit.vertexPoints;

		const edges = [
			new Ray(points.topLeft, points.bottomLeft), //left
			new Ray(points.topLeft, points.topRight), //top
			new Ray(points.topRight, points.bottomRight), //right
			new Ray(points.bottomLeft, points.bottomRight) //bottom
		];

		for (var o = 0; o < edges.length; o++) {
			const collision = getRayIntersect(ray, edges[o]);

			if (collision.intersect) {
				const rayLength = getRayLength(ray.pointA, collision.point);
				if (rayLength < closestIntersection.dist) {
					closestIntersection.reflection = collision;
					closestIntersection.dist = rayLength;
				}
			}
		}
	}

	return closestIntersection;
}

function getBorderCollisions(ray, angle, forbiddenBorder) {
	const borders = [
		new Ray(new xy(0, 0), new xy(0, CANVAS_HEIGHT)), //left
		new Ray(new xy(0, 0), new xy(CANVAS_WIDTH, 0)), //top
		new Ray(new xy(CANVAS_WIDTH, 0), new xy(CANVAS_WIDTH, CANVAS_HEIGHT)), //right
		new Ray(new xy(0, CANVAS_HEIGHT), new xy(CANVAS_WIDTH, CANVAS_HEIGHT)) //bottom
	];

	for (var i = 0; i < borders.length; i++) {
		//skip border to avoid clipping
		if (i == forbiddenBorder) {
			continue;
		}

		const reflection = reflectRay(ray, borders[i], angle, i);

		if (reflection.intersect) {
			return {
				reflection: reflection,
				id: i
			};
		}
	}

	return {
		reflection: false,
		id: null
	};
}

function getShellCollisions(ray, angle) {
	const closestIntersection = {
		reflection: null,
		dist: Infinity
	};

	for (var i = 0; i < STAGE_CACHE.shells.length; i++) {
		//if shell isn't diminishing and is still active
		if (!STAGE_CACHE.shells[i].diminish) {
			const infoShell = STAGE_CACHE.shells[i];
			const shell = new Polygon(infoShell);
			const points = shell.vertexPoints;

			const edges = [
				new Ray(points.topLeft, points.bottomLeft), //left
				new Ray(points.topLeft, points.topRight), //top
				new Ray(points.topRight, points.bottomRight), //right
				new Ray(points.bottomLeft, points.bottomRight) //bottom
			];

			for (var o = 0; o < edges.length; o++) {
				const intersection = getRayIntersect(ray, edges[o]);
				const shellRay = new Ray(new xy(infoShell.centerX, infoShell.centerY), new xy(infoShell.centerX + Math.cos(infoShell.angle) * 1000, infoShell.centerY + Math.sin(infoShell.angle) * 1000));

				if (intersection.intersect && getComradeCollisions(shellRay, infoShell.angle, false, NaN).reflection) {
					const rayLength = getRayLength(ray.pointA, intersection.point);

					if (rayLength < closestIntersection.dist) {
						closestIntersection.reflection = intersection;
						closestIntersection.dist = rayLength;
					}
				}
			}
		}
	}

	return closestIntersection;
}

function singleShellCollision(shellRay, tank) {
	const closestIntersection = {
		reflection: null,
		side: null,
		dist: Infinity
	};

	const polygonTank = new Polygon(tank);
	const points = polygonTank.vertexPoints;

	//predict
	polygonTank.x += Math.cos(tank.angle) * 40;
	polygonTank.y += Math.sin(tank.angle) * 40;

	const edges = [
		new Ray(points.topLeft, points.bottomLeft), //left
		new Ray(points.topLeft, points.topRight), //top
		new Ray(points.topRight, points.bottomRight), //right
		new Ray(points.bottomLeft, points.bottomRight) //bottom
	];

	for (var i = 0; i < edges.length; i++) {
		const intersection = getRayIntersect(shellRay, edges[i]);

		if (intersection.intersect) {
			const rayLength = getRayLength(shellRay.pointA, intersection.point);

			if (rayLength < closestIntersection.dist) {
				closestIntersection.reflection = intersection;
				closestIntersection.side = i;
				closestIntersection.dist = rayLength;
			}
		}
	}

	return closestIntersection;
}

function getComradeCollisions(ray, angle, firstShot, tankID) {
	const closestIntersection = {
		reflection: null,
		dist: Infinity
	};

	for (var i = 0; i < STAGE_CACHE.enemies.length; i++) {
		//avoid clipping into own tank on first shot
		//if enemy tank isn't dead
		if (!STAGE_CACHE.enemies[i].dead) {
			if (firstShot && STAGE_CACHE.enemies[i].tankID == tankID) {
				continue;
			}

			const enemy = new Polygon(STAGE_CACHE.enemies[i].tank);
			const points = enemy.vertexPoints;

			const edges = [
				new Ray(points.topLeft, points.bottomLeft), //left
				new Ray(points.topLeft, points.topRight), //top
				new Ray(points.topRight, points.bottomRight), //right
				new Ray(points.bottomLeft, points.bottomRight) //bottom
			];

			for (var o = 0; o < edges.length; o++) {
				//bump up pointA of ray to avoid clipping based on side of collision

				const intersection = getRayIntersect(ray, edges[o]);

				if (intersection.intersect) {
					const rayLength = getRayLength(ray.pointA, intersection.point);

					if (rayLength < closestIntersection.dist) {
						closestIntersection.reflection = intersection;
						closestIntersection.dist = rayLength;
					}
				}
			}
		}
	}

	return closestIntersection;
}

function getPlayerCollisions(ray, angle) {
	const closestIntersection = {
		reflection: null,
		dist: Infinity
	};

	const player = new Polygon(STAGE_CACHE.player.tank);
	const points = player.vertexPoints;

	const edges = [
		new Ray(points.topLeft, points.bottomLeft), //left
		new Ray(points.topLeft, points.topRight), //top
		new Ray(points.topRight, points.bottomRight), //right
		new Ray(points.bottomLeft, points.bottomRight) //bottom
	];

	for (var i = 0; i < edges.length; i++) {
		const intersection = getRayIntersect(ray, edges[i]);

		if (intersection.intersect) {
			const rayLength = getRayLength(ray.pointA, intersection.point);

			if (rayLength < closestIntersection.dist) {
				closestIntersection.reflection = intersection;
				closestIntersection.dist = rayLength;
			}
		}
	}

	return closestIntersection;
}

function getForeignCollisions(tank) {
	const range = TANK_WIDTH * 1.8;
	const bigOffset = 20 * Math.PI / 180;
	const smallOffset = 25 * Math.PI / 180;

	const bigRight = new Ray(new xy(tank.centerX, tank.centerY), new xy(range * 3 * Math.cos(tank.angle + bigOffset) + tank.centerX, range * 3 * Math.sin(tank.angle + bigOffset) + tank.centerY));
	const bigLeft = new Ray(new xy(tank.centerX, tank.centerY), new xy(range * 3 * Math.cos(tank.angle - bigOffset) + tank.centerX, range  * 3 * Math.sin(tank.angle - bigOffset) + tank.centerY));

	const smallRight = new Ray(new xy(tank.centerX, tank.centerY), new xy(TANK_WIDTH / 1.3 * Math.cos(tank.angle + smallOffset) + tank.centerX, TANK_WIDTH / 1.3 * Math.sin(tank.angle + smallOffset) + tank.centerY));
	const smallLeft = new Ray(new xy(tank.centerX, tank.centerY), new xy(TANK_WIDTH / 1.3 * Math.cos(tank.angle - smallOffset) + tank.centerX, TANK_WIDTH / 1.3 * Math.sin(tank.angle - smallOffset) + tank.centerY));

	const smallMiddle = new Ray(new xy(tank.centerX, tank.centerY), new xy(TANK_WIDTH / 1.3 * Math.cos(tank.angle) + tank.centerX, TANK_WIDTH / 1.3 * Math.sin(tank.angle) + tank.centerY));

	const isBigRight = getBorderCollisions(bigRight, tank.angle + bigOffset, null).reflection || getWallCollisions(bigRight, tank.angle + bigOffset, null).reflection || getComradeCollisions(bigRight, tank.angle + bigOffset, true, tank.tankID).reflection || getPitCollisions(bigRight, tank.angle + bigOffset).reflection;
	const isBigLeft = getBorderCollisions(bigLeft, tank.angle - bigOffset, null).reflection || getWallCollisions(bigLeft, tank.angle - bigOffset, null).reflection || getComradeCollisions(bigLeft, tank.angle - bigOffset, true, tank.itankID).reflection || getPitCollisions(bigLeft, tank.angle - bigOffset).reflection;
	
	const isSmallRight = getBorderCollisions(smallRight, tank.angle + smallOffset, null).reflection || getWallCollisions(smallRight, tank.angle + smallOffset, null).reflection || getComradeCollisions(smallRight, tank.angle + smallOffset, true, tank.tankID).reflection || getPitCollisions(smallRight, tank.angle + smallOffset).reflection;
	const isSmallLeft = getBorderCollisions(smallLeft, tank.angle - smallOffset, null).reflection || getWallCollisions(smallLeft, tank.angle - smallOffset, null).reflection || getComradeCollisions(smallLeft, tank.angle - smallOffset, true, tank.tankID).reflection || getPitCollisions(smallLeft, tank.angle - smallOffset).reflection;

	const isSmallMiddle = getBorderCollisions(smallMiddle, tank.angle, null).reflection || getWallCollisions(smallMiddle, tank.angle, null).reflection || getComradeCollisions(smallMiddle, tank.angle, true, tank.tankID).reflection || getPitCollisions(smallMiddle, tank.angle).reflection;

	if (isSmallMiddle || (isSmallRight && isSmallLeft)) {
		return U_TURN;
	} else {
		if (isBigRight) {
			return TURN_RIGHT;
		} else if (isBigLeft) {
			return TURN_LEFT;
		}
	}

	return false;
}









