//FUNCTION DEFINITIONS TO HANDLE CHECK FOR ANY INTERSECTIONS
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
				const rayLength = getMagnitude(ray.pointA.x - reflection.point.x, ray.pointA.y - reflection.point.y);

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

			const enemy = new Polygon(STAGE_CACHE.enemies[i]);
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
					const rayLength = getMagnitude(ray.pointA.x - intersection.point.x, ray.pointA.y - intersection.point.y);

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
	
	var player = new Polygon(STAGE_CACHE.player);

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
			const rayLength = getMagnitude(ray.pointA.x - intersection.point.x, ray.pointA.y - intersection.point.y);

			if (rayLength < closestIntersection.dist) {
				closestIntersection.reflection = intersection;
				closestIntersection.dist = rayLength;
			}
		}
	}

	return closestIntersection;
}

//FUNCTION DEFINITION TO USE PRIOR DEFINITIONS TO PUT IT INTO ACTION
function castToPlayer(ray, angle, bouncesLeft, firstShot, tankID, shellDetectionRadius, collidedSideID) {
	while (bouncesLeft >= 0) {
		const comradeCollision = getComradeCollisions(ray, angle, firstShot, tankID);

		//only proceed if we are not killing comrades
		if (!comradeCollision.reflection) {
			const playerCollision = getPlayerCollisions(ray, angle, false);

			if (playerCollision.reflection) {
				const wallCollisionTP = getWallCollisions(new Ray(ray.pointA, playerCollision.reflection.point), angle, collidedSideID);
				if (!wallCollisionTP.reflection) {
					//no walls are in the way
					return true;
				} else {
					//bounce off wall we have detected
					ray = wallCollisionTP.reflection.newRay;
					angle = wallCollisionTP.reflection.newAngle;
					bouncesLeft--;
					collidedSideID = wallCollisionTP.id;
					firstShot = false;
					continue;
				}
			} else {
				const wallCollision = getWallCollisions(ray, angle, collidedSideID);

				if (!wallCollision.reflection) {
					const borderCollision = getBorderCollisions(ray, angle, collidedSideID);

					if (!borderCollision.reflection) break;
					ray = borderCollision.reflection.newRay;
					angle = borderCollision.reflection.newAngle;
					bouncesLeft--;
					colldedSide = borderCollision.id;
					firstShot = false;
					continue;
				}

				//no player but we hit a wall
				//bounce off wall we have detected
				ray = wallCollision.reflection.newRay;
				angle = wallCollision.reflection.newAngle;
				bouncesLeft--;
				collidedSideID = wallCollision.id;
				firstShot = false;
				continue;
			}
		} else {
			break;
		}
	}

	return false;
}