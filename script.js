// dom element for the game
const documentAll = document.querySelectorAll;
const documentIndi = document.querySelector;
const gameButtons = document.querySelectorAll(".button");
// const gameTopRow = document.querySelectorAll(".top-row .button");
// const gameMiddleRow = document.querySelectorAll(".middle-row .button");
// const gameBottomRow = document.querySelectorAll(".bottom-row .button");
const gameSection = document.querySelector(".game");
const gameOverSection = document.querySelector(".game-over");
const restartButton = document.querySelector(".restart");
const gameWinner = document.querySelector(".winner");
// variables for the game
let gameConsole = [
    [null,null,null],
    [null,null,null],
    [null,null,null]
];
let gameMoves = 0;
let nonClickedPos = [0,1,2,3,4,5,6,7,8];
let gameState = true;
// funtions for the game 
//setting the changes in the game console variable
const setGameConsole = (address , type) =>{
    console.log(address, type)
    nonClickedPos = nonClickedPos.filter(value => value != address);
    let consoleRow = Math.floor(address /3);
    let consoleColumn = address % 3;
    // console.log(nonClickedPos);
    gameConsole[consoleRow][consoleColumn] = type;
    document.querySelector(`#column${address}`).innerHTML = type;
    document.querySelector(`#column${address}`).removeEventListener("click",setUserOption);
    gameMoves++;
    checkGameOver(gameConsole,type)==true?gameOver(type):gameMoves >= 9 ?gameOver("tie"):null;
}
//getting the computer moves
const getComputerOption = () =>{
    // let selectionAddress = Math.floor(Math.random()*nonClickedPos.length);
    // let selectedOption = nonClickedPos[selectionAddress];
    let selectedOption = minmaxOption(gameConsole,"o",nonClickedPos);
    console.log(selectedOption);
    setGameConsole(selectedOption,"o");
    return selectedOption;
}
//for setting user changes to the front-end and back-end
const setUserOption = (e) =>{
    let item = e.target;
    // gameState = true;
    // item.removeEventListener("click" , setUserOption);
    let userSelection = item.id;
    userSelection = Number(userSelection[userSelection.length - 1]);
    setGameConsole(userSelection,"x");
    // gameState == true?getComputerOption(): null;
    if (gameState == true){
        let tempConsole = [];
        for (let i =0 ; i < gameConsole.length; ++i){
            tempConsole[i] = gameConsole[i].slice(0);
        }
        let computerSelection = minmaxOption(tempConsole,"o",nonClickedPos);
        setGameConsole(computerSelection,"o");
    }
}
//set the gameover changes
const gameOver = (winner) =>{
    gameState = false;
    if (winner == "o"){
        console.log(gameConsole)
        gameWinner.innerHTML = "lose";
        gameWinner.style.color = "red";
    }else if (winner == "tie"){
        gameWinner.innerHTML = "tie";
        gameWinner.style.color = "blue";
    }
    nonClickedPos.forEach((button) =>{
        document.querySelector(`#column${button}`).removeEventListener("click",setUserOption);
    })
    gameSection.style.opacity = .4;
    gameOverSection.style.display = "flex";
    // gameConsole = [
    //     [null,null,null],
    //     [null,null,null],
    //     [null,null,null]
    // ];
    nonClickedPos = [0,1,2,3,4,5,6,7,8];
    gameMoves = 0;
    gameState = false;
}
//to check wheather is over or not
const checkGameOver = (playingConsole,type) =>{
    // if (gameMoves < 5)return false;
    // console.log(type);
    // console.log(playingConsole , gameMoves)
    let mainRow = transRow = null;
    for (let i = 0; i < 3; ++i){
        mainRow = playingConsole[i][0] == playingConsole[i][1] && playingConsole[i][1] == playingConsole[i][2];
        transRow = playingConsole[0][i] == playingConsole[1][i] && playingConsole[1][i] == playingConsole[2][i];
        console.log(playingConsole[i][i] == type && (mainRow || transRow));
        if (playingConsole[i][i] == type && (mainRow || transRow)){
            // console.log("called");
            // gameOver(type);
            return true;
        }
    }
    let posCrossRow = negCrossRow = null;
    posCrossRow = playingConsole[0][0] == playingConsole[1][1] && playingConsole[1][1] == playingConsole[2][2];
    negCrossRow = playingConsole[0][2] == playingConsole[1][1] && playingConsole[1][1]== playingConsole[2][0];
    // console.log(playingConsole[1][1] == type && posCrossRow || negCrossRow);
    if (playingConsole[1][1] == type && (posCrossRow == true || negCrossRow == true)){
        // console.log("cross")
        // gameOver(type);
        return true;
    }
}
const minmaxOption = (gameGround,player,emptySpot) =>{
    if(checkGameOver(gameGround,"x") == true){
        return 10;
    }else if(checkGameOver(gameGround,"o") == true){
        return 20;
    }if(emptySpot.length == 0){
        return 0;
    }
    let moves = [];
    for (let i = 0 ; i < emptySpot.length; ++i){
        // console.log(gameGround)
        let boardRow = boardCol = move = currentSpot = {};
        move.index = emptySpot[i];
        currentSpot = emptySpot.filter(item => item != emptySpot[i]);
        boardRow = Math.floor(emptySpot[i] / 3);
        boardCol = emptySpot[i] % 3;
        gameGround[boardRow][boardCol] = player;
        // console.log(gameGround,emptySpot[i],boardRow,boardCol);
        if (player == "o"){
            let result = minmaxOption(gameGround,"x",currentSpot);
            move.score = result;
        }else{
            let result = minmaxOption(gameGround,"o",currentSpot);
            move.score = result;
        }
        gameGround[boardRow][boardCol] = null;
        moves.push(move);
        // console.log(moves)
    }
    // console.log(moves);
    let bestMove = null;
    if (player == "o"){
        for (let i =0 ; i < moves.length ; ++i ){
            if (moves[i].score > -1000){
                bestMove = moves[i].index;
            }
        }
    }else{
        for (let i =0 ; i < moves.length ; ++i){
            if (moves[i].score < 1000){
                bestMove = moves[i].index;
            }
        }
    }
    // console.log(moves,nonClickedPos,bestMove);
    return bestMove;
}
//controll the game movements and game logic
// const gameController = () =>{;
//     if (gameState){
//         getComputerOption();
//     }

// }
// for the restart functionality
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
