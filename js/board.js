'use strict'

const EMPTY = ''
const MINE = '💣'
const FLAG = '🚩'
var gRawBoard, mineLocations

function cellClicked(elCellI, elCellJ) {
    const lClickedCellLocation = { i: elCellI, j: elCellJ }
    if (!gGame.isRunning && !gGame.isOver) startGame(lClickedCellLocation)

    checkCell(lClickedCellLocation)
}

function cellRightClicked(elCellI, elCellJ) {
    const rClickedCellLocation = { i: elCellI, j: elCellJ }
    if (!gGame.isRunning && !gGame.isOver) startGame(rClickedCellLocation)

    checkCell(rClickedCellLocation, true)

}

function fillMines(board, skipCellLocation) {
    for (let i = 0; i < gLevel.mines;) {
        const randomRow = getRandomInt(0, board.length)
        const randomCol = getRandomInt(0, board[0].length)
        const randomLocation = { i: randomRow, j: randomCol }
        if ((randomRow !== skipCellLocation.i ||
            randomCol !== skipCellLocation.j) &&
            cellIsEmpty(randomLocation)) {
            i++
            // Model:
            board[randomRow][randomCol].isMine = true
            board[randomRow][randomCol].content = MINE
            mineLocations.push(randomLocation)
            // DOM:
            renderCell(randomLocation, MINE)
        }
    }
}

function cellIsEmpty(location) {
    if (gBoard[location.i][location.j].content === EMPTY) {
        return true
    }
    return false
}

function getEmptyCellsLocation() {    
    const emptyCellsLocation = []

    for (let i = 0; i < gRawBoard.length; i++) {
        for (let j = 0; j < gRawBoard[i].length; j++) {
            if ((gRawBoard[i][j] !== MINE) && (!gBoard[i][j].isRevealed)) {
                emptyCellsLocation.push({ i, j })
            }
        }
    }
    return emptyCellsLocation
}

function getRawBoard(board) {
    gRawBoard = []
    for (let i = 0; i < board.length; i++) {
        gRawBoard.push([])
        for (let j = 0; j < board[i].length; j++) {
            const rawBoardCell = board[i][j];
            if (rawBoardCell.isMine) gRawBoard[i].push(MINE)
            else {
                const cellNeighbos = countNeighbors({ i, j }, board, MINE)
                if (cellNeighbos === EMPTY) gRawBoard[i].push(0)
                else gRawBoard[i].push(cellNeighbos)
            }
        }
    }
    console.table(gRawBoard) // delete me
    return gRawBoard
}


function checkCell(location, rightClicked = false) {
    let gBoardContent = gBoard[location.i][location.j].content
    if (gBoard[location.i][location.j].isRevealed) return
    if (gGame.isOver) return
    if (rightClicked) {
        if (gBoard[location.i][location.j].isFlagged) {
            gBoard[location.i][location.j].isFlagged = false
            gGame.flagsCount--
            renderCell(location, EMPTY, false, rightClicked)
        }
        else {
            gBoard[location.i][location.j].isFlagged = true
            gGame.flagsCount++
            renderCell(location, FLAG, false, rightClicked)
        }
        const elMineCount = document.querySelector('.mine-count')
        elMineCount.innerText = ((gLevel.mines - gGame.flagsCount) <= 9) ? `00${gLevel.mines - gGame.flagsCount}` : `0${gLevel.mines - gGame.flagsCount}`
    } else {
        if (gBoard[location.i][location.j].isFlagged) return
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
        renderCell(location, gBoard[location.i][location.j].content, true)
    }
    checkGameOver()
}