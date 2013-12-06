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
   this.hoveredCell = {row: -1, col: -1};
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

var Cell;

Cell = (function() {
  function Cell(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.sprite = null;
  }

  Cell.prototype.center = function() {
    return {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2,
    };
  };

  return Cell;
})();
var board = [[0,0,0],[0,0,0],[0,0,0]];
var gameStatus = new GameStatus();
var players = [
   {name:'&nbsp;', nick:'&nbsp;'},
   {name:'Player 1', nick:'1', color:'yellow'},
   {name:'Player 2', nick:'2', color:'white'},
];
var monikerFiles = [null,'star_y.png','star_w.png'];
var monikerWinnerFiles = [null,'star_y_win.png','star_w_win.png'];
var textures = {};

var setPlayers = function setPlayers(p1, p2){
   players[1].name = p1.name;
   players[1].nick = p1.nick;
   players[2].name = p2.name;
   players[2].nick = p2.nick;
   document.getElementById('matchup').innerHTML = p1.name + " vs. " + p2.name;
}

var mark = function mark(row,col){
   if(gameStatus.isGameOver) return;
   if(board[row][col] != 0) return;
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
   if(lastPlayer == 1){
      return 2;
   } else {
      return 1;
   }
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
   try{
      gameStatus.nextPlayer = 1;
      initBoard();
   } catch(e) {
      alert(e);
   }

};

var initBoard = function(){
   // create an new instance of a pixi stage
   var stage = new PIXI.Stage(0x000080, true);
   
   stage.setInteractive(true);
   
   var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);

   renderer.view.style.width = window.innerWidth + "px";
   renderer.view.style.height = window.innerHeight + "px";
   renderer.view.style.display = "block";
   
   // add render view to DOM
   document.getElementById('board').appendChild(renderer.view);
   
   var Grid = function Grid(x, y, width){
      var grid = new PIXI.Graphics();
      var thickness = 10;
      var lineOpacity = .4;
      var lineColor = 0xFFFF00;
      grid.position.x = x;
      grid.position.y = y;
      this.x = x;
      this.y = y;
      grid.lineStyle(thickness, lineColor, lineOpacity);
      grid.drawRect(0, 0, width, width);

      var third = width / 3;

      var drawCrossHatch = function(){
         grid.beginFill(0xFF3300);
         grid.lineStyle(thickness, lineColor, lineOpacity);
         
         var verticalLine = function(x, y, height){
            grid.moveTo(x, y + thickness / 2);
            grid.lineTo(x, y + height - thickness / 2);
            grid.endFill();
         }
         verticalLine(1 * third, 0, width);
         verticalLine(2 * third, 0, width);

         var horizontalLine = function(x, y, width){
            grid.moveTo(x + thickness / 2, y);
            grid.lineTo(x + width - thickness / 2, y);
            grid.endFill();
         }
         horizontalLine(0, 1 * third + 0, width);
         horizontalLine(0, 2 * third + 0, width);
      };
      drawCrossHatch();
      var row = function(x, y, height, width){
         return [
            new Cell(x + 0 * third, y, third, third),
            new Cell(x + 1 * third, y, third, third),
            new Cell(x + 2 * third, y, third, third)]
      };

      this.graphics = grid;
      this.thickness = thickness;
      this.width = width;
      this.height = width;
      this.third = third;
      this.cells = [
            row(0, 0 * third, third, third),
            row(0, 1 * third, third, third),
            row(0, 2 * third, third, third)];
   }
   Grid.prototype.getRowFromXY = function(x, y){
      if(isNaN(x) || isNaN(y) || x <= 0 || y <= 0) return -1;
      var row = (y - this.thickness - this.y) / this.width * 3
      row = Math.floor(row);
      return row;
   };
   Grid.prototype.getColFromXY = function(x, y){
      if(isNaN(x) || isNaN(y) || x <= 0 || y <= 0) return -1;
      var col = (x - this.thickness - this.x) / this.height * 3
      col = Math.floor(col);
      return col;
   };
   Grid.prototype.setCellImage = function(row, col, file){
      if(row < 0 || col < 0 || row > 2 || col > 2) return -1;
      var cell = this.cells[row][col];
      if(cell.sprite){
         if(file == null) {
            this.graphics.removeChild(cell.sprite);
            cell.sprite = null;
         } else {
            cell.sprite.setTexture(loadTexture(file));
         }
         cell.file = file;
         return;
      }
      if(file == null) return;
      var sprite = loadSprite(file);
      sprite.width = Math.min(this.third, sprite.width);
      sprite.height = Math.min(this.third, sprite.height);
      sprite.position.x = cell.center().x - sprite.width / 2;
      sprite.position.y = cell.center().y - sprite.height / 2;
      cell.sprite = sprite;
      cell.file = file;
      cell.startTick = gameStatus.tick;
      this.graphics.addChild(sprite);
   };
   Grid.prototype.setTick = function(tick){
      for(var r = 0; r < 3; r++){
         for(var c = 0; c < 3; c++){
            var cell = this.cells[r][c];
            if(cell.sprite){
               cell.sprite.alpha = .75 + .25 * Math.cos((tick - cell.startTick) / 20);
            }
         }
      }
   };

   var padding = 40;
   var gridX = 130;
   var gridY = 100;
   var gridWidth = 300;
   if(window.innerWidth < 500){
      document.getElementById('game').setAttribute('style', 'position:relative');
      gridX = 0;
      gridY = 0;
      gridWidth = Math.min(window.innerWidth, window.innerHeight);
   }
   var grid = new Grid(gridX, gridY, gridWidth);
   gridGraphic = grid.graphics;

   var loadSprite = function(file){
      return new PIXI.Sprite(loadTexture(file));
   };

   var loadTexture = function(file){
      if(textures[file]) return textures[file];
      var url = window.location.toString().match(/^https?:\/\/[^\/]+/) + '/tictactoe/images/' + file;
      var texture = new PIXI.Texture.fromImage(url);
      textures[file] = texture;
      return texture;
   };
   stage.addChild(loadSprite('background_tree.png'));
   stage.addChild(gridGraphic);

   var marks = new PIXI.Graphics();
   marks.position.x = 0;
   marks.position.y = 0;
   gridGraphic.addChild(marks);


   var createPlayerLabel = function(player){
      var label = new PIXI.Text(player.name, {stroke:player.color, strokeThickness:5, font:'bold 24pt Arial'});
      label.position.x = 100;
      label.position.y = - 90 + padding / 2;
      return label;
   };

   var createPlayerMoniker = function(playerNumber){
      var moniker = loadSprite(monikerFiles[playerNumber]);
      moniker.position.x = 0;
      moniker.position.y = - 90;
      return moniker;
   };

   playerLabels = []
   playerLabels[1] = createPlayerLabel(players[1])
   playerLabels[2] = createPlayerLabel(players[2])

   playerMonikers = []
   playerMonikers[1] = createPlayerMoniker(1)
   playerMonikers[2] = createPlayerMoniker(2)

   var count = 0;
   
   var outOfBounds = function(n){
      return n < 0 || n > 2;
   };
   stage.click = stage.tap = function(data){
      var relPoint = data.getLocalPosition(stage);
      var row = grid.getRowFromXY(relPoint.x, relPoint.y);
      var col = grid.getColFromXY(relPoint.x, relPoint.y);

      if(outOfBounds(row) || outOfBounds(col)) return;
      mark(row,col);
   }

   var doAnimation = function (){
      requestAnimFrame(animate);
   };
   doAnimation();

   function animate() {
      gameStatus = foldStatus(gameStatus, gameStatus);
      marks.clear();
      var isWinningPlay = function (row, col){
         if(gameStatus.winningMoves){
            for (var i = gameStatus.winningMoves.length - 1; i >= 0; i--) {
               var move = gameStatus.winningMoves[i];
               if(row == move[0] && col == move[1]) return true;
            };
         }
         return false;
      };
      var stagePoint = stage.getMousePosition();
      var relPoint = {x: stagePoint.x, y: stagePoint.y}
      var hoveredCell = {
         row: grid.getRowFromXY(relPoint.x, relPoint.y),
         col: grid.getColFromXY(relPoint.x, relPoint.y),
      };

      for (var r = board.length - 1; r >= 0; r--) {
         var row = board[r];
         for (var c = row.length - 1; c >= 0; c--) {
            var cell = grid.cells[r][c];
            var isCellHovered = hoveredCell.row == r && hoveredCell.col == c;
            var winningPlay = isWinningPlay(r,c);
            var shouldGlow = winningPlay || isCellHovered;
            var playerNumber = row[c];
            if(playerNumber == 0 && isCellHovered) playerNumber = gameStatus.nextPlayer;
            grid.setCellImage(r, c, (winningPlay ? monikerWinnerFiles : monikerFiles)[playerNumber]);
         };
      };

      // player to move
      if(gameStatus.isWinner){
         setCurrentPlayerSprite(gameStatus.winningPlayerNumber, playerMonikers);
         setCurrentPlayerSprite(gameStatus.winningPlayerNumber, playerLabels);
      };

      // player to move
      if(!gameStatus.isGameOver){
         setCurrentPlayerSprite(gameStatus.nextPlayer, playerMonikers);
         setCurrentPlayerSprite(gameStatus.nextPlayer, playerLabels);
      };

      grid.setTick(gameStatus.tick);

      renderer.render(stage);
      doAnimation();
   }

   var setCurrentPlayerSprite = function (playerNumber, sprites){
      var onPlayer = playerNumber;
      var offPlayer = getOtherPlayer(playerNumber);
      var onLabel = sprites[onPlayer];
      var offLabel = sprites[offPlayer];
      if(onLabel && onLabel.parent) gridGraphic.removeChild(onLabel);
      if(offLabel && offLabel.parent) gridGraphic.removeChild(offLabel);
      if(onLabel) gridGraphic.addChild(onLabel);
   };
};
