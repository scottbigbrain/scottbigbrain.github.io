class Ball {
	
	constructor() {
		this.loc = createVector(-80,0);
		this.vel = createVector(0,40);
		this.acl = createVector(0,0);


		this.mass = 1;
		this.size = 30;
		this.k_p = 0.05
		this.k = player.health*this.k_p;
		this.mu = 0.4;

		this.p_system = new Emitter(this.loc.x, this.loc.y);
	}

	update() {
		this.k = player.health*this.k_p;

		if (this.loc.dist(player.loc) > 20) {
			this.elastic(); 
			this.friction();
			player.loc.add(this.vel.copy().setMag(0.5));
		}

		this.atSide();

		this.vel.add(this.acl);
		this.loc.add(this.vel);

		this.acl.mult(0);

		this.p_system.position = this.loc.copy();
		this.p_system.emit(ceil(player.health*4), 0.7);
		this.p_system.update();
	}

	elastic() {
		// attract to the player
		let f = player.loc.copy().sub(this.loc).mult(this.k)
		// f.mult(f.mag());
		this.applyForce(f);
	}

	friction() {
		// slow down that ball it is way to fast
		let f = this.vel.copy().normalize().mult(-this.mu)
		this.applyForce(f);
	}

	applyForce(f) {
		let force = f.copy().div(this.mass);
		this.acl.add(force);
	}

	atSide() {
		// if going to be at left or right bounce off that side
		if (this.loc.copy().add(this.vel).x + xr < this.size/2 + wallr ||
			xr - this.loc.copy().add(this.vel).x < this.size/2 + wallr   ) {
			this.vel.x *= -wall_bounce;
			// camera.shake(4, 10);
		}

		// if going to be at top or bottom bounce off that side
		if (this.loc.copy().add(this.vel).y + yr < this.size/2 + wallr ||
			yr - this.loc.copy().add(this.vel).y < this.size/2 + wallr   ) {
			this.vel.y *= -wall_bounce;
			// camera.shake(4, 10);
		}
	}

	draw() {
		for (let particle of this.p_system.particles) {
			if (particle.lifetime > 180) {
				fill(240, 146, 31, particle.lifetime);
			} else {
				fill(240, 177, 31, particle.lifetime);
			}
			noStroke();
			circle(particle.pos.x, particle.pos.y, particle.r);
		}

		stroke(250);
		strokeWeight(this.k*100);
		line(player.loc.x, player.loc.y, this.loc.x, this.loc.y);

		// fill(255, 140, 20, this.vel.mag()^2 / 4);
		// noStroke();
		// circle(this.loc.x, this.loc.y, this.size * 1.6);

		fill(255, 132, 10);
		strokeWeight(4);
		stroke(200, 100, 100);
		circle(this.loc.x, this.loc.y, this.size);

		// let glow = color(255, 190, 137, 255);
		// let glow_size = 40;
		// loadPixels();
		// let d = pixelDensity();
		// for (let i = 0; i < width*height; i++) {
		// 	let x = i % width;
		// 	let y = floor(i/width);
		// 	let distance = this.loc.dist(createVector(x,y));

		// 	if (distance <= glow_size) {
		// 		let j = i * 4;
		// 		pixels[j] = red(glow);
		// 		pixels[j+1] = green(glow);
		// 		pixels[j+2] = blue(glow);
		// 		pixels[j+3] = alpha(glow) * (glow_size-distance)/glow_size;
		// 	}
		// }
	}

}