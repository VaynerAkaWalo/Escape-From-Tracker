const db = require('../modules/db')

function getCompleted(login, callback) {
    let sql = `select questName from completed where login like ?`;
    db.all(sql, [login], (err, row) => {
        let result = []
        if(err) {
            console.log("Error: " + err)
        }
        row.forEach((row) => {
            result.push(row.questName)
        })
        callback(null, result)

    })
}

function getQuests(username ,callback) {
    getCompleted(username, (err, completed) => {
        let sql = `select name, trader, map, type, next, previous from quests`;
        db.all(sql, [], (err, row) => {
            let result = []
            if(err) {
                console.log("Error: " + err)
            }
            row.forEach((row) => {
                let status;
                if(completed.includes(row.name)) {
                    status = 'completed'
                }
                else if(completed.includes(row.previous) || row.previous === 'null') {
                    status = 'in progress'
                }
                else {
                    status = 'blocked'
                }
                result.push({
                    questName: row.name,
                    trader: row.trader,
                    map: row.map,
                    type: row.type,
                    status
                })
            })
            callback(null, result)
        })
    })

}

function getQuestsFromTrader(username ,trader, callback) {
    getCompleted(username, (err, completed) => {
        let sql = `select name, trader, map, type, next, previous from quests where trader like ?`;
        db.all(sql, [trader], (err, row) => {
            let result = []
            if(err) {
                console.log("Error: " + err)
            }
            row.forEach((row) => {
                let status;
                if(completed.includes(row.name)) {
                    status = 'completed'
                }
                else if(completed.includes(row.previous) || row.previous === 'null') {
                    status = 'in progress'
                }
                else {
                    status = 'blocked'
                }
                result.push({
                    questName: row.name,
                    trader: row.trader,
                    map: row.map,
                    type: row.type,
                    status
                })
            })
            callback(null, result)

        })
    })
}

function getQuestsFromMap(username ,map, callback) {
    getCompleted(username, (err, completed) => {
        let sql = `select name, trader, map, type, next, previous from quests where map like ?`;
        db.all(sql, [map], (err, row) => {
            let result = []
            if(err) {
                console.log("Error: " + err)
            }
            row.forEach((row) => {
                let status;
                if(completed.includes(row.name)) {
                    status = 'completed'
                }
                else if(completed.includes(row.previous) || row.previous === 'null') {
                    status = 'in progress'
                }
                else {
                    status = 'blocked'
                }
                result.push({
                    questName: row.name,
                    trader: row.trader,
                    map: row.map,
                    type: row.type,
                    status
                })
            })
            callback(null, result)

        })
    })
}

function getQuestInfo(username ,name, callback) {
    getCompleted(username, (err, completed) => {
        let sql = `select * from quests where name like ?`;
        db.get(sql, [name], (err, row) => {
            if(err) {
                console.log("Error: " + err)
            }
            let status;
            if(completed.includes(row.name)) {
                status = 'completed'
            }
            else if(completed.includes(row.previous) || row.previous === 'null') {
                status = 'in progress'
            }
            else {
                status = 'blocked'
            }
            let result = {
                questName: row.name,
                trader: row.trader,
                map: row.map,
                status,
                dialogue: row.dialogue,
                image: row.image,
                next: row.next,
                previous: row.previous
            }
            callback(null, result)
        })
    })
}

function getObjectives(questName, callback) {
    let sql = `select name from objectives where questName like ?`;
    db.all(sql, [questName], (err, row) => {
        let result = []
        if(err) {
            console.log("Error: " + err)
        }
        row.forEach((row) => {
            result.push(row.name)
        })

        callback(null, result)
    })
}

function getRequirements(questName, callback) {
    let sql = `select name from requirements where questName like ?`;
    db.all(sql, [questName], (err, row) => {
        let result = []
        if(err) {
            console.log("Error: " + err)
        }
        row.forEach((row) => {
            result.push(row.name)
        })

        callback(null, result)
    })
}

function getRewards(questName, callback) {
    let sql = `select name from rewards where questName like ?`;
    db.all(sql, [questName], (err, row) => {
        let result = []
        if(err) {
            console.log("Error: " + err)
        }
        row.forEach((row) => {
            result.push(row.name)
        })

        callback(null, result)
    })
}

function setCompleted(login, questName, callback) {
    let sql = `insert into completed (questName, login) values (?, ?)`
    db.run(sql, [questName, login], (err) => {
        if (err) {
            console.log(err)
        }
    })

    callback(null)
}

function setUnCompleted(login, questName, callback) {
    let sql = `delete from completed where questName like ? and login like ?`
    db.run(sql, [questName, login], (err) => {
        if (err) {
            console.log(err)
        }
    })
    getQuestInfo(login, questName, (err, result) => {
        if(result.next !== 'null') {
            getQuestInfo(login, result.next, (err, result) => {
                if(result.status === 'completed') {
                    setUnCompleted(login, result.questName, () => {

                    })
                }
            })
        }
    })
    callback(null)
}

function getQuest(username ,questName, callback) {
    getQuestInfo(username, questName, (err, questInfo) => {
        getObjectives(questInfo.questName, (err, objectives) => {
            getRewards(questInfo.questName, (err, rewards) => {
                getRequirements(questInfo.questName, (err, requirements) => {
                    callback(null, {
                        questName: questInfo.questName,
                        trader: questInfo.trader,
                        map: questInfo.map,
                        status: questInfo.status,
                        dialogue: questInfo.dialogue,
                        objectives: objectives,
                        requirements: requirements,
                        rewards: rewards,
                        image: questInfo.image,
                        next: questInfo.next,
                        previous: questInfo.previous
                    })
                })
            })
        })
    })
}

module.exports = {
    getQuests,
    getQuest,
    getQuestsFromTrader,
    setCompleted,
    setUnCompleted,
    getQuestsFromMap
}