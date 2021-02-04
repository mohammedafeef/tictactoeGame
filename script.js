// dom element for the game
const documentAll = document.querySelectorAll;
const documentIndi = document.querySelector;
const gameButtons = document.querySelectorAll(".button");
const gameTopRow = document.querySelectorAll(".top-row .button");
const gameMiddleRow = document.querySelectorAll(".middle-row .button");
const gameBottomRow = document.querySelectorAll(".bottom-row .button");
const gameSection = document.querySelector(".game");
const gameOverSection = document.querySelector(".game-over");
const restartButton = document.querySelector(".restart");
// variables for the game
let gameConsole = [
    [null,null,null],
    [null,null,null],
    [null,null,null]
];
let gameMoves = 0;
let nonClickedPos = [0,1,2,3,4,5,6,7,8];
// funtions for the game 
//setting the changes in the game console variable
const setGameConsole = (address , type) =>{
    let consoleRow = Math.floor(address /3);
    let consoleColumn = address % 3;
    console.log(address);
    nonClickedPos = nonClickedPos.filter(value => value != address);
    console.log(nonClickedPos);
    console.log(address,type,consoleRow,consoleColumn);
    gameConsole[consoleRow][consoleColumn] = type;
    document.querySelector(`#column${address}`).innerHTML = type;
    gameMoves++;
}
//getting the computer moves
const getComputerOption = () =>{
    let selectionAddress = Math.floor(Math.random()*nonClickedPos.length);
    let selectedOption = nonClickedPos[selectionAddress];
    setGameConsole(selectedOption,"o");
    return selectedOption;
}
//for setting user changes to the front-end and back-end
const setUserOption = (item) =>{
    item.removeEventListener("click" , setUserOption);
    let userSelection = item.id;
    userSelection = Number(userSelection[userSelection.length - 1]);
    setGameConsole(userSelection,"x");
    gameController();
}
//set the gameover changes
const gameOver = () =>{
    gameSection.style.opacity = .4;
    gameOverSection.style.display = "block";
    gameConsole = [
        [null,null,null],
        [null,null,null],
        [null,null,null]
    ];
    nonClickedPos = [0,1,2,3,4,5,6,7,8];
    gameMoves = 0;
}
//to check wheather is over or not
const checkGameOver = (type) =>{
    if (gameMoves < 5)return;
    let mainRow = transRow = null;
    for (let i = 0; i < 3; ++i){
        mainRow = gameConsole[i][0] == gameConsole[i][1] == gameConsole[i][2];
        transRow = gameConsole[0][i] == gameConsole[1][i] == gameConsole[2][i];
        if (gameConsole[i][i] == type && (mainRow || transRow)){
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
// for the restart functionality
const resetConsole = () =>{
    gameButtons.forEach((button) =>{
        button.innerHTML = "";
        button.addEventListener("click" , setUserOption(button));
    })
    gameSection.style.opacity = 1;
    gameOverSection.style.display = "none";

}
//adding event listner for each button
gameButtons.forEach((button) =>{
    button.addEventListener("click" , () =>{setUserOption(button)})
})
//adding click event for the restart button
restartButton.addEventListener("click",()=>{resetConsole()})
