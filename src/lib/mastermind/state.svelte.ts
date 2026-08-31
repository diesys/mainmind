import {
	buildPalette,
	check,
	generateSolution,
	isCompleteGuess,
	isWin,
	makeEmptyGuess
} from './game';
import type { ColorIndex, Feedback, Guess } from './types';

export interface Move {
	guess: Guess;
	feedback: Feedback;
}

/**
 * Reactive game state for a single Mastermind game. The UI drives this class
 * and it delegates all rules to the pure logic in `game.ts`.
 */
export class Game {
	nColors = $state(0);
	solution = $state<Guess>([]);
	palette = $state<string[]>([]);
	currGuess = $state<Guess>(makeEmptyGuess());
	selected = $state(0);
	moves = $state<Move[]>([]);
	won = $state(false);

	get started(): boolean {
		return this.nColors > 0;
	}

	get attempts(): number {
		return this.moves.length;
	}

	start(nColors: number): void {
		this.nColors = nColors;
		this.solution = generateSolution(nColors);
		this.palette = buildPalette(nColors);
		this.currGuess = makeEmptyGuess();
		this.selected = 0;
		this.moves = [];
		this.won = false;
	}

	select(index: number): void {
		if (this.won) return;
		this.selected = index;
	}

	/**
	 * Sets the selected slot to the given palette index, or clears it when
	 * `colorIndex` is -1. Mirrors the auto-advance of the original UI: the
	 * selection moves to the first empty slot when one remains.
	 */
	setColor(colorIndex: ColorIndex): void {
		if (this.won) return;
		this.currGuess[this.selected] = colorIndex;
		const nextEmpty = this.currGuess.indexOf(-1);
		if (nextEmpty !== -1) {
			this.selected = nextEmpty;
		}
	}

	submit(): void {
		if (this.won || !isCompleteGuess(this.currGuess)) return;
		const feedback = check(this.solution, this.currGuess);
		this.moves = [...this.moves, { guess: [...this.currGuess], feedback }];
		if (isWin(feedback)) {
			this.won = true;
		} else {
			this.currGuess = makeEmptyGuess();
			this.selected = 0;
		}
	}
}
