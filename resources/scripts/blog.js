
const searchInput = document.getElementById('searchInput');
const posts = document.querySelectorAll('.post-card');

/* =========================
   FILTER POSTS
========================== */

function filterPosts(query, mode = "general") {

  query = query.toLowerCase();

  posts.forEach(post => {

    const title =
      post.dataset.title || "";

    const tags =
      post.dataset.tags || "";

    const content =
      post.dataset.content || "";

    let isMatch = false;

    /* =========================
       TAG FILTER
    ========================== */

    if (mode === "tag") {

      const tagList = tags.split(" ");

      isMatch = tagList.includes(query);

    }

    /* =========================
       GENERAL SEARCH
    ========================== */

    else {

      const searchableText =
        title + " " + tags + " " + content;

      isMatch =
        searchableText.includes(query);

    }

    post.style.display =
      isMatch ? "block" : "none";

  });

}

/* =========================
   LIVE SEARCH
========================== */

if (searchInput) {

  searchInput.addEventListener('input', function () {

    filterPosts(this.value);

  });

}

/* =========================
   URL TAG FILTER
========================== */

const params =
  new URLSearchParams(window.location.search);

const activeTag =
  params.get('tag');

if (activeTag && searchInput) {

  searchInput.value = activeTag;

  filterPosts(activeTag, "tag");

}
