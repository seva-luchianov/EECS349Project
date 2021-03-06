const $ = require('jquery');
const qs = require('query-string');

if (location.pathname === "/showthread.php") {
    let q = qs.parse(location.search);
    console.log("parsed query string", q);

    let currPage = getCurrPage();
    if (currPage != q.page) {
        console.log("reached end of thread!");
        chrome.runtime.sendMessage({
            command: "finish-posts",
            data: {
                tid: q.tid
            }
        });
    } else {
        const $article = $(document).find('article');

        let data = {
            tid: q.tid,
            posts: function() {
                let posts = [];
                let $posts = $article.find("#posts").children("div");
                for (let i = 0; i < $posts.length; i++) {
                    let $post = $($posts[i]);
                    posts.push({
                        author: {
                            name: $post.find(".author_information").find(".largetext").text().trim(),
                            stats: function() {
                                const statKeys = ["posts", "threads", "bRating", "popularity", "bytes", "gamexp"];
                                let stats = {};
                                let $stats = $post.find(".author_statistics").find(".author_row");
                                for (let j = 0; j < $stats.length; j++) {
                                    const $stat = $($stats[j]).find(".author_value");
                                    stats[statKeys[j]] = $stat.text().trim();
                                }
                                return stats;
                            }()
                        },
                        content: $post.find(".post_content").text().trim(),
                        id: $post.attr("id"),
                        url: location.href
                    });
                }
                return posts;
            }()
        };

        console.log(data);

        chrome.runtime.sendMessage({
            command: "save-posts",
            data: data
        });

        q.page++;
        console.log("next query string", qs.stringify(q));
        setTimeout(function() {
            location.search = qs.stringify(q);
        }, 500);
    }
} else if (location.pathname === "/forumdisplay.php") {
    let $articles = $(document).find(".subject_old,.subject_new");
    for (let i = 0; i < $articles.length; i++) {
        let $article = $($articles[i]);
        let $link = $article.find("a");
        let $stats = $article.closest("tr").children();

        chrome.runtime.sendMessage({
            command: "parse-article",
            data: {
                url: "https://hackforums.net/" + $link.attr("href") + "&page=1",
                tid: $article.attr("id").substr(4),
                title: $link.text().trim(),
                replies: $stats[2].innerText,
                views: $stats[3].innerText
            }
        });
    }
} else if (location.pathname === "/search.php") {
    let $articles = $(document).find(".inline_row");
    for (let i = 0; i < $articles.length; i++) {
        let $article = $($articles[i]);
        let $link = $article.find("a").first();
        let $stats = $article.closest("tr").children();
        let url = $link.attr("href");
        chrome.runtime.sendMessage({
            command: "parse-article",
            data: {
                url: "https://hackforums.net/" + url + "&page=1",
                tid: qs.parse(url.substr(url.indexOf("?"), url.length)).tid,
                title: $link.text().trim(),
                replies: $stats[4].innerText,
                views: $stats[5].innerText
            }
        });
    }
} else {
    console.log("dont run on", location.pathname);
}

function getCurrPage() {
    let currPageElements = document.getElementsByClassName("pagination_current");
    if (currPageElements.length) {
        return currPageElements[0].innerText * 1;
    } else {
        return 1;
    }
}