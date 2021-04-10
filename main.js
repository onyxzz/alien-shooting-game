
// General

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d')

canvas.width = innerHeight
canvas.height = innerHeight

const ingame_score = document.querySelector('#ingamescore')
const ingame_HP = document.querySelector('#ingameHP')
const result = document.querySelector('#result')
const final_score = document.querySelector('#finalscore')
const start_btn = document.querySelector('#startbtn')

let score = 0
let HP = 3
let difficulty = 1
let friction = 0.999999999
let x = canvas.width / 2 - canvas.width / 50
let y = canvas.height - canvas.height / 25
let velocity = { x: 0, y: -1 }
let animationID

let playerShips = []
let missiles = []
let alienShips = []
let bigAsteroids = []
let smallAsteroids = []
let particles = []
let lasers = []


// Objects

class PlayerShip {
	constructor(x, y, height, width, color, velocity) {
		this.x = x
		this.y = y
		this.width = width
		this.height = height
		this.color = color
		this.velocity = velocity
	}

	draw() {
		context.beginPath()
		context.rect(this.x, this.y, this.width, this.height)
		context.fillStyle = this.color
		context.fill()
	}

	update() {
		this.draw()
		this.x += velocity.x
		this.y += velocity.y
	}
}

playerShips.push(
	new PlayerShip(
		x,
		y,
		canvas.width / 25,
		canvas.height / 25,
		'#41AAC4',
		velocity
	)
)

class Missile {
	constructor(x, y, radius, color, velocity) {
		this.x = x
		this.y = y
		this.radius = radius
		this.color = color
		this.velocity = velocity
	}

	draw() {
		context.beginPath()
		context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false)
		context.fillStyle = this.color
		context.fill()
	}

	update() {
		this.draw()
		this.x += this.velocity.x
		this.y += this.velocity.y
	}
}

class AlienShip {
	constructor(x, y, radius, color, velocity) {
		this.x = x
		this.y = y
		this.radius = radius
		this.color = color
		this.velocity = velocity
	}

	draw() {
		context.beginPath()
		context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false)
		context.fillStyle = this.color
		context.fill()
	}

	update() {
		this.draw()
		this.x += this.velocity.x
		this.y += this.velocity.y
	}
}

class BigAsteroid {
	constructor(x, y, radius, color, velocity) {
		this.x = x
		this.y = y
		this.radius = radius
		this.color = color
		this.velocity = velocity
	}

	draw() {
		context.beginPath()
		context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false)
		context.fillStyle = this.color
		context.fill()
	}

	update() {
		this.draw()
		this.x += this.velocity.x
		this.y += this.velocity.y
	}
}

class Laser {
	constructor(x, y, radius, color, velocity) {
		this.x = x
		this.y = y
		this.radius = radius
		this.color = color
		this.velocity = velocity
	}

	draw() {
		context.beginPath()
		context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false)
		context.fillStyle = this.color
		context.fill()
	}

	update() {
		this.draw()
		this.x += this.velocity.x
		this.y += this.velocity.y
	}
}

class SmallAsteroid {
	constructor(x, y, radius, color, velocity) {
		this.x = x
		this.y = y
		this.radius = radius
		this.color = color
		this.velocity = velocity
		this.alpha = 1
	}

	draw() {
		context.save()
		context.globalAlpha = this.alpha
		context.beginPath()
		context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false)
		context.fillStyle = this.color
		context.fill()
		context.restore()
	}

	update() {
		this.draw()
		this.velocity.x *= friction
		this.velocity.y *= friction
		this.x = this.x + this.velocity.x
		this.y = this.y + this.velocity.y
	}
}

class Particle {
	constructor(x, y, radius, color, velocity) {
		this.x = x
		this.y = y
		this.radius = radius
		this.color = color
		this.velocity = velocity
		this.alpha = 1
	}

	draw() {
		context.save()
		context.globalAlpha = this.alpha
		context.beginPath()
		context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false)
		context.fillStyle = this.color
		context.fill()
		context.restore()
	}

	update() {
		this.draw()
		this.velocity.x *= friction
		this.velocity.y *= friction
		this.x = this.x + this.velocity.x
		this.y = this.y + this.velocity.y
		this.alpha -= 0.01
	}
}

// Control System

window.addEventListener('keydown', (acceleration) => {
	switch(acceleration.key) {
		case 'ArrowUp':
			if (velocity.y !== 0) break
			velocity = { x: 0, y: -1 }
			break
		case 'ArrowDown':
			if (velocity.y !== 0) break
			velocity = { x: 0, y: 1 }
			break
		case 'ArrowLeft':
			if (velocity.x !== 0) break
			velocity = { x: -1, y: 0 }
			break
		case 'ArrowRight':
			if (velocity.x !== 0) break
			velocity = { x: 1, y: 0 }
			break
	}
})

window.addEventListener('click', (event) => {
	playerShips.forEach((playerShip) => {

		const angle = Math.atan2(
			event.clientX - playerShip.x + canvas.width / 50,
			event.clientY - playerShip.y + canvas.height / 50
		)

		const velocity = {
			x: Math.sin(angle) * canvas.width / 100,
			y: Math.cos(angle) * canvas.width / 100
		}

		missiles.push(
			new Missile(
				playerShip.x + canvas.width / 50,
				playerShip.y + canvas.height / 50,
				canvas.width / 200,
				'#DDDDDD',
				velocity
			)
		)
	})
})

// Spawn Enemy

function increaseDif() {
	setInterval(() => {
		difficulty += 0.05
	},1000)
}

function spawnAlienShip() {
	setInterval(() => {
		
		let x
		let y

		const radius = canvas.width / 50
		const color = '#80CEB9'

		if (Math.random() < 0.5) {
			x = Math.random() * canvas.width
			y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
		} else {
			x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
			y = Math.random() * canvas.height
		}

		const angle = Math.atan2(
			(Math.random() * canvas.width) - x,
			(Math.random() * canvas.height) - y
		)

		const velocity = {
			x: Math.sin(angle) * 0.75,
			y: Math.cos(angle) * 0.75
		}

		alienShips.push(new AlienShip(x, y,radius, color, velocity))
	},4000 / difficulty)
}

function spawnLaser() {
	setInterval(() => {
		alienShips.forEach((alienShip) => {
			playerShips.forEach((playerShip) => {

				const angle = Math.atan2(
					playerShip.x + canvas.width / 50 - alienShip.x,
					playerShip.y + canvas.width / 50 - alienShip.y
				)

				const velocity = {
					x: Math.sin(angle) * canvas.width / 100,
					y: Math.cos(angle) * canvas.width / 100
				}

				lasers.push(
					new Laser(
						alienShip.x,
						alienShip.y,
						canvas.width / 200,
						'#DDDDDD',
						velocity
					)
				)
			})
		})
	},1000 / difficulty)
}

function spawnBigAsteroid() {
	setInterval(() => {
		
		let x
		let y

		const radius = canvas.width / 50 * 3
		const color = '#717D8C'

		if (Math.random() < 0.5) {
			x = Math.random() * canvas.width
			y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
		} else {
			x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
			y = Math.random() * canvas.height
		}

		const angle = Math.atan2(
			(Math.random() * canvas.width) - x,
			(Math.random() * canvas.height) - y
		)

		const velocity = {
			x: Math.sin(angle) * 0.25,
			y: Math.cos(angle) * 0.25
		}

		bigAsteroids.push(new BigAsteroid(x, y,radius, color, velocity))
	},9000 / difficulty)
}


function spawnSmallAsteroid() {
	setInterval(() => {
		
		let x
		let y

		const radius = canvas.width / 100 * 3
		const color = '#717D8C'

		if (Math.random() < 0.5) {
			x = Math.random() * canvas.width
			y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
		} else {
			x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
			y = Math.random() * canvas.height
		}

		const angle = Math.atan2(
			(Math.random() * canvas.width) - x,
			(Math.random() * canvas.height) - y
		)

		const velocity = {
			x: Math.sin(angle) * 0.5,
			y: Math.cos(angle) * 0.5
		}

		smallAsteroids.push(new SmallAsteroid(x, y,radius, color, velocity))
	},3000 / difficulty)
}


// Collision

function Mechanic() {
	animationID = requestAnimationFrame(Mechanic)

	context.fillStyle = '#2F343A'
	context.fillRect(0, 0, canvas.width, canvas.width)

	// Player Ship Collision

	playerShips.forEach((playerShip) => {
		playerShip.update()

		alienShips.forEach((alienShip, aSindex) => {
			const distance = Math.hypot(
				playerShip.x + canvas.width / 50 - alienShip.x,
				playerShip.y + canvas.width / 50 - alienShip.y
			)

			if (distance < canvas.width / 50 + alienShip.radius ) {
				for (let i = 0; i < alienShip.radius; i++) {
					particles.push(
						new Particle(
							alienShip.x,
							alienShip.y,
							Math.random() * 2,
							'#80CEB9',
							{
								x: (Math.random() - 0.5) * (Math.random() * 5),
								y: (Math.random() - 0.5) * (Math.random() * 5)
							}
						)
					)
				}
				for (let i = 0; i < canvas.width / 50; i++) {
					particles.push(
						new Particle(
							playerShip.x + canvas.width / 50,
							playerShip.y + canvas.width / 50,
							Math.random() * 2,
							'#41AAC4',
							{
								x: (Math.random() - 0.5) * (Math.random() * 5),
								y: (Math.random() - 0.5) * (Math.random() * 5)
							}
						)
					)
				}
				HP -= 1
				ingameHP.innerHTML = HP
				setTimeout(() => {
					alienShips.splice(aSindex, 1)
				},0)
			}
		})

		lasers.forEach((laser, lindex) => {
			const distance = Math.hypot(
				playerShip.x + canvas.width / 50 - laser.x,
				playerShip.y + canvas.width / 50 - laser.y
			)
			
			if (distance < canvas.width / 50 + laser.radius ) {
				for (let i = 0; i < laser.radius; i++) {
					particles.push(
						new Particle(
							laser.x,
							laser.y,
							Math.random() * 2,
							'#41AAC4',
							{
								x: (Math.random() - 0.5) * (Math.random() * 5),
								y: (Math.random() - 0.5) * (Math.random() * 5)
							}
						)
					)
				}
				HP -= 1
				ingameHP.innerHTML = HP
				setTimeout(() => {
					lasers.splice(lindex, 1)
				},0)
			}
		})

		bigAsteroids.forEach((bigAsteroid, bAindex) => {
			const distance = Math.hypot(
				playerShip.x + canvas.width / 50 - bigAsteroid.x,
				playerShip.y + canvas.width / 50 - bigAsteroid.y
			)

			if (distance < canvas.width / 50 + bigAsteroid.radius) {
				for (let i = 0; i < bigAsteroid.radius; i++) {
					particles.push(
						new Particle(
							bigAsteroid.x,
							bigAsteroid.y,
							Math.random() * 2,
							'#80CEB9',
							{
								x: (Math.random() - 0.5) * (Math.random() * 5),
								y: (Math.random() - 0.5) * (Math.random() * 5)
							}
						)
					)
				}
				for (let i = 0; i < canvas.width / 50; i++) {
					particles.push(
						new Particle(
							playerShip.x + canvas.width / 50,
							playerShip.y + canvas.width / 50,
							Math.random() * 2,
							'#41AAC4',
							{
								x: (Math.random() - 0.5) * (Math.random() * 5),
								y: (Math.random() - 0.5) * (Math.random() * 5)
							}
						)
					)
				}
				HP -= 3
				ingameHP.innerHTML = HP
				setTimeout(() => {
					bigAsteroids.splice(bAindex, 1)				
				},0)
			}
		})

		smallAsteroids.forEach((smallAsteroid, sAindex) => {
			const distance = Math.hypot(
				playerShip.x + canvas.width / 50 - smallAsteroid.x,
				playerShip.y + canvas.width / 50 - smallAsteroid.y
			)

			if (distance < canvas.width / 50 + smallAsteroid.radius) {
				for (let i = 0; i < smallAsteroid.radius; i++) {
					particles.push(
						new Particle(
							smallAsteroid.x,
							smallAsteroid.y,
							Math.random() * 2,
							'#41AAC4',
							{
								x: (Math.random() - 0.5) * (Math.random() * 5),
								y: (Math.random() - 0.5) * (Math.random() * 5)
							}
						)
					)
				}
				for (let i = 0; i < canvas.width / 50; i++) {
					particles.push(
						new Particle(
							playerShip.x + canvas.width / 50,
							playerShip.y + canvas.width / 50,
							Math.random() * 2,
							'#41AAC4',
							{
								x: (Math.random() - 0.5) * (Math.random() * 5),
								y: (Math.random() - 0.5) * (Math.random() * 5)
							}
						)
					)
				}
				HP -= 2
				ingameHP.innerHTMl = HP
				setTimeout(() => {
					smallAsteroids.splice(sAindex, 1)
				},0)
			}
		})

		if (HP <= 0) {
			cancelAnimationFrame(animationID)
			result.style.display = 'flex'
			finalscore.innerHTML = score
		}
	})

	// Missile Collision

	missiles.forEach((missile, mindex) => {
		missile.update()

		if (missile.x - missile.radius < 0 ||
			missile.x - missile.radius > canvas.width ||
			missile.y + missile.radius < 0 ||
			missile.y - missile.radius > canvas.height
		) {
			setTimeout(() => {
				missiles.splice(mindex, 1)
			},0)
		}

		lasers.forEach((laser, lindex) => {
			const distance = Math.hypot(
				missile.x - laser.x,
				missile.y - laser.y
			)
			if (distance < laser.radius + missile.radius) {
				setTimeout(() => {
					missiles.splice(mindex, 1)
					lasers.splice(lindex, 1)
				}, 0)
			}
		})

		alienShips.forEach((alienShip, aSindex) => {
			const distance = Math.hypot(
				missile.x - alienShip.x,
				missile.y - alienShip.y
			)
			if (distance < alienShip.radius + missile.radius) {
				for (let i = 0; i < alienShip.radius * 2; i++) {
					particles.push(
						new Particle(
							alienShip.x,
							alienShip.y,
							Math.random() * 2,
							'#80CEB9',
							{
								x: (Math.random() - 0.5) * (Math.random() * 5),
								y: (Math.random() - 0.5) * (Math.random() * 5)
							}
						)
					)
				}
				score += 200
				ingamescore.innerHTML = score
				setTimeout(() => {
					alienShips.splice(aSindex, 1)
					missiles.splice(mindex, 1)
				}, 0)
			}
		})

		bigAsteroids.forEach((bigAsteroid, bAindex) => {
			const distance = Math.hypot(
				missile.x - bigAsteroid.x,
				missile.y - bigAsteroid.y
			)
			if (distance < bigAsteroid.radius + missile.radius) {
				for (let i = 0; i < bigAsteroid.radius * 2; i++) {
					particles.push(
						new Particle(
							bigAsteroid.x,
							bigAsteroid.y,
							Math.random() * 2,
							'#717D8C',
							{
								x: (Math.random() - 0.5) * (Math.random() * 5),
								y: (Math.random() - 0.5) * (Math.random() * 5)
							}
						)
					)
				}
				for (let i = 0; i < 6; i++) {
					smallAsteroids.push(
						new SmallAsteroid(
							missile.x,
							missile.y,
							canvas.width / 100 * 3,
							'#717D8C',
							{
								x: (Math.random() - 0.5) * (Math.random() * 5),
								y: (Math.random() - 0.5) * (Math.random() * 5)
							}
						)
					)
				}
				score += 100
				ingamescore.innerHTML = score
				setTimeout(() => {
					bigAsteroids.splice(bAindex, 1)
					missiles.splice(mindex, 1)
				},0)
			}
		})

		smallAsteroids.forEach((smallAsteroid, sAindex) => {
			const distance = Math.hypot(
				missile.x - smallAsteroid.x,
				missile.y - smallAsteroid.y
			)
			if (distance < smallAsteroid.radius + missile.radius) {
				for (let i = 0; i < smallAsteroid.radius * 2; i++) {
					particles.push(
						new Particle(
							smallAsteroid.x,
							smallAsteroid.y,
							Math.random() * 2,
							'#717D8C',
							{
								x: (Math.random() - 0.5) * (Math.random() * 5),
								y: (Math.random() - 0.5) * (Math.random() * 5)
							}
						)
					)
				}
				score += 100
				ingamescore.innerHTML = score
				setTimeout(() => {
					smallAsteroids.splice(sAindex, 1)
					missiles.splice(mindex, 1)
				},0)
			}
		})
	})

	// Alien Ship Collision

	alienShips.forEach((alienShip, aSindex) => {
		alienShip.update()

		if (alienShip.x - alienShip.radius < 0 ||
			alienShip.x - alienShip.radius > canvas.width ||
			alienShip.y + alienShip.radius < 0 ||
			alienShip.y - alienShip.radius > canvas.height
		) {
			setTimeout(() => {
				alienShips.splice(aSindex, 1)
			},0)
		}

		bigAsteroids.forEach((bigAsteroid, bAindex) => {
			const distance = Math.hypot(
				alienShip.x - bigAsteroid.x,
				alienShip.y - bigAsteroid.y
			)
			if (distance < alienShip.radius + bigAsteroid.radius) {
				for (let i = 0; i < alienShip.radius; i++) {
					particles.push(
						new Particle(
							alienShip.x,
							alienShip.y,
							Math.random() * 2,
							'#80CEB9',
							{
								x: (Math.random() - 0.5) * (Math.random() * 5),
								y: (Math.random() - 0.5) * (Math.random() * 5)
							}
						)
					)
				}
				for (let i = 0; i < bigAsteroid.radius; i++) {
					particles.push(
						new Particle(
							bigAsteroid.x,
							bigAsteroid.y,
							Math.random() * 2,
							'#717D8C',
							{
								x: (Math.random() - 0.5) * (Math.random() * 5),
								y: (Math.random() - 0.5) * (Math.random() * 5)
							}
						)
					)
				}
				for (let i = 0; i < 2; i++) {
					smallAsteroids.push(
						new SmallAsteroid(
							bigAsteroid.x,
							bigAsteroid.y,
							canvas.width / 100 * 3,
							'#717D8C',
							{
								x: (Math.random() - 0.5) * (Math.random() * 5),
								y: (Math.random() - 0.5) * (Math.random() * 5)
							}
						)
					)
				}
				setTimeout(() => {
					bigAsteroids.splice(bAindex, 1)
					alienShips.splice(aSindex, 1)				
				},0)
			}
		})

		smallAsteroids.forEach((smallAsteroid, sAindex) => {
			const distance = Math.hypot(
				alienShip.x - smallAsteroid.x,
				alienShip.y - smallAsteroid.y
			)
			if (distance < alienShip.radius + smallAsteroid.radius) {
				for (let i = 0; i < alienShip.radius; i++) {
					particles.push(
						new Particle(
							alienShip.x,
							alienShip.y,
							Math.random() * 2,
							'#80CEB9',
							{
								x: (Math.random() - 0.5) * (Math.random() * 5),
								y: (Math.random() - 0.5) * (Math.random() * 5)
							}
						)
					)
				}
				for (let i = 0; i < smallAsteroid.radius; i++) {
					particles.push(
						new Particle(
							smallAsteroid.x,
							smallAsteroid.y,
							Math.random() * 2,
							'#717D8C',
							{
								x: (Math.random() - 0.5) * (Math.random() * 5),
								y: (Math.random() - 0.5) * (Math.random() * 5)
							}
						)
					)
				}
				setTimeout(() => {
					smallAsteroids.splice(sAindex, 1)
					alienShips.splice(aSindex, 1)
				},0)
			}
		})
	})

	// Laser Collision

	lasers.forEach((laser, lindex) => {
		laser.update()

		if (laser.x - laser.radius < 0 ||
			laser.x - laser.radius > canvas.width ||
			laser.y + laser.radius < 0 ||
			laser.y - laser.radius > canvas.height
		) {
			setTimeout(() => {
				lasers.splice(lindex, 1)
			},0)
		}

		bigAsteroids.forEach((bigAsteroid, bAindex) => {
			const distance = Math.hypot(
				laser.x - bigAsteroid.x,
				laser.y - bigAsteroid.y
			)
			if (distance < bigAsteroid.radius + laser.radius) {
				for (let i = 0; i < bigAsteroid.radius * 2; i++) {
					particles.push(
						new Particle(
							bigAsteroid.x,
							bigAsteroid.y,
							Math.random() * 2,
							'#717D8C',
							{
								x: (Math.random() - 0.5) * (Math.random() * 5),
								y: (Math.random() - 0.5) * (Math.random() * 5)
							}
						)
					)
				}
				for (let i = 0; i < 6; i++) {
					smallAsteroids.push(
						new SmallAsteroid(
							laser.x,
							laser.y,
							canvas.width / 100 * 3,
							'#717D8C',
							{
								x: (Math.random() - 0.5) * (Math.random() * 5),
								y: (Math.random() - 0.5) * (Math.random() * 5)
							}
						)
					)
				}
				setTimeout(() => {
					bigAsteroids.splice(bAindex, 1)
					lasers.splice(lindex, 1)
				},0)
			}
		})

		smallAsteroids.forEach((smallAsteroid, sAindex) => {
			const distance = Math.hypot(
				laser.x - smallAsteroid.x,
				laser.y - smallAsteroid.y
			)
			if (distance < smallAsteroid.radius + laser.radius) {
				for (let i = 0; i < smallAsteroid.radius * 2; i++) {
					particles.push(
						new Particle(
							smallAsteroid.x,
							smallAsteroid.y,
							Math.random() * 2,
							'#717D8C',
							{
								x: (Math.random() - 0.5) * (Math.random() * 5),
								y: (Math.random() - 0.5) * (Math.random() * 5)
							}
						)
					)
				}
				setTimeout(() => {
					smallAsteroids.splice(sAindex, 1)
					lasers.splice(lindex, 1)
				},0)
			}
		})
	})

	// Big Asteroid Collision

	bigAsteroids.forEach((bigAsteroid, bAindex) => {
		bigAsteroid.update()

		if (bigAsteroid.x - bigAsteroid.radius < 0 ||
			bigAsteroid.x - bigAsteroid.radius > canvas.width ||
			bigAsteroid.y + bigAsteroid.radius < 0 ||
			bigAsteroid.y - bigAsteroid.radius > canvas.height
		) {
			setTimeout(() => {
				bigAsteroids.splice(bAindex, 1)
			},0)
		}

		smallAsteroids.forEach((smallAsteroid, sAindex) => {
			const distance = Math.hypot(
				bigAsteroid.x - smallAsteroid.x,
				bigAsteroid.y - smallAsteroid.y
			)
			if (distance < 0) {
				setTimeout(() => {
					smallAsteroids.splice(sAindex, 1)
					bigAsteroids.splice(bAindex, 1)
				},0)
			}
		})
	})

	// Small Asteroid Collision

	smallAsteroids.forEach((smallAsteroid, sAindex) => {
		smallAsteroid.update()

		if (smallAsteroid.x - smallAsteroid.radius < 0 ||
			smallAsteroid.x - smallAsteroid.radius > canvas.width ||
			smallAsteroid.y + smallAsteroid.radius < 0 ||
			smallAsteroid,y - smallAsteroid.radius > canvas.height
		) {
			setTimeout(() => {
				smallAsteroids.splice(sAindex, 1)
			},0)
		}
	})

	// Particle

	particles.forEach((particle, pindex) => {
		if (particle.alpha <= 0) {
			particles.splice(pindex, 1)
		} else {
			particle.update()
		}
	})
}

// Restart Game

function init() {

	playerShips = []
	missiles = []
	alienShips = []
	lasers = []
	bigAsteroids = []
	smallAsteroids = []
	particles = []

	velocity = { x: 0, y: -1 }

	playerShips.push(
		new PlayerShip(
			x,
			y,
			canvas.width / 25,
			canvas.height / 25,
			'#41AAC4',
			velocity
		)
	)

	score = 0
	HP = 3
	difficulty = 1

	ingamescore.innerHTML = score
	finalscore.innerHTML = score
	ingameHP.innerHTML = HP
}

start_btn.addEventListener('click', () => {
	init()
	Mechanic()
	increaseDif()
	spawnAlienShip()
	spawnLaser()
	spawnBigAsteroid()
	spawnSmallAsteroid()
	result.style.display = 'none'
})