// Core types for the Mastermind game logic.
//
// A guess/solution is a sequence of color indices into the palette.
// An empty slot is represented by -1 (never a valid palette index).

/** Index of a color in the game palette. */
export type ColorIndex = number;

/** A sequence of color indices; an empty slot is -1. */
export type Guess = ColorIndex[];

/**
 * Feedback for a guess against the secret code, in the form `[exact, misplaced]`:
 * - `exact`: number of pegs correct in color and position
 * - `misplaced`: number of pegs correct in color but wrong position
 */
export type Feedback = [number, number];
