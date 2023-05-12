function getAllBookmarks(bookmarkTreeNodes){
  let bookmarksBar = bookmarkTreeNodes[0].children[0];
  let bookmarks = [];
  function traverseBookmarksTree(node) {
    if (node.url !== undefined) {
        bookmarks.push(node);
    }
  
    if (node.children) {
      for (var i = 0; i < node.children.length; i++) {
        traverseBookmarksTree(node.children[i]);
      }
    }
  }

  traverseBookmarksTree(bookmarksBar);
  return bookmarks;
}


function createBookmarks(bookmarks) {
    const bookmarksEl = document.getElementById('bookmarks');
    for (let i = 0; i < bookmarks.length; i++) {
        let bookmark = bookmarks[i];
        let bookmarkDiv = document.createElement('div');
        bookmarkDiv.className = ["list-group"];
        let anchor = document.createElement('a');
        anchor.className = ["list-group-item list-group-item-action"];
        anchor.id = bookmark.title;
        anchor.href = bookmark.url;
        anchor.innerText = bookmark.title;
        bookmarkDiv.appendChild(anchor);
        bookmarkDiv.addEventListener('click', (event) => {
            event.preventDefault();
            chrome.tabs.create({ url: bookmark.url });
        });
        bookmarksEl.appendChild(bookmarkDiv);
    }
    
}

chrome.bookmarks.getTree(function(bookmarkTreeNodes) {
  const bookmarks = getAllBookmarks(bookmarkTreeNodes);
  createBookmarks(bookmarks);

  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('keyup', (event) => {

      const searchValue = event.target.value.toLowerCase();
      const bookmarksEl = document.getElementById('bookmarks');
      const bookmarks = bookmarksEl.getElementsByTagName('a');
      for (let i = 0; i < bookmarks.length; i++) {
          const bookmark = bookmarks[i];
          const bookmarkTitle = bookmark.id.toLowerCase();
          const href = bookmark.href.toLowerCase();
          if (bookmarkTitle.indexOf(searchValue) > -1 || href.indexOf(searchValue) > -1) {
              bookmark.parentElement.style.display = "";
          } else {
              bookmark.parentElement.style.display = "none";
          }
      }
  });

});


document.getElementById("searchInput").focus();


