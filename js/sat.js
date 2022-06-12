/*
Seperating Axis Theorem/SAT
http://programmerart.weebly.com/separating-axis-theorem.html
help me
*/

function getVertex(cx, cy, vx, vy, rotatedAngle) {
	//change rotatedAngle to radians
	rotatedAngle = rotatedAngle * Math.PI / 180;

	//get distance from center to specified vertex
	const distanceX = vx - cx;
	const distanceY = vy - cy;
	const distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));

	//original angle of polygon without the added rotation
	const originalAngle = Math.atan2(distanceY, distanceX);

	const rotatedVertexX = cx + distance * Math.cos(originalAngle - rotatedAngle);
	const rotatedVertexY = cy + distance * Math.sin(originalAngle - rotatedAngle);

	//vertex with polygon's rotation
	return new xy(rotatedVertexX, rotatedVertexY);
}

class Polygon {
	constructor(polygon) {
		this.vertices = [];
		this.edges = [];

		this.x = polygon.x;
		this.y = polygon.y;
		this.width = polygon.width;
		this.height = polygon.height;
		this.rotation = polygon.angle;
		this.centerX = polygon.x + (polygon.width / 2);
		this.centerY = polygon.y + (polygon.height / 2);

		//GET VERTEXES//

		this.vertexPoints = {
			topLeft: getVertex(this.centerX, this.centerY, this.x, this.y, this.rotation),
			topRight: getVertex(this.centerX, this.centerY, this.x + this.width, this.y, this.rotation),
			bottomLeft: getVertex(this.centerX, this.centerY, this.x, this.y + this.height, this.rotation),
			bottomRight: getVertex(this.centerX, this.centerY, this.x + this.width, this.y + this.height, this.rotation)
		};

		//store in array for later use
		for (var vertex in this.vertexPoints) {
			this.vertices.push(this.vertexPoints[vertex]);
		}
	
		//GET EDGES//

		//left edge
		this.edges.push(new xy(this.vertexPoints.topLeft.x - this.vertexPoints.bottomLeft.x, this.vertexPoints.topLeft.y - this.vertexPoints.bottomLeft.y));

		//top edge
		this.edges.push(new xy(this.vertexPoints.topLeft.x - this.vertexPoints.topRight.x, this.vertexPoints.topLeft.y - this.vertexPoints.topRight.y));

		//right edge
		this.edges.push(new xy(this.vertexPoints.topRight.x - this.vertexPoints.bottomRight.x, this.vertexPoints.topRight.y - this.vertexPoints.bottomRight.y));

		//bottom edge
		this.edges.push(new xy(this.vertexPoints.bottomRight.x - this.vertexPoints.bottomLeft.x, this.vertexPoints.bottomRight.y - this.vertexPoints.bottomLeft.y));
	}
}

class Circle {
	constructor(circle) {
		this.x = circle.x;
		this.y = circle.y;
		this.radius = circle.radius;
	}
}

function mean(polygon) {
	var xSum = 0;
	var ySum = 0;

	for (var i = 0; i < polygon.vertices.length; i++) {
		xSum += polygon.vertices[i].x;
		ySum += polygon.vertices[i].y;
	}

	return new xy(xSum / polygon.vertices.length, ySum / polygon.vertices.length);
}

function dotProduct(pointA, pointB) {
	return pointA.x * pointB.x + pointA.y * pointB.y; 
}

function getMagnitude(vector) {
	return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
}

function normalizeVector(vector) {
	const invLen = 1 / getMagnitude(vector);
	vector.x *= invLen;
	vector.y *= invLen;

	return vector;
}

function CIRCLE_WITH_CIRCLE(circleA, circleB) {
	const radiusDistance = circleA.radius + circleB.radius;
	const distanceX = circleA.x - circleB.x;
	const distanceY = circleA.y - circleB.y;
	const distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));

	if (distance < radiusDistance) {
		return true;
	}
	return false;
}

//polygon to circle collision
function SAT_POLYGON_CIRCLE(poly, circ) {
	const polygon = new Polygon(poly);
	const circle = new Circle(circ);

	//set up perpendicular edges
	const perpendicularEdges = [];
	for (var i = 0; i < polygon.edges.length; i++) {
		const perpendicularLine = new xy(-polygon.edges[i].y, polygon.edges[i].x);
		perpendicularEdges.push(normalizeVector(perpendicularLine));
	}

	//project shapes
	for (var i = 0; i < perpendicularEdges.length; i++) {
		const perpLine = perpendicularEdges[i];
		var amin = null;
		var amax = null;
		var bmin = null;
		var bmax = null;

		//project polygon
		for (var j = 0; j < polygon.vertices.length; j++) {
			var dot = dotProduct(polygon.vertices[j], perpLine);
		
			if (amax == null || dot > amax) {
				amax = dot;
			}
			if (amin == null || dot < amin) {
				amin = dot;
			}
		}

		//project circle
		const dir = normalizeVector(perpLine);
		const edgeX = dir.x * circle.radius;
		const edgeY = dir.y * circle.radius;

		const p1 = new xy(circle.x + edgeX, circle.y + edgeY);
		const p2 = new xy(circle.x - edgeX, circle.y - edgeY);

		bmin = dotProduct(p1, perpLine);
		bmax = dotProduct(p2, perpLine);

		//swap min and max values if min is greater than max (we guessed wrong)
		if (bmin > bmax) {
			const t = bmin;
			bmin = bmax;
			bmax = t;
		}

		//check if the shapes are touching from the ultimate dot products
		if (amin >= bmax || bmin >= amax) {
			return false;
		}
	}

	return true;
}

//polygon to polygon collision
function SAT_POLYGON(polygonA, polygonB) {
	const polygonOne = new Polygon(polygonA);
	const polygonTwo = new Polygon(polygonB);

	//set up perpendicular edges
	const perpendicularEdges = [];
	for (var i = 0; i < polygonOne.edges.length; i++) {
		const perpendicularLine = new xy(-polygonOne.edges[i].y, polygonOne.edges[i].x);
		perpendicularEdges.push(perpendicularLine);
	}
	for (var i = 0; i < polygonTwo.edges.length; i++) {
		const perpendicularLine = new xy(-polygonTwo.edges[i].y, polygonTwo.edges[i].x);
		perpendicularEdges.push(perpendicularLine);
	}

	/*
	loop through all perpendicular edges and verticies of both polygons to get dot product to compare
	if all test cases passes, then they are touching
	*/

	//variables for collision resolution

	//perp line of the shortest current vector/depth of collision
	var normal = null;

	//shortest vector/depth of collision
	var depth = Infinity;

	//project vertices
	for (var i = 0; i < perpendicularEdges.length; i++) {
		const perpLine = perpendicularEdges[i];
		var amin = null;
		var amax = null;
		var bmin = null;
		var bmax = null;

		//calculate dot product of verticies with each perpendicular edge AKA project vertices
		for (var j = 0; j < polygonOne.vertices.length; j++) {
			var dot = dotProduct(polygonOne.vertices[j], perpLine);
		
			if (amax == null || dot > amax) {
				amax = dot;
			}
			if (amin == null || dot < amin) {
				amin = dot;
			}
		}

		for (var j = 0; j < polygonTwo.vertices.length; j++) {
			var dot = dotProduct(polygonTwo.vertices[j], perpLine)

			if (bmax == null || dot > bmax) {
				bmax = dot;
			}
			if (bmin == null || dot < bmin) {
				bmin = dot;
			}
		}

		//check if the polygons are touching from the ultimate dot products
		if ((amin < bmax && amin > bmin) || (bmin < amax && bmin > amin)) {
			//find the shortest vector of collision
			const axisDepth = Math.min(bmax - amin, amax - bmin);

			if (axisDepth < depth) {
				depth = axisDepth;
				normal = perpLine;
			}

			continue;
		} else {
			return {
				collision: false,
				depth: null,
				normal: null
			};
		}
	}
	
	depth /= getMagnitude(normal);
	normal = normalizeVector(normal);

	//calculate centers of polygons to ensure our normal is pointing same direction
	const centerOne = mean(polygonOne);
	const centerTwo = mean(polygonTwo);

	//vector from center of polygon one to two
	const vectorDirection = new xy(centerOne.x - centerTwo.x, centerOne.y - centerTwo.y);

	//normal is unfourtunately facing opposite direction, reverse
	if (dotProduct(vectorDirection, normal) < 0) {
		normal.x *= -1;
		normal.y *= -1;
	}

	return {
		collision: true,
		depth: depth,	
		normal: normal
	}
}