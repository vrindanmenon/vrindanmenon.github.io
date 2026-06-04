
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
SEARCH
========================== */

const searchButton = document.getElementById('searchButton');

if (searchButton && searchInput) {
  searchButton.addEventListener('click', () => {
    filterPosts(searchInput.value);
    if (mobileSidebar) {
      mobileSidebar.classList.remove('sidebar-open');
    }
  });

  // Still allow Enter key on desktop
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      filterPosts(searchInput.value);
      if (mobileSidebar) {
        mobileSidebar.classList.remove('sidebar-open');
      }
    }
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

// =========================
// MOBILE SIDEBAR TOGGLE
// =========================
const menuToggle = document.getElementById('mobileMenuToggle');
const mobileSidebar = document.getElementById('mobileSidebar');

if (menuToggle && mobileSidebar) {
  menuToggle.addEventListener('click', () => {
    mobileSidebar.classList.toggle('sidebar-open');
  });

  // Close sidebar when clicking outside
  document.addEventListener('click', (e) => {
    if (!mobileSidebar.contains(e.target) && !menuToggle.contains(e.target)) {
      mobileSidebar.classList.remove('sidebar-open');
    }
  });
}