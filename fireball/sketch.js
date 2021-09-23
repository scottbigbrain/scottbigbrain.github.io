// Game for the GMTK Game Jam 2021. Author: Elijah Buchanan

let scaling = 1;
let xr = 800;
let yr = 600;
let wallr = 15;
let wall_bounce = 0.6;
let game_started = false;

let back;

let player;
let score = 0;
let camera;
let ball;
let monsters = [];
let shots = [];
let drops = [];

let d_emitter;

let hit_sound, dash_sound;

function preload() {
	hit_sound = loadSound('assets/hit.wav');
	dash_sound = loadSound('assets/dash.wav');
}


function setup() {
	createCanvas(1000, 800);
	frameRate(30);

	player = new Player();
	camera = new Camera();
	ball = new Ball();

	for (let i = 0; i < 3; i++) {
		monsters.push(new Monster());
	}
	d_emitter = new Emitter(0,0);
}

function draw() {
	background(49, 57, 81);
	translate(width/2-camera.loc.x, height/2-camera.loc.y);
	scale(scaling);

	if (game_started) {

	ball.update();
	for (let monster of monsters) {
		monster.update();
	}
	for (let shot of shots) {
		shot.update();
	}
	player.update();
	camera.update();
	d_emitter.update();

	}


	ball.draw();
	player.draw();
	for (let monster of monsters) {
		monster.draw();
	}
	for (let shot of shots) {
		shot.draw();
	}
	for (let drop of drops) {
		drop.draw();
	}
	for (let particle of d_emitter.particles) {
		fill(5, 11, 46, particle.lifetime);
		noStroke();
		circle(particle.pos.x, particle.pos.y, particle.r);
	}

	stroke(10);
	strokeWeight(wallr*2);
	line(-xr, -yr,  xr, -yr);
	line( xr, -yr,  xr,  yr);
	line( xr,  yr, -xr,  yr);
	line(-xr,  yr, -xr, -yr);

	rectMode(CENTER);
	fill(50, 160, 60);
	noStroke();
	rect(camera.loc.x, camera.loc.y+height/2-40, player.health*200, 40);
	stroke(20);
	strokeWeight(1);
	line(camera.loc.x+100, camera.loc.y+height/2-60, camera.loc.x+100, camera.loc.y+height/2-20);
	line(camera.loc.x-100, camera.loc.y+height/2-60, camera.loc.x-100, camera.loc.y+height/2-20);

	fill(220, 230, 255);
	stroke(100);
	strokeWeight(1.5);
	textSize(32);
	textAlign(LEFT, TOP);
	text("Score: "+score, camera.loc.x-width/2+40, camera.loc.y-height/2+40);


	if (!game_started) {
		fill(220, 230, 255);
		stroke(100);
		strokeWeight(1.5);
		textSize(32);
		textAlign(CENTER);
		text("Press any key to start game", camera.loc.x, camera.loc.y);
		game_started = keyIsPressed;
	}



	// kill monsters touched by the ball and add up the score and drop packs
	let dead = monsters.filter(m => m.touchingBall());
	monsters = monsters.filter(m => !m.touchingBall());
	score += dead.length;
	doDrops(dead);
	doDeaths(dead);

	// screen shake and slow ball
	if (dead.length > 0) {
		camera.shake(8, 3);
		hit_sound.play();
	}

	// get rid of shots touching the walls or ball or player
	shots = shots.filter(s => !s.atSide() && !s.touchingBall() && !s.touchingPlayer());

	// remove expired drops
	drops = drops.filter(d => d.lifetime > 0);

	let chance = map(monsters.length, 0, 40, 0.015, 0);
	if (random() < chance && monsters.length < 40 && game_started) monsters.push(new Monster());

	if (player.health < 0.1) {
		fill(220, 230, 255);
		stroke(100);
		strokeWeight(1.5);
		textSize(32);
		textAlign(CENTER);
		text("Game Over", camera.loc.x, camera.loc.y);
		textSize(24);
		text("Press r to restart", camera.loc.x, camera.loc.y+36);

		if (keyIsDown(82)) setTimeout(() => {  initGame(); }, 1500);
	}

}


function doDrops(dead) {
	for (let d of dead) {
		if (random() < 0.35) {
			drops.push(new Drop(d.loc.add(p5.Vector.random2D().mult(random(40)))));
		}
	}
}

function doDeaths(dead) {
	for (let d of dead) {
		d_emitter.position = d.loc.copy();
		d_emitter.emit(random(5, 15));
		ball.p_system.emit(random(3,12))
	}
}


function initGame() {
	score = 0;
	monsters = [];
	shots = [];
	drops = [];

	player = new Player();
	camera = new Camera();
	ball = new Ball();

	for (let i = 0; i < 10; i++) {
		monsters.push(new Monster());
	}
}
