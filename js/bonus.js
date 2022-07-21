var gCheats = {
    spoliers: 3,
    hints: 3,
}

function safeClick(elHintsCount) {

    if (gCheats.hints === 0) return alert(`There's no more hints for you`)

    const emptyCells = getEmptyCellsLocation()
    const randomLocation = emptyCells[getRandomInt(0, emptyCells.length)]

    if (typeof randomLocation === 'undefined') {
        alert(`There's no more empty cells`)
        return
    }

    // gBoard[randomLocation.i][randomLocation.j].content = countNeighbors(randomLocation, gBoard, MINE)
    // gBoard[randomLocation.i][randomLocation.j].isRevealed = true
    // gGame.clearedCount++
    
    const elCell = document.querySelector(`[data-location="${randomLocation.i}-${randomLocation.j}"]`)
    elCell.classList.add('hinted')
    setTimeout(() => { elCell.classList.remove('hinted') }, 1000)


    gCheats.hints--

    let currHints = ''
    for (let i = 0; i < gCheats.hints; i++) {
        currHints += HINT
    }
    elHintsCount.innerText = currHints

    // renderCell(randomLocation, gBoard[randomLocation.i][randomLocation.j].content, true, true)
}