<script>
  // Importing necessary Svelte components for displaying ratings and genres graphs
  import { fly, fade } from "svelte/transition";
  import { sineInOut } from "svelte/easing";

  import Ratings from "../graphs/ratings.svelte";
  import RatingsAll from "../graphs/ratings_all.svelte";
  import Genre from "../graphs/genre.svelte";
  import GenreAll from "../graphs/genre_all.svelte";
  import Releases from "../graphs/releases.svelte";
  import ReleasesAll from "../graphs/releases_all.svelte";

  // Importing base path configuration from the app's paths
  import { base } from "$app/paths";

  // Getting data passed via props
  let { data } = $props();

  let currentGraphType = $state("Ratings");
  let slideDirection = 1;

  function button_right() {
    slideDirection = 1;
    if (currentGraphType === "Ratings") {
      currentGraphType = "Genres";
    } else if (currentGraphType === "Genres") {
      currentGraphType = "Releases";
    } else if (currentGraphType === "Releases") {
      currentGraphType = "Ratings";
    }
    disableScrolling();
  }

  function button_left() {
    slideDirection = -1;
    if (currentGraphType === "Ratings") {
      currentGraphType = "Releases";
    } else if (currentGraphType === "Releases") {
      currentGraphType = "Genres";
    } else if (currentGraphType === "Genres") {
      currentGraphType = "Ratings";
    }
    disableScrolling();
  }

  import { onMount } from "svelte";

  let blurred = $state(true);

  onMount(() => {
    setTimeout(() => {
      blurred = false;
    }, 10); // Small delay to trigger transition
  });

  function disableScrolling() {
    document.body.style.overflow = "hidden"; // Disable scrolling

    setTimeout(() => {
      document.body.style.overflow = ""; // Restore scrolling
    }, 1000); // Enable scrolling after 1 second
  }
</script>

<svelte:head>
  <link
    href="https://fonts.googleapis.com/css2?family=Manrope&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="top-container" class:loaded={!blurred}>
  {#if currentGraphType === "Ratings"}
    <div
      class="navigate"
      onclick={() => button_left()}
      in:fly={{
        easing: sineInOut,
        delay: 400 - slideDirection * 100,
        x: slideDirection * 130,
        duration: 700,
      }}
    >
      <span class="button-lable left-img">Releases</span>
      <img class="left-img" src="releases.png" alt="Next" />
    </div>
  {:else if currentGraphType === "Genres"}
    <div
      class="navigate"
      onclick={() => button_left()}
      in:fly={{
        easing: sineInOut,
        delay: 400 - slideDirection * 100,
        x: slideDirection * 130,
        duration: 700,
      }}
    >
      <span class="button-lable left-img">Ratings</span>
      <img class="left-img" src="ratings.png" alt="Next" />
    </div>
  {:else}
    <div
      class="navigate"
      onclick={() => button_left()}
      in:fly={{
        easing: sineInOut,
        delay: 400 - slideDirection * 100,
        x: slideDirection * 130,
        duration: 700,
      }}
    >
      <span class="button-lable left-img">Genres</span>
      <img class="left-img" src="genres.png" alt="Next" />
    </div>
  {/if}

  <div class="main-graph-wrapper">
    {#key currentGraphType}
      <h3 in:fade={{ delay: 100, duration: 1300 }} out:fade={{ duration: 0 }}>
        {#if currentGraphType === "Ratings"}Average IMDb Rating by Release Year
        {:else if currentGraphType === "Genres"}Distribution of Most common
          Genres
        {:else}Volume of Released Content by Year
        {/if}
      </h3>
    {/key}

    <h4>
      <span style="color: #f986c5">Netlix</span> vs.
      <span style="color: #A0C4FF">Apple</span> vs.
      <span style="color: #90d5b0">Amazon</span>
    </h4>

    <div class="main-graph">
      {#key currentGraphType}
        <div
          class="graph-box"
          in:fly={{
            easing: sineInOut,
            delay: 400,
            x: slideDirection * 130,
            duration: 700,
          }}
          out:fly={{
            easing: sineInOut,
            x: slideDirection * -130,
            duration: 700,
          }}
        >
          {#if currentGraphType === "Ratings"}
            <RatingsAll
              datapoints1={data.netflix_both_avg_rating}
              datapoints2={data.apple_both_avg_rating}
              datapoints3={data.amazon_both_avg_rating}
              datapoints4={data.all_both_avg_rating}
              year="releaseYear"
              rating="average_rating"
            />
          {:else if currentGraphType === "Genres"}
            <GenreAll data={data.all_genres} />
          {:else}
            <ReleasesAll
              datapoints1={data.netflix_both_per_year}
              datapoints2={data.apple_both_per_year}
              datapoints3={data.amazon_both_per_year}
              datapoints4={data.all_both_per_year}
              year="releaseYear"
              rating="count"
            />
          {/if}
        </div>
      {/key}
    </div>
  </div>
  {#if currentGraphType === "Ratings"}
    <div
      class="navigate"
      onclick={() => button_right()}
      in:fly={{
        easing: sineInOut,
        delay: 400 + slideDirection * 100,
        x: slideDirection * 130,
        duration: 700,
      }}
    >
      <span class="button-lable right-img">Genres</span>
      <img class="right-img" src="genres.png" alt="Next" />
    </div>
  {:else if currentGraphType === "Genres"}
    <div
      class="navigate"
      onclick={() => button_right()}
      in:fly={{
        easing: sineInOut,
        delay: 400 + slideDirection * 100,
        x: slideDirection * 130,
        duration: 700,
      }}
    >
      <span class="button-lable right-img">Releases</span>
      <img class="right-img" src="releases.png" alt="Next" />
    </div>
  {:else}
    <div
      class="navigate"
      onclick={() => button_right()}
      in:fly={{
        easing: sineInOut,
        delay: 400 + slideDirection * 100,
        x: slideDirection * 130,
        duration: 700,
      }}
    >
      <span class="button-lable right-img">Ratings</span>
      <img class="right-img" src="ratings.png" alt="Next" />
    </div>
  {/if}
</div>

<div class="bottom-container" class:loaded={!blurred}>
  <div class="secondary-graph-wrapper">
    <h3>Netflix</h3>
    <!-- Netflix title -->
    <h4>
      <span style="color: #d3739d">Movies</span> vs.
      <span style="color: #fabdd9">TV</span>
    </h4>

    <div class="secondary-graph">
      {#key currentGraphType}
        <div
          class="graph-box"
          in:fly={{
            easing: sineInOut,
            delay: 400,
            x: slideDirection * 100,
            duration: 400,
          }}
          out:fly={{
            easing: sineInOut,
            x: slideDirection * -100,
            duration: 500,
          }}
        >
          {#if currentGraphType === "Ratings"}
            <Ratings
              datapoints1={data.netflix_both_avg_rating}
              datapoints2={data.netflix_movies_avg_rating}
              datapoints3={data.netflix_tv_avg_rating}
              color1="#d3739d"
              color2="#fabdd9"
              year="releaseYear"
              rating="average_rating"
              animationDelay="0.4"
            />
          {:else if currentGraphType === "Genres"}
            <Genre
              data={data.netflix_genres}
              color1="#d3739d"
              color2="#fabdd9"
              animationDelay="0.6"
            />
          {:else}
            <Releases
              data={data.netflix_movies_and_tv_per_year}
              color1="#d3739d"
              color2="#fabdd9"
              year="year"
              animationDelay="0.2"
            />
          {/if}
        </div>
      {/key}
    </div>
  </div>

  <div class="secondary-graph-wrapper">
    <h3>Apple</h3>
    <!-- Apple title -->
    <h4>
      <span style="color: #769dde">Movies</span> vs.
      <span style="color: #c0d6fc">TV</span>
    </h4>

    <div class="secondary-graph">
      {#key currentGraphType}
        <div
          class="graph-box"
          in:fly={{
            easing: sineInOut,
            delay: 550,
            x: slideDirection * 100,
            duration: 400,
          }}
          out:fly={{
            easing: sineInOut,
            delay: 150,
            x: slideDirection * -100,
            duration: 400,
          }}
        >
          {#if currentGraphType === "Ratings"}
            <Ratings
              datapoints1={data.apple_both_avg_rating}
              datapoints2={data.apple_movies_avg_rating}
              datapoints3={data.apple_tv_avg_rating}
              color1="#769dde"
              color2="#c0d6fc"
              year="releaseYear"
              rating="average_rating"
              animationDelay="0.6"
            />
          {:else if currentGraphType === "Genres"}
            <Genre
              data={data.apple_genres}
              color1="#769dde"
              color2="#c0d6fc"
              animationDelay="0.8"
            />
          {:else}
            <Releases
              data={data.apple_movies_and_tv_per_year}
              color1="#769dde"
              color2="#c0d6fc"
              year="year"
              animationDelay="0.5"
            />
          {/if}
        </div>
      {/key}
    </div>
  </div>

  <div class="secondary-graph-wrapper">
    <h3>Amazon</h3>
    <!-- Amazon title -->
    <h4>
      <span style="color: #64c491">Movies</span> vs.
      <span style="color: #b9e4cd">TV</span>
    </h4>

    <div class="secondary-graph">
      {#key currentGraphType}
        <div
          class="graph-box"
          in:fly={{
            easing: sineInOut,
            delay: 700,
            x: slideDirection * 100,
            duration: 400,
          }}
          out:fly={{
            easing: sineInOut,
            delay: 300,
            x: slideDirection * -100,
            duration: 400,
          }}
        >
          {#if currentGraphType === "Ratings"}
            <Ratings
              datapoints1={data.amazon_both_avg_rating}
              datapoints2={data.amazon_movies_avg_rating}
              datapoints3={data.amazon_tv_avg_rating}
              color1="#64c491"
              color2="#b9e4cd"
              year="releaseYear"
              rating="average_rating"
              animationDelay="0.8"
            />
          {:else if currentGraphType === "Genres"}
            <Genre
              data={data.amazon_genres}
              color1="#64c491"
              color2="#b9e4cd"
              animationDelay="1.0"
            />
          {:else}
            <Releases
              data={data.amazon_movies_and_tv_per_year}
              color1="#64c491"
              color2="#b9e4cd"
              year="year"
              animationDelay="0.8"
            />
          {/if}
        </div>
      {/key}
    </div>
  </div>
</div>

<footer>
  <p>
    © 2025 Frederick Phillips \ Dataset by
    <a href="https://www.kaggle.com/octopusteam" target="_blank">OctopusTeam</a>
  </p>
</footer>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :global(body) {
    font-family: "Manrope", sans-serif;
    background-color: #1e1e1e;
    color: #f0f0f0;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: auto; /* Allows content to scroll if absolutely necessary */
  }

  .top-container {
    flex: 1;
    display: flex;
    justify-content: center;
    gap: 20px;
    padding: 0 10px;
    padding-left: 12%;
    padding-right: 12%;
  }

  .navigate {
    flex: 0 0 15%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    cursor: pointer;
  }

  .navigate img {
    max-width: 100%;
    max-height: 100%;
    opacity: 0.2;
    filter: grayscale(100%);
    transform: scale(1.2);
    transition:
      transform 0.3s ease,
      opacity 0.3s ease,
      filter 0.3s ease;
  }

  .navigate .right-img {
    margin-left: 70%;
  }

  .navigate .left-img {
    margin-right: 70%;
  }

  .navigate:hover img {
    transform: scale(1.3);
    opacity: 0.8;
    filter: grayscale(50%);
  }

  .main-graph-wrapper {
    flex: 1;
    position: relative;
    flex-direction: column;
    align-content: center;
  }

  .main-graph {
    flex: 0.8;
    position: relative;
  }

  .bottom-container {
    flex: 0 0 20%;
    display: flex;
    justify-content: center;
    gap: 50px;
    padding-top: 25px;
    padding-left: 15%;
    padding-right: 15%;
  }

  .secondary-graph-wrapper {
    flex: 1;
    position: relative;
    flex-direction: column;
  }

  .secondary-graph {
    flex: 1;
    position: relative;
  }

  .graph-box {
    background-color: #404040;
    border-radius: 15px; /* Slightly more rounded corners for the effect */
    width: 100%;
    height: 100%;
    position: relative;
    box-shadow:
      inset -8px -8px 15px rgba(0, 0, 0, 0.3),
      /* Inset shadow for depth */ inset 8px 8px 15px rgba(255, 255, 255, 0.05),
      /* Light highlight shadow */ 8px 8px 15px rgba(0, 0, 0, 0.35); /* Outer shadow for pop-out effect */
  }

  footer {
    padding-top: 25px;
    text-align: right;
    font-style: italic;
    font-size: 0.7em;
    padding-right: 1%;
    color: gray;
    opacity: 0.7;
  }

  /* Aspect ratio maintenance */
  .main-graph::after {
    content: "";
    display: block;
    padding-bottom: 41.25%; /* 330/800 aspect ratio */
  }

  .secondary-graph::after {
    content: "";
    display: block;
    padding-bottom: 55%; /* 185/336 aspect ratio */
  }

  .graph-box {
    position: absolute;
    top: 20;
    left: 20;
    right: 20;
    bottom: 20;
  }

  .main-graph {
    aspect-ratio: 800/330;
  }
  .secondary-graph {
    aspect-ratio: 336/185;
  }

  h3 {
    text-align: center;
    padding-bottom: 2px;
  }

  h4 {
    text-align: center;
    padding-bottom: 5px;
  }

  .main-graph-wrapper h3 {
    font-size: 200%;
    padding-top: 2%;
  }
  .main-graph-wrapper h4 {
    padding-bottom: 20px;
  }
  .secondary-graph-wrapper h4 {
    font-size: 80%;
  }

  .bottom-container,
  .top-container {
    filter: blur(10px);
    opacity: 0;
    transition:
      filter 0.3s ease-out,
      opacity 0.3s ease-out;
  }

  .bottom-container.loaded,
  .top-container.loaded {
    filter: blur(0);
    opacity: 1;
  }

  .button-lable {
    padding-top: 40%;
    padding-bottom: 15px;
    font-weight: bold;
    color: lightgray;
    font-size: 18px;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    pointer-events: none; /* Prevent interference with hover */
  }

  .navigate:hover .button-lable {
    opacity: 1;
  }
</style>
