const {controller,get,post}=require('../lib/decorator');
const {getAllMovies,getMovieDetails,getRelativeMovies}=require('../service/movie')
@controller('api/v0/movies')
class movieController{
    @get('/')
        async getMovies(ctx,next){
        const {type,year}=ctx.query;
        const movies=await getAllMovies(type,year)
        ctx.body={
            movies
        }
    }
    @get('/:id')
    async getMovieDetail(ctx,next){
        const id=ctx.params.id;
        const movie=await getMovieDetails(id);
        const relativeMovies=await getRelativeMovies(movie);
        ctx.body={
            data:{
                movie,
                relativeMovies
            },
            success:true
        }
    }
}
module.exports={
    movieController
}