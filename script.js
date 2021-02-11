// dom element for the game
const gameButtons = document.querySelectorAll(".button");
const gameSection = document.querySelector(".game");
const gameOverSection = document.querySelector(".game-over");
const restartButton = document.querySelector(".restart");
const gameWinner = document.querySelector(".winner");
// variables for the game
let gameBoard = Array.from(Array(9).keys());
let winCombs =  [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
];
let gameMoves = 0;
let gameState = true;
// funtions for the game 
//setting the changes in the game console variable
const setGameConsole = (address , type) =>{
    gameBoard[address]= type;
    document.querySelector(`#column${address}`).innerHTML = type;
    document.querySelector(`#column${address}`).removeEventListener("click",setUserOption);
    gameMoves++;
    checkGameOver(gameBoard,type)?gameOver(type):gameMoves >= 9 ?gameOver("tie"):null;
}
//getting the computer moves
const getComputerOption = () =>{
    gameState?setGameConsole(getMediumOption(gameBoard),"o"):null;
}
//for setting user changes to the front-end and back-end
const setUserOption = (e) =>{
    console.log(e);
    let item = e.target;
    let userSelection = item.id;
    userSelection = Number(userSelection[userSelection.length - 1]);
    setGameConsole(userSelection,"x");
    getComputerOption()
}
//set the gameover changes
const gameOver = (winner) =>{
    gameState = false;
    if (winner == "o"){
        console.log(gameBoard);
        gameWinner.innerHTML = "lose";
        gameWinner.style.color = "red";
    }else if (winner == "tie"){
        gameWinner.innerHTML = "tie";
        gameWinner.style.color = "blue";
    }
    let empty = emptySpot();
    empty.forEach((button) =>{
        document.querySelector(`#column${button}`).removeEventListener("click",setUserOption);
    })
    gameSection.style.opacity = .4;
    gameOverSection.style.display = "flex";
    gameBoard = Array.from(Array(9).keys());
    gameMoves = 0;
    gameState = false;
}
//to check wheather is over or not
const checkGameOver = (board,type) => {
    let plays = board.reduce((a, e, i) =>
        (e === type) ? a.concat(i) : a, []);
    for (let [index, win] of winCombs.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            return true;
        }
    }
    return false;
}
//To find the empty spots in gameBoard
const emptySpot =() =>{
    return gameBoard.filter(s => typeof s == 'number');
}
//easy level bot
//medium level bot
const getMediumOption = (gameConsole) =>{
    let emptySpace = emptySpot();
    let spots = [];
    for (let i = 0 ; i <emptySpace.length; ++i){
        let spotContent = gameConsole[emptySpace[i]];
        let move = {};
        move.index = gameConsole[emptySpace[i]];
        gameConsole[emptySpace[i]] = "o";
        if (checkGameOver(gameConsole,"o")){
            move.score = 10;
        }
        gameConsole[emptySpace[i]] = "x";
        if (!move.score && checkGameOver(gameConsole,"x")){
            move.score = -10;
        }
        gameConsole[emptySpace[i]] = spotContent;
        if (!move.score){
            move.score = -20;
        }
        spots.push(move);
    }
    console.log(spots)
    let bestScore = bestMove =-30;
    for (let j = 0; j < spots.length; ++j){
        if (spots[j].score >bestScore){
            bestScore = spots[j].score;
            bestMove = j;
        }
    }
    console.log(spots[bestMove])
    return spots[bestMove].index;

}
//unbeatable bot
const getImpossibleOption = (gameGround,player) =>{
    let liveEmptySpot = emptySpot();
    if(checkGameOver(gameGround,"x")){
        return {score : -20};
    }else if(checkGameOver(gameGround,"o")){
        return {score : 20};
    }if(liveEmptySpot.length === 0){
        return {score : 0};
    }
    let moves = [];
    for (let i = 0 ; i < liveEmptySpot.length; ++i){
        let move = {};
        move.index = gameGround[liveEmptySpot[i]];
        gameGround[liveEmptySpot[i]] = player;
        if (player == "o"){
            let result = minmaxOption(gameGround,"x");
            move.score = result.score;
        }else{
            let result = minmaxOption(gameGround,"o");
            move.score = result.score;
        }
        gameGround[liveEmptySpot[i]] = move.index;
        moves.push(move);
    }
    let bestMove ;
    if (player == "o"){
        let bestScore = -1000;
        for (let i =0 ; i < moves.length ; ++i ){
            if (moves[i].score > bestScore){
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }else{
        let bestScore = 1000;
        for (let i =0 ; i < moves.length ; ++i){
            if (moves[i].score < bestScore){
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];
}
const resetConsole = () =>{
    gameButtons.forEach((button) =>{
        button.innerHTML = "";
        button.addEventListener("click" ,setUserOption);
    })
    gameSection.style.opacity = 1;
    gameOverSection.style.display = "none";
    gameState = true;

}

//adding event listner for each button
gameButtons.forEach((button) =>{
    button.addEventListener("click" , setUserOption )
})
//adding click event for the restart button
restartButton.addEventListener("click",()=>{resetConsole()})
