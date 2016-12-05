var TVDB = require("node-tvdb");
var tvdb = new TVDB(require('./secrets.js'));


function getEpisodes(id, season, name){
    return new Promise( (resolve, reject) => {
        tvdb.getEpisodesById(id, function(err, response) {
            if(err) return reject(err)
            resolve(response)
        })
    }).then( res => res.filter( ep => ep.SeasonNumber == season ).map( x=> Object.assign({},x, {name})))
}

function compare(a, b) {
    if (a > b) {
        return 1;
    }
    if (a < b) {
        return -1;
    }
    // a must be equal to b
    return 0;
}

const episodes = Promise.all([
    getEpisodes(279121, 3, "The Flash"),
    getEpisodes(257655, 5, "The Arrow"),
    getEpisodes(295760, 2, "Legends of tomorrow")
])
      .then( eps => [].concat.apply([], eps))
      .then( eps => eps.sort( (a,b) => compare(a.FirstAired, b.FirstAired)))
      .then( x   => x.forEach( ({name, SeasonNumber, EpisodeNumber, FirstAired}) => console.log(FirstAired, name, SeasonNumber, EpisodeNumber)))
