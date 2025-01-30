<script>
  // Importing necessary Svelte components for displaying ratings and genres graphs
  import Ratings from '../graphs/ratings.svelte'; 
  import RatingsAll from '../graphs/ratings_all.svelte'; 
  import Genre from '../graphs/genre.svelte'; 
  import GenreAll from '../graphs/genre_all.svelte'; 

  import ReleasesAll from '../graphs/releases_all.svelte'; 

  // Importing base path configuration from the app's paths
  import { base } from '$app/paths';

  // Getting data passed via props
  let { data } = $props();

  let currentGraphType = $state('Ratings'); 

  function button_right() {
    if (currentGraphType === 'Ratings') { currentGraphType = 'Genres' } 
    else if (currentGraphType === 'Genres') { currentGraphType = 'Releases' }
    else if (currentGraphType === 'Releases') { currentGraphType = 'Ratings' }
  }

  function button_left() {
    if (currentGraphType === 'Ratings') { currentGraphType = 'Releases' } 
    else if (currentGraphType === 'Releases') { currentGraphType = 'Genres' }
    else if (currentGraphType === 'Genres') { currentGraphType = 'Ratings' }
  }


</script>

<style>
  * {
      margin: 0;
      padding: 0;
      box-sizing: border-box; 
  }

  :global(body) {
      font-family: 'Roboto', sans-serif;
      background-color: #1e1e1e;
      color: #f0f0f0;
      height: 100vh;
      display: flex;
      gap: 20px;
      flex-direction: column;
      overflow-y: auto; /* Allows content to scroll if absolutely necessary */
  }

  .top-container {
      flex: 1.0;
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
      justify-content: center;
      cursor: pointer;
  }

  .navigate img {
      padding-top: 50%;
      max-width: 40%;
      max-height: 40%;
      opacity: 0.5;
      transition: transform 0.3s ease, opacity 0.3s ease;
  }

  .navigate img:hover {
      transform: scale(1.1);
      opacity: 1;
  }

  .main-graph-wrapper {
      flex: 1.0;
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
      padding-top: 5px;
      padding-left: 15%;
      padding-right: 15%;
  }

  .secondary-graph-wrapper {
      flex: 1.0;
      position: relative;
      flex-direction: column;
  }

  .secondary-graph {
      flex: 1.0;
      position: relative;
  }

  .graph-box {
      background-color: #404040;
      border-radius: 10px;
      width: 100%;
      height: 100%;
  }

  footer {
      text-align: right;
      font-size: 0.8em;
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

  .main-graph { aspect-ratio: 800/330; }
  .secondary-graph { aspect-ratio: 336/185; }

  h3 { 
    text-align: center; 
    padding-bottom: 2px; 
  }

  h4 { 
    text-align: center; 
    padding-bottom: 5px; 
  }

  .main-graph-wrapper h3 {font-size: 200%;}
  .main-graph-wrapper h4 {padding-bottom: 20px;}
  .secondary-graph-wrapper h4 {font-size: 80%;}


  .graph-box img {
      max-width: 99%;
      max-height: 99%;
      padding: 1%;
  }

</style>

    
    <div class="top-container">

        {#if currentGraphType === 'Ratings'}
          <div class="navigate" onclick={() => button_left()}><img src="bar-chart.png" alt="Next"></div>
        {:else if currentGraphType === 'Genres'}
          <div class="navigate"  onclick={() => button_left()}  >
           <img src="line-graph.png" alt="Next">
          </div>        
        {:else}
          <div class="navigate" onclick={() => button_left()}><img src="donut-chart.png" alt="Next"></div>
        {/if}
        
        <div class="main-graph-wrapper">
          
          {#if currentGraphType === 'Ratings'}
            <h3>Average IMDb Rating by Release Year</h3>
            <h4>
              <span style="color: #A0C4FF">Netlix</span> vs. 
              <span style="color: #fc90ac">Apple</span> vs. 
              <span style="color: #CAFFBF">Amazon</span>
            </h4>
          {:else if currentGraphType === 'Genres'}
            <h3>Most common Genres</h3>
            <h4>
              <span >Netlix</span> vs. 
              <span >Apple</span> vs. 
              <span >Amazon</span>
            </h4>          
          {:else}
            <h3>Volume of Released Content by Year</h3>
            <h4>
              <span style="color: #A0C4FF">Netlix</span> vs. 
              <span style="color: #fc90ac">Apple</span> vs. 
              <span style="color: #CAFFBF">Amazon</span>
            </h4>          
          {/if}

          <div class="main-graph">
            <div class="graph-box">


              {#if currentGraphType === 'Ratings'}
               <RatingsAll 
                datapoints1={data.netflix_both_avg_rating} 
                datapoints2={data.apple_both_avg_rating} 
                datapoints3={data.amazon_both_avg_rating} 
                datapoints4={data.all_both_avg_rating} 
                year="releaseYear" rating="average_rating" 
               />

              {:else if currentGraphType === 'Genres'}
                <img src="genres_all.png">

              {:else}
                <ReleasesAll 
                datapoints1={data.netflix_both_per_year} 
                datapoints2={data.apple_both_per_year} 
                datapoints3={data.amazon_both_per_year} 
                datapoints4={data.all_both_per_year} 
                year="releaseYear" rating="count" 
                />
              {/if}


            </div>
          </div>

        </div>

        {#if currentGraphType === 'Ratings'}
          <div class="navigate" onclick={() => button_right()}><img src="donut-chart.png" alt="Next"></div>
        {:else if currentGraphType === 'Genres'}
          <div class="navigate" onclick={() => button_right()}><img src="bar-chart.png" alt="Next"></div>
        {:else}
          <div class="navigate" onclick={() => button_right()}><img src="line-graph.png" alt="Next"></div>
        {/if}

        
    </div>

    <div class="bottom-container">

      <div class="secondary-graph-wrapper">
        
        <h3>Netflix</h3> <!-- Netflix title -->
        <h4><span style="color: #769dde">Movies</span> vs. <span style="color: #c0d6fc">TV</span></h4>
  
        <div class="secondary-graph">
            <div class="graph-box">

              {#if currentGraphType === 'Ratings'}

                <Ratings datapoints1={data.netflix_both_avg_rating} 
                datapoints2={data.netflix_movies_avg_rating} 
                datapoints3={data.netflix_tv_avg_rating} 
                color1="#769dde"
                color2="#c0d6fc" 
                year="releaseYear" rating="average_rating" />

              {:else if currentGraphType === 'Genres'}
                <Genre datapoints={data.netflix_movies_genres} genre="genre" count="count" />

              {:else}
                <img src="releases_netflix.png">
              {/if}

            </div>
        </div>
      </div>

      <div class="secondary-graph-wrapper">

        <h3>Apple</h3> <!-- Apple title -->
        <h4><span style="color: #fc90ac">Movies</span> vs. <span style="color: #ffc2d2">TV</span></h4> 

        <div class="secondary-graph">
            <div class="graph-box">

              {#if currentGraphType === 'Ratings'}
                <Ratings datapoints1={data.apple_both_avg_rating} 
                datapoints2={data.apple_movies_avg_rating} 
                datapoints3={data.apple_tv_avg_rating} 
                color1="#fc90ac"
                color2="#ffc2d2"
                year="releaseYear" rating="average_rating" /> 

              {:else if currentGraphType === 'Genres'}
                <Genre datapoints={data.apple_movies_genres} genre="genre" count="count" />

              {:else}
                <img src="releases_apple.png">
              {/if}

            </div>
        </div>
      </div>

      <div class="secondary-graph-wrapper">

        <h3>Amazon</h3> <!-- Amazon title -->
        <h4><span style="color: #abff99">Movies</span> vs. <span style="color: #d5ffcc">TV</span></h4>
  
        <div class="secondary-graph">
            <div class="graph-box">

              {#if currentGraphType === 'Ratings'}
                <Ratings datapoints1={data.amazon_both_avg_rating} 
                datapoints2={data.amazon_movies_avg_rating} 
                datapoints3={data.amazon_tv_avg_rating} 
                color1="#abff99"
                color2="#d5ffcc"
                year="releaseYear" rating="average_rating" />

              {:else if currentGraphType === 'Genres'}
                <Genre datapoints={data.amazon_movies_genres} genre="genre" count="count" />

              {:else}
                <img src="releases_amazon.png">
              {/if}

            </div>
        </div>
      </div>
      
    </div>

    <footer>© 2025 Frederick Phillips</footer>