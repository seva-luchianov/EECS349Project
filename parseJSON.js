const fs = require('fs');
const path = require('path');

let data = require('./data/parsed2.json');
const {
    parse
} = require('json2csv');

let productRows = [];

let responseRows = [];

Object.values(data).forEach(function(article) {
    console.log(`Start parsing ${article.title}`);

    if (!article.posts.length) {
        return;
    }

    productRows.push(Object.assign({
        'Thread_id': article.tid,
        'Thread_link': article.url,
        'Market': "HackFormus",
        'Vendor name': article.posts[0].author.name,
        'Product/service name': article.title,
        'Replies': article.replies,
        'Views': article.views,
        'Category': 'Keyloggers',
        'Price': '',
        'Unit': '',
        'Payment method': ''
    }, parsePost(article.posts[0])));

    for (let i = 1; i < article.posts.length; i++) {
        responseRows.push(Object.assign({
            'Thread_id': article.tid,
            'Floor_number': i
        }, parsePost(article.posts[i])));
    }

    //console.log(csv);
    console.log(`Finish parsing ${article.title}`);
});

try {
    let fullPath = path.join(__dirname, 'csv');


    fs.writeFileSync(`${fullPath}/MainData.csv`, parse(productRows, {
        fields: [
            'Thread_id',
            'Thread_link',
            'Market',
            'Vendor name',
            'Product/service name',
            'Replies',
            'Views',
            'Category',
            'Price',
            'Unit',
            'Payment method'
        ]
    }));

    fs.writeFileSync(`${fullPath}/RepliesData.csv`, parse(responseRows, {
        fields: [
            'Thread_id',
            'Comment_link',
            'Floor_number',
            'User name',
            'Trade',
            'Review',
            'Q&A',
            'Content',
        ]
    }));
} catch (err) {
    console.error(err);
}

function parsePost(post) {
    return {
        'Comment_link': post.url,
        'Market': "Hack Forums",
        "User name": post.author.name,
        'Trade': function() {
            if (post.hasOwnProperty("trade")) {
                return post.trade;
            }
            return "";
        }(),
        'Review': function() {
            if (post.hasOwnProperty("review")) {
                if (post.review) {
                    return post.review > 0 ? "positive" : "negative";
                }
                return 0;
            }
            return "";
        }(),
        'Q&A': function() {
            if (post.hasOwnProperty("qa")) {
                return post.qa ? 1 : 0;
            }
            return "";
        }(),
        'Content': JSON.stringify(post.content)
    };
}