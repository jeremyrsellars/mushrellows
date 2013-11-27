var GameStatus;

GameStatus = (function() {
  function GameStatus() {
   this.tick = 1;
   this.winningPlayerNumber = 0;
   this.isWinner = false;
   this.isStalemate = false;
   this.isGameOver = false;
   this.winningMoves = null;
   this.nextPlayer = -1;
  }

  return GameStatus;

})();

GameStatus.createStalemate = function(){
   var stalemate = new GameStatus();
   stalemate.winningPlayerNumber = -1;
   stalemate.isStalemate = true;
   stalemate.isGameOver = true;
   return stalemate;
};

var Rect;

Rect = (function() {
  function Rect(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  Rect.prototype.center = function() {
    return {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2,
    };
  };

  return Rect;

})();
var board = [[0,0,0],[0,0,0],[0,0,0]];
var gameStatus = new GameStatus();
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
   board[row][col] = gameStatus.nextPlayer;
   var nextStatus = getGameStatus();
   if(nextStatus.isWinner || nextStatus.isStalemate){
      var playerName = nextStatus.isWinner ? players[nextStatus.winningPlayerNumber].name : 'neither';
      setWinner(nextStatus.winningPlayerNumber, playerName);
      var statusMessage = nextStatus.isStalemate ? "Stalemate - your wits seem matched" : players[nextStatus.winningPlayerNumber].name + " is the Champion";
      document.getElementById('status').innerHTML = statusMessage;
      document.getElementById('again').setAttribute('style', '');
   } else {
      nextStatus.nextPlayer = getOtherPlayer(gameStatus.nextPlayer);
   }
   gameStatus = foldStatus(nextStatus, gameStatus);
}

var foldStatus = function foldStatus(nextStatus, lastStatus){
   nextStatus.tick = lastStatus.tick + 1;
   return nextStatus;
}

var getOtherPlayer = function getOtherPlayer(lastPlayer){
   if(lastPlayer == 1)
      return 2;
   else
      return 1;
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

var getGameStatus = function getGameStatus(){
   var status = findWinningStatusForPlayer(1);
   if(status.isWinner)
      {console.log('player 1 is the winner'); return status;}
   status = findWinningStatusForPlayer(2);
   if(status.isWinner)
      {console.log('player 2 is the winner'); return status;}
   if(isFilled())
      return GameStatus.createStalemate();
   return new GameStatus();
}

var findWinningStatusForPlayer = function findWinningStatusForPlayer(playerNumber){
   var on = function(row,col){return board[row][col] == playerNumber};
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
   var winningStatus = new GameStatus();
   winningStatus.winningPlayerNumber = playerNumber;
   winningStatus.isWinner = false;
   winningStatus.isStalemate = false;
   winningStatus.isGameOver =  true;
   winningStatus.winningMoves = null;
   for (var i = winningMoves.length - 1; i >= 0; i--) {
      var moves = winningMoves[i];
      if(isWinningMove(moves)) {
         winningStatus.winningMoves = moves;
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

var initGame = function(){
   gameStatus.nextPlayer = 1;
   initBoard();
};

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
         grid.lineTo(x, y + height);
         grid.endFill();
      }
      verticalLine(x + 1 * third, y, width);
      verticalLine(y + 2 * third, y, width);

      var wideLine = function(x, y, width){
         grid.moveTo(x, y);
         grid.lineTo(x + width, y);
         grid.endFill();
      }
      wideLine(x, 1 * third + y, width);
      wideLine(x, 2 * third + y, width);
      var row = function(x, y, height, width){
         return [
            new Rect(x + 0 * third, y, third, third),
            new Rect(x + 1 * third, y, third, third),
            new Rect(x + 2 * third, y, third, third)]
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
   var grid = new Grid(0, 0, 300);
   gridGraphic = grid.graphics;
   stage.addChild(gridGraphic);

   var marks = new PIXI.Graphics();
   gridGraphic.addChild(marks);
   
   var count = 0;
   
   stage.click = stage.tap = function(data)
   {
      var relPoint = data.getLocalPosition(gridGraphic);
      var row = grid.getRowFromXY(relPoint.x, relPoint.y);
      var col = grid.getColFromXY(relPoint.x, relPoint.y);

      mark(row,col);
   }
   
   requestAnimFrame(animate);

   function animate() {
      gameStatus = foldStatus(gameStatus, gameStatus);
      marks.clear();
      
      for (var r = board.length - 1; r >= 0; r--) {
         var row = board[r];
         for (var c = row.length - 1; c >= 0; c--) {
            var cell = grid.cells[r][c];
            drawPlayerMoniker(row[c], cell.x, cell.y, cell.width, cell.height);
            //drawCellOutline(r, c);
         };
      };

      // player to move
      if(gameStatus.isWinner){
         drawWinningLine(gameStatus.winningPlayerNumber, gameStatus.winningMoves);
      };

      // player to move
      if(!gameStatus.isGameOver){
         drawPlayerMoniker(gameStatus.nextPlayer,
            padding + grid.width / 2 - 50, grid.height + padding + padding, 100, 100,
            true);
      };

      renderer.render(stage);
      requestAnimFrame(animate);
   }

   var playerColor = [0xffffff, 0xFF0000, 0x000000]

   var drawPlayerMoniker = function drawPlayerMoniker (player, x, y, width, height, isGlowing) {
      var fillOpacity = 0.5;
      if(gameStatus.tick % 100 == 0)
         console.log(gameStatus.tick);
      if(isGlowing) fillOpacity += .1 * Math.sin(gameStatus.tick / 10);
      marks.beginFill(playerColor[player], fillOpacity);
      var radius = Math.max(width, height) * .333;
      marks.drawCircle(x + width / 2, y + height / 2, radius);
      marks.lineStyle(5, playerColor[player], 1);
      marks.drawCircle(x + width / 2, y + height / 2, radius);
      marks.drawCircle(x + width / 2, y + height / 2, radius * .6666);
   }

   var drawCellOutline = function drawCellOutline (row, col) {
      var cell = grid.cells[row][col];
      marks.lineStyle(1, 0x000000, 1);
      marks.moveTo(cell.x, cell.y);
      marks.lineTo(cell.x + cell.width, cell.y);
      marks.lineTo(cell.x + cell.width, cell.y + cell.height);
      marks.lineTo(cell.x, cell.y + cell.height);
      marks.lineTo(cell.x, cell.y);
   }

   var drawWinningLine = function drawWinningLine (player, moves) {
      var getCell = function(move){
         return grid.cells[move[0]][move[1]];
      };
      var cell1 = getCell(moves[0]);
      var cell3 = getCell(moves[2]);
      marks.lineStyle(10, playerColor[player], 1);
      marks.moveTo(cell1.center().x, cell1.center().y);
      marks.lineTo(cell3.center().x, cell3.center().y);
   }
};
