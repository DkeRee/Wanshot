const U_TURN = 1;
const TURN_LEFT = 2;
const TURN_RIGHT = 3;

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
	const offset = 20 * Math.PI / 180;

	const bigRight = new Ray(new xy(tank.centerX, tank.centerY), new xy(range * 3 * Math.cos(tank.angle + offset) + tank.centerX, range * 3 * Math.sin(tank.angle + offset) + tank.centerY));
	const bigLeft = new Ray(new xy(tank.centerX, tank.centerY), new xy(range * 3 * Math.cos(tank.angle - offset) + tank.centerX, range  * 3 * Math.sin(tank.angle - offset) + tank.centerY));

	const smallRight = new Ray(new xy(tank.centerX, tank.centerY), new xy(range * Math.cos(tank.angle + offset) + tank.centerX, range * Math.sin(tank.angle + offset) + tank.centerY));
	const smallLeft = new Ray(new xy(tank.centerX, tank.centerY), new xy(range * Math.cos(tank.angle - offset) + tank.centerX, range * Math.sin(tank.angle - offset) + tank.centerY));

	const isBigRight = getBorderCollisions(bigRight, tank.angle + offset, null).reflection || getWallCollisions(bigRight, tank.angle + offset, null).reflection || getComradeCollisions(bigRight, tank.angle + offset, true, tank.tankID).reflection || getPitCollisions(bigRight, tank.angle + offset).reflection;
	const isBigLeft = getBorderCollisions(bigLeft, tank.angle - offset, null).reflection || getWallCollisions(bigLeft, tank.angle - offset, null).reflection || getComradeCollisions(bigLeft, tank.angle - offset, true, tank.itankID).reflection || getPitCollisions(bigLeft, tank.angle - offset).reflection;
	
	const isSmallRight = getBorderCollisions(smallRight, tank.angle + offset, null).reflection || getWallCollisions(smallRight, tank.angle + offset, null).reflection || getComradeCollisions(smallRight, tank.angle + offset, true, tank.tankID).reflection || getPitCollisions(smallRight, tank.angle + offset).reflection;
	const isSmallLeft = getBorderCollisions(smallLeft, tank.angle - offset, null).reflection || getWallCollisions(smallLeft, tank.angle - offset, null).reflection || getComradeCollisions(smallLeft, tank.angle - offset, true, tank.tankID).reflection || getPitCollisions(smallLeft, tank.angle - offset).reflection;


	if (isSmallRight && isSmallLeft) {
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









