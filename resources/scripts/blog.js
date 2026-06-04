/* =========================
     SEARCH + FILTER SCRIPT
========================== */

  const searchInput = document.getElementById('searchInput');
  const posts = document.querySelectorAll('.post-card');

  function filterPosts(query) {

    query = query.toLowerCase();

    posts.forEach(post => {

      const title = post.dataset.title || "";
      const tags = post.dataset.tags || "";
      const content = post.dataset.content || "";

      const searchableText =
        title + " " + tags + " " + content;

      if (searchableText.includes(query)) {

        post.style.display = 'block';

      } else {

        post.style.display = 'none';

      }

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

  const params = new URLSearchParams(window.location.search);

  const activeTag = params.get('tag');

  if (activeTag && searchInput) {

    searchInput.value = activeTag;

    filterPosts(activeTag);

  }

