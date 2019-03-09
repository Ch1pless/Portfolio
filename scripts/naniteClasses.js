function NaniteCreator(c, a, b, p) {
	this.cost = new Decimal(c);
	this.amount = new Decimal(a);
	this.bought = new Decimal(b);
	this.pow = new Decimal(p);
	this.tillNext = new Decimal(10 - this.bought.mod(10));
	this.available = false;

	this.buyOne = function () {
		this.amount = this.amount.plus(1);
		this.bought = this.bought.plus(1);
		this.tillNext = new Decimal(10 - this.bought.mod(10));
	};

	this.availtrue = function () {
		this.available = true;
	}

	this.availfalse = function () {
		this.available = false;
	}
}

function Researcher(c, a, b, p) {
	this.cost = new Decimal(c);
	this.costMult = new Decimal(1e10);
	this.amount = new Decimal(a);
	this.bought = new Decimal(b);
	this.pow = new Decimal(p);
	this.available = false;

	this.buyOne = function () {
		this.amount = this.amount.plus(1);
		this.bought = this.bought.plus(1);
		this.cost = this.cost.times(this.costMult);
	};

	this.availtrue = function () {
		this.available = true;
	}

	this.availfalse = function () {
		this.available = false;
	}
}

function NanoSphere(u,p,c,cm) {
	this.upgrades = new Decimal(u);
	this.pow = new Decimal(p);
	this.cost = new Decimal(c);
	this.costMult = new Decimal(cm);
	this.available = false;

	this.buyOne = function () {
		if (this.upgrades != 0) {
			if (this.pow.gte(16)) {
				this.pow = this.pow.times((1/Math.pow(1.10, this.upgrades))+1);
			} else {
				this.pow = this.pow.times(2);
			}

		}
		this.upgrades = this.upgrades.plus(1);
		this.cost = this.cost.times(this.costMult.plus(Math.pow(1e2, this.upgrades)));
	}

	this.availtrue = function () {
		this.available = true;
	}

	this.availfalse = function () {
		this.available = false;
	}
}

function ConNanoSphere(pow = 1) {
	this.pow = new Decimal(pow);

	this.boost = function (boost) {
		let powBoost = boost.minus(1);
		this.pow = this.pow.plus(powBoost);
	}
}
