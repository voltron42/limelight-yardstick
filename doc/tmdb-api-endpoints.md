# TMDB API Endpoints Documentation

This document outlines the structure and usage of The Movie Database (TMDB) API endpoints used in limelight-yardstick.

## Authentication

Two authentication methods are available:

- **v3 API**: Uses `TMDB_API_KEY` environment variable
- **v4 API**: Uses `TMDB_READ_ACCESS_TOKEN` environment variable (Bearer token)

## Core Endpoints

### Movie Search

**Function:** `search-movie`  
**API Version:** v3  
**HTTP Method:** GET  
**Endpoint:** `/search/movie`

#### Input

```clojure
(search-movie query)
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| query | string | Yes | Search query string (e.g., "Inception", "The Matrix") |

#### Output

```clojure
{
  :status 200
  :headers {...}
  :body {
    :page 1
    :results [
      {
        :adult false
        :backdrop_path "/path/to/backdrop.jpg"
        :genre_ids [28 12 878]
        :id 27205
        :original_language "en"
        :original_title "Inception"
        :overview "A skilled thief who steals corporate secrets..."
        :popularity 75.5
        :poster_path "/path/to/poster.jpg"
        :release_date "2010-07-16"
        :title "Inception"
        :video false
        :vote_average 8.8
        :vote_count 28000
      }
      ...
    ]
    :total_pages 5
    :total_results 98
  }
}
```

#### Example

```clojure
(search-movie "Inception")
```

---

### Movie Details

**Function:** `get-movie`  
**API Version:** v3  
**HTTP Method:** GET  
**Endpoint:** `/movie/{movie_id}`

#### Input

```clojure
(get-movie movie-id)
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| movie-id | integer | Yes | Unique TMDB movie identifier (e.g., 550 for Fight Club) |

#### Output

```clojure
{
  :status 200
  :headers {...}
  :body {
    :adult false
    :backdrop_path "/path/to/backdrop.jpg"
    :budget 63000000
    :genres [
      {:id 18 :name "Drama"}
      {:id 53 :name "Thriller"}
    ]
    :homepage "https://www.fightclub.com"
    :id 550
    :imdb_id "tt0137523"
    :original_language "en"
    :original_title "Fight Club"
    :overview "An insomniac office worker and a devil-may-care soapmaker..."
    :popularity 75.5
    :poster_path "/path/to/poster.jpg"
    :production_companies [
      {
        :id 508
        :logo_path "/path/to/logo.png"
        :name "Fox 2000 Pictures"
        :origin_country "US"
      }
    ]
    :production_countries [{:iso_3166_1 "US" :name "United States of America"}]
    :release_date "1999-10-15"
    :revenue 100853753
    :runtime 139
    :spoken_languages [{:english_name "English" :iso_639_1 "en" :name "English"}]
    :status "Released"
    :tagline "How much can you know about yourself if you've never been in a fight?"
    :title "Fight Club"
    :video false
    :vote_average 8.8
    :vote_count 28000
  }
}
```

#### Example

```clojure
(get-movie 550)  ;; Fight Club
```

---

## Available Endpoints (By Category)

### Configuration
- `GET /configuration` - Get API configuration (v3 or v4)
- `GET /configuration/countries` - Get list of countries
- `GET /configuration/jobs` - Get list of job types
- `GET /configuration/languages` - Get list of languages
- `GET /configuration/timezones` - Get list of timezones

### Search
- `GET /search/movie` - Search for movies ✅ (implemented)
- `GET /search/tv` - Search for TV shows
- `GET /search/person` - Search for people
- `GET /search/collection` - Search for collections
- `GET /search/keyword` - Search for keywords
- `GET /search/company` - Search for companies
- `GET /search/multi` - Multi-search (movies, TV, people)

### Movies
- `GET /movie/{id}` - Get movie details ✅ (implemented)
- `GET /movie/{id}/account_states` - Get account states for movie
- `GET /movie/{id}/alternative_titles` - Get alternative titles
- `GET /movie/{id}/changes` - Get change history
- `GET /movie/{id}/credits` - Get cast and crew
- `GET /movie/{id}/external_ids` - Get external IDs (IMDB, etc.)
- `GET /movie/{id}/images` - Get posters, backdrops, logos
- `GET /movie/{id}/keywords` - Get associated keywords
- `GET /movie/{id}/lists` - Get lists this movie appears in
- `GET /movie/{id}/recommendations` - Get recommended movies
- `GET /movie/{id}/release_dates` - Get release dates by country
- `GET /movie/{id}/reviews` - Get user reviews
- `GET /movie/{id}/similar` - Get similar movies
- `GET /movie/{id}/translations` - Get translations
- `GET /movie/{id}/videos` - Get trailers and videos
- `GET /movie/popular` - Get popular movies
- `GET /movie/now_playing` - Get movies in theaters
- `GET /movie/top_rated` - Get top-rated movies
- `GET /movie/upcoming` - Get upcoming movies

### TV Shows
- `GET /tv/{id}` - Get TV show details
- `GET /tv/{id}/season/{season_number}` - Get season details
- `GET /tv/{id}/season/{season_number}/episode/{episode_number}` - Get episode details
- `GET /tv/popular` - Get popular TV shows
- `GET /tv/top_rated` - Get top-rated TV shows
- `GET /tv/on_the_air` - Get currently airing TV shows

### People
- `GET /person/{id}` - Get person details
- `GET /person/{id}/movie_credits` - Get movie credits
- `GET /person/{id}/tv_credits` - Get TV credits
- `GET /person/{id}/combined_credits` - Get all credits
- `GET /person/{id}/external_ids` - Get external IDs
- `GET /person/{id}/images` - Get profile images
- `GET /person/popular` - Get popular people

### Genres
- `GET /genre/movie/list` - Get movie genres
- `GET /genre/tv/list` - Get TV genres

### Collections
- `GET /collection/{id}` - Get collection details
- `GET /collection/{id}/images` - Get collection images
- `GET /collection/{id}/translations` - Get collection translations

### Companies
- `GET /company/{id}` - Get company details
- `GET /company/{id}/alternative_names` - Get company alternative names
- `GET /company/{id}/images` - Get company images

### Keywords
- `GET /keyword/{id}` - Get keyword details

### Account (v4 API)
- `GET /account` - Get account details ✅ (implemented)
- `GET /account/favorite/movies` - Get favorite movies
- `GET /account/favorite/tv` - Get favorite TV shows
- `GET /account/lists` - Get user lists
- `GET /account/watchlist/movies` - Get movie watchlist
- `GET /account/watchlist/tv` - Get TV watchlist

### Discover
- `GET /discover/movie` - Discover movies (with filters)
- `GET /discover/tv` - Discover TV shows (with filters)

---

## Error Handling

All API responses include either successful data or an error object:

```clojure
;; Success
{:body {...}}

;; Error (missing credentials)
{:error "TMDB_API_KEY environment variable not set"}

;; Error (API error)
{:body {:success false :status_code 34 :status_message "The resource you requested could not be found."}}
```

---

## Implementation Notes

- The `request-v3` and `request-v4` base functions handle authentication and error handling
- All responses are automatically parsed as JSON
- Credentials must be set as environment variables before making requests
- API rate limits apply: 40 requests per 10 seconds for authenticated users
- Consider caching responses to minimize API calls
