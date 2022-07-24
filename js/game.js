'use strict'


var levelNames = ['beginner', 'medium', 'expert']

const LIFE = '❤️'
const HINT = '❔'
const SPOILER = '💡'

var gBoard, gGame, boardsSaver
var gLevel = {
    levelName: '',
    size: 0,
    mines: 0,
}
var gGame = {
    isRunning: false,
    isOver: false,
    clearedCount: 0,
    flagsCount: 0,
    livesCount: 3,
}

// Prevent opening context menu in rightclick
window.oncontextmenu = () => { return false }

// Init game at load or at level select
function initGame(size = 4, mines = 2, elSelectedLevel) {

    // If no level selected, beginner level is auto selected
    elSelectedLevel = ((typeof elSelectedLevel) !== 'undefined') ? elSelectedLevel : document.getElementById(`size-${size}`)

    // Set the size of board header matching to table size
    const elBoardHeader = document.querySelector('.board-header')
    elBoardHeader.setAttribute('colspan', `${size}`)

    // Init DOM Emoji
    const elEmoji = document.querySelector('.emoji')
    elEmoji.innerText = `🙂`

    // Init DOM mines count
    const elMineCount = document.querySelector('.mine-count')
    elMineCount.innerText = (mines <= 9) ? `00${mines}` : `0${mines}`

    // Init DOM lives ,hints, spoils count
    const elLivesCount = document.getElementById('lives-count')
    const elHintsCount = document.getElementById('hints-count')
    const elSpoilsCount = document.getElementById('spoils-count')
    elLivesCount.innerText = `${LIFE}${LIFE}${LIFE}`
    elHintsCount.innerText = `${HINT}${HINT}${HINT}`
    elSpoilsCount.innerText = `${SPOILER}${SPOILER}${SPOILER}`

    // Init High Scores count
    for (let i = 0; i < levelNames.length; i++) {
        const levelName = levelNames[i];
        let elLevel = document.getElementById(levelName)
        elLevel.innerText = localStorage.getItem(levelName)
    }

    // Init variables:
    resetTimer()
    gLevel.size = size
    gLevel.mines = mines
    gLevel.levelName = (elSelectedLevel.innerText).toLowerCase()
    elSelectedLevel.style.backgroundColor = '#2F3E46'
    mineLocations = []
    boardsSaver = []
    gGame = {
        isRunning: false, isOver: false, inSpoilMod: false, clearedCount: 0, flagsCount: 0, livesCount: 3,
    }
    gCheats = {
        spoilers: 3, hints: 3
    }

    // Init board model
    gBoard = createBoard(size)
    // boardsSaver.push(copyMat(gBoard))
    boardsSaver.push(structuredClone(gBoard))

    // Init DOM board
    renderBoard(gBoard, '.board')
}

// Update data and DOM to match selected level
function levelSelect(size, mines, elButton) {

    // Select all level buttons element
    const elButtons = document.querySelectorAll('.difficulty-buttons button')
    const elEmoji = document.querySelector('.emoji')

    // Update emoji element to current level size
    elEmoji.setAttribute(`onclick`, `initGame(${size}, ${mines})`)

    // Remove colors for unselected buttons
    for (let i = 0; i < elButtons.length; i++) {
        const elLevelButton = elButtons[i];
        if (elButton === elLevelButton) {
            elButton.style.backgroundColor = '#52796F'
        }
        else elLevelButton.removeAttribute('style')
    }

    initGame(size, mines, elButton)
}

// Create board model
function createBoard(size) {
    const board = []
    for (let i = 0; i < size; i++) {
        board.push([])
        for (let j = 0; j < size; j++) {
            const location = { i, j }
            // Fill board with variablse
            board[i].push({ location, isClicked: false, isMine: false, isFlagged: false, isRevealed: false, content: EMPTY })
        }
    }
    return board
}

// Start game with cell to avoid at first click
function startGame(avoidCell) {

    // Update model
    gGame.isRunning = true

    // Fill board with mines
    fillMines(gBoard, avoidCell)

    // Create raw board with only the content of cells
    getRawBoard(gBoard)

    // Init time watch
    startTimer()
}

// Check if the game is over
function checkGameOver(clickedOnMine = false) {

    // Select lives count element
    const elLivesCount = document.getElementById('lives-count')

    // Check if player cleared all empty cells and flagged all mines
    if ((gGame.flagsCount === gLevel.mines) &&
        (gGame.clearedCount === gLevel.size ** 2 - gLevel.mines)) {
        endGame(true)
    }

    // Reduce player life if he clicked on mine
    if (clickedOnMine) {
        gGame.livesCount--
        let currLives = ''
        elLivesCount.innerText = LIFE.repeat(gGame.livesCount)

        // If player ran out of lives, reveal the mines (game over)
        if (gGame.livesCount < 1) revealMines()

        else {
            // Update emoji for a 600 ms to soprised imoji
            const elImoji = document.querySelector('.emoji')
            elImoji.innerText = '😮'
            setTimeout(() => { elImoji.innerText = '🙂' }, 600)
        }
    }
}

// End game with player lost or won as parameter
function endGame(playerWon) {

    // Stop time watch
    stopTimer()

    // Update model that the game is over
    gGame.isRunning = false
    gGame.isOver = true

    // Update dome with appropriate emoji
    const elEmoji = document.querySelector('.emoji')
    if (playerWon) {
        elEmoji.innerText = '😎'

        const elTimer = document.getElementById('timer')
        const timeToWin = elTimer.innerText
        console.log('timeToWin:', timeToWin);
        updateScore(timeToWin)

    } else {
        elEmoji.innerText = '🤯'
    }
}

// Update best score
function updateScore(time) {
    var score = +time
    const levelName = gLevel.levelName
    const levelScore = localStorage.getItem(levelName)

    // Check if it's the first play in this level
    if (levelScore !== null) {

        // If it's not check if it's best score
        if (score < levelScore) {
            localStorage.setItem(levelName, score);
            console.log('score is smaller:', score);
        }
    } else localStorage.setItem(levelName, score)

    const timeInStr = ` ${localStorage.getItem(levelName)} Sec`


    console.log('score:', score);
    console.log('levelScore:', levelScore);

    let elLevel = document.getElementById(levelName)
    elLevel.innerText = timeInStr
}