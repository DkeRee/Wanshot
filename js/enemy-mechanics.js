function getRayIntersect(rayA, rayB) {
	//one of these rays are of length 0
	if ((rayA.pointA.x == rayA.pointB.x && rayA.pointA.y == rayA.pointB.y) || (rayB.pointA.x == rayB.pointB.x && rayB.pointA.y == rayB.pointB.y)) {
		return {
			intersecting: false,
			point: null
		};
	}

	const denominator = ((rayB.pointB.y - rayB.pointA.y) * (rayA.pointB.y - rayA.pointA.y) - (rayB.pointB.x - rayB.pointA.x) * (rayA.pointB.x - rayA.pointA.x));

	//these lines are parallel
	if (denominator == 0) {
		return {
			intersecting: false,
			point: null
		};
	}

	const ua = ((rayB.pointB.x - rayB.pointA.x) * (rayA.pointA.y - rayB.pointA.y) - (rayB.pointB.y - rayB.pointA.y) * (rayA.pointA.x - rayB.pointA.x)) / denominator;
	const ub = ((rayA.pointB.x - rayA.pointA.x) * (rayA.pointA.y - rayB.pointA.y) - (rayA.pointB.y - rayA.pointA.y) * (rayA.pointA.x - rayB.pointA.x)) / denominator;

	//it is not intersecting
	if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
		return {
			intersecting: false,
			point: null
		};
	}

	//it is intersecting
	return {
		intersecting: true,
		point: new xy(rayA.pointA.x + ua * (rayA.pointB.x - rayA.pointA.x), rayA.pointA.y + ua * (rayA.pointB.y - rayA.pointA.y))
	}
}

function getWallIntersection(angle, ray) {
	//check tiles
	for (var i = 0; i < STAGE_CACHE.tiles.length; i++) {
		const tile = STAGE_CACHE.tiles[i];

		const sides = [
			new Ray(new xy(tile.x, tile.y), new xy(tile.x, tile.y + tile.height)), //left
			new Ray(new xy(tile.x, tile.y), new xy(tile.x + tile.width, tile.y)), //top
			new Ray(new xy(tile.x + tile.width, tile.y), new xy(tile.x + tile.width, tile.y + tile.height)), //right
			new Ray(new xy(tile.x, tile.y + tile.height), new xy(tile.x + tile.width, tile.y + tile.height)) //bottom
		];

		//check if it collided into any sides
		for (var o = 0; o < sides.length; o++) {
			const intersection = getRayIntersect(ray, sides[o]);

			if (intersection.intersect) {
				var newRay;
				var newAngle;
				const intersectedPoint = intersection.point;

				if (o == 0 || o == 2) {
					//this rebounded off the left or right wall
					newAngle = Math.PI - angle;
				} else {
					//this rebounded off the top or bottom wall
					newAngle = 2 * Math.PI - angle;
				}

				newRay = new Ray(new xy(intersectedPoint.x, intersectedPoint.y), new xy(1000 * Math.cos(newAngle) + intersectedPoint.x, 1000 * Math.sin(newAngle) + intersectedPoint.y));
			
				return {
					intersect: true,
					newRay: newRay,
					newAngle: newAngle
				}
			}
		}
	}

	//check borders
	const borders = [
		new Ray(new xy(0, 0), new xy(0, CANVAS_HEIGHT)), //left
		new Ray(new xy(0, 0), new xy(CANVAS_WIDTH, 0)), //top
		new Ray(new xy(CANVAS_WIDTH, 0), new xy(CANVAS_WIDTH, CANVAS_HEIGHT)), //right
		new Ray(new xy(0, CANVAS_HEIGHT), new xy(CANVAS_WIDTH, CANVAS_HEIGHT)) //bottom
	];

	for (var i = 0; i < borders.length; i++) {
		const intersection = getRayIntersect(ray, borders[i]);

		if (intersection.intersect) {
			var newRay;
			var newAngle;
			const intersectedPoint = intersection.point;

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
				newRay: newRay,
				newAngle: newAngle
			}
		}
	}

	//ray collided with nothing
	return {
		intersect: false,
		newRay: null,
		newAngle: null
	}
}

function getPlayerIntersection(ray) {
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
			return true;
		}
	}
}