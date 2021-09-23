class Camera {
	
	constructor() {
		this.loc = player.loc.copy();
		this.vel = createVector();
		this.acl = createVector();

		this.speed = 1;
		this.mu = 0.05;

		this.shake_time = Infinity;
		this.shake_duration = 10;
		this.shake_mag = 10;
	}

	update() {
		if (this.loc.dist(player.loc) > 8) {
			// this.acl.add(to.normalize().mult(this.speed));
			let steer = player.loc.copy().sub(this.loc.copy().add(this.vel));
			steer.normalize().mult(this.speed);
			this.acl.add(steer);
		} else if (abs(this.vel.mag()) > 2) {
			this.vel.mult(0);
			this.loc = player.loc.copy();
		}
		this.acl.add(this.vel.copy().normalize().mult(-this.mu));

		this.vel.add(this.acl);
		if (abs(this.vel.mag()) > 6) this.vel.normalize().mult(6);
		this.loc.add(this.vel);

		this.acl.mult(0);

		if (this.shake_time <= this.shake_duration) {
			this.shake_time++;
			this.loc.add(p5.Vector.random2D().mult(random(this.shake_mag)));
		}
	}

	shake(mag=10, time=10) {
		this.shake_time = 0;
		this.shake_duration = time;
		this.shake_mag = mag;
	}

}