'use strict';


const gameContainer = document.querySelector('.okvir');
const clickPlaces = document.querySelectorAll('.click__place');
const resetBtn = document.querySelector('.reset');
const message = document.querySelector('.message');

// Starter info
let player = 'x';
let gameInProgress = true;
const winCombinations = [
    [0,1,2],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];


const changePlayer = () => player==='x' ? player='o' : player='x';


const registerPlayerClick = function(div){
    const playerHTML = `<span class="player--${player}">${player}</span>`;
    div.insertAdjacentHTML('afterbegin', playerHTML);
}


const checkWinner = function(){
   return winCombinations.some(arr=> arr.every(arrNum=>clickPlaces[arrNum].children[0]?.innerHTML===player)
   );
}


const preview = function(eventType, e) {
   const div = e.target.closest('.click__place');

   if(eventType==='mouseover'){
    div.classList.add(`preview-player--${player}`);
   } else {
    div.classList.remove(`preview-player--${player}`);
   }

}


const reset = () => {
    gameInProgress = true;
    clickPlaces.forEach(place=>place.innerHTML='');
}

const draw = function(){    
   return [...clickPlaces].every(place=>place.innerHTML!=='');
}

const styleCombination = function(){
    const combination = winCombinations.find(arr=>arr.every(arr=>clickPlaces[arr].children[0]?.innerHTML===player));

   combination.forEach(arrNum=>clickPlaces[arrNum].children[0].classList
        .add('winAnimation'));

    clickPlaces.forEach((place, i)=>{
        if(combination.includes(i)) return;

        const innerSign = place.children[0];
        if(!innerSign) return;

        innerSign.style.opacity='0.4';
        
        //place.children[0]?.style.opacity='0.4';
    });
}


const showMessage = function(msg='Something went wrong', color='red'){
    const width = window.innerWidth;
    
    width>700 ? message.style.left='0%' : message.style.left='50%';

    message.style.opacity='1';
    message.style.color=color;
    message.innerHTML = msg;

    setTimeout(() => {
        message.style.left='-50%';
        message.style.opacity='0';     
    }, 3000);

}


// Main function (run other functions)

const startGame = function(e){

const click = e.target.closest('.click__place');
if(!click) return;

if(gameInProgress){
    
if(click.innerHTML!==''){
    showMessage('To polje je vec popunjeno');
    return;
};


click.classList.remove(`preview-player--${player}`);

registerPlayerClick(click);

const curPlayerWin = checkWinner();
const isDraw = draw();

if(curPlayerWin){
    showMessage(`Player ${player} is winner!`, 'yellowgreen');
    styleCombination();
    gameInProgress = false;
    return;
}

if(isDraw){
    showMessage('Draw!', 'gray');
    gameInProgress = false;
    return;
}

changePlayer();
} else {
    showMessage('Game has finished, click reset and play again!', 'gray');
}
}

// EVENT LISTENERS FOR UPPER FUNCTIONS

gameContainer.addEventListener('click', startGame);

resetBtn.addEventListener('click', reset);

clickPlaces.forEach(placeDiv=>{
    placeDiv.addEventListener('mouseover', preview.bind(this, 'mouseover'));
    placeDiv.addEventListener('mouseleave', preview.bind(this,'mouseleave'));
});