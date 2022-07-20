'use strict'

// Board rendering
function renderBoard(mat, selector) {

    var strHTML = ''
    for (var i = 0; i < mat.length; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < mat[0].length; j++) {

            const cell = mat[i][j].content
            const contentData = mat[i][j].content
            const className = 'cell cell-' + i + '-' + j
            strHTML += `<td class="${className}" data-content="${contentData}" onclick="cellClicked(${i}, ${j})" oncontextmenu="cellRightClicked(${i}, ${j})">${cell}</td>`
        }
        strHTML += '</tr>'
    }
    
    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}

// Cell rendering
function renderCell(location, value) { // location such as: {i: 2, j: 7}
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    if (!isNaN(value)) {
        elCell.removeAttribute('data-content')
        elCell.classList.add("cleared")
    }
    else elCell.dataset.content = value
    elCell.innerHTML = value
    
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
    console.log('neighborsCount:', neighborsCount);
    return neighborsCount;
}

// Get Random integer
function getRandomInt(min, max) { //The maximum is exclusive and the minimum is inclusive
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}
