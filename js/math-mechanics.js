class xy {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

class Ray {
	constructor(pointA, pointB) {
		this.pointA = pointA;
		this.pointB = pointB;
	}
}

function getMagnitude(distX, distY) {
	return Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
}

function getPerpAngle(angle) {
	return angle - (Math.PI / 2);
}

function dotProduct(pointA, pointB) {
	return pointA.x * pointB.x + pointA.y * pointB.y; 
}

function normalizeVector(vector) {
	const invLen = 1 / getMagnitude(vector.x, vector.y);
	vector.x *= invLen;
	vector.y *= invLen;

	return vector;
}

function betterAtan2(y, x) {
	var angle = Math.atan2(y, x);

	if (angle < 0) {
		angle = 2 * Math.PI - Math.abs(angle);
	}

	return angle;
}

function degreesToRadians(degrees) {
	return degrees * Math.PI / 180;
}