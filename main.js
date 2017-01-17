var TVDB = require("node-tvdb");
var tvdb = new TVDB(require('./secrets.js'));
const {sortBy, flatten} = require('lodash')

function getEpisodes(id, season, name){
    const timer = setInterval(()=>process.stderr.write('.'), 1000)
    return new Promise( (resolve, reject) => {
        tvdb.getEpisodesById(id, function(err, response) {
            clearInterval(timer)
            process.stderr.write("*")
            if(err) return reject(err)
            resolve(response)
        })
    }).then( res => res.filter( ep => ep.SeasonNumber == season ).map( x=> Object.assign({},x, {name})))
}

function compare(a, b) {
    console.log('comparing', a,b)
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
      .then( eps => flatten(eps))
      .then( eps => sortBy(eps, 'FirstAired'))
      .then( x   => x.forEach( ({name, SeasonNumber, EpisodeNumber, FirstAired}) => console.log(FirstAired, name, SeasonNumber, EpisodeNumber)))
      .catch( err => console.error(err))
