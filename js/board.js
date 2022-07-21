'use strict'

const EMPTY = ''
const MINE = '💣'
const FLAG = '🚩'
var gRawBoard, mineLocations

function cellClicked(elCellI, elCellJ) {
    const lClickedCellLocation = { i: elCellI, j: elCellJ }
    // console.log('lClickedCellLocation:', lClickedCellLocation);
    if (!gGame.isRunning && !gGame.isOver) startGame(lClickedCellLocation)

    checkCell(lClickedCellLocation)
}

function cellRightClicked(elCellI, elCellJ) {
    const rClickedCellLocation = { i: elCellI, j: elCellJ }
    // console.log('rClickedCellLocation:', rClickedCellLocation);
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
        console.log('cell is empty');
        return true
    }
    console.log('cell is not empty');
    return false
}

// get board with all known location (eg. cell with 2 neighbors mines cell = 2)
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
    // console.table(gRawBoard)
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
            // elMineCount
            // let mineInCell = (gBoardContent === MINE) ? true : false
            // renderCell(location, EMPTY, mineInCell)
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
                gGame.clearedCount++
                // revealEmptyNeighbors(location)
                break
            case MINE:
                // endGame(false)
                revealMines()
                return
            case FLAG:
                console.log('FLAG:', FLAG);
                break
        }
        renderCell(location, gBoard[location.i][location.j].content, true)
    }
    // console.log(`(${gGame.flagsCount} === ${gLevel.mines}):`, (gGame.flagsCount === gLevel.mines));
    // console.log(`(${gGame.clearedCount} === ${gLevel.size} ** 2 - ${gLevel.mines}):`, (gGame.clearedCount === gLevel.size ** 2 - gLevel.mines));
    if ((gGame.flagsCount === gLevel.mines) &&
        (gGame.clearedCount === gLevel.size ** 2 - gLevel.mines)) endGame(true)
}