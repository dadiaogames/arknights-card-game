import { payCost, get_blocker } from './Game';

export function fullmoon(G, ctx, self) {
	let power = self.power;
	G.onPlayCard.push(
		(G, ctx) => {
			G.score += 1 + power;
		}
	);
}

export function warchest(G, ctx, self) {
	let power = self.power;
	G.onEnemyOut.push(
		(G, ctx) => {
			G.score += 1 + power;
		}
	);
}

export function fans_act_once(G, ctx, self) {
	if (payCost(G, ctx, 1, true)) {
		for (let enemy of G.efield) {
			if (get_blocker(G, ctx, enemy) == self) {
				enemy.dmg += 2 + (enemy.vulnerable || 0);
			}
		}
		self.exhausted = false;
	}
}