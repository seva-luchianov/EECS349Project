const $ = require('jquery');

if (location.pathname === "/showthread.php") {
    const $article = $(document).find('article');

    let data = {
        title: $article.find('.thead').text().trim(),
        posts: function() {
            let posts = [];
            let $posts = $article.find("#posts").children("div");
            for (let i = 0; i < $posts.length; i++) {
                let $post = $($posts[i]);
                posts.push({
                    author: {
                        name: $post.find(".author_information").find(".largetext").text().trim(),
                        stats: {
                            posts: "",
                            threads: "",
                            bRating: "",
                            popularity: "",
                            bytes: "",
                            gamexp: ""
                        }
                    },
                    content: $post.find(".post_content").text().trim(),
                    id: $post.attr("id")
                });
            }
            return posts;
        }()
    };

    console.log(data);

    chrome.runtime.sendMessage({
        command: "save-article",
        data: data
    });

    if ( /* last page */ ) {
        window.close();
    } else {
        location.href = "&page" + currpage + 1;
    }

} else if (location.pathname === "/forumdisplay.php") {
    let $articles = $(document).find(".subject_old,.subject_new");
    for (let i = 0; i < $articles.length; i++) {
        let $article = $($articles[i]);
        chrome.runtime.sendMessage({
            command: "open-tab",
            data: $article.find("a").attr("href")
        });
    }
} else {
    console.log("dont run on", location.pathname);
}