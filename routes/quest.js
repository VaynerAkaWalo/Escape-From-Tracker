var express = require('express');
var router = express.Router();
var questModules = require("../modules/quests")
const {checkIfLoggedIn} = require("../modules/login")
const db = require("../modules/db");


router.get('/', function(req, res, next) {
    checkIfLoggedIn(req, res, () => {
        questModules.getQuests(req.session.username, (err, result) => {
            res.render('quests', {
                username: req.session.username,
                quests: result
            });
        })
    })
});

router.get('/:path', function(req, res, next) {
    checkIfLoggedIn(req, res, () => {
        const maps = ['Factory', 'Customs', 'Woods', 'Shoreline', 'Interchange', 'Reserve', 'Lighthouse', 'Streets of Tarkov', 'The Lab']
        if(maps.includes(req.params.path)) {
            questModules.getQuestsFromMap(req.session.username, req.params.path, (err, result) => {
                res.render('quests', {
                    username: req.session.username,
                    quests: result
                });
            })
        }
        else {
            questModules.getQuestsFromTrader(req.session.username ,req.params.path, (err, result) => {
                res.render('quests', {
                    username: req.session.username,
                    quests: result
                });
            })
        }
    })
});

router.get('/:trader/:quest', (req, res) => {
    checkIfLoggedIn(req, res, () => {
        questModules.getQuest(req.session.username, req.params.quest, (err, result) => {
            result['username'] = req.session.username
            res.render('quest', result)
        })
    })

})

router.post("/:trader/:quest", (req, res) => {
    checkIfLoggedIn(req, res, () => {
        if(req.body.completed != null) {
            switch (req.body.completed) {
                case 'uncompleted':
                    questModules.setUnCompleted(req.session.username, req.params.quest, () => {
                        questModules.getQuest(req.session.username, req.params.quest, (err, result) => {
                            result['username'] = req.session.username
                            res.render('quest', result)
                        })
                    })
                    break;
                case 'completed':
                    questModules.setCompleted(req.session.username, req.params.quest, () => {
                        questModules.getQuest(req.session.username, req.params.quest, (err, result) => {
                            result['username'] = req.session.username
                            res.render('quest', result)
                        })
                    })
                    break;
            }

        }
    })
})

module.exports = router;
