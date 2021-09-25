class Player {
	
	constructor() {
		this.loc = createVector(0,0);
		this.vel = createVector(0,0);
		this.acl = createVector(0,0);

		this.size = 24;
		this.health = 1;

		this.thrust = 6;
		this.moving = false;
		this.dash = 35;
		this.dash_vec = createVector();
		this.dash_time = 5;
		this.dash_count = this.dash_time;
		this.dash_running = false;
		this.dash_ready = true;
		this.dash_recharge = 0;
	}

	update() {
		this.moving = false;
		this.controls();

		if (this.touchingShot() && this.health >= 0.1) {
			this.health -= 0.1;
			fill(255, 200, 200, 100);
			noStroke();
			rectMode(CENTER);
			rect(0, 0, 2*xr, 2*yr);
			got_shot_sound.play();
		}

		if (this.health <= 0.91 && this.health > 0.09) {
			let drop = this.touchingDrop();
			if (drop != undefined) {
				this.health += 0.1;
				drops = drops.filter(d => d != drop);
			}
		}

		if (this.dash_count > 0) {
			this.dash_count--;
			if (this.dash_count == 0) this.dash_running = false;
			this.loc.add(this.dash_vec);
			this.drawDash();
			if (this.atSide()) this.loc.sub(this.dash_vec);
		}
		this.dash_recharge--;
	}

	controls() {
		// W is up
		if (keyIsDown(87) && !this.atTop()) {
			this.loc.y -= this.thrust;
			this.moving = true;
		}
		// S is down
		if (keyIsDown(83) && !this.atBottom()) {
			this.loc.y += this.thrust;
			this.moving = true;
		}
		// A is left
		if (keyIsDown(65) && !this.atLeft()) {
			this.loc.x -= this.thrust;
			this.moving = true;
		}
		// D is down
		if (keyIsDown(68) && !this.atRight()) {
			this.loc.x += this.thrust;
			this.moving = true;
		}

		// dash when you click
		if (mouseIsPressed && this.dash_ready==true && !this.dash_running && this.dash_recharge<0) {
			let cam_to_player = this.loc.copy().sub(camera.loc);
			let m = createVector(-(width/2-mouseX), -(height/2-mouseY)).sub(cam_to_player);
			let ang = m.heading();
			this.dash_vec = p5.Vector.fromAngle(ang, this.dash);
			this.dash_count = this.dash_time;
			this.dash_running = true;
			this.dash_recharge = 30;
			this.moving = true;

			dash_sound.play();
		}
	}

	atLeft() {
		return this.loc.x + xr < this.size/2 + wallr;
	}
	atRight() {
		return xr - this.loc.x < this.size/2 + wallr;
	}
	atTop() {
		return this.loc.y + yr < this.size/2 + wallr;
	}
	atBottom() {
		return yr - this.loc.y < this.size/2 + wallr;
	}
	atSide() {
		return this.atLeft() || this.atRight() || this.atTop() || this.atBottom();
	}

	touchingShot() {
		for (let shot of shots) {
			if (shot.touchingPlayer()) {
				camera.shake(10, 4);
				return true;
			}
		}
		return false
	}

	touchingDrop() {
		for (let drop of drops) {
			if (this.loc.dist(drop.loc) < this.size/2 + drop.size/2) {
				return drop;
			}
		}
	}

	drawDash() {
		let v = this.loc.copy().sub(this.dash_vec.copy().mult(2));
		stroke(255, 150);
		strokeWeight(this.size*0.6);
		line(this.loc.x, this.loc.y, v.x, v.y);
	}

	draw() {
		fill(220);
		stroke(200);
		strokeWeight(1);
		circle(this.loc.x, this.loc.y, 20);
	}

}
