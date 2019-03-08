Decimal.set({
   toExpPos: 4
});
let updateRate = 50;
let costMults = [1e3, 1e5, 1e7, 1e9, 1e11];
let game = {
   nanite: new Decimal(10),
	nanC: [new NaniteCreator(1e1,0,0,1),new NaniteCreator(1e2,0,0,1),new NaniteCreator(1e8,0,0,1),new NaniteCreator(1e14,0,0,1),new NaniteCreator(1e20,0,0,1)],
   tick: {
		//testspeed: new Decimal(1e2),
		//normalspeed: new Decimal(1e3),
      speed: new Decimal(1e3),
      cost: new Decimal(1e3),
      decrement: new Decimal(0.89),
		costMult: new Decimal(1e1)
   },
   nsphere: new NanoSphere(0,1,2,1e2,1e3),
   nchip: new NanoChip(1),
   researcher: new Researcher(1e4, 0, 0, 1),
   researchPoints: new Decimal(0),
   upgrades: [],
   achievements: []
}

/*for (let i = 1; i < 6; i++) {
   let naniteC = new NaniteCreator(Math.pow(10,Math.pow(i,i)), 0, 0, 1);
   nanC.push(naniteC);
}*/


function formatDecimals(item) {
	let temp = item.toSD(3, Decimal.ROUND_DOWN).toString();
	temp = temp.replace("+", "")
	return temp;
}

function format(item) {
   if (item.lt(1000)) return item.trunc().toString();
   let temp = item.toSD(3, Decimal.ROUND_DOWN).toString();
   temp = temp.replace("+", "");
   return temp;
}

function prodPerSec(item) {
	let power = item.pow.times(game.nsphere.pow).times(game.nchip.pow),
	tPS = 1000/game.tick.speed;
   let perSec = item.amount.times(power).times(tPS).div(updateRate);
   return perSec;
}

function canBuy(item, costItem) {
	if (item.available != null || item.available != undefined) {
		if (item.available && costItem.gte(item.cost)) return true; else return false;
	} else {
		if (costItem.gte(item.cost)) return true; else return false;
	}

}

function canBuyTillNext(item, costItem) {

	if (item.available != null || item.available != undefined) {
		if (item.available && costItem.gte(item.cost.times(item.tillNext))) return true; else return false;
	} else {
		if (costItem.gte(item.cost.times(item.tillNext))) return true; else return false;
	}
}

function canChip() {
	if (game.nsphere.pow.gte(16)) return true; else return false;
}

function boostChip() {
	if (canChip()) {
		game.nchip.boost(game.nsphere.pow.div(10));
		game.nanite = new Decimal(10);
	   game.tick.speed = new Decimal(1e1);
	   game.tick.cost = new Decimal(1e3);
	   game.tick.decrement = new Decimal(0.9);
		game.tick.costMult = new Decimal(1e1);
	   game.nsphere = new NanoSphere();
	   game.researcher = new Researcher(1e4, 0, 0, 1);
	   game.researchPoints = new Decimal(0);
		game.nanC[0] = new NaniteCreator(1e1,0,0,1);
		game.nanC[0].availtrue();
		game.nanC[1] = new NaniteCreator(1e2,0,0,1);
		game.nanC[2] = new NaniteCreator(1e8,0,0,1);
		game.nanC[3] = new NaniteCreator(1e14,0,0,1);
		game.nanC[4] = new NaniteCreator(1e20,0,0,1);
	}
}

function buyOneCalc(item, costItem) {
		item.buyOne();
	   if (item.bought.mod(10) == 0 && !item.bought.eq(0)) {
	      item.cost = item.cost.times(costMults[game.nanC.indexOf(item)]).floor();
	      item.pow = item.pow.times(2);
	   } else {
	      item.cost = item.cost;
	   }
}

function buyOne(item) {
   switch (item) {
      case 0:
         if (canBuy(game.nanC[0], game.nanite)) {
            game.nanite = game.nanite.minus(game.nanC[0].cost);
            buyOneCalc(game.nanC[0], game.nanite);
         }
         break;
      case 1:
         if (canBuy(game.nanC[1], game.nanite)) {
            game.nanite = game.nanite.minus(game.nanC[1].cost);
            buyOneCalc(game.nanC[1], game.nanite);
         }
         break;
      case 2:
         if (canBuy(game.nanC[2], game.nanite)) {
            game.nanite = game.nanite.minus(game.nanC[2].cost);
            buyOneCalc(game.nanC[2], game.nanite);
         }
         break;
      case 3:
         if (canBuy(game.nanC[3], game.nanite)) {
            game.nanite = game.nanite.minus(game.nanC[3].cost);
            buyOneCalc(game.nanC[3], game.nanite);
         }
         break;
      case 4:
         if (canBuy(game.nanC[4], game.nanite)) {
            game.nanite = game.nanite.minus(game.nanC[4].cost);
            buyOneCalc(game.nanC[4], game.nanite);
         }
         break;
      case "t":
         if (canBuy(game.tick, game.nanite)) {
            game.nanite = game.nanite.minus(game.tick.cost);
            game.tick.speed = game.tick.speed.minus(game.tick.speed.times(0.11));
            game.tick.cost = game.tick.cost.times(game.tick.costMult);
         }
         break;
		case "ns":
			if (canBuy(game.nsphere, game.nanite)) {
				game.nanite = game.nanite.minus(game.nsphere.cost);
				game.nsphere.buyOne();
			}
			break;
   }

}


function buyNextSingle(item, currency, index) {
   if (currency.gte(item.cost.times(item.tillNext))) {
      for (i in item.tillNext) {
         buyOne(index);
      }
   }
}


function buyMaxCalc(item, currency, index) {
   let total = currency.div(item.cost).floor();
   for (i in total) {
      buyOne(index);
   }
}

function buyMax(item) {
   switch (item) {
      //buyMaxCalc(buy, currency, index);
      case 0:
         buyMaxCalc(game.nanC[0], game.nanite, 0);
         break;
      case 1:
         buyNextSingle(game.nanC[1], game.nanite, 1);
         break;
      case 2:
         buyNextSingle(game.nanC[2], game.nanite, 2);
         break;
      case 3:
         buyNextSingle(game.nanC[3], game.nanite, 3);
         break;
      case 4:
         buyNextSingle(game.nanC[4], game.nanite, 4);
         break;
      case "t":
         buyMaxCalc(game.tick, game.nanite, "t");
         break;
		case "ns":
			buyMaxCalc(game.nsphere, game.nanite, "ns");
			break;
   }
}

function buyMaxAll() {
	if (canBuy(game.nsphere, game.nanite)) buyMaxCalc(game.nsphere, game.nanite, "ns");
   if (canBuy(game.tick, game.nanite)) buyMaxCalc(game.tick, game.nanite, "t");
   if (canBuy(game.nanC[4], game.nanite)) buyMaxCalc(game.nanC[4], game.nanite, 4);
   if (canBuy(game.nanC[3], game.nanite)) buyMaxCalc(game.nanC[3], game.nanite, 3);
   if (canBuy(game.nanC[2], game.nanite)) buyMaxCalc(game.nanC[2], game.nanite, 2);
   if (canBuy(game.nanC[1], game.nanite)) buyMaxCalc(game.nanC[1], game.nanite, 1);
   if (canBuy(game.nanC[0], game.nanite)) buyMaxCalc(game.nanC[0], game.nanite, 0);
}

function updateDisplay() {
   let doc = (element) => document.getElementById(element);
   let disp = (element, innerHTML) => doc(element).innerHTML = innerHTML;
	let power = (powerItem) => powerItem.pow.times(game.nsphere.pow).times(game.nchip.pow);
   disp("naniteA", `${format(game.nanite)}`);
   disp("tickspeed", `${formatDecimals(game.tick.speed)}`);
   disp("tB1", `Cost: ${format(game.tick.cost)} nanites`);
   disp("tBM", `Buy Max`);
   disp("n1P", `x${format(power(game.nanC[0]))}`);
   disp("n1A", `${format(game.nanC[0].amount)}`);
   disp("n1B1", `Cost: ${format(game.nanC[0].cost)} nanites`);
   disp("n1BM", `To Next: ${game.nanC[0].tillNext}, Cost: ${format(game.nanC[0].cost.times(game.nanC[0].tillNext))}`);
   disp("n2P", `x${format(power(game.nanC[1]))}`);
   disp("n2A", `${format(game.nanC[1].amount)}`);
   disp("n2B1", `Cost: ${format(game.nanC[1].cost)} nanites`);
   disp("n2BM", `To Next: ${game.nanC[1].tillNext}, Cost: ${format(game.nanC[1].cost.times(game.nanC[1].tillNext))}`);
   disp("n3P", `x${format(power(game.nanC[2]))}`);
   disp("n3A", `${format(game.nanC[2].amount)}`);
   disp("n3B1", `Cost: ${format(game.nanC[2].cost)} nanites`);
   disp("n3BM", `To Next: ${game.nanC[2].tillNext}, Cost: ${format(game.nanC[2].cost.times(game.nanC[2].tillNext))}`);
   disp("n4P", `x${format(power(game.nanC[3]))}`);
   disp("n4A", `${format(game.nanC[3].amount)}`);
   disp("n4B1", `Cost: ${format(game.nanC[3].cost)} nanites`);
   disp("n4BM", `To Next: ${game.nanC[3].tillNext}, Cost: ${format(game.nanC[3].cost.times(game.nanC[3].tillNext))}`);
	disp("n5P", `x${format(power(game.nanC[4]))}`);
   disp("n5A", `${format(game.nanC[4].amount)}`);
   disp("n5B1", `Cost: ${format(game.nanC[4].cost)} nanites`);
   disp("n5BM", `To Next: ${game.nanC[4].tillNext}, Cost: ${format(game.nanC[4].cost.times(game.nanC[4].tillNext))}`);

	if (game.nsphere.upgrades.lt(1)) disp("nsphereBtn", `<b>Create a NanoSphere<br>Cost: ${format(game.nsphere.cost)} nanites</b>`);
	if (game.nsphere.upgrades.gte(1)) disp("nsphereBtn", `<b>Upgrade NanoSphere<br>Cost: ${format(game.nsphere.cost)} nanites</b><br>Current: x${format(game.nsphere.pow)}`);

	disp("nchipBtn", `<b>Condense NanoSpheres<br>Boost: ${game.nsphere.pow.div(10)}</b><br>Current: ${game.nchip.pow}`);

	if (!canChip()) {
		doc("nchipBtn").classList.add("greyed");
	} else {
		doc("nchipBtn").classList.remove("greyed");
	}
	if (!canBuy(game.nsphere, game.nanite)) {
		doc("nsphereBtn").classList.add("greyed");
	} else {
		doc("nsphereBtn").classList.remove("greyed");
	}
   if (!canBuy(game.nanC[0], game.nanite)) {
      doc("n1B1").classList.add("greyed");
   } else {
      doc("n1B1").classList.remove("greyed");
   }
   if (!canBuyTillNext(game.nanC[0], game.nanite)) {
      doc("n1BM").classList.add("greyed");
   } else {
      doc("n1BM").classList.remove("greyed");
   }
   if (!canBuy(game.nanC[1], game.nanite)) {
      doc("n2B1").classList.add("greyed");
   } else {
      doc("n2B1").classList.remove("greyed");
   }
   if (!canBuyTillNext(game.nanC[1], game.nanite)) {
      doc("n2BM").classList.add("greyed");
   } else {
      doc("n2BM").classList.remove("greyed");
   }
   if (!canBuy(game.nanC[2], game.nanite)) {
      doc("n3B1").classList.add("greyed");
   } else {
      doc("n3B1").classList.remove("greyed");
   }
   if (!canBuyTillNext(game.nanC[2], game.nanite)) {
      doc("n3BM").classList.add("greyed");
   } else {
      doc("n3BM").classList.remove("greyed");
   }
   if (!canBuy(game.nanC[3], game.nanite)) {
      doc("n4B1").classList.add("greyed");
   } else {
      doc("n4B1").classList.remove("greyed");
   }
   if (!canBuyTillNext(game.nanC[3], game.nanite)) {
      doc("n4BM").classList.add("greyed");
   } else {
      doc("n4BM").classList.remove("greyed");
   }
   if (!canBuy(game.nanC[4], game.nanite)) {
   	doc("n5B1").classList.add("greyed");
   } else {
   	doc("n5B1").classList.remove("greyed");
   }
   if (!canBuyTillNext(game.nanC[4], game.nanite)) {
   	doc("n5BM").classList.add("greyed");
   } else {
   	doc("n5BM").classList.remove("greyed");
   }
   if (!canBuy(game.tick, game.nanite)) {
      doc("tB1").classList.add("greyed");
   } else {
      doc("tB1").classList.remove("greyed");
   }
}

function updateAmounts() {
   game.nanite = game.nanite.plus(prodPerSec(game.nanC[0]));
   game.nanC[0].amount = game.nanC[0].amount.plus(prodPerSec(game.nanC[1]));
   game.nanC[1].amount = game.nanC[1].amount.plus(prodPerSec(game.nanC[2]));
   game.nanC[2].amount = game.nanC[2].amount.plus(prodPerSec(game.nanC[3]));
   game.nanC[3].amount = game.nanC[3].amount.plus(prodPerSec(game.nanC[4]));
}


function updateMilestones() {
	let doc = (element) => document.getElementById(element);
	let clAdd = (element,cl) => doc(element).classList.add(cl);
	let clRem = (element,cl) => doc(element).classList.remove(cl);
	game.nanC[0].availtrue();
   if (game.nanC[0].amount.gte(1)) {
		clRem("naniteRow", "unav");
		clAdd("naniteRow", "fade");
   } else {
		clAdd("naniteRow", "unav");
		clRem("naniteRow", "fade");
   }
   if (game.nsphere.upgrades.gte(1)) {
		game.nanC[1].availtrue();
		clRem("tickRow", "unav");
		clRem("n2Row", "unav");
		clAdd("tickRow", "fade");
		clAdd("n2Row", "fade");
   } else {
		clAdd("tickRow", "unav");
		clAdd("n2Row", "unav");
		clRem("tickRow", "fade");
		clRem("n2Row", "fade");
   }
   if (game.nsphere.upgrades.gte(2)) {
		game.nanC[2].availtrue();
      clRem("n3Row", "unav");
		clAdd("n3Row", "fade");
   } else {
      clAdd("n3Row", "unav");
		clAdd("n3Row", "fade");
   }
   if (game.nsphere.upgrades.gte(3)) {
		game.nanC[3].availtrue();
		clRem("n4Row", "unav");
		clAdd("n4Row", "fade");
   } else {
		clAdd("n4Row", "unav");
		clAdd("n4Row", "fade");
   }
	if (game.nsphere.upgrades.gte(4)) {
		game.nanC[4].availtrue();
		clRem("n5Row", "unav");
		clAdd("n5Row", "fade");
   } else {
		clAdd("n5Row", "unav");
		clAdd("n5Row", "fade");
   }
	if (game.nsphere.pow.gte(16)) {
		clRem("nchipBtn", "unav");
		clAdd("nchipBtn", "fade");
	} else {
		clAdd("nchipBtn", "unav");
		clRem("nchipBtn", "fade");
	}
}

let requestLoop,
   startTime = Date.now(),
   fps,
   now,
   then,
   elapsed;

function gameLoop() {
   fps = 1000 / updateRate;
   then = Date.now();
   startTime = then;
   gameTick();
}

function gameTick() {
   requestAnimationFrame(gameTick);

   now = Date.now();
   elapsed = now - then;

   if (elapsed > fps) {
      then = now - (elapsed % fps);

      updateAmounts();
      updateMilestones();
      updateDisplay();
   }

}



requestAnimationFrame(gameLoop)

//cancelAnimationFrame(requestLoop)

//let gameInterval;
//gameInterval = setInterval(gameTick, updateRate);

window.addEventListener("load", updateDisplay);

document.getElementById("tB1").addEventListener("click", () => buyOne("t"));
document.getElementById("tBM").addEventListener("click", () => buyMax("t"));
document.getElementById("n1B1").addEventListener("click", () => buyOne(0));
document.getElementById("n1BM").addEventListener("click", () => buyMax(0));
document.getElementById("n2B1").addEventListener("click", () => buyOne(1));
document.getElementById("n2BM").addEventListener("click", () => buyMax(1));
document.getElementById("n3B1").addEventListener("click", () => buyOne(2));
document.getElementById("n3BM").addEventListener("click", () => buyMax(2));
document.getElementById("n4B1").addEventListener("click", () => buyOne(3));
document.getElementById("n4BM").addEventListener("click", () => buyMax(3));
//document.getElementById("n5B1").addEventListener("click", () => buyOne(4));
//document.getElementById("n5BM").addEventListener("click", () => buyMax(4));
document.getElementById("maxBuy").addEventListener("click", () => buyMaxAll());
document.getElementById("nsphereBtn").addEventListener("click", () => {buyOne("ns"); if (game.nsphere.created == false) game.nsphere.created = true;});
document.getElementById("nchipBtn").addEventListener("click", () => boostChip());

window.addEventListener("keydown", (event) => {
   switch (event.keyCode) {
      case 77: //M
         document.getElementById("maxBuy").click();
         break;

   }
});


function saveGame() {
	localStorage.setItem("save", JSON.stringify(game));
}

function loadGame() {
	let savegame = JSON.parse(localStorage.getItem("save"));
	if (typeof savegame.nanite !== undefined) game.nanite = new Decimal(savegame.nanite);
	game.nanC[0] = new NaniteCreator(savegame.nanC[0].cost,savegame.nanC[0].amount,savegame.nanC[0].bought,savegame.nanC[0].pow);
	game.nanC[1] = new NaniteCreator(savegame.nanC[1].cost,savegame.nanC[1].amount,savegame.nanC[1].bought,savegame.nanC[1].pow);
	game.nanC[2] = new NaniteCreator(savegame.nanC[2].cost,savegame.nanC[2].amount,savegame.nanC[2].bought,savegame.nanC[2].pow);
	game.nanC[3] = new NaniteCreator(savegame.nanC[3].cost,savegame.nanC[3].amount,savegame.nanC[3].bought,savegame.nanC[3].pow);
	game.nanC[4] = new NaniteCreator(savegame.nanC[4].cost,savegame.nanC[4].amount,savegame.nanC[4].bought,savegame.nanC[4].pow);
   game.tick.speed = new Decimal(savegame.tick.speed);
   game.tick.cost = new Decimal(savegame.tick.cost);
   game.tick.decrement = new Decimal(savegame.tick.decrement);
	game.tick.costMult = new Decimal(savegame.tick.costMult);
   game.nsphere = new NanoSphere(savegame.nsphere.upgrades,savegame.nsphere.pow,savegame.nsphere.mult,savegame.nsphere.cost,savegame.nsphere.costMult);
   game.nchip = new NanoChip(savegame.nchip.pow);
	game.researcher = savegame.researcher;
   game.researchPoints = new Decimal(savegame.researchPoints);
   game.upgrades = savegame.upgrades;
   game.achievements = savegame.achievements;
	updateMilestones();
	updateDisplay();
}

function resetHard() {
	localStorage.removeItem("save")
}

window.addEventListener("load", loadGame);
window.setInterval(saveGame, 200);
