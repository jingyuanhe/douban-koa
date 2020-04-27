const mongoose=require('mongoose');
const Movie=mongoose.model('Movie');
const getAllMovies=async (type,year)=>{
    let query={};
    if(type){
        query.movieTypes={
            $in:[type]
        }
    }
    if(year){
        query.year=year
    }
    return await Movie.find(query);
}
const getMovieDetails=async (id)=>{
    const movie=await Movie.findOne({_id:id})
    return movie
}
const getRelativeMovies=async (movie)=>{
    const movies=await Movie.find({movieTypes:{
        $in:movie.movieTypes
    }})
    return movies
}
module.exports={
    getRelativeMovies,
    getMovieDetails,
    getAllMovies
}