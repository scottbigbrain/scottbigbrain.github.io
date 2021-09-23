class Shot {
	
	constructor(x, y, ang) {
		this.loc = createVector(x, y);
		this.vel = p5.Vector.fromAngle(ang, 12);
		this.size = 12;
	}

	update() {
		this.loc.add(this.vel);
	}

	atSide() {
		// check right and left
		if (this.loc.x + xr < this.size/2 + wallr ||
			xr - this.loc.x < this.size/2 + wallr   ) {
			return true;
		}

		// check top and bottom
		if (this.loc.y + yr < this.size/2 + wallr ||
			yr - this.loc.y < this.size/2 + wallr   ) {
			return true;
		}
	}

	touchingBall() {
		return this.loc.dist(ball.loc) < this.size/2 + ball.size/2;
	}

	touchingPlayer() {
		return this.loc.dist(player.loc) < this.size/2 + player.size/2;
	}

	draw() {
		fill(15, 21, 51);
		noStroke();
		circle(this.loc.x, this.loc.y, this.size);
	}

}