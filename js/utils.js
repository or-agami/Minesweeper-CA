'use strict'

// Board rendering
function renderBoard(mat, selector) {

    var strHTML = ''
    for (var i = 0; i < mat.length; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < mat[0].length; j++) {

            const cell = mat[i][j]
            const className = 'cell cell-' + i + '-' + j
            strHTML += `<td class="${className}" onclick="cellClicked(${i}, ${j})">${cell}</td>`
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
    elCell.innerHTML = value
}


// Get Random integer
function getRandomInt(min, max) { //The maximum is exclusive and the minimum is inclusive
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}
