'use strict'

// Board rendering
function renderBoard(mat, selector) {

    console.table(mat)
    var strHTML = ''
    for (var i = 0; i < mat.length; i++) {

        strHTML += '<tr>'

        for (var j = 0; j < mat[0].length; j++) {

            const cell = mat[i][j]
            // const cellData = `date-i="${i}" data-j="${j}"`
            const cellData = `data-location="${i}-${j}"`

            var cellContent = cell.content
            if (cell.isFlagged) cellContent = FLAG

            var className = `cell cell-${i}-${j}`
            if (cell.isFlagged) className += ' flagged'
            className += (cell.isRevealed) ? ' cleared' : ' hidden'
            // className += ()

            strHTML += `<td class="${className}" ${cellData} onclick="cellClicked(${i}, ${j})" oncontextmenu="cellRightClicked(${i}, ${j})">${cellContent}</td>`
        }
        strHTML += '</tr>'
    }

    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}

// Cell rendering
function renderCell(location, value, show = false) { // location such as: {i: 2, j: 7}
    // Select the elCell and set the value
    const elCell = document.querySelector(`[data-location="${location.i}-${location.j}"]`)

    if (show || gBoard[location.i][location.j].isRevealed) elCell.classList.remove('hidden')


    if (value === FLAG || elCell.classList.contains('flagged')) {
        elCell.classList.toggle('flagged')
        elCell.classList.toggle('hidden')
    } else {
        // elCell.classList.add('hidden')
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
    // console.log('neighborsCount:', neighborsCount);
    return neighborsCount;
}

// Get Random integer
function getRandomInt(min, max) { //The maximum is exclusive and the minimum is inclusive
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}
