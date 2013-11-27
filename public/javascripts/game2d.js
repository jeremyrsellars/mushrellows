var board = [[0,0,0],[0,0,0],[0,0,0]];
var gameStatus = {isGameOver: false};
var players = [
   {name:'&nbsp;', nick:'&nbsp;'},
   {name:'Player 1', nick:'1'},
   {name:'Player 2', nick:'2'}
];

var setPlayers = function setPlayers(p1, p2){
   players[1] = p1;
   players[2] = p2;
   document.getElementById('matchup').innerHTML = p1.name + " vs. " + p2.name;
}

var mark = function mark(row,col){
   if(gameStatus.isGameOver) return;
   if(board[row][col] != 0)
      return;
   board[row][col] = player;
   nextPlayer();
   var winningStatus = findWinningStatus();
   if(winningStatus.isWinner || winningStatus.isStalemate){
      gameStatus.isGameOver = true;
      var playerName = winningStatus.isWinner ? players[winningStatus.playerNumber].name : 'neither';
      setWinner(winningStatus.playerNumber, playerName);
      var status = winningStatus.isStalemate ? "Stalemate - your wits seem matched" : players[winningStatus.playerNumber].name + " is the Champion";
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
}

var setWinner = function setWinner(playerNumber, playerName){
   setTimeout(50, function(){
      alert(playerName + ' is the winner!');
   });
};

var setActiveState = function setActiveState(cell, newState){
   var newClass = cell.getAttribute('class').replace(/\s*(in)?active/g, '') + ' ' + newState;
   cell.setAttribute('class', newClass);
};

var findWinningStatus = function findWinningStatus(){
   var status = findWinningStatusForPlayer(1);
   if(status.isWinner)
      return status;
   status = findWinningStatusForPlayer(2);
   if(status.isWinner)
      return status;
   if(isFilled())
      return {playerNumber:-1, isWinner:false, isStalemate:true, isGameOver: true, winningMoves:null};
   return {playerNumber:0, isWinner:false, isStalemate:false, isGameOver: false, winningMoves:null};
}

var findWinningStatusForPlayer = function findWinningStatusForPlayer(playerNumber){
   var on = function(row,col){return board[row][col]};
   var winningMoves = [
      [[0,0],[0,1],[0,2]],
      [[1,0],[1,1],[1,2]],
      [[2,0],[2,1],[2,2]],

      [[0,0],[1,0],[2,0]],
      [[0,1],[1,1],[2,1]],
      [[0,2],[1,2],[2,2]],

      [[0,0],[1,1],[2,2]],
      [[2,0],[1,1],[0,2]],
   ];
   var isWinningMove = function(coords){
      var win = true;
      for (var i = coords.length - 1; i >= 0; i--) {
         win &= on.apply(null,coords[i]);
      };
      return win;
   };
   var status = function(row,col){return playerNumber == board[row][col]};
   var winningStatus = {playerNumber:playerNumber, isWinner:false, isStalemate:false, isGameOver: true, winningMoves:null}
   for (var i = winningMoves.length - 1; i >= 0; i--) {
      if(isWinningMove(winningMoves[i])) {
         winningStatus.winningMoves = winningMoves;
         winningStatus.isWinner = true;
         winningStatus.isGameOver = true;
      }
   };
   return winningStatus;
}

var isFilled = function isFilled(){
   var on = function(row,col){return board[row][col]};
   return true
      && on(0,0) && on(0,1) && on(0,2)
      && on(1,0) && on(1,1) && on(1,2)
      && on(2,0) && on(2,1) && on(2,2)
      ;
}

var player = 2;
var initGame = function(){
   nextPlayer();
};

var rect = function(x, y, width, height){return {x:x, y:y, width:width, height:height};};

var initBoard = function(){
   // create an new instance of a pixi stage
   var stage = new PIXI.Stage(0xFFFFFF, true);
   
   stage.setInteractive(true);
   
   var renderer = PIXI.autoDetectRenderer(380, 480);
   
   // set the canvas width and height to fill the screen
   //renderer.view.style.width = window.innerWidth + "px";
   //renderer.view.style.height = window.innerHeight + "px";
   renderer.view.style.display = "block";
    
   // add render view to DOM
   document.getElementById('board').appendChild(renderer.view);
   
   var Grid = function Grid(x, y, width){
      var grid = new PIXI.Graphics();
      
      // set a fill and line style
      grid.beginFill(0xFF3300);
      grid.lineStyle(10, 0xffd900, 1);
      
      var third = width / 3;
      var thickness = 10;

      // draw a shape
      var verticalLine = function(x, y, height){
         grid.moveTo(x, y);
         grid.lineTo(x + thickness, y);
         grid.lineTo(x + thickness, y + height);
         grid.lineTo(x, y + height);
         grid.lineTo(x, y);
         grid.endFill();
      }
      verticalLine(x + 1 * third, y, width);
      verticalLine(y + 2 * third, y, width);

      var wideLine = function(x, y, width){
         grid.moveTo(x, y);
         grid.lineTo(x, y + thickness);
         grid.lineTo(x + width, y + thickness);
         grid.lineTo(x + width, y);
         grid.lineTo(x, y);
         grid.endFill();
      }
      wideLine(x, 1 * third + y, width);
      wideLine(x, 2 * third + y, width);
      var row = function(x, y, height, width){
         return [
            rect(x + 0 * third, y, third, third),
            rect(x + 1 * third, y, third, third),
            rect(x + 2 * third, y, third, third)]
      };

      this.graphics = grid,
      this.x = x,
      this.y = y,
      this.width = width,
      this.height = width,
      this.cells = [
            row(x, y + 0 * third, third, third),
            row(x, y + 1 * third, third, third),
            row(x, y + 2 * third, third, third)];
   }
   Grid.prototype.getRowFromXY = function(x, y){
      var row = (y - this.y) / this.width * 3
      row = Math.max(0, Math.min(2, Math.floor(row)));
      return row;
   };
   Grid.prototype.getColFromXY = function(x, y){
      var col = (x - this.x) / this.height * 3
      col = Math.max(0, Math.min(2, Math.floor(col)));
      return col;
   };

   var padding = 40;
   var grid = new Grid(padding, padding, 300);
   gridGraphic = grid.graphics;
   stage.addChild(gridGraphic);

   var marks = new PIXI.Graphics();
   stage.addChild(marks);
   marks.position.x = 60;
   marks.position.y = 60;
   
   var count = 0;
   
   stage.click = stage.tap = function(data)
   {
      var relPoint = data.getLocalPosition(gridGraphic);
      var row = grid.getRowFromXY(relPoint.x, relPoint.y);
      var col = grid.getColFromXY(relPoint.x, relPoint.y);

      mark(row,col);
      requestAnimFrame(animate);
   }
   
   requestAnimFrame(animate);

   function animate() {
      marks.clear();
      
      for (var r = board.length - 1; r >= 0; r--) {
         var row = board[r];
         for (var c = row.length - 1; c >= 0; c--) {
            var cell = grid.cells[r][c];
            drawPlayerMoniker(row[c], cell.x, cell.y, cell.width, cell.height);
         };
      };

      // player to move
      drawPlayerMoniker(player, padding + grid.width / 2 - 50, grid.height + padding + padding, 100, 100);

      renderer.render(stage);
      requestAnimFrame(animate);
   }

   var playerColor = [0xffffff, 0xffFF00, 0x00ffFF]
   var drawPlayerMoniker = function draw (player, x, y, width, height) {
      marks.beginFill(playerColor[player], 0.5);
      marks.drawCircle(x, y, Math.max(width, height) * .333);
   }
};
