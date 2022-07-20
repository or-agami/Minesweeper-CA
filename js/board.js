'use strict'

const EMPTY = ''
const MINE = '💣'
const FLAG = '🚩'

function cellClicked(elCellI, elCellJ) {
    const lClickedCellLocation = { i: elCellI, j: elCellJ }
    // console.log('lClickedCellLocation:', lClickedCellLocation);
    if (!gGame.isRunning) startGame(lClickedCellLocation)

    checkCell(lClickedCellLocation)
}

function cellRightClicked(elCellI, elCellJ) {
    const rClickedCellLocation = { i: elCellI, j: elCellJ }
    // console.log('rClickedCellLocation:', rClickedCellLocation);
    if (!gGame.isRunning) startGame(rClickedCellLocation)

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
            board[randomRow][randomCol].content = MINE
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

function getSafeCells() {
    const safeCells = []
    for (let i = 0; i < gBoard.length; i++) {
        safeCells.push([])
        for (let j = 0; j < gBoard[i].length; j++) {
            const cell = gBoard[i][j];
            if (!cell.isMine) safeCells[i].push(cell.location)
        }
    }
    console.table(safeCells)
    return safeCells
}

function checkCell(location, rightClicked = false) {
    let gBoardContent = gBoard[location.i][location.j].content
    if (rightClicked) {
        if (gBoard[location.i][location.j].isFlagged) {
            gBoard[location.i][location.j].isFlagged = false
            gGame.flagsCount--
            // let mineInCell = (gBoardContent === MINE) ? true : false
            // renderCell(location, EMPTY, mineInCell)
            renderCell(location, EMPTY)
        }
        else {
            gBoard[location.i][location.j].isFlagged = true
            gGame.flagsCount++
            renderCell(location, FLAG)
        }
    } else {
        if (gBoard[location.i][location.j].isFlagged) return
        switch (gBoardContent) {
            case EMPTY:
                gBoard[location.i][location.j].content = countNeighbors(location, gBoard, MINE)
                gGame.clearedCount++
                break
            case MINE:
                console.log('You Dead:', MINE);

                break
            case FLAG:
                console.log('FLAG:', FLAG);
                break
        }
        renderCell(location, gBoard[location.i][location.j].content, true)
    }
    console.log(`(${gGame.flagsCount} === ${gLevel.mines}):`, (gGame.flagsCount === gLevel.mines));
    console.log(`(${gGame.clearedCount} === ${gLevel.size} ** 2 - ${gLevel.mines}):`, (gGame.clearedCount === gLevel.size ** 2 - gLevel.mines));
    if ((gGame.flagsCount === gLevel.mines) &&
        (gGame.clearedCount === gLevel.size ** 2 - gLevel.mines)) endGame(true)
}