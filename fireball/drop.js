class Drop {
	
	constructor(loc) {
		this.loc = loc;
		this.lifetime = 255;
		this.size = 18;
	}

	draw() {
		this.lifetime -= 0.5;

		fill(60, 180, 70, this.lifetime);
		stroke(20, 80, 30, this.lifetime);
		circle(this.loc.x, this.loc.y, this.size);
	}

}