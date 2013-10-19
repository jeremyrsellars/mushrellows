var board = [[0,0,0],[0,0,0],[0,0,0]];
var gameOver = false;
var players = [
   {name:'&nbsp;', nick:'&nbsp;'},
   {name:'Player 1', nick:'1'},
   {name:'Player 2', nick:'2'}
];

var setPlayers = function setPlayers(p1, p2){
   players[1] = p1;
   players[2] = p2;
   document.getElementById('matchup').innerHTML = p1.name + " vs. " + p2.name;
   document.getElementById('p1').innerHTML = p1.nick;
   document.getElementById('p2').innerHTML = p2.nick;
   console.log('set players');
   console.log(players);
}

var mark = function mark(t){
   if(gameOver) return;
   var row = t.id.charCodeAt(0) - 65;
   var col = t.id.charCodeAt(1) - 65;
   board[row][col] = player;
   t.setAttribute('class', 'p' + player);
   t.setAttribute('onclick', null);
   t.innerHTML = players[player].nick;
   console.log('players');
   console.log(players);
   nextPlayer();
   var winner = findWinner();
   if(winner){
      gameOver = true;
      setWinner(winner == 1, winner == 2);
      var status = winner < 0 ? "Stalemate - your wits seem matched" : players[winner].name + " is the Champion";
      document.getElementById('status').innerHTML = status;
      document.getElementById('again').setAttribute('style', '');
   }
}
var nextPlayer = function nextPlayer(){
   var lastPlayer = player;
   if(player == 1)
      player = 2;
   else
      player = 1;
   setActiveState(document.getElementById('p' + player), 'active');
   setActiveState(document.getElementById('p' + lastPlayer), 'inactive');
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
   var on = function(row,col){return player == board[row][col]};
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
   var on = function(row,col){return board[row][col]};
   return true
      && on(0,0) && on(0,1) && on(0,2)
      && on(1,0) && on(1,1) && on(1,2)
      && on(2,0) && on(2,1) && on(2,2)
      ;
}

var player = 2;
nextPlayer();
