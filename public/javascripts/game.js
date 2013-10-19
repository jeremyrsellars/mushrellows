var game = [[0,0,0],[0,0,0],[0,0,0]];
var gameOver = false;
var players = ['&nbsp;', 'A', 'E'];
var mark = function mark(t){
   if(gameOver) return;
   var row = t.id.charCodeAt(0) - 65;
   var col = t.id.charCodeAt(1) - 65;
   game[row][col] = player;
   t.setAttribute('class', 'p' + player);
   t.setAttribute('onclick', null);
   t.innerHTML = players[player];
   nextPlayer();
   var winner = findWinner();
   if(winner){
      gameOver = true;
      document.getElementById('status').innerHTML = "<a href='/'>Play again!</a>";
      setWinner(winner == 1, winner == 2);
   }
}
var nextPlayer = function nextPlayer(){
   var lastPlayer = player;
   if(player == 1)
      player = 2;
   else
      player = 1;
   var active = document.getElementById('p' + player);
   var inactive = document.getElementById('p' + lastPlayer);
   setActiveState(active, 'active');
   setActiveState(inactive, 'inactive');
}

var setWinner = function setWinner(p1, p2){
   setActiveState(document.getElementById('p1'), p1 ? 'active' : 'inactive');
   setActiveState(document.getElementById('p2'), p2 ? 'active' : 'inactive');
};

var setActiveState = function setActiveState(cell, newState){
   var newClass = cell.getAttribute('class').replace(/\s*(in)?active/g, '') + ' ' + newState;
   cell.setAttribute('class', newClass);
};

var findWinner = function findWinner(){
   if(isWinner(1)) return 1;
   if(isWinner(2)) return 2;
   if(isFilled()) return -1;
   return 0;
}

var isWinner = function isWinner(player){
   var on = function(row,col){return player == game[row][col]};
   return false
      || (on(0,0) && on(0,1) && on(0,2))
      || (on(1,0) && on(1,1) && on(1,2))
      || (on(2,0) && on(2,1) && on(2,2))

      || (on(0,0) && on(1,0) && on(2,0))
      || (on(0,1) && on(1,1) && on(2,1))
      || (on(0,2) && on(1,2) && on(2,2))

      || (on(0,0) && on(1,1) && on(2,2))
      || (on(2,0) && on(1,1) && on(0,2))
      ;
}

var isFilled = function isWinner(player){
   var on = function(row,col){return game[row][col]};
   return true
      && on(0,0) && on(0,1) && on(0,2)
      && on(1,0) && on(1,1) && on(1,2)
      && on(2,0) && on(2,1) && on(2,2)
      ;
}

var player = 2;
nextPlayer();
