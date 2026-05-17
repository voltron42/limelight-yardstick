# "Limelight Yardstick" Specification

I want to develop a scorecard for rating movies:

* There are four categories:
  * daring
  * ambition
  * engagement
  * satisfaction
* each category will be scored on one of four levels:
  * extremely negative
  * moderately negative
  * moderately positive
  * extremely positive
* each combination of category and level needs its own unique term
* final twist categories will then be able to be ranked buy the user to their importance on the film, for example:
  * one film may have daring and satisfaction as the first and second rated categories
  * another film may have ambition as the most important category and then daring and then satisfaction, etc
* The scorecard will then generate both:
  * a taxonomical rating made up of the four selected terms in their ranked order
  * a numerical rating using the following formula:
    * a numeric score will be attached to each category based on the ranking
      * extremely negative => 1
      * moderately negative => 2
      * moderately positive => 3
      * extremely positive => 4
    * The scores are then weighted based on the user's ranking of each category
      * The highest ranked score gets multiplied by 4
      * the next highest by 3
      * the third highest by 2
      * the lowest by 1
    * the scores are all added together and applied to the following formula: `(sum-min)/(max-min)`
      * `min` is the lowest possible score of all 1's => 10
      * `max` is the highest possible score of all 4's => 40
    * This final score is described as:
      * a percent
      * number of half Stars out of 10
      * number of half Stars out of 5
* For the interface:
  * React / importNamespace
  * dark theme
  * bootstrap colors
  * radio groups for each category
  * jQuery Drag-and-Drop integration for ranking categories
  * mobile friendly
  * use 'Font-Awesome' free icons for empty stars, half stars, and full stars (and any other icons)
* Backend
  * Clojure with document db integration (suggestions?)
  * integrate with `themoviedb.com` for movie links
    * later feature submits scorecard as a review on `themoviedb`
    * potential Claude assistance in reading reviews to attempt to interpret as scorecards
  * google account integration for user login
  * ability to filter movies / reviews by taxonomic rating
  * metrics by movie for both scores and taxonomic rating
