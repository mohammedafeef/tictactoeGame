// dom element for the game
const documentAll = document.querySelectorAll;
const documentIndi = document.querySelector;
const gameButtons = documentAll(".button");
const gameTopRow = documentAll(".top-row .button");
const gameMiddleRow = documentAll(".middle-row .button");
const gameBottomRow = documentAll(".bottom-row .button");
// variables for the game
let gameConsole = [
    [null,null,null],
    [null,null,null],
    [null,null,null]
];
let gameState = false;
let gameMoves = 0;
let nonClickedPos = [0,1,2,3,4,5,6,7,8];
// funtions for the game 
//setting the changes in the game console variable
const setGameConsole = (address , type) =>{
    let consoleRow = address /3;
    let consoleColumn = address % 3;
    gameConsole[consoleRow][consoleColumn] = type;
    gameMoves++;
}
//getting the computer moves
const getComputerOption = () =>{
    let selectionAddress = Math.floor(Math.random()*nonClickedPos.length);
    let selectedOption = nonClickedPos[selectionAddress];
    delete nonClickedPos[selectionAddress];
    setGameConsole(selectedOption,"o");
    // to filter all empty location in the array
    nonClickedPos = nonClickedPos.filter(value => value != null);
    return selectedOption;
}
//for setting user changes to the front-end and back-end
const setUserOption = (item) =>{
    item.innerHTML = "x";
    nonClickedPos = nonClickedPos.filter(value => value != Number(item.id));
    setGameConsole(Number(item.id),"x");
    item.removeEventListener("click" , setUserOption(button));
    gameController();
}
//set the gameover changes
const gameOver = () =>{
    
}
//to check wheather is over or not
const checkGameOver = (type) =>{
    let mainRow = transRow = null;
    for (let i = 0; i < 3; ++i){
        mainRow = gameConsole[i][0] == gameConsole[i][1] == gameConsole[i][2];
        transRow = gameConsole[0][i] == gameConsole[1][i] == gameConsole[2][i];
        if (!isGameOver && (mainRow || transRow) && gameConsole[i][i] == type){
            gameOver();
            return;
        }
    }
    let posCrossRow = negCrossRow = null;
    posCrossRow = gameConsole[0][0] == gameConsole[1][1] == gameConsole[2][2];
    negCrossRow = gameConsole[0][2] == gameConsole[1][1] == gameConsole[2][0];
    if (gameConsole[1][1] == type && posCrossRow || negCrossRow){
        gameover();
        return;
    }
}
//controll the game movements and game logic
const gameController = () =>{
    checkGameOver("x");
    getComputerOption();
    checkGameOver("o");

}
//adding event listner for each button
gameButtons.forEach((button) =>{
    button.addEventListener("click" , setUserOption(button))
})
