'use strict'

// Board rendering
function renderBoard(mat, selector = '.board') {

    console.table(mat)
    var strHTML = ''
    for (var i = 0; i < mat.length; i++) {

        strHTML += '<tr>'

        for (var j = 0; j < mat[0].length; j++) {

            const cell = mat[i][j]
            const cellData = `data-location="${i}-${j}"`
            
            var cellContent = (cell.content === 0) ? EMPTY : cell.content
            
            if (cell.isFlagged) cellContent = FLAG
            
            var className = `cell cell-${i}-${j}`
            if (cell.isFlagged) className += ' flagged'
            className += (cell.isRevealed) ? ' cleared' : ' hidden'
            // className += (cell.)
            
            strHTML += `<td class="${className}" ${cellData} onclick="cellClicked(${i}, ${j})" oncontextmenu="cellRightClicked(${i}, ${j})">${cellContent}</td>`
        }
        strHTML += '</tr>'
    }

    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}

// Cell rendering
function renderCell(location, value, show = false, isRightClick = false) { // location such as: {i: 2, j: 7}
    // Select the elCell and set the value
    const elCell = document.querySelector(`[data-location="${location.i}-${location.j}"]`)
    if (value === 0) value = EMPTY

    if (show || gBoard[location.i][location.j].isRevealed) {
        elCell.classList.remove('hidden')
        elCell.classList.add('cell-cleared')
    }

    if ((value === EMPTY) && (!isRightClick)) {
        recursionOpening(location.i, location.j, value)
    }

    if (value === FLAG || elCell.classList.contains('flagged')) {
        elCell.classList.toggle('flagged')
    }
    elCell.innerHTML = value

}

// Show all mines
function revealMines() {
    const playerWon = false
    for (let i = 0; i < mineLocations.length; i++) {
        renderCell(mineLocations[i], MINE, true)
    }
    endGame(playerWon)
}

// Neighbors Count
function countNeighbors(cellLocation, board, value) {
    const cellI = cellLocation.i
    const cellJ = cellLocation.j
    let neighborsCount = 0;

    for (let i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;

        for (let j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= board[i].length) continue;
            if (board[i][j].content === value) {
                neighborsCount++
            }
        }
    }
    return neighborsCount;
}

// Recursion opening
function recursionOpening(row, col, value) {

    var nextRow
    var nextCol

    for (let i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;

        for (let j = col - 1; j <= col + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue;
            if (i === row && j === col) continue;
            nextRow = i
            nextCol = j

            // check if next location is in grid:
            if ((nextRow >= 0 && nextRow < gBoard.length) && (nextCol >= 0 && nextCol < gBoard[i].length)) {
                if (gBoard[nextRow][nextCol].isRevealed) continue

                gBoard[nextRow][nextCol].isRevealed = true
                gBoard[nextRow][nextCol].isFlagged = false
                gBoard[nextRow][nextCol].content = gRawBoard[nextRow][nextCol]
                // gBoard[nextRow][nextCol].isRevealed = true

                gGame.clearedCount++

                renderCell({ i: nextRow, j: nextCol }, gRawBoard[nextRow][nextCol], true)
            }
        }
    }

}

// Get Random integer
function getRandomInt(min, max) { //The maximum is exclusive and the minimum is inclusive
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}
