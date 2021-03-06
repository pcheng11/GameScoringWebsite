// get all games in steam
var mongoose = require('mongoose'),
    express = require('express'),
    Game = require('../models/GameSchema.js'),
    router = express.Router();

/**
 * game api endpoint
 * get game info
 */
router.get("/", (req, res) => {
    Game.find({},
        (err, game) => {
            if (err) {
                return res.status(500).send(err)
            }
            return res.status(200).send({
                message: "OK",
                data: game
            });
        });
})

/**
 * game api endpoint
 * get game info
 */
router.get("/:game_id", (req, res) => {
    const game_id = req.params.game_id;
    Game.findOne(
        { "game_id": game_id },
        (err, game) => {
            if (err) {
                return res.status(500).send(err)
            }
            return res.status(200).send({
                message: "OK",
                data: game
            });
        });
})

/**
 * put game comment
 */
router.put("/comment/:game_id", (req, res) => {
    const game_id = req.params.game_id;
    const comment = req.body.comment;
    const user_id = req.body.user_id;
    const user_name = req.body.user_name;
    const date = req.body.date;
    const game_name = req.body.game_name;
    let comment_object = {
        user_name: user_name,
        user_id: user_id,
        comment: comment,
        date: date,
        game_name: game_name,
        game_id: game_id
    }
    Game.findOneAndUpdate(
        { "game_id": game_id },
        { "$push": { "comment": comment_object } },
        { new:true },
        (err, game) => {
            if (err) {
                return res.status(500).send(err)
            }
            return res.status(200).send({
                message: "OK",
                data: game
            });
        });
})

/**
 * put game score
 */
router.put("/score/:game_id", (req, res) => {
    const game_id = req.params.game_id;
    const score = req.body.score;
    if (score === 'score_5') {
        Game.findOneAndUpdate(
            { "game_id": game_id },
            { "$inc": { "score.score_5": 1} },
            { new: true },
            (err, game) => {
                if (err) {
                    return res.status(500).send(err)
                }
                return res.status(200).send({
                    message: "OK",
                    data: game
                });
        });
    } else if (score === 'score_4') {
        Game.findOneAndUpdate(
            { "game_id": game_id },
            { "$inc": { "score.score_4": 1} },
            { new: true },
            (err, game) => {
                if (err) {
                    return res.status(500).send(err)
                }
                return res.status(200).send({
                    message: "OK",
                    data: game
                });
        });
    } else if (score === 'score_3') {
        Game.findOneAndUpdate(
            { "game_id": game_id },
            { "$inc": { "score.score_3": 1} },
            { new: true },
            (err, game) => {
                if (err) {
                    return res.status(500).send(err)
                }
                return res.status(200).send({
                    message: "OK",
                    data: game
                });
        });
    } else if (score === 'score_2') {
        Game.findOneAndUpdate(
            { "game_id": game_id },
            { "$inc": { "score.score_2": 1} },
            { new: true },
            (err, game) => {
                if (err) {
                    return res.status(500).send(err)
                }
                return res.status(200).send({
                    message: "OK",
                    data: game
                });
        });
    } else if (score === 'score_1') {
        Game.findOneAndUpdate(
            { "game_id": game_id },
            { "$inc": { "score.score_1": 1} },
            { new: true },
            (err, game) => {
                if (err) {
                    return res.status(500).send(err)
                }
                return res.status(200).send({
                    message: "OK",
                    data: game
                });
        });
    }
})

/**
 * post game
 */
router.post("/", (req, res) => {
    console.log(req.body)
    let comment = new Game(req.body); // edited line
    comment.save()
    res.status(201).send(comment)

})


/**
 * get comment from a specific user
 */
router.get("/comment/:user_id", (req, res) => {
    const user_id = req.params.user_id;

    Game.aggregate([
        {$match: {'comment.user_id': user_id}},
        {$project: {
            comment: {$filter: {
                input: '$comment',
                as: 'single',
                cond: {$eq: ['$$single.user_id', user_id]}
            }},
            _id: 0,
            
        }}
    ])
    .exec()
    .then(response => {
        res.status(200).send({
            message: "OK",
            data: response
        });
    })
    .catch(error => {
        res.status(500).send({
            message: "fuck you",
            data: error
        });
    })
})


module.exports = router;