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
    onMessage[request.command](request.data, sendResponse);
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