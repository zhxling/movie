var Movie=require('../models/movie');
var Category=require('../models/category');

exports.index=function(req,res){
  Category
    .find({})
    .populate({
      path: 'movies',
      select: 'title poster',
      options: { limit: 6 }
    })
    .exec(function(err,categories){
      if (err) {
          console.log(err);
      }
      res.render('index', {
        title:'电影-首页', 
        categories: categories
      });
    })
};

exports.search=function(req,res){
  //每一页的数量
  var count=2;
  var catId=req.query.cat;
  var page = parseInt(req.query.p, 10) || 0;
  var index=page*count;
  var q=req.query.q;

  //根据分类查询
  if(catId){
    Category
      .find({_id:catId})
      .populate({
        path:'movies',
        select:'title poster'
      })
      .exec(function(err,category){
        if (err) {
          console.log(err);
        }

        var category=category[0] || {};
        var movies=category.movies || [];
        var results=movies.slice(index,index+count);

        res.render('results', {
          title:'电影搜索结果', 
          keyword: category.name,
          query:'catId='+catId,
          currentPage:page,
          totalPage: Math.ceil(movies.length / count),
          movies:movies,
        });
      })
  }
  else {
    Movie
      .find({title: new RegExp(q + '.*', 'i')})
      .exec(function(err, movies) {
        if (err) {
          console.log(err)
        }
        var results = movies.slice(index, index + count)

        res.render('results', {
          title: 'imooc 结果列表页面',
          keyword: q,
          currentPage: (page + 1),
          query: 'q=' + q,
          totalPage: Math.ceil(movies.length / count),
          movies: results
        })
      })
  }
}