class Monster {
	
	constructor() {
		this.loc = createVector(random(-xr, xr), random(-yr, yr));
		this.vel = createVector();

		this.speed = random(4,8);
		this.size = 20;

		this.spiral = random([-1, 1]);
		this.close = random(80, 160);
		this.wander_goal = createVector(random(-xr*0.7, xr*0.7), random(-yr*0.7, yr*0.7));
		this.wander_time = 0;
		this.wander_speed = 10;
		this.wander_force = 0.2;

		this.age = 0;
	}

	update() {
		// if close enough move toward the player at a given speed
		if (this.age <= 40) {
			this.age++;
		} else if (this.atSide()) {
			this.vel.mult(-1);
			this.loc.add(this.vel.copy().mult(0.5));
			this.spiral *= -1;
			
		} else if (this.loc.dist(player.loc) < 400 && this.loc.dist(player.loc) > this.close) {
			let move = player.loc.copy().sub(this.loc).normalize().mult(this.speed);
			let ang = map(this.loc.dist(player.loc), this.close, 400, this.spiral*PI/2, 0) + random(-0.05, 0.05);
			move.rotate(ang);
			this.vel = move;

			let chance = 0.012;
			if (random() < chance) this.shoot();
			chance = 0.004;
			if (random() < chance) this.spiral *= -1;

		} else if (this.loc.dist(player.loc) <= this.close) {
			this.vel = p5.Vector.fromAngle(this.spiral*5*PI/8, this.speed*0.8);
			let chance = 0.012;
			if (random() < chance) this.shoot();

		// wander otherwise by vehicle seeking a random point
		} else if (this.loc.dist(player.loc) < 1200) {
			this.wander_time++;

			let wanted = this.wander_goal.copy().sub(this.loc).setMag(this.wander_speed);
			let correction = wanted.copy().sub(this.vel).setMag(this.wander_force);
			this.vel.add(correction);

			if (this.wander_time >= 120) {
				this.wander_time = 0;
				this.wander_goal = createVector(random(-xr*0.7, xr*0.7), random(-yr*0.7, yr*0.7));
			}
		}

		this.loc.add(this.vel);

		let chance = 0.003;
		if (random() < chance) this.close = random(80,200);
	}

	touchingBall() {
		return this.loc.dist(ball.loc) < this.size/2 + (ball.size/2)*1.8 * 1.6*min(ball.vel.mag()/20, 1);
	}

	shoot() {
		let to = player.loc.copy().sub(this.loc);
		shots.push(new Shot(this.loc.x, this.loc.y, to.heading()+random(-0.25, 0.25)));
	}

	atSide() {
		// check right and left
		if (this.loc.copy().add(this.vel).x + xr < this.size/2 + wallr ||
			xr - this.loc.x < this.size/2 + wallr   ) {
			return true;
		}

		// check top and bottom
		if (this.loc.copy().add(this.vel).y + yr < this.size/2 + wallr ||
			yr - this.loc.y < this.size/2 + wallr   ) {
			return true;
		}
	}

	draw() {
		fill(10, 16, 51, this.age * 6.5);
		stroke(5, 11, 46, this.age * 8);
		strokeWeight(1);
		circle(this.loc.x, this.loc.y, this.size);
	}

}