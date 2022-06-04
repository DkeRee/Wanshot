/*
Seperating Axis Theorem/SAT
http://programmerart.weebly.com/separating-axis-theorem.html
help me
*/

class xy {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

function getVertex(cx, cy, vx, vy, rotatedAngle) {
	//change rotatedAngle to radians
	rotatedAngle = rotatedAngle * Math.PI / 180;

	//get distance from center to specified vertex
	const distanceX = vx - cx;
	const distanceY = vy - cy;
	const distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));

	//original angle of polygon without the added rotation
	const originalAngle = Math.atan2(distanceY, distanceX);
	const rotatedVertexX = cx + distance * Math.cos(originalAngle + rotatedAngle);
	const rotatedVertexY = cy + distance * Math.sin(originalAngle + rotatedAngle);

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

		const vertexPoints = {
			topLeft: getVertex(this.centerX, this.centerY, this.x, this.y, this.rotation),
			topRight: getVertex(this.centerX, this.centerY, this.x + this.width, this.y, this.rotation),
			bottomLeft: getVertex(this.centerX, this.centerY, this.x, this.y + this.height, this.rotation),
			bottomRight: getVertex(this.centerX, this.centerY, this.x + this.width, this.y + this.height, this.rotation)
		}

		//store in array for later use
		for (var vertex in vertexPoints) {
			this.vertices.push(vertexPoints[vertex]);
		}
	
		//GET EDGES//

		//left edge
		this.edges.push(new xy(vertexPoints.topLeft.x - vertexPoints.bottomLeft.x, vertexPoints.topLeft.y - vertexPoints.bottomLeft.y));

		//top edge
		this.edges.push(new xy(vertexPoints.topLeft.x - vertexPoints.topRight.x, vertexPoints.topLeft.y - vertexPoints.topRight.y));

		//right edge
		this.edges.push(new xy(vertexPoints.topRight.x - vertexPoints.bottomRight.x, vertexPoints.topRight.y - vertexPoints.bottomRight.y));

		//bottom edge
		this.edges.push(new xy(vertexPoints.bottomRight.x - vertexPoints.bottomLeft.x, vertexPoints.bottomRight.y - vertexPoints.bottomLeft.y));
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

function vectorLength(vector) {
	return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
}

function normalizeVector(vector) {
	const invLen = 1 / vectorLength(vector);
	vector.x *= invLen;
	vector.y *= invLen;

	return vector;
}

function SAT(rectOne, rectTwo) {
	const polygonOne = new Polygon(rectOne);
	const polygonTwo = new Polygon(rectTwo);

	//set up perpendicular edges
	var perpendicularEdges = [];
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

	for (var i = 0; i < perpendicularEdges.length; i++) {
		const perpLine = perpendicularEdges[i];
		var dot = 0;
		var amin = null;
		var amax = null;
		var bmin = null;
		var bmax = null;

		//calculate dot product of verticies with each perpendicular edge
		for (var j = 0; j < polygonOne.vertices.length; j++) {
			dot = dotProduct(polygonOne.vertices[j], perpLine);
		
			if (amax == null || dot > amax) {
				amax = dot;
			}
			if (amin == null || dot < amin) {
				amin = dot;
			}
		}

		for (var j = 0; j < polygonTwo.vertices.length; j++) {
			dot = dotProduct(polygonTwo.vertices[j], perpLine)

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
	
	depth /= vectorLength(normal);
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