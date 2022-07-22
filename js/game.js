'use strict'

const LIFE = '💗'
const HINT = '❔'
const SPOILER = '💡'

var gBoard, gGame
var gLevel = {
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

    // Init DOM lives count
    const elLivesCount = document.getElementById('lives-count')
    elLivesCount.innerText = `${LIFE}${LIFE}${LIFE}`

    // Init variables:
    resetTimer()
    gLevel.size = size
    gLevel.mines = mines
    elSelectedLevel.style.backgroundColor = '#0B2027'
    mineLocations = []
    gGame = {
        isRunning: false, isOver: false, inSpoilMod: false, clearedCount: 0, flagsCount: 0, livesCount: 3,
    }
    gCheats = {
        spoilers: 3, hints: 3
    }

    // Init board model
    gBoard = createBoard(size)

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
            elButton.style.backgroundColor = '#40798C'
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
        for (let i = 0; i < gGame.livesCount; i++) {
            currLives += LIFE
        }
        elLivesCount.innerText = currLives

        // If player ran out of lives, reveal the mines (game over)
        if (gGame.livesCount < 1) revealMines()

        else {
            // Update emoji for a 500 ms to soprised imoji
            const elImoji = document.querySelector('.emoji')
            elImoji.innerText = '😮'
            setTimeout(() => { elImoji.innerText = '🙂' }, 500)
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
    } else {
        elEmoji.innerText = '🤯'
    }
}