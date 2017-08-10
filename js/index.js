var gameTable = [0,1,2,3,4,5,6,7,8];
var gameStarted = false;
var actualPlayer = "";

var AIPoints = 0;
var yourPoints = 0;
$(document).ready(function(){

});
var isYourTurn = true;

$('#checkbox-player-select').change(function(){
  console.log("Changed");
  if(!$(this).prop('checked')){
    $('#sign-detector').text('You´re the X');
  }else{
    $('#sign-detector').text('You´re the O');
  }
});

$('.box').mousedown(function(e){
  gameStarted = true;
  if(!$('#checkbox-player-select').prop('checked')){
    console.log($(this).attr('class'),'eres la X');
    if(isYourTurn){
      $(this).append('<p class="col s12 center josefin-text" style="position:relative; top: 0%; left: 50%; transform:translate(-50%, -50%); color: white; font-size: 38px;">X</p>');
      actualPlayer = 'X';
      $('#checkbox-player-select').attr("disabled", "disabled");
      isYourTurn = false;
      var id = $(this).attr('id');
      gameTable[Number(id) - 1] = 'X';
      if(!checkWin(actualPlayer, gameTable)){
        AIInitialise();
      }else{
        alert('X Wins');
        yourPoints++;
        $('#you').text(yourPoints.toString());
        reset(gameTable);
      }
    }
  }else{
    if(isYourTurn){
      console.log('eres la O');
       $(this).append('<p class="col s12 center josefin-text" style="position:relative; top: 0%; left: 40%; transform:translate(-50%, -50%); color: white; font-size: 38px;">O</p>');
      $('#checkbox-player-select').attr("disabled", "disabled");
      isYourTurn = false;
      actualPlayer = 'O';
      var id = $(this).attr('id');
      gameTable[Number(id) - 1] = 'O';
      if(!checkWin(actualPlayer, gameTable)){
        AIInitialise();
      }else{
        alert('O Wins');
        yourPoints++;
        $('#you').text(yourPoints.toString());
        reset(gameTable);
      }
    }
  }
});

var AIPlayer = '';

function AIInitialise(){
  
  if(actualPlayer == 'X'){
    AIPlayer = 'O';
  }else{
    AIPlayer = 'X';
  }
  
  if(!isYourTurn){
    var copyTable = gameTable.slice();
    var checkDraw = gameTable.slice();
    var isDraw = checkDraw.filter(function(a,b){
      return a != "X" && a != "O";
    });
    console.log("Copy game board: " + copyTable);
    var bestMove = minimaxAlgorithm(copyTable, AIPlayer);
    gameTable[bestMove.index] = AIPlayer;
    console.log(gameTable);
    $('#'+(bestMove.index+1).toString()).append('<p class="col s12 center josefin-text" style="position: relative; top: 0%; left: 40%; transform:translate(-50%, -50%); color: white; font-size: 38px;">'+AIPlayer+'</p>');
    isYourTurn = true;
    if(isDraw.length == 0){
      alert("Draw");
      reset(gameTable);
    }
    
    if(checkWin(AIPlayer, gameTable)){
      alert(AIPlayer + " Wins");
      AIPoints++;
      $('#AI').text(AIPoints.toString());
      reset(gameTable);
    }
  }
}

function checkWin(player, board){
  //Check horizontals
  if((board[0] == player && board[1] == player && board[2] == player) ||
    (board[3] == player && board[4] == player && board[5] == player) ||
    (board[6] == player && board[7] == player && board[8] == player) ||
    (board[0] == player && board[3] == player && board[6] == player) ||
    (board[1] == player && board[4] == player && board[7] == player) ||
    (board[2] == player && board[5] == player && board[8] == player) ||
    (board[0] == player && board[4] == player && board[8] == player) ||
    (board[2] == player && board[4] == player && board[6] == player)){
    return true;
  }else{
    return false;
  }
}

//This IA is based on minimax algorithm thanks for the creator of this algorithm
function minimaxAlgorithm(newBoard, player){
  var emptySlots = newBoard.filter(function(a,b){
    return a != 'X' && a != 'O';
  });
  
  if(checkWin(actualPlayer, newBoard)){
    return {score: -10};
  }else if(checkWin(AIPlayer, newBoard)){
    return {score: +10};
  }else if(emptySlots.length == 0){
    return {score: 0};
  }
  
  var moves = [];
  for(var x = 0; x < emptySlots.length; x++){
    var move = {};
    move.index = newBoard[emptySlots[x]];
    
    newBoard[emptySlots[x]] = player;
    if(player == AIPlayer){
      var result = minimaxAlgorithm(newBoard, actualPlayer);
      move.score = result.score;
    }else{
      var result = minimaxAlgorithm(newBoard, AIPlayer);
      move.score = result.score;
    }
    
    newBoard[emptySlots[x]] = move.index;
    moves.push(move);
  }
  
  var hackingMove;
  
  // Store score of AI Player
  if(player === AIPlayer){
    var score = -100;
    for(var j = 0; j < moves.length; j++){
      if(moves[j].score > score){
        score = moves[j].score;
        hackingMove = j;
      }
    }
  }else{
    var score = 100;
    for(var y = 0; y < moves.length; y++){
      if(moves[y].score < score){
        score = moves[y].score;
        hackingMove = y;
      }
    }
  }
  return moves[hackingMove];
}

function reset(board){
  for(i = 0; i < board.length; i++){
    board[i] = i;
    $('#'+(i+1).toString()).children('p').remove();
  }
}