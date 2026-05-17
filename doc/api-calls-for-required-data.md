# API Calls for Required Data

Based on `requiredData.md`, this document outlines the specific TMDB API calls needed to retrieve all required data for Movies and People.

---

## Movie Data

### Required Fields
- Title
- Year
- Synopsis
- Genres
- Studio
- Posters
- Credits

### API Calls Needed

#### 1. Get Movie Details
**Function:** `get-movie`  
**Endpoint:** `GET /movie/{id}`  
**API Version:** v3

**Input:**
```clojure
(get-movie movie-id)
```

| Parameter | Type | Required |
|-----------|------|----------|
| movie-id | integer | Yes |

**Output Fields Used:**
```clojure
{
  :title "Inception"                    ;; Movie Title
  :release_date "2010-07-16"            ;; Year (extract YYYY)
  :overview "A skilled thief..."        ;; Synopsis
  :genres [
    {:id 28 :name "Action"}
    {:id 12 :name "Adventure"}
    {:id 878 :name "Science Fiction"}   ;; Genres
  ]
  :production_companies [
    {:id 508 :name "Fox 2000 Pictures"} ;; Studio(s)
  ]
}
```

**Full Response Example:**
```json
{
  "adult": false,
  "backdrop_path": "/s3TBrA08IEchmIC87JJ89el26l.jpg",
  "budget": 160000000,
  "genres": [
    {"id": 28, "name": "Action"},
    {"id": 12, "name": "Adventure"},
    {"id": 878, "name": "Science Fiction"}
  ],
  "homepage": "http://inceptionmovie.com/",
  "id": 27205,
  "imdb_id": "tt1375666",
  "original_language": "en",
  "original_title": "Inception",
  "overview": "Cobb, a skilled thief who steals corporate secrets through dream-sharing technology...",
  "popularity": 35.6,
  "poster_path": "/qmDpIHrmpJLSqn482m34Jkmro5.jpg",
  "production_companies": [
    {
      "id": 508,
      "logo_path": "/7PzJdsLGlL7GCkP4JIumjO0ViWh.png",
      "name": "Fox 2000 Pictures",
      "origin_country": "US"
    }
  ],
  "production_countries": [{"iso_3166_1": "US", "name": "United States of America"}],
  "release_date": "2010-07-16",
  "revenue": 839671572,
  "runtime": 148,
  "spoken_languages": [{"iso_639_1": "en", "name": "English"}],
  "status": "Released",
  "tagline": "Your mind is the scene of the crime",
  "title": "Inception",
  "video": false,
  "vote_average": 8.8,
  "vote_count": 27548
}
```

---

#### 2. Get Movie Images (Posters)
**Function:** `request-v3` (custom call needed)  
**Endpoint:** `GET /movie/{id}/images`  
**API Version:** v3

**Input:**
```clojure
(request-v3 "/movie/27205/images")
```

| Parameter | Type | Required |
|-----------|------|----------|
| movie-id | integer | Yes (in URL) |

**Output Fields Used:**
```clojure
{
  :posters [
    {
      :file_path "/qmDpIHrmpJLSqn482m34Jkmro5.jpg"
      :height 1500
      :width 1000
      :vote_average 5.8
      :vote_count 3
    }
    ... (more posters)
  ]
  :backdrops [
    {
      :file_path "/s3TBrA08IEchmIC87JJ89el26l.jpg"
      :height 720
      :width 1280
    }
    ... (more backdrops)
  ]
}
```

**Full Response Example:**
```json
{
  "backdrops": [
    {
      "aspect_ratio": 1.778,
      "file_path": "/s3TBrA08IEchmIC87JJ89el26l.jpg",
      "height": 720,
      "iso_639_1": null,
      "vote_average": 5.8,
      "vote_count": 3,
      "width": 1280
    }
  ],
  "id": 27205,
  "posters": [
    {
      "aspect_ratio": 0.667,
      "file_path": "/qmDpIHrmpJLSqn482m34Jkmro5.jpg",
      "height": 1500,
      "iso_639_1": "en",
      "vote_average": 5.8,
      "vote_count": 3,
      "width": 1000
    }
  ]
}
```

---

#### 3. Get Movie Credits
**Function:** `request-v3` (custom call needed)  
**Endpoint:** `GET /movie/{id}/credits`  
**API Version:** v3

**Input:**
```clojure
(request-v3 "/movie/27205/credits")
```

| Parameter | Type | Required |
|-----------|------|----------|
| movie-id | integer | Yes (in URL) |

**Output Fields Used:**
```clojure
{
  :cast [
    {
      :id 3223
      :name "Leonardo DiCaprio"
      :character "Cobb"
      :profile_path "/woKxCEexONWIB74Nubs35q6673d.jpg"
      :order 0
    }
    ... (more cast members)
  ]
  :crew [
    {
      :id 3
      :name "Christopher Nolan"
      :job "Director"
      :department "Directing"
      :profile_path "/gulJQDfoWHu9vOLNpBgsx0auwhe.jpg"
    }
    ... (more crew members)
  ]
}
```

**Full Response Example:**
```json
{
  "cast": [
    {
      "adult": false,
      "character": "Cobb",
      "credit_id": "52fe4751c3a36847f813bf33",
      "gender": 2,
      "id": 3223,
      "known_for_department": "Acting",
      "name": "Leonardo DiCaprio",
      "order": 0,
      "popularity": 26.034,
      "profile_path": "/woKxCEexONWIB74Nubs35q6673d.jpg"
    },
    {
      "adult": false,
      "character": "Ariadne",
      "credit_id": "52fe4751c3a36847f813bf33",
      "gender": 1,
      "id": 3625,
      "known_for_department": "Acting",
      "name": "Ellen Page",
      "order": 1,
      "popularity": 15.123,
      "profile_path": "/jhBh1t7xvS0MJw4N5k0z9Sh2x1q.jpg"
    }
  ],
  "crew": [
    {
      "adult": false,
      "credit_id": "52fe4751c3a36847f813bf33",
      "department": "Directing",
      "gender": 2,
      "id": 3,
      "job": "Director",
      "known_for_department": "Directing",
      "name": "Christopher Nolan",
      "profile_path": "/gulJQDfoWHu9vOLNpBgsx0auwhe.jpg"
    },
    {
      "adult": false,
      "credit_id": "52fe4751c3a36847f813bf33",
      "department": "Writing",
      "gender": 2,
      "id": 3,
      "job": "Screenplay",
      "known_for_department": "Writing",
      "name": "Christopher Nolan",
      "profile_path": "/gulJQDfoWHu9vOLNpBgsx0auwhe.jpg"
    }
  ],
  "id": 27205
}
```

---

## People Data

### Required Fields
- Name
- Date Of Birth
- Bio
- Images
- Credits

### API Calls Needed

#### 1. Get Person Details
**Function:** `request-v3` (custom call needed)  
**Endpoint:** `GET /person/{id}`  
**API Version:** v3

**Input:**
```clojure
(request-v3 "/person/3223")
```

| Parameter | Type | Required |
|-----------|------|----------|
| person-id | integer | Yes (in URL) |

**Output Fields Used:**
```clojure
{
  :name "Leonardo DiCaprio"             ;; Name
  :birthday "1974-11-11"                ;; Date of Birth
  :biography "Leonardo Wilhelm DiCaprio..." ;; Bio
  :profile_path "/woKxCEexONWIB74Nubs35q6673d.jpg"
}
```

**Full Response Example:**
```json
{
  "adult": false,
  "also_known_as": [
    "Leonard DiCaprio",
    "Leonardu Dikappurio"
  ],
  "biography": "Leonardo Wilhelm DiCaprio is an American actor and film producer. Born in 1974...",
  "birthday": "1974-11-11",
  "deathday": null,
  "external_ids": {
    "facebook_id": "leonardo.dicaprio",
    "imdb_id": "nm0000152",
    "instagram_id": "leonardodicaprio",
    "twitter_id": null
  },
  "gender": 2,
  "homepage": null,
  "id": 3223,
  "imdb_id": "nm0000152",
  "known_for_department": "Acting",
  "name": "Leonardo DiCaprio",
  "place_of_birth": "Los Angeles, California, USA",
  "popularity": 26.034,
  "profile_path": "/woKxCEexONWIB74Nubs35q6673d.jpg"
}
```

---

#### 2. Get Person Images
**Function:** `request-v3` (custom call needed)  
**Endpoint:** `GET /person/{id}/images`  
**API Version:** v3

**Input:**
```clojure
(request-v3 "/person/3223/images")
```

| Parameter | Type | Required |
|-----------|------|----------|
| person-id | integer | Yes (in URL) |

**Output Fields Used:**
```clojure
{
  :profiles [
    {
      :file_path "/woKxCEexONWIB74Nubs35q6673d.jpg"
      :height 1000
      :width 667
      :vote_average 5.8
      :vote_count 3
    }
    ... (more profile images)
  ]
}
```

**Full Response Example:**
```json
{
  "id": 3223,
  "profiles": [
    {
      "aspect_ratio": 0.667,
      "file_path": "/woKxCEexONWIB74Nubs35q6673d.jpg",
      "height": 1000,
      "iso_639_1": null,
      "vote_average": 5.8,
      "vote_count": 3,
      "width": 667
    },
    {
      "aspect_ratio": 0.667,
      "file_path": "/2bXbqS127Cmne9akR7wWjxcVrnA.jpg",
      "height": 1382,
      "iso_639_1": null,
      "vote_average": 5.5,
      "vote_count": 2,
      "width": 921
    }
  ]
}
```

---

#### 3. Get Person Movie Credits
**Function:** `request-v3` (custom call needed)  
**Endpoint:** `GET /person/{id}/movie_credits`  
**API Version:** v3

**Input:**
```clojure
(request-v3 "/person/3223/movie_credits")
```

| Parameter | Type | Required |
|-----------|------|----------|
| person-id | integer | Yes (in URL) |

**Output Fields Used:**
```clojure
{
  :cast [
    {
      :id 27205
      :title "Inception"
      :character "Cobb"
      :release_date "2010-07-16"
    }
    ... (more movie credits)
  ]
}
```

**Full Response Example:**
```json
{
  "cast": [
    {
      "adult": false,
      "backdrop_path": "/s3TBrA08IEchmIC87JJ89el26l.jpg",
      "character": "Cobb",
      "credit_id": "52fe4751c3a36847f813bf33",
      "genre_ids": [28, 12, 878],
      "id": 27205,
      "order": 0,
      "original_language": "en",
      "original_title": "Inception",
      "overview": "A skilled thief who steals corporate secrets...",
      "popularity": 35.6,
      "poster_path": "/qmDpIHrmpJLSqn482m34Jkmro5.jpg",
      "release_date": "2010-07-16",
      "title": "Inception",
      "video": false,
      "vote_average": 8.8,
      "vote_count": 27548
    },
    {
      "adult": false,
      "backdrop_path": "/ykJWxwsD3KqkdJj7vKcqKe1T23l.jpg",
      "character": "Jack Dawson",
      "credit_id": "52fe475ec3a36847f80b5d41",
      "genre_ids": [18, 36],
      "id": 597,
      "order": 0,
      "original_language": "en",
      "original_title": "Titanic",
      "overview": "84 years later, a 101-year-old woman named Rose DeWitt Bukater...",
      "popularity": 86.573,
      "poster_path": "/9xjZS2nnySiOpQ4SDynucJ0Xq2K.jpg",
      "release_date": "1997-12-19",
      "title": "Titanic",
      "video": false,
      "vote_average": 7.9,
      "vote_count": 27500
    }
  ],
  "crew": [
    {
      "adult": false,
      "backdrop_path": "/mDO0SYIEUEN0v8kJnq2Zhe4DMlV.jpg",
      "credit_id": "52fe4250c3a36847f8024f49",
      "department": "Production",
      "genre_ids": [28, 878],
      "id": 19995,
      "job": "Producer",
      "original_language": "en",
      "original_title": "Avatar",
      "overview": "In the 22nd century, a paraplegic Marine is dispatched to the moon...",
      "popularity": 73.595,
      "poster_path": "/kmnjjajc34wn0bea4oy64unmp1.jpg",
      "release_date": "2009-12-18",
      "title": "Avatar",
      "video": false,
      "vote_average": 7.8,
      "vote_count": 28753
    }
  ],
  "id": 3223
}
```

---

## Summary of API Calls Required

### For Movie Information (3 calls):
1. `GET /movie/{id}` - Title, Year, Synopsis, Genres, Studio
2. `GET /movie/{id}/images` - Posters
3. `GET /movie/{id}/credits` - Credits (Cast & Crew)

### For People Information (3 calls):
1. `GET /person/{id}` - Name, Date of Birth, Bio
2. `GET /person/{id}/images` - Images
3. `GET /person/{id}/movie_credits` - Movie Credits Only

### Total: 6 API Endpoints

---

## Implementation Notes

- All fields can be extracted from these three API calls per entity type
- Image URLs require prepending the base image URL: `https://image.tmdb.org/t/p/{size}{file_path}`
  - Common sizes: `w92`, `w154`, `w185`, `w342`, `w500`, `original`
- To search for a movie/person first, use `search-movie` or implement a `search-person` function
- Consider caching responses to minimize API calls (required data rarely changes)
- Implement error handling for missing fields (nullable: bio, birthday, images, etc.)
- The `/person/{id}/movie_credits` endpoint returns only movie credits (no TV shows)
  - Alternative: Use `/person/{id}/tv_credits` for TV shows only
  - Alternative: Use `/person/{id}/combined_credits` for both movies and TV combined
