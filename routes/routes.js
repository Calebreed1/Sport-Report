var express = require("express");
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("../models");



module.exports = app => {
    app.get("/", function (req, res, render) {
        db.Article.find({ saved: false }).sort({ "_id": -1 }).then(dbArticle => {
            res.render("index", { articles: dbArticle });
        }).catch(err => res.json(err));
    });


    app.get("/scrape", (req, res) => {
        db.Article.find({}).then(articles => {
            let alreadyScraped = articles.map(article => article.link);
            axios.get("https://www.sbnation.com").then(response => {
                var $ = cheerio.load(response.data);

                $("div").each(function (i, element) {
                    var result = {};

                    result.title = $(this)
                        .children("h2")
                        .children("a")
                        .text();
                    result.link = $(this)
                        .children("h2")
                        .children("a")
                        .attr("href");
                    result.img = $(this)
                        .children("picture").attr("src");
                    if (!alreadyScraped.includes(result.link)) {
                        db.Article.create(result).then(dbArticle => {
                            console.log(dbArticle);
                        }).catch(err => console.log(err)); 
                            
                        };
                    });
                res.redirect("/");
            });
        });
    });


app.get("/saved", function (req, res) {
    db.Article.find({ saved: true }).sort({ '_id': -1 })
        .populate('note')
        .exec(function (err, article) {
            if (err) res.json(err);
            console.log(article);
            return res.render('index', { articles: article });
        });
});


app.get("/saved/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id })
        .populate("note")
        .exec((err, article) => {
            if (err) res.json(err);
            console.log(article);
            return res.json(article);
        }).catch(function (err) {
            return res.json(err);
        });
});


app.post("/saved/:id", function (req, res) {
    db.Note.create(req.body)
        .then(function (dbNote) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { note: dbNote._id } }, { new: true });
        })
        .then(function (dbArticle) {
            return res.json(dbArticle);
        })
        .catch(function (err) {
            return res.json(err);
        });
});

app.delete("/saved/:id", function (req, res) {
    db.Article.findByIdAndRemove(req.params.id)
        .then(dbArticle => res.json(dbArticle))
        .catch(err => res.json(err));
});

app.get("/articles", function (req, res) {
    db.Article.find({})
        .then(dbArticle => res.json(dbArticle))
        .catch(err => res.json(err));
})

app.post("/articles/:id", function (req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true })
        .then(dbArticle => res.json(dbArticle))
        .catch(err => res.json(err));
});


}