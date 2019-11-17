console.log("Running...");

let articles = {};

const onMessage = {
    "save-posts": function(data) {
        let posts = articles[data.tid].posts;
        posts = posts.concat(data.posts);
        articles[data.tid].posts = posts;
    },
    "parse-article": function(data) {
        console.log("queue tab", data);
        articles[data.tid] = {
            url: data.url,
            tid: data.tid,
            title: data.title,
            posts: []
        };
        chrome.tabs.create({
            url: data.url
        });
    },
    "finish-posts": function(data, sender) {
        chrome.tabs.remove(sender.tab.id);
    }
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(request);
    onMessage[request.command](request.data, sender);
});

chrome.browserAction.onClicked.addListener(function() {
    stats();
    console.log("articles", articles);
    console.log(JSON.stringify(articles));
});

function stats() {
    authors = {};
    Object.entries(articles).forEach(function(entry) {
        // do stats
        entry[1].price = 0;
        let posts = entry[1].posts;
        if (!posts.length) {
            return;
        }
        incremenentVal(authors, posts[0].author.name);
        for (let i = 1; i < posts.length; i++) {
            let post = posts[i];
            post.review = calculateReview(post);
            post.qa = calculateQA(post);
            post.trade = calculateTrade(post);
        }
    });
    console.log("authors", authors);
    console.log(JSON.stringify("authors"));
}

function calculateReview(post) {
    return searchRegex(
        post.content, ["good", "nice", "works", "great", "success", "wonderful"]
    ) - searchRegex(
        post.content, ["bad", "cannot", "problem", "trouble", "issue"]
    );
}

function calculateQA(post) {
    return post.content.includes("? ") || post.content.indexOf("?") >= post.content.length - 2;
}

function calculateTrade(post) {
    return searchRegex(post.content, ["trade, exchange, share"]);
}

function searchRegex(searchString, tagMatches, enforceBoundaries) {
    let matches = 0;
    for (let i = 0; i < tagMatches.length; i++) {
        let regex = tagMatches[i];
        if (enforceBoundaries) {
            regex = '\\b' + tagMatches[i] + '\\b';
        }
        matches += (searchString.toLowerCase().match(new RegExp(regex, 'g')) || []).length;
    }
    return matches;
}

function incremenentVal(obj, val) {
    if (obj[val]) {
        obj[val]++;
    } else {
        obj[val] = 1;
    }
}