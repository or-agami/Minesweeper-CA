var gCheats = {
    spoilers: 3,
    hints: 3,
}

// Player clicked on hint ("Safe Click")
function safeClick(elHintsCount) {

    // Return if game is not running
    if (!gGame.isRunning) return

    // Return and Alert user if he ran out of hints
    if (gCheats.hints === 0) return alert(`There's no more hints for you`)

    // Get all empty cells
    const emptyCells = getEmptyCellsLocation()

    // Select random empty cell location
    const randomLocation = emptyCells[getRandomInt(0, emptyCells.length)]

    // Return and Alert user if there is only mines left
    if (typeof randomLocation === 'undefined') return alert(`There's no more empty cells`)

    // Select cell element
    const elCell = document.querySelector(`[data-location="${randomLocation.i}-${randomLocation.j}"]`)

    // Flash cell by adding class for a second (style added with css)
    elCell.classList.add('hinted')
    setTimeout(() => { elCell.classList.remove('hinted') }, 1000)

    // Update Model hints count
    gCheats.hints--

    // Update DOM hints count
    let currHints = ''
    for (let i = 0; i < gCheats.hints; i++) {
        currHints += HINT
    }
    elHintsCount.innerText = currHints
}

// Player clicked on spoiler (flash 9 cells for a sec around clicked cell)
function spoilClick(elSpoilCount) {

    // Return if game is not running
    if (!gGame.isRunning) return

    // Return and Alert user if he ran out of spoilers
    if (gCheats.spoilers === 0) return alert(`There's no more spoilers for you`)

    // Set or Unset spoil mode (so player can regret pre cell select)
    if (!gGame.inSpoilMod) {

        // Update model
        gGame.inSpoilMod = true

        // Set strobing to spoil count element until cell is clicked
        elSpoilCount.classList.add('spoiled')
        gCheats.spoilers--
    } else {
        gGame.inSpoilMod = false
        elSpoilCount.classList.remove('spoiled')
        gCheats.spoilers++
    }
}

// Flash 9 cells
function spoilCells(location) {
    var elCellToFlash
    const elSpoilCount = document.getElementById('spoil-count')
    // Remove strobing to spoil count element
    elSpoilCount.classList.remove('spoiled')

    // Select cell and all his neighbors:
    for (let i = location.i - 1; i <= location.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;

        for (let j = location.j - 1; j <= location.j + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue;

            elCellToFlash = document.querySelector(`[data-location="${i}-${j}"]`)

            // If spoil mode on reveal cells for a second and run this func again
            if (gGame.inSpoilMod) {
                elCellToFlash.classList.remove('hidden')
                elCellToFlash.classList.add('cell-flashed')
                setTimeout(() => { spoilCells(location) }, 1000)
            }
            // If spoil mode off and cell is not cleared hid cells
            else if (!elCellToFlash.classList.contains('cell-cleared')) {
                elCellToFlash.classList.add('hidden')
                elCellToFlash.classList.remove('cell-flashed')
            }
        }
    }

    // Update DOM spoil count and turn off spoil mode
    if (gGame.inSpoilMod) {
        gGame.inSpoilMod = false
        let currSpoilers = ''
        for (let i = 0; i < gCheats.spoilers; i++) {
            currSpoilers += SPOILER
        }
        elSpoilCount.innerText = currSpoilers
    }
}