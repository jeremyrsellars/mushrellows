
/*
 * GET home page.
 */

exports.index = function(req, res){
   var model = { title: 'Mushrellows', url: req.originalUrl};
   if(req.query.p1 && req.query.p2){
      model.p1 = {name:req.query.p1, nick:req.query.p1[0]};
      model.p2 = {name:req.query.p2, nick:req.query.p2[0]};
   } else{
      model.p1 = {name:'Xtra-awesome', nick:'X'};
      model.p2 = {name:'One Tic-tac-tician', nick:'O'};
   }
   res.render('index', model);
};

exports.game2d = function(req, res){
   var model = { title: 'Mushrellows', url: req.originalUrl};
   if(req.query.p1 && req.query.p2){
      model.p1 = {name:req.query.p1, nick:req.query.p1[0]};
      model.p2 = {name:req.query.p2, nick:req.query.p2[0]};
   } else{
      model.p1 = {name:'Xtra-awesome', nick:'X'};
      model.p2 = {name:'One Tic-tac-tician', nick:'O'};
   }
   res.render('game2d', model);
};