let articles = [];

console.log("Running...");

let tabQueue = [];

const onMessage = {
    "save-article": function(data) {
        for (const article of articles) {
            if (article.title === data.title) {
                return;
            }
        }

        console.log("Add new article", data.title);
        articles.push(data);

        console.log(articles);
    },
    "open-tab": function(data) {
        console.log("queue tab", data);
        tabQueue.push("https://hackforums.net/" + data);
    }
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(request);
    onMessage[request.command](request.data);
});

setInterval(function() {
    if (tabQueue.length) {
        let url = tabQueue.shift();
        console.log("Open new tab", url);
        chrome.tabs.create({
            url: url
        });
    }
}, 5000);

function stats() {
    authors = {};
    for (const article of articles) {
        // do stats
        incremenentVal(authors, article.posts[0].author.name);
    }
    console.log(authors);
}

function incremenentVal(obj, val) {
    if (obj[val]) {
        obj[val]++;
    } else {
        obj[val] = 1;
    }
}

chrome.storage.local.set({
    articles: articles
});