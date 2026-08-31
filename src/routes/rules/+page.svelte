<script lang="ts">
  import { resolve } from "$app/paths";
</script>

<svelte:head>
  <title>Rules · Mastermind</title>
</svelte:head>

<main class="rules">
  <p>
    <a href={resolve("/")}>&larr; Back to the game</a>
  </p>

  <h1>Are you the <i>main mind</i>?</h1>

  <p>
    The original
    <a
      href="https://en.wikipedia.org/wiki/Mastermind_(board_game)"
      target="_blank"
      rel="noreferrer"><i>Mastermind</i></a
    >
    is essentially a code-breaking game for two players (here one is the computer).
    The game selects some random colors (choose how many in the new game menu). Your
    goal is to guess what the game randomly chose!
  </p>

  <h2>How?</h2>

  <p>
    Before you there are 4 empty slots: click them to choose your color
    combination, then submit with the button on the right. The computer gives
    you an answer through 4 smaller dots beside your previous guess:
  </p>

  <ul>
    <li><i>Red dot(s)</i>: you positioned well that many colors.</li>
    <li>
      <i>White dot(s)</i>: you chose well that many colors (but in the wrong
      position).
    </li>
  </ul>

  <h2>Examples</h2>

  <ul>
    <li>
      If you get 4 white dots, that means you only have to rearrange the colors
      of your last guess.
    </li>
    <li>If you get 4 red dots... you won! You're a Mastermind!</li>
  </ul>

  <h2>Credits</h2>

  <p>
    This game is a port in svelte of the previous
    <a href="https://flowin.space/jastersind" target="_blank" rel="noreferrer"
      >Jaster Sind</a
    >, a simple JavaScript rewriting of the original game. Its source code is
    licensed with
    <a
      href="https://www.gnu.org/licenses/agpl-3.0.en.html"
      target="_blank"
      rel="noreferrer">AGPLv3</a
    >, a free license.
  </p>
</main>

<style>
  .rules {
    max-width: 30rem;
    margin: 0 auto;
    padding: 1.5rem 1rem;
    font-family: system-ui, sans-serif;
    line-height: 1.5;
  }

  h1,
  h2 {
    line-height: 1.2;
  }
</style>
