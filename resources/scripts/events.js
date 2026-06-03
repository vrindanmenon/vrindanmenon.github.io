let primaryNavMobileView = document.getElementById("primary-nav-mobile-view");
let menuIcon = document.getElementById("menu-icon");
let closeIcon = document.getElementById("close-icon");

function closeMenu(){

    primaryNavMobileView.style.width = "0";
    menuIcon.style.display = "block";

}

function openMenu(){

    primaryNavMobileView.style.width = "80%";
    menuIcon.style.display = "none";

}