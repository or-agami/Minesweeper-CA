
function safeClick() {

    const emptyCells = getEmptyCellsLocation()
    const randomLocation = emptyCells[getRandomInt(0, emptyCells.length)]

    if (typeof randomLocation === 'undefined') {
        alert(`There's no more empty cells`)
        return
    }

    gBoard[randomLocation.i][randomLocation.j].content = countNeighbors(randomLocation, gBoard, MINE)
    gBoard[randomLocation.i][randomLocation.j].isRevealed = true
    gGame.clearedCount++

    renderCell(randomLocation, gBoard[randomLocation.i][randomLocation.j].content, true, true)
}