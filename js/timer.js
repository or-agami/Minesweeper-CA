'use strict'

var seconds = 0
var tens
const elSeconds = document.getElementById('timer')
var timerInterval, startedTime

function startTimer() {
    clearInterval(timerInterval)
    startedTime = Date.now()
    timerInterval = setInterval(timerInit, 1)
}

function stopTimer() {
    clearInterval(timerInterval)
    let timeElaps = elSeconds.innerText
    return timeElaps
}

function resetTimer() {
    clearInterval(timerInterval)
    startedTime = 0
    seconds = '000'
    elSeconds.innerHTML = seconds
}

function timerInit() {
    tens = Date.now() - startedTime

    if (tens > 999) {
        startedTime = Date.now()
        seconds++

        if (seconds <= 9) {
            elSeconds.innerHTML = '00' + seconds
        } 
        else if (seconds <= 99) {
            elSeconds.innerHTML = '0' + seconds
        } 
        else elSeconds.innerHTML = seconds
    }
    else return
}
