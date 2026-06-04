
const searchInput = document.getElementById('searchInput');

/* =========================
   FILTER POSTS
========================== */

function filterPosts(query, mode = "general") {

  const posts = document.querySelectorAll('.post-card');

  query = query.trim().toLowerCase();

  posts.forEach(post => {

    const title = (post.dataset.title || "").toLowerCase();
    const tags = (post.dataset.tags || "").toLowerCase();
    const content = (post.dataset.content || "").toLowerCase();

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

      const searchableText = `${title} ${tags} ${content}`;

      isMatch = searchableText.includes(query);

    }

    post.style.display = isMatch ? "block" : "none";

  });

}

/* =========================
   LIVE SEARCH
========================== */

if (searchInput) {

  searchInput.addEventListener('input', (e) => {

    filterPosts(e.target.value);

  });

}

/* =========================
   URL TAG FILTER
========================== */

const params = new URLSearchParams(window.location.search);

const activeTag = params.get('tag');

if (activeTag && searchInput) {

  searchInput.value =
    activeTag;

  filterPosts(activeTag, "tag");

}

/* =========================
   MOBILE SIDEBAR
========================== */

const mobileMenuToggle =
  document.getElementById('mobileMenuToggle');

const mobileSidebar =
  document.getElementById('mobileSidebar');

if (mobileMenuToggle && mobileSidebar) {

  mobileMenuToggle.addEventListener('click', () => {

    mobileSidebar.classList.toggle('sidebar-open');

  });

}

document.addEventListener('click', (e) => {

  if (
    mobileSidebar &&
    mobileSidebar.classList.contains('sidebar-open') &&
    !mobileSidebar.contains(e.target) &&
    !mobileMenuToggle.contains(e.target)
  ) {

    mobileSidebar.classList.remove('sidebar-open');

  }

});
