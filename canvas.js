//Inspiration: https://www.youtube.com/watch?v=raXW5J1Te7Y

//initial setup
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = window.innerWidth ;
canvas.height = window.innerHeight;


//Variables 
const mouse = {
	x : innerWidth / 2,
	y : innerHeight / 2
};

const Colors = [
	"#187F31",
	"#2FFF61",
	"#26CC4E",
	"#254C2F",
];


//Event Listeners
addEventListener('mousemove', event => {
	mouse.x = event.clientX;
	mouse.y = event.clientY;
});

addEventListener('resize', function() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	//A chaque refresh, on reprend toute la fenêtre + on envoit la fonction init qui crée les cercles
	init();
});


// Utility function
function randomIntFromRange(min,max) {
	return Math.floor(Math.random() * (max-min+1) + min);
}

function randomColor(Colors) {
	return Colors[Math.floor(Math.random() * Colors.length)];
}


// Objects (qui seront générer ailleurs)
function Particle(x , y , radius , color) {
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.color = color;
	//Pour créer le mouvement circulaire.
	this.radians = Math.random() * Math.PI*2; //On génère alératoirement sur la limite du rayon du cercle
	this.velocity = 0.02;
	this.distanceFromCenter = randomIntFromRange(50,120); // "randomInt" est là pour varier l'éloigement sur l'axe des x de chaque cercle généré.
	this.lastMouse =  {x:x , y:y}


	this.update = () => {
		//move points over time
		this.radians += this.velocity;
		this.x = this.lastMouse.x + Math.cos(this.radians) * this.distanceFromCenter; 
		this.y = this.lastMouse.y + Math.sin(this.radians) * this.distanceFromCenter;
		// --> le '*100' (qui a été remplacé par randomint) permettait de bouger de façon plus large
		//plutôt qu'entre 0 et 1.
		
		//Drag effect
		this.lastMouse.x += (mouse.x - this.lastMouse.x) *0.05;
		this.lastMouse.y +=	(mouse.y - this.lastMouse.y) *0.05;
		//On référence "lastMouse" (dernière position de la souris)
		// pour le x et y afin d'avoir
		//une belle trace quand on bouge la soursi
		

		this.draw();


	}

	this.draw = () => {
		//forme à générer
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
		c.fillStyle = this.color;
		c.fill();
		c.closePath();
	}
}

// Generation on screen
let particles;
function init() {
	particles = []

	for (i = 0; i < 100; i++) {
		//Lui dire quoi dessiner ici. Ca n'apparaîtra pas à l'écran car on doit "l'animer pour ça"
		const radius = (Math.random()*2)+1;
		particles.push(new Particle(mouse.x, mouse.y, radius, randomColor(Colors)));
	};
}

// Animation loop
function animate() {
	requestAnimationFrame(animate);
	c.fillStyle = "rgba(255,255,255,0.05)"
	c.fillRect(0,0, canvas.width, canvas.height);
	//--> Pour éviter les traînées des formes
	// --> ici avec fill rect et le fillstyle, on permet
	//de redessiner un rectangle transparent qui se redessine à chaque
	//rafraichissement --> opacity = trail
	
	particles.forEach(Particle => {
		Particle.update();
	});
}

init();
animate();