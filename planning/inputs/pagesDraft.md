# Pages Draft

## Page List

* Dashboard (for `logged-in` user)
  * Profile status ( "Private" | "Public" )
  * Current User Queue
  * Search (simple text search with link to "Advanced Search")
    * text search is keyword search that searches for movies, artists, and users
  * Most Similar Public Users
  * Current User Ratings
* User Profile (profile of `other` user)
  * Username
  * Date joined
  * Taste diff / count (count is the number of movies both users have in common, "Taste Diff" is the `diff` between their ratings - see `BRAINSTORME_ANALYSIS_AND_ELABORATION.MD`)
  * User Scoreboard (list of ratings by `other` user that `logged-in` user has also rated)
  * Recommendations by Taste (?)
    * Looking at the highest value taxonomic ratings for the `logged-in` user, find the `other` user's most similarly taxonomically rated movies that have not yet been rated by the `logged-in` user
  * Top 5 / Bottom 5 (thumbnails of movies - without rating - that are the 5 highest numeric rating and 5 lowest numeric rating from the `other` user that the `logged-in` user has **not** rated)
* Movie Profile
  * Poster Thumbnail (links to poster gallery as modal)
  * Title
  * Year
  * Genres
  * First 3 (or less) directors
  * First 3 (or less) writers
  * First 5 (or less) actors
  * Studio
  * "Add To Queue" button -or- list Position in queue
  * Scorecard for `logged-in` user (if not yet scorred) -or- Movie Scoreboard
* Artist Profile
  * Thumbnail (links to Gallery modal)
  * Name
  * DOB
  * Bio
  * Contribution table
* Advanced Search
  * Movie Search
    * Plex-style 'advanced' filter
      * include taxonomic rating percent
  * Artist Search
    * movie overlap search (look up movie titles and pick multiples, search results are any overlapping contributors, listed with role(s))
  * User Search
    * by name
    * by movie
    * by most-used taxonomic rating (...?)

## Scorecard

Each category for the scorecard should be layed out as follows:

|------------------------------------------------------------------------|
|                      -----------------------------------------------   |
| :::  ***Daring:***  | Dogmatic | Formulaic | Creative | Provocative |  |
|                      -----------------------------------------------   |
|------------------------------------------------------------------------|

The ":::" is an icon to be used for drag-and-drop to prioritize the categories.

The category options should 
* use the vocabulary defined in the table in `FinalVocabularySelection.md`.
* be grouped as a "button group"
* be representing a radio group
* be color coded to the levels using the following button classes:
  * Extremely Negative -> btn-outline-danger
  * Moderately Negative -> btn-outline-warning
  * Moderately Positive -> btn-outline-info
  * Extremely Positive -> btn-outline-success
* the draggable category panels themselves should have a `bg-primary` background with light text

## User Scoreboard

|  Movie               |  Rating              |  Score                             |
|----------------------|----------------------|------------------------------------|
| < Title > (< Year >) | < taxonomic rating > | < calculated half-stars out of 5 > |
|  The Matrix (1999)   | Unforgettable, Masterful, Irresistible, Creative |  * * * * *  |

Use Font Awesome icons for stars

## Movie Scoreboard

| Rating | Score | Count | Percent |
|---|---|---|
| < taxonomic rating > | < calculated half-stars out of 5 > | < count out of total > | < count as a percent >
| Unforgettable, Masterful, Irresistible, Creative |  * * * * *  | 43 / 78 | 55% |

Below scoreboard show a bar graph of score distribution

## Contribution table

| Movie | Year | Role(s) |
|---|---|---|
| < Title > (< Year >) | "Director", "Writer", < character name > |
| Charlie's Angels | 2019 | "Boz", Director, Writer |
| Hunger Games | 2012 | "Effie Trinket" |
