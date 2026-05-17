# Similarity Algorithm Pseudocode

## 1. Parse the Taxonomic Rating

`
function parseTaxonomicRating (string taxonomicRating) { ... }
`

returns the following object:

`
{
  "daring": {
    "weight": 4, // possible 1 thru 4 based on ranking algorithm
    "rating": 3 // possible 0 - 3 based on vocabulary index
  },
  "ambition": { ... }, // same object schema as "daring"
  "engagement": { ... }, // same object schema as "daring"
  "satisfaction": { ... }, // same object schema as "daring"
}
`

## 2. produce a numerical diff between two users' ratings of the same movie

`
function diffRatings(ParsedRating a, ParsedRating b) { // "ParsedRating" is the object seen above
  return ["daring","ambition","engagement","satisfaction"].reduce((sum, category) => {
    let catA = a[category];
    let catB = b[category];
    return sum + (max(catA.weight, catB.weight) * | catA.rating - catB.rating | * (1 + | catA.weight - catB.weight |));
  }, 0)
}
`

## Questions ...

* efficiency?
* when do we do this?
* caching? persist and update?
* Suggestions?