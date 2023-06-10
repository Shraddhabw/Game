var oriBoard;
const humanPlayer='O';
const aiPlayer='X';
const wincombo=[
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

const cell=document.querySelectorAll(".cell");
console.log(cell);

startGame();

function startGame()
{
    document.querySelector(".endgame").style.display = "none";
    oriBoard=Array.from(Array(9).keys());
    console.log(oriBoard);
    for(var i=0;i<cell.length;i++)
    {
        cell[i].innerText = "";
        cell[i].style.removeProperty('background-color');
        cell[i].addEventListener('click',turnclick,false);

    }
}

function turnclick(block)
{
    if(typeof oriBoard[block.target.id] == 'number')
    {
    
    turn(block.target.id,humanPlayer);
    if(!checkWin(oriBoard,humanPlayer) && !checkTie()) turn(bestSpot(),aiPlayer);
    }
    
}

function turn(blockId,player)
{
    oriBoard[blockId]=player;
    document.getElementById(blockId).innerText=player;
    let gameWon=checkWin(oriBoard,player);
    if(gameWon) gameOver(gameWon);
}

function checkWin(oriBoard,player)
{
    let plays = oriBoard.reduce((a,e,i) => (e===player) ? a.concat(i) : a,[]);
    let gameWon=null;
    for( let[index,win] of wincombo.entries())
    {
        if(win.every(ele => plays.indexOf(ele) > -1))
        {
            gameWon={index: index,player: player};
            break;
            
        }
    }
    return gameWon;
}
function gameOver(gameWon)
{
     for(let i of wincombo[gameWon.index])
     {
        document.getElementById(i).style.backgroundColor = gameWon.player == humanPlayer ? "IndianRed" : "SteelBlue";
     }
     for(let i=0;i<cell.length;i++)
     
     {
        cell[i].removeEventListener('click',turnclick,false);
     }
     declareWinner(gameWon.player == humanPlayer ? "Congo! You win!!!!" : "Sorry!!! You Lose!");
}

function declareWinner(who)
{
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText= who;
}

function emptyBlock()
{
    return oriBoard.filter(s => typeof s=='number');
}

function bestSpot()
{

    return minmax(oriBoard,aiPlayer).index;
}


function checkTie()
{
    if(emptyBlock().length==0)
    {
        for(var i=0;i<cell.length;i++)
        {
            cell[i].style.backgroundColor='LightSeaGreen';
            cell[i].removeEventListener('click',turnclick,false);
        }
        declareWinner("Tie Game!!");
        return true;
    }
    return false;
}

function minmax(newBoard,player)
{
    var avaispot=emptyBlock();

    if(checkWin(newBoard,humanPlayer))
    return {score:-10};

    else if(checkWin(newBoard,aiPlayer))
    return {score:10};

    else if(avaispot.length === 0)
    return {score:0};

    var moves=[];

    for(var i=0;i<avaispot.length;i++)
    {
        var move={};
        move.index=newBoard[avaispot[i]];
        oriBoard[avaispot[i]]=player;

        if(player==aiPlayer)
        {
            var result=minmax(newBoard,humanPlayer);
            move.score=result.score;
        }
        else
        {
            var result=minmax(newBoard,aiPlayer);
            move.score=result.score;
        }

        newBoard[avaispot[i]] = move.index;

        moves.push(move);
    }

    var bestmove;
    if(player=== aiPlayer)
    {
        var bestscore=-10000;
        for(var i=0;i<moves.length;i++)
        {
            if(moves[i].score>bestscore)
            {
                bestscore=moves[i].score;
                bestmove=i;
            }
        }
    }
    else
    {
        var bestscore=10000;
        for(var i=0;i<moves.length;i++)
        {
            if(moves[i].score<bestscore)
            {
                bestscore=moves[i].score;
                bestmove=i;
            }
        }
    }
    return moves[bestmove];



}