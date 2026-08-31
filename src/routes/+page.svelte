<script lang="ts">
  import type { Attachment } from "svelte/attachments";
  import { resolve } from "$app/paths";
  import TargetCursor from "$lib/components/TargetCursor.svelte";
  import { GUESS_LENGTH, isCompleteGuess } from "$lib/mastermind/game";
  import { Game } from "$lib/mastermind/state.svelte";

  // import BorderGlow from '$lib/components/BorderGlow.svelte';

  const game = new Game();

  const colorCounts = [2, 3, 4, 5, 6, 7, 8, 9, 10];
  const slots = Array.from({ length: GUESS_LENGTH }, (_, i) => i);

  // BorderGlow (disattivato): configurazione del glow direzionale
  // const glowProps = {
  //   edgeSensitivity: 25,
  //   glowIntensity: 1.2,
  //   glowRadius: 7,
  //   colors: ['#FF8A4C', '#FFC18A', '#FF6B2C'] as string[]
  // } as const;

  const gameInProgress = $derived(game.started && !game.won);
  const canSubmit = $derived(gameInProgress && isCompleteGuess(game.currGuess));
  const canStartNewGame = $derived(!game.started || game.won);

  function resetSelectOnWin(startable: boolean): Attachment<HTMLSelectElement> {
    return (node) => {
      if (startable) node.selectedIndex = 0;
    };
  }

  function onColorCountChange(event: Event): void {
    const select = event.currentTarget as HTMLSelectElement;
    const count = Number(select.value);
    if (!Number.isInteger(count) || count < 2) return;
    game.start(count);
  }
</script>

<section class="game">
  <TargetCursor targetSelector=".dot, button, select" />

  <section class="setup">
    <label for="color-count">New game with</label>
    <select
      id="color-count"
      {@attach resetSelectOnWin(canStartNewGame)}
      onchange={onColorCountChange}
      disabled={!canStartNewGame}
    >
      <option value="0" selected disabled> choose the number of colors </option>
      {#each colorCounts as n (n)}
        <option value={n}>{n} colors</option>
      {/each}
    </select>
    <button
      type="button"
      class="new-game"
      disabled={!gameInProgress}
      onclick={() => game.start(0)}
    >
      New game
    </button>
  </section>

  {#if game.started}
    {#if game.moves.length}
      <ol class="history">
        {#each game.moves as move, moveIndex (moveIndex)}
          {@const feedback = move.feedback}
          <li class="move">
            <ol class="guess-row" aria-label="Guess {moveIndex + 1}">
              {#each move.guess as colorIndex, i (i)}
                <li
                  class="dot"
                  style:background-color={game.palette[colorIndex]}
                  aria-label="Guess {moveIndex + 1}, slot {i + 1}: {colorIndex +
                    1}"
                ></li>
              {/each}
            </ol>
            <ol
              class="feedback"
              aria-label="Feedback for guess {moveIndex + 1}"
            >
              {#each slots as _, i (i)}
                <li
                  class="peg"
                  class:exact={i < feedback[0]}
                  class:misplaced={i >= feedback[0] &&
                    i < feedback[0] + feedback[1]}
                  aria-hidden="true"
                ></li>
              {/each}
            </ol>
          </li>
        {/each}
      </ol>
    {/if}

    <section class="current" aria-label="Current guess">
      <div class="row">
        <ol class="guess-row">
          {#each slots as i (i)}
            <button
              type="button"
              class="dot slot"
              class:empty={game.currGuess[i] === -1}
              class:selected={game.selected === i}
              style:background-color={game.currGuess[i] !== -1
                ? game.palette[game.currGuess[i]]
                : undefined}
              aria-label="Guess slot {i + 1}{game.currGuess[i] !== -1
                ? `, color ${game.currGuess[i] + 1}`
                : ', empty'}"
              onclick={() => game.select(i)}
            ></button>
          {/each}
        </ol>
        <button
          type="button"
          class="submit"
          onclick={() => game.submit()}
          disabled={!canSubmit}
        >
          Check
        </button>
      </div>

      <ol class="palette">
        <li>
          <button
            type="button"
            class="dot clear"
            aria-label="Remove the color from the selected slot"
            onclick={() => game.setColor(-1)}
          >
            ✕
          </button>
        </li>
        {#each game.palette as color, i (i)}
          <li>
            <button
              type="button"
              class="dot"
              style:background-color={color}
              aria-label="Pick color {i + 1}"
              onclick={() => game.setColor(i)}
            ></button>
          </li>
        {/each}
      </ol>
    </section>

    {#if game.won}
      <section class="result" aria-live="polite" aria-label="You won">
        <p>
          You're a Mastermind! You found the combination in
          {game.attempts}
          {game.attempts === 1 ? "try" : "tries"}, using
          {game.nColors} colors!
        </p>
        <ol class="solution">
          {#each slots as i (i)}
            <li
              class="dot"
              style:background-color={game.palette[game.solution[i]]}
              aria-label="Solution slot {i + 1}"
            ></li>
          {/each}
        </ol>
      </section>
    {/if}
  {/if}

  <footer>
    <a href={resolve("/rules")}>How to play</a>
  </footer>
</section>

<style>
  .game {
    max-width: 30rem;
    margin: 0 auto;
    padding: 1.5rem 1rem;
    font-family: system-ui, sans-serif;
    line-height: 1.5;
  }

  .setup {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .dot {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 999px;
    border: 2px solid #6b7280;
    box-sizing: border-box;
    padding: 0;
  }

  button {
    cursor: pointer;
  }

  .guess-row {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    gap: 0.5rem;
  }

  .slot.empty {
    background: #e5e7eb;
  }

  .slot.selected {
    box-shadow: 0 0 0 3px #3b82f6;
  }

  .row {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .submit {
    padding: 0.375rem 0.75rem;
    border: 1px solid #374151;
    border-radius: 0.25rem;
    /*background: #f9fafb;*/
  }

  .submit:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .new-game {
    border: 1px solid #374151;
  }

  .new-game:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .palette {
    list-style: none;
    margin: 1rem 0 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .palette li {
    display: inline-flex;
  }

  .clear {
    background: #d1d5db;
    font-size: 0.75rem;
    line-height: 1;
    color: #374151;
  }

  .history {
    list-style: none;
    margin: 0 0 1rem;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  .move {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .feedback {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(2, auto);
    gap: 0.125rem;
  }

  .peg {
    width: 0.625rem;
    height: 0.625rem;
    border-radius: 999px;
    border: 1px solid #9ca3af;
  }

  .peg.exact {
    background: #df0e0e;
    border-color: #df0e0e;
  }

  .peg.misplaced {
    background: #ffffff;
    border-color: #df0e0e;
  }

  .result {
    margin-top: 1.5rem;
  }

  .solution {
    list-style: none;
    margin: 0.5rem 0 0;
    padding: 0;
    display: flex;
    gap: 0.5rem;
  }

  footer {
    margin-top: 2rem;
  }

  footer a {
    color: #6b7280;
  }
</style>
