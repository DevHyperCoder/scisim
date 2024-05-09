export class Vector {
	x: number;
	y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	add(v: Vector) {
		return new Vector(this.x + v.x, this.y + v.y);
	}

	sub(v: Vector) {
		return new Vector(this.x - v.x, this.y - v.y);
	}

	lenSquared() {
		return this.x ** 2 + this.y ** 2;
	}

	len() {
		return Math.sqrt(this.lenSquared());
	}

	v(): [number, number] {
		return [this.x, this.y];
	}

	rotate(angleRad: number) {
		return new Vector(this.x * Math.cos(angleRad), this.y * Math.sin(angleRad));
	}

	// Mutable add
	madd(v: Vector) {
		this.x += v.x;
		this.y += v.y;
	}

	// Mutable sub
	msub(v: Vector) {
		this.x -= v.x;
		this.y -= v.y;
	}

	static ZERO(): Vector {
		return new Vector(0, 0);
	}
}
