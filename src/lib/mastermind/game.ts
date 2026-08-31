import type { ColorIndex, Feedback, Guess } from './types';

/** Number of pegs per guess and per solution. */
export const GUESS_LENGTH = 4;

/**
 * Generates the secret code to guess: `GUESS_LENGTH` random palette indices
 * in `[0, nColors)` (ported from `createGame` in the VanillaJS version).
 */
export function generateSolution(nColors: number): Guess {
  const solution: Guess = [];
  for (let i = 0; i < GUESS_LENGTH; i++) {
    solution.push(Math.floor(Math.random() * nColors));
  }
  return solution;
}

/** Returns a guess with all slots empty. */
export function makeEmptyGuess(): Guess {
  return Array.from({ length: GUESS_LENGTH }, () => -1);
}

/**
 * Builds the color palette as HSL strings (ported verbatim from `createGame`).
 * Note: the hue step uses `360 / nColors + 1`, matching the original formula.
 */
export function buildPalette(nColors: number): string[] {
  const colors: string[] = [];
  for (let i = 0; i < nColors; i++) {
    colors.push(`hsl(${Math.ceil(i * (360 / nColors + 1))},80%,50%)`);
  }
  return colors;
}

/**
 * Computes the feedback for a guess against the secret code (ported from `check`).
 *
 * Returns `[exact, misplaced]` where:
 * - `exact`: pegs correct in color and position
 * - `misplaced`: pegs correct in color but in the wrong position
 *
 * Behavior preserved from the original: exact matches are marked first, then
 * each remaining guess color consumes a single matching target peg. The caller's
 * arrays are never mutated.
 */
export function check(target: Guess, guess: Guess): Feedback {
  const res: Feedback = [0, 0];
  const targetCopy: (ColorIndex | undefined)[] = [...target];
  const guessCopy: (ColorIndex | undefined)[] = [...guess];

  for (let i = 0; i < guessCopy.length; i++) {
    if (targetCopy[i] === guessCopy[i]) {
      targetCopy[i] = undefined;
      guessCopy[i] = undefined;
      res[0] += 1;
    }
  }

  for (let i = 0; i < guessCopy.length; i++) {
    if (guessCopy[i] !== undefined && targetCopy.includes(guessCopy[i])) {
      targetCopy[targetCopy.indexOf(guessCopy[i])] = undefined;
      res[1] += 1;
    }
  }

  return res;
}

/** True when every slot of the guess is filled (none left as -1). */
export function isCompleteGuess(guess: Guess): boolean {
  return guess.indexOf(-1) === -1;
}

/** True when the feedback means all pegs are correct in color and position. */
export function isWin(feedback: Feedback): boolean {
  return feedback[0] === GUESS_LENGTH;
}
