
/*
 * GET home page.
 */

exports.index = function(req, res){
   var model = { title: 'Mushrellows'};
   console.log(req.query.p1);
   if(req.query.p1 && req.query.p2){
      model.p1 = {name:req.query.p1, nick:req.query.p1[0]};
      model.p2 = {name:req.query.p2, nick:req.query.p2[0]};
   }
   console.log (model);
   res.render('index', model);
};