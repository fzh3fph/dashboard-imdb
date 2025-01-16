<script>
  // Importing necessary Svelte components for displaying ratings and genres graphs
  import Ratings from '../graphs/ratings.svelte'; 
  import RatingsAll from '../graphs/ratings_all.svelte'; 
  import Genre from '../graphs/genre.svelte'; 
  import GenreAll from '../graphs/genre_all.svelte'; 

  // Importing base path configuration from the app's paths
  import { base } from '$app/paths';

  // Getting data passed via props
  let { data } = $props();

  // Initial state setup for the current graph type and associated text
  let currentGraphType = $state('Ratings'); // Start with Ratings graph by default
  let currentText = $state('Comparing Average Rating per Year for Movies'); // Default text

  // Function to switch between graph types and their corresponding text
  function switchGraph() {
    // Conditional text change based on the selected graph type
    if (currentGraphType === 'Ratings') {
      currentGraphType = 'Genres'
      currentText = 'Comparing Genre Distribution of Movies'; // Text for Genres
    } else if (currentGraphType === 'Genres') {
      currentGraphType = 'Ratings'
      currentText = 'Comparing Average Rating per Year for Movies';
    }
  }
</script>

<style>
  /* Resetting default margin and padding for all elements */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* Global body styling for consistent layout and appearance */
  :global(body) {
    margin: 0;
    font-family: 'Roboto', sans-serif; /* Modern font */
    background-color: #1e1e1e; /* Dark background */
    color: #f0f0f0; /* Light text color */
    display: flex;
    flex-direction: column; /* Stack content vertically */
    align-items: center;
    justify-content: center;
    height: 100vh; /* Full viewport height */
  }

  /* Flexbox container to center the content vertically and horizontally */
  .container {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100vh; /* Ensure full height */
  }

  /* Top section style - aligning the graphs side by side */
  .top {
    display: flex;
    flex-direction: row; /* Horizontal layout */
    padding: 10px;
    align-items: flex-start; /* Align content at the top */
  }

  /* Bottom section for graph controls and additional content */
  .bottom {
    display: flex;
    flex: 1; /* Fill available space */
    padding: 10px;
    align-items: flex-start; /* Align items to the top */
  }

  /* Styling for individual sections inside the container */
  .top-section {
    display: flex;
    flex-direction: column; /* Stack graph title and content vertically */
    align-items: center;
    padding: 20px;
  }

  .bottom-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start; /* Align content to top */
    align-items: center;
  }

  .bottom-left {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start; /* Align items to left */
    padding: 15px;
  }

  /* Header styling */
  .header {
    display: flex;
    align-items: center;
    padding: 20px;
  }

  /* Styling for the logo image in the header */
  .header img {
    height: 50px;
    width: 50px;
    margin-right: 20px;
  }

  /* Main title styling */
  .header h1 {
    font-size: 40px;
    margin: 0;
    text-shadow: 4px 4px 1px rgba(255, 255, 255, 0.2); /* Subtle text shadow */
  }

  /* Subtitle styling for graph sections */
  .top-section h3 {
    font-size: 24px;
    margin: 0;
    text-shadow: 2px 2px 1px rgba(255, 255, 255, 0.2); /* Subtle shadow effect */
    padding: 5px;
  }

  /* Styling for h3 elements in the bottom-right section */
  .bottom-right h3 {
    font-size: 30px;
    margin: 0;
    text-shadow: 2px 2px 1px rgba(255, 255, 255, 0.2); /* Subtle shadow effect */
    padding: 5px;
  }

  .button-container-left {
      display: flex;
      justify-content: center;
      gap: 10px; /* Space between buttons */
      padding-top: 180px;
      padding-left: 100px;
  }
  .button-container-right {
      display: flex;
      justify-content: center;
      gap: 10px; /* Space between buttons */
      padding-top: 180px;
      padding-right: 100px;
  }

  .button {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100px;
      height: 100px;
      font-size: calc(80px * 0.6);
      color: gray;
      background: none;
      border: none;
      cursor: pointer;
      outline: none;
  }

  .button:hover {
      color: #505050; /* Change color on hover */
  }

  .button:active {
      transform: scale(0.8); /* Slight shrink effect on click */
  }

  /* Button styling */
  .btn {
    background-color: #007aff; /* Primary blue color */
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    margin-bottom: 10px; /* Space between buttons */
  }

  /* Hover effect for buttons */
  .btn:hover {
    background-color: #005bb5; /* Darker blue on hover */
  }

  /* Styling for text bubbles that contain explanatory text */
  .bubble {
    background-color: #404040; /* Lighter gray for the bubble */
    color: white;
    padding: 15px; /* Set padding to 15px */
    border-radius: 15px;
    font-size: 18px;
    max-width: 600px;
    word-wrap: break-word;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1); /* Soft shadow around bubble */
    margin-bottom: 15px; /* Space between bubble and buttons */
  }
</style>

<!-- Main container for content -->
<div class="container">
  <!-- Header with logo and main title -->
  <div class="header">
    <img src="camera.png" alt="Logo">
    <h1>Netflix vs Apple vs Amazon</h1>
  </div>

  <!-- Bottom section with control buttons and all graph view -->
  <div class="bottom">
    <!-- Left Section for control buttons and explanatory text 
    <div class="bottom-left">
      <div class="bubble">
        {currentText} 
      </div>
      
      <div><button class="btn" on:click={() => switchGraph('Ratings')}>Ratings</button></div>
      <div><button class="btn" on:click={() => switchGraph('Genres')}>Genres</button></div>
    </div>-->

    <div class="button-container-left"><button class="button" on:click={() => switchGraph()}>&lt;</button></div>

    <!-- Right Section for 'All' graphs (aggregated data) -->
    <div class="bottom-right">
      <h3>All</h3> <!-- Title for All graphs -->
      {#if currentGraphType === 'Ratings'}
        <!-- Show ratings graph for all movies -->
        <RatingsAll datapoints1={data.netflix_all_avg_rating} datapoints2={data.netflix_movies_avg_rating} datapoints3={data.netflix_tv_avg_rating} year="releaseYear" rating="average_rating" />
      {:else}
        <!-- Show genre distribution graph for all movies -->
        <GenreAll datapoints={data.netflix_movies_genres} genre="genre" count="count" />
      {/if}
    </div>

    <div class="button-container-right"><button class="button" on:click={() => switchGraph()}>&gt;</button></div>
  </div>

  <!-- Top section for displaying the individual graphs for Netflix, Apple, and Amazon -->
  <div class="top">
    <!-- Netflix Section -->
    <div class="top-section">
      <h3>Netflix</h3> <!-- Netflix title -->
      {#if currentGraphType === 'Ratings'}
        <!-- Show ratings graph for Netflix -->
        <Ratings datapoints={data.netflix_movies_avg_rating} year="releaseYear" rating="average_rating" />
      {:else}
        <!-- Show genre distribution graph for Netflix -->
        <Genre datapoints={data.netflix_movies_genres} genre="genre" count="count" />
      {/if}
    </div>

    <!-- Apple Section -->
    <div class="top-section">
      <h3>Apple</h3> <!-- Apple title -->
      {#if currentGraphType === 'Ratings'}
        <!-- Show ratings graph for Apple -->
        <Ratings datapoints={data.apple_movies_avg_rating} year="releaseYear" rating="average_rating" />
      {:else}
        <!-- Show genre distribution graph for Apple -->
        <Genre datapoints={data.apple_movies_genres} genre="genre" count="count" />
      {/if}
    </div>

    <!-- Amazon Section -->
    <div class="top-section">
      <h3>Amazon</h3> <!-- Amazon title -->
      {#if currentGraphType === 'Ratings'}
        <!-- Show ratings graph for Amazon -->
        <Ratings datapoints={data.amazon_movies_avg_rating} year="releaseYear" rating="average_rating" />
      {:else}
        <!-- Show genre distribution graph for Amazon -->
        <Genre datapoints={data.amazon_movies_genres} genre="genre" count="count" />
      {/if}
    </div>
  </div>

  
</div>
