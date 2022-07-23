'use strict'

const EMPTY = ''
const MINE = '💣'
const FLAG = '🚩'
var gRawBoard, mineLocations

// Cell left clicked
function cellClicked(elCellI, elCellJ) {

    // Set cell location to object
    const lClickedCellLocation = { i: elCellI, j: elCellJ }

    // If the game is not started, start game
    if (!gGame.isRunning && !gGame.isOver) startGame(lClickedCellLocation)

    checkCell(lClickedCellLocation)
}

function cellRightClicked(elCellI, elCellJ) {

    // Set cell location to object
    const rClickedCellLocation = { i: elCellI, j: elCellJ }

    // If the game is not started, start game
    if (!gGame.isRunning && !gGame.isOver) startGame(rClickedCellLocation)

    checkCell(rClickedCellLocation, true)
}

// Fill mines with random location and cell to avoid in first click
function fillMines(board, skipCellLocation) {

    // Loop with mines amount acording to level
    for (let i = 0; i < gLevel.mines;) {

        // Set random location to each mine
        const randomRow = getRandomInt(0, board.length)
        const randomCol = getRandomInt(0, board[0].length)
        const randomLocation = { i: randomRow, j: randomCol }

        // Continue only if random location is not as the first click
        if ((randomRow !== skipCellLocation.i ||
            randomCol !== skipCellLocation.j) &&
            cellIsEmpty(randomLocation)) {
            i++

            // Update model:
            board[randomRow][randomCol].isMine = true
            board[randomRow][randomCol].content = MINE
            mineLocations.push(randomLocation)

            // update DOM:
            renderCell(randomLocation, MINE)
        }
    }
}

// Check if cell location is empty
function cellIsEmpty(location) {
    if (gBoard[location.i][location.j].content === EMPTY) {
        return true
    }
    return false
}

// Get all the empty cells locations in array
function getEmptyCellsLocation() {
    const emptyCellsLocation = []

    for (let i = 0; i < gRawBoard.length; i++) {
        for (let j = 0; j < gRawBoard[i].length; j++) {

            // Only include empty cells that are not revealed
            if ((gRawBoard[i][j] !== MINE) && (!gBoard[i][j].isRevealed)) {

                // Push empty cell location to array, eg. { 3, 2 }
                emptyCellsLocation.push({ i, j })
            }
        }
    }
    return emptyCellsLocation
}

// Get raw board with only the content of the cells
function getRawBoard(board) {

    gRawBoard = []

    for (let i = 0; i < board.length; i++) {
        gRawBoard.push([])

        for (let j = 0; j < board[i].length; j++) {
            const rawBoardCell = board[i][j];

            // If cell is containg mine (💣) add to array
            if (rawBoardCell.isMine) gRawBoard[i].push(MINE)

            // Else count cell's mines neighbors and add count to array
            else {
                const cellNeighbos = countNeighbors({ i, j }, board, MINE)

                // If cell don't have mines neighbors push 0
                if (cellNeighbos === EMPTY) gRawBoard[i].push(0)

                else gRawBoard[i].push(cellNeighbos)
            }
        }
    }
    return gRawBoard
}

// Check cell content and act appropriately
function checkCell(location, rightClicked = false) {
    let gBoardContent = gBoard[location.i][location.j].content

    // Return if clecked cell is already revealed
    if (gBoard[location.i][location.j].isRevealed) return

    // Return if game is over
    if (gGame.isOver) return

    // Check if spoil mod is on
    if (gGame.inSpoilMod && !rightClicked) return spoilCells(location)

    // Add current state for the undo function
    boardsSaver.push(structuredClone(gBoard))

    // If player right clicked a cell:
    if (rightClicked) {

        // Flag or Unflag cell accordingly
        if (gBoard[location.i][location.j].isFlagged) {

            // Model:
            gBoard[location.i][location.j].isFlagged = false
            gGame.flagsCount--

            // DOM:
            if (gBoard[location.i][location.j].isMine) renderCell(location, MINE, false, rightClicked)
            else renderCell(location, EMPTY, false, rightClicked)
        } else {

            // Model:
            gBoard[location.i][location.j].isFlagged = true
            gGame.flagsCount++

            // DOM:
            renderCell(location, FLAG, false, rightClicked)
        }
        // Update DOM mines count according the flag count 
        const elMineCount = document.querySelector('.mine-count')
        elMineCount.innerText = ((gLevel.mines - gGame.flagsCount) <= 9) ? `00${gLevel.mines - gGame.flagsCount}` : `0${gLevel.mines - gGame.flagsCount}`
    }

    // If player left clicked a cell
    else {

        // Return if cell is flagged
        if (gBoard[location.i][location.j].isFlagged) return

        // Update game accordingly to cell content
        switch (gBoardContent) {
            case EMPTY:
                gBoard[location.i][location.j].content = countNeighbors(location, gBoard, MINE)
                gBoard[location.i][location.j].isRevealed = true
                gGame.clearedCount++
                break
            case MINE:
                checkGameOver(gBoardContent === MINE)
                return
        }
        // Update DOM
        renderCell(location, gBoard[location.i][location.j].content, true)
    }
    // Check if the game is over
    checkGameOver()
}