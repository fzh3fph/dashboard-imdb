// +page.js
export const prerender = true;

import Papa from 'papaparse';
import { base } from '$app/paths';

export async function load({ fetch, params }) {
    // Combined all platforms' movie and TV ratings
    const all_both_avg_rating_CSV = await fetch(base + '/data/data_processed/all_both_avg_rating.csv', {headers: {'Content-Type': 'text/csv'}});
    let all_both_avg_rating_TextCSV = await all_both_avg_rating_CSV.text();
    let all_both_avg_rating_ParsedCSV = Papa.parse(all_both_avg_rating_TextCSV, {header: true});

    // Netflix combined movie and TV ratings
    const netflix_both_avg_rating_CSV = await fetch(base + '/data/data_processed/netflix_both_avg_rating.csv', {headers: {'Content-Type': 'text/csv'}});
    let netflix_both_avg_rating_TextCSV = await netflix_both_avg_rating_CSV.text();
    let netflix_both_avg_rating_ParsedCSV = Papa.parse(netflix_both_avg_rating_TextCSV, {header: true});

    // Apple combined movie and TV ratings
    const apple_both_avg_rating_CSV = await fetch(base + '/data/data_processed/apple_both_avg_rating.csv', {headers: {'Content-Type': 'text/csv'}});
    let apple_both_avg_rating_TextCSV = await apple_both_avg_rating_CSV.text();
    let apple_both_avg_rating_ParsedCSV = Papa.parse(apple_both_avg_rating_TextCSV, {header: true});

    // Amazon combined movie and TV ratings
    const amazon_both_avg_rating_CSV = await fetch(base + '/data/data_processed/amazon_both_avg_rating.csv', {headers: {'Content-Type': 'text/csv'}});
    let amazon_both_avg_rating_TextCSV = await amazon_both_avg_rating_CSV.text();
    let amazon_both_avg_rating_ParsedCSV = Papa.parse(amazon_both_avg_rating_TextCSV, {header: true});

    // Netflix movie ratings
    const netflix_movies_avg_rating_CSV = await fetch(base + '/data/data_processed/netflix_movies_avg_rating.csv', {headers: {'Content-Type': 'text/csv'}})
    let netflix_movies_avg_rating_TextCSV = await netflix_movies_avg_rating_CSV.text()
    let netflix_movies_avg_rating_ParsedCSV = Papa.parse(netflix_movies_avg_rating_TextCSV, {header: true})
  
    // Apple movie ratings
    const apple_movies_avg_rating_CSV = await fetch(base + '/data/data_processed/apple_movies_avg_rating.csv', {headers: {'Content-Type': 'text/csv'}})
    let apple_movies_avg_rating_TextCSV = await apple_movies_avg_rating_CSV.text()
    let apple_movies_avg_rating_ParsedCSV = Papa.parse(apple_movies_avg_rating_TextCSV, {header: true})
  
    // Amazon movie ratings
    const amazon_movies_avg_rating_CSV = await fetch(base + '/data/data_processed/amazon_movies_avg_rating.csv', {headers: {'Content-Type': 'text/csv'}})
    let amazon_movies_avg_rating_TextCSV = await amazon_movies_avg_rating_CSV.text()
    let amazon_movies_avg_rating_ParsedCSV = Papa.parse(amazon_movies_avg_rating_TextCSV, {header: true})
  
    // Netflix movie genres
    const netflix_movies_genres_CSV = await fetch(base + '/data/data_processed/netflix_movies_genres.csv', {headers: {'Content-Type': 'text/csv'}})
    let netflix_movies_genres_TextCSV = await netflix_movies_genres_CSV.text()
    let netflix_movies_genres_ParsedCSV = Papa.parse(netflix_movies_genres_TextCSV, {header: true})
  
    // Apple movie genres
    const apple_movies_genres_CSV = await fetch(base + '/data/data_processed/apple_movies_genres.csv', {headers: {'Content-Type': 'text/csv'}})
    let apple_movies_genres_TextCSV = await apple_movies_genres_CSV.text()
    let apple_movies_genres_ParsedCSV = Papa.parse(apple_movies_genres_TextCSV, {header: true})
  
    // Amazon movie genres
    const amazon_movies_genres_CSV = await fetch(base + '/data/data_processed/amazon_movies_genres.csv', {headers: {'Content-Type': 'text/csv'}})
    let amazon_movies_genres_TextCSV = await amazon_movies_genres_CSV.text()
    let amazon_movies_genres_ParsedCSV = Papa.parse(amazon_movies_genres_TextCSV, {header: true})
  
    // Netflix movies per year
    const netflix_movies_per_year_CSV = await fetch(base + '/data/data_processed/netflix_movies_per_year.csv', {headers: {'Content-Type': 'text/csv'}})
    let netflix_movies_per_year_TextCSV = await netflix_movies_per_year_CSV.text()
    let netflix_movies_per_year_ParsedCSV = Papa.parse(netflix_movies_per_year_TextCSV, {header: true})
  
    // Apple movies per year
    const apple_movies_per_year_CSV = await fetch(base + '/data/data_processed/apple_movies_per_year.csv', {headers: {'Content-Type': 'text/csv'}})
    let apple_movies_per_year_TextCSV = await apple_movies_per_year_CSV.text()
    let apple_movies_per_year_ParsedCSV = Papa.parse(apple_movies_per_year_TextCSV, {header: true})
  
    // Amazon movies per year
    const amazon_movies_per_year_CSV = await fetch(base + '/data/data_processed/amazon_movies_per_year.csv', {headers: {'Content-Type': 'text/csv'}})
    let amazon_movies_per_year_TextCSV = await amazon_movies_per_year_CSV.text()
    let amazon_movies_per_year_ParsedCSV = Papa.parse(amazon_movies_per_year_TextCSV, {header: true})
  
    // Netflix TV ratings
    const netflix_tv_avg_rating_CSV = await fetch(base + '/data/data_processed/netflix_tv_avg_rating.csv', {headers: {'Content-Type': 'text/csv'}})
    let netflix_tv_avg_rating_TextCSV = await netflix_tv_avg_rating_CSV.text()
    let netflix_tv_avg_rating_ParsedCSV = Papa.parse(netflix_tv_avg_rating_TextCSV, {header: true})
  
    // Apple TV ratings
    const apple_tv_avg_rating_CSV = await fetch(base + '/data/data_processed/apple_tv_avg_rating.csv', {headers: {'Content-Type': 'text/csv'}})
    let apple_tv_avg_rating_TextCSV = await apple_tv_avg_rating_CSV.text()
    let apple_tv_avg_rating_ParsedCSV = Papa.parse(apple_tv_avg_rating_TextCSV, {header: true})
  
    // Amazon TV ratings
    const amazon_tv_avg_rating_CSV = await fetch(base + '/data/data_processed/amazon_tv_avg_rating.csv', {headers: {'Content-Type': 'text/csv'}})
    let amazon_tv_avg_rating_TextCSV = await amazon_tv_avg_rating_CSV.text()
    let amazon_tv_avg_rating_ParsedCSV = Papa.parse(amazon_tv_avg_rating_TextCSV, {header: true})
  
    // Netflix TV genres
    const netflix_tv_genres_CSV = await fetch(base + '/data/data_processed/netflix_tv_genres.csv', {headers: {'Content-Type': 'text/csv'}})
    let netflix_tv_genres_TextCSV = await netflix_tv_genres_CSV.text()
    let netflix_tv_genres_ParsedCSV = Papa.parse(netflix_tv_genres_TextCSV, {header: true})
  
    // Apple TV genres
    const apple_tv_genres_CSV = await fetch(base + '/data/data_processed/apple_tv_genres.csv', {headers: {'Content-Type': 'text/csv'}})
    let apple_tv_genres_TextCSV = await apple_tv_genres_CSV.text()
    let apple_tv_genres_ParsedCSV = Papa.parse(apple_tv_genres_TextCSV, {header: true})
  
    // Amazon TV genres
    const amazon_tv_genres_CSV = await fetch(base + '/data/data_processed/amazon_tv_genres.csv', {headers: {'Content-Type': 'text/csv'}})
    let amazon_tv_genres_TextCSV = await amazon_tv_genres_CSV.text()
    let amazon_tv_genres_ParsedCSV = Papa.parse(amazon_tv_genres_TextCSV, {header: true})
  
    // Netflix TV per year
    const netflix_tv_per_year_CSV = await fetch(base + '/data/data_processed/netflix_tv_per_year.csv', {headers: {'Content-Type': 'text/csv'}})
    let netflix_tv_per_year_TextCSV = await netflix_tv_per_year_CSV.text()
    let netflix_tv_per_year_ParsedCSV = Papa.parse(netflix_tv_per_year_TextCSV, {header: true})
  
    // Apple TV per year
    const apple_tv_per_year_CSV = await fetch(base + '/data/data_processed/apple_tv_per_year.csv', {headers: {'Content-Type': 'text/csv'}})
    let apple_tv_per_year_TextCSV = await apple_tv_per_year_CSV.text()
    let apple_tv_per_year_ParsedCSV = Papa.parse(apple_tv_per_year_TextCSV, {header: true})
  
    // Amazon TV per year
    const amazon_tv_per_year_CSV = await fetch(base + '/data/data_processed/amazon_tv_per_year.csv', {headers: {'Content-Type': 'text/csv'}})
    let amazon_tv_per_year_TextCSV = await amazon_tv_per_year_CSV.text()
    let amazon_tv_per_year_ParsedCSV = Papa.parse(amazon_tv_per_year_TextCSV, {header: true})

    // All Both per Year
    const all_both_per_year_CSV = await fetch(base + '/data/data_processed/all_both_per_year.csv', {headers: {'Content-Type': 'text/csv'}});
    let all_both_per_year_TextCSV = await all_both_per_year_CSV.text();
    let all_both_per_year_ParsedCSV = Papa.parse(all_both_per_year_TextCSV, {header: true});

    // Netflix Both per Year
    const netflix_both_per_year_CSV = await fetch(base + '/data/data_processed/netflix_both_per_year.csv', {headers: {'Content-Type': 'text/csv'}});
    let netflix_both_per_year_TextCSV = await netflix_both_per_year_CSV.text();
    let netflix_both_per_year_ParsedCSV = Papa.parse(netflix_both_per_year_TextCSV, {header: true});

    // Apple Both per Year
    const apple_both_per_year_CSV = await fetch(base + '/data/data_processed/apple_both_per_year.csv', {headers: {'Content-Type': 'text/csv'}});
    let apple_both_per_year_TextCSV = await apple_both_per_year_CSV.text();
    let apple_both_per_year_ParsedCSV = Papa.parse(apple_both_per_year_TextCSV, {header: true});

    // Amazon Both per Year
    const amazon_both_per_year_CSV = await fetch(base + '/data/data_processed/amazon_both_per_year.csv', {headers: {'Content-Type': 'text/csv'}});
    let amazon_both_per_year_TextCSV = await amazon_both_per_year_CSV.text();
    let amazon_both_per_year_ParsedCSV = Papa.parse(amazon_both_per_year_TextCSV, {header: true});

  
    return { 
      all_both_avg_rating: all_both_avg_rating_ParsedCSV.data,

      netflix_both_avg_rating: netflix_both_avg_rating_ParsedCSV.data,
      apple_both_avg_rating: apple_both_avg_rating_ParsedCSV.data,
      amazon_both_avg_rating: amazon_both_avg_rating_ParsedCSV.data,

      netflix_movies_avg_rating: netflix_movies_avg_rating_ParsedCSV.data,
      apple_movies_avg_rating: apple_movies_avg_rating_ParsedCSV.data,
      amazon_movies_avg_rating: amazon_movies_avg_rating_ParsedCSV.data,
  
      netflix_movies_genres: netflix_movies_genres_ParsedCSV.data,
      apple_movies_genres: apple_movies_genres_ParsedCSV.data,
      amazon_movies_genres: amazon_movies_genres_ParsedCSV.data,
  
      netflix_movies_per_year: netflix_movies_per_year_ParsedCSV.data,
      apple_movies_per_year: apple_movies_per_year_ParsedCSV.data,
      amazon_movies_per_year: amazon_movies_per_year_ParsedCSV.data,
  
      netflix_tv_avg_rating: netflix_tv_avg_rating_ParsedCSV.data,
      apple_tv_avg_rating: apple_tv_avg_rating_ParsedCSV.data,
      amazon_tv_avg_rating: amazon_tv_avg_rating_ParsedCSV.data,
  
      netflix_tv_genres: netflix_tv_genres_ParsedCSV.data,
      apple_tv_genres: apple_tv_genres_ParsedCSV.data,
      amazon_tv_genres: amazon_tv_genres_ParsedCSV.data,
  
      netflix_tv_per_year: netflix_tv_per_year_ParsedCSV.data,
      apple_tv_per_year: apple_tv_per_year_ParsedCSV.data,
      amazon_tv_per_year: amazon_tv_per_year_ParsedCSV.data,

      all_both_per_year: all_both_per_year_ParsedCSV.data,
      netflix_both_per_year: netflix_both_per_year_ParsedCSV.data,
      apple_both_per_year: apple_both_per_year_ParsedCSV.data,
      amazon_both_per_year: amazon_both_per_year_ParsedCSV.data
    }
  }
  