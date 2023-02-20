function hideCompleted() {
    var quests = document.getElementsByClassName('completed')
    console.log(quests.length)
    for (const quest of quests) {
        quest.style.display = 'none';
    }
}

function hideBlocked() {
    var quests = document.getElementsByClassName('blocked')
    console.log(quests.length)
    for (const quest of quests) {
        quest.style.display = 'none';
    }
}

function showCompleted() {
    var quests = document.getElementsByClassName('completed')
    console.log(quests.length)
    for (const quest of quests) {
        quest.style.display = 'block';
    }
}

function showBlocked() {
    var quests = document.getElementsByClassName('blocked')
    console.log(quests.length)
    for (const quest of quests) {
        quest.style.display = 'block';
    }s
}

document.getElementById('showcompleted').addEventListener("click", () => {
    if(document.getElementById('showcompleted').checked) {
        showCompleted()
    }
    else {
        hideCompleted()
    }
})

document.getElementById('showblocked').addEventListener("click", () => {
    if(document.getElementById('showblocked').checked) {
        showBlocked()
    }
    else {
        hideBlocked()
    }
})

hideCompleted()
hideBlocked()
