const mkdirp = require('mkdirp');
const fs = require('fs');
const path = require('path');

let data = require('./data/parsed.json');
const {
    parse
} = require('json2csv');

let i = 0;

function range(s, e) {
    return Array.from('x'.repeat(e - s), (_, i) => s + i);
}

Object.values(data).forEach(function(article) {
    console.log("Start parsing " + i + " " + article.title);

    if (!article.posts.length) {
        return;
    }

    let rows = [Object.assign({
        title: article.title,
        url: article.url,
        tid: article.tid,
        post: 0,
    }, parsePost(article.posts[0]))];

    for (let index = 1; index < article.posts.length; index++) {
        rows.push(Object.assign({
            post: index
        }, parsePost(article.posts[index])));
    }

    try {
        let csv = parse(rows, {
            fields: [
                'title',
                'url',
                'tid',
                'post',
                'username',
                'trade',
                'review',
                'qa',
                'content'
            ]
        });
        //console.log(csv);
        let fullPath = path.join(__dirname, 'csv');
        fs.writeFileSync(`${fullPath}/article${i}.csv`, csv);
        console.log("Finished parsing " + i + " " + article.title);
        i++;
    } catch (err) {
        console.error(err);
    }
});

function parsePost(post) {
    return {
        username: post.author.name,
        trade: function() {
            if (post.hasOwnProperty("trade")) {
                return post.trade;
            }
            return "";
        }(),
        review: function() {
            if (post.hasOwnProperty("review")) {
                if (post.review) {
                    return post.review > 0 ? "positive" : "negative";
                }
                return 0;
            }
            return "";
        }(),
        qa: function() {
            if (post.hasOwnProperty("qa")) {
                return post.qa ? 1 : 0;
            }
            return "";
        }(),
        content: JSON.stringify(post.content)
    };
}

function writeFile(name, contents, cb) {
    let fullPath = path.join(__dirname, 'csv');
    mkdirp(fullPath, function() {
        fs.writeFileSync(`${fullPath}/${name}.csv`, contents);
    });
}