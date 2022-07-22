'use strict'

// Board rendering
function renderBoard(mat, selector = '.board') {

    // console.table(mat)
    var strHTML = ''

    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>'

        for (var j = 0; j < mat[0].length; j++) {

            // Set cell database to his location
            const cell = mat[i][j]
            const cellData = `data-location="${i}-${j}"`

            // If cell has 0 neighbors, content is empty string
            var cellContent = (cell.content === 0) ? EMPTY : cell.content

            // If cell is flag update DOM
            if (cell.isFlagged) cellContent = FLAG

            var className = `cell cell-${i}-${j}`
            if (cell.isFlagged) className += ' flagged'
            className += (cell.isRevealed) ? ' cell-cleared' : ' hidden'

            strHTML += `<td class="${className}" ${cellData} onclick="cellClicked(${i}, ${j})" oncontextmenu="cellRightClicked(${i}, ${j})">${cellContent}</td>`
        }
        strHTML += '</tr>'
    }
    // Update DOM with mat
    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}

// Cell rendering
function renderCell(location, value, show = false, isRightClick = false) { // location such as: {i: 2, j: 7}
    // Select the cell from DOM
    const elCell = document.querySelector(`[data-location="${location.i}-${location.j}"]`)

    // If cell has 0 neighbors, content is empty string
    if (value === 0) value = EMPTY

    // If cell revealed update DOM
    if (show || gBoard[location.i][location.j].isRevealed) {
        elCell.classList.remove('hidden')
        elCell.classList.add('cell-cleared')
    }

    // If cell empty open his empty neighbors (in recursion)
    if ((value === EMPTY) && (!isRightClick)) {
        recursionOpening(location.i, location.j, value)
    }

    // If cell is flagged update DOM
    if (value === FLAG || elCell.classList.contains('flagged')) {
        elCell.classList.toggle('flagged')
    }

    // Update DOM with his content
    elCell.innerHTML = value
}

// Show all mines when losing
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

    // Check neighbors:
    for (let i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;

        for (let j = col - 1; j <= col + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue;
            if (i === row && j === col) continue;
            nextRow = i
            nextCol = j

            // Check if next location is in grid:
            if ((nextRow >= 0 && nextRow < gBoard.length) && (nextCol >= 0 && nextCol < gBoard[i].length)) {

                // Skip if cell already revealed:
                if (gBoard[nextRow][nextCol].isRevealed) continue

                // Remove flags if cell is not mine
                if (gBoard[nextRow][nextCol].isFlagged) gGame.flagsCount--
                gBoard[nextRow][nextCol].isFlagged = false

                // Update model:
                gBoard[nextRow][nextCol].isRevealed = true
                gBoard[nextRow][nextCol].content = gRawBoard[nextRow][nextCol]
                gGame.clearedCount++

                // Update DOM:
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
