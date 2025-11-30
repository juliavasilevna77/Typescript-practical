"use strict";
const siteTitle = "Практична робота з TypeScript";
const postsLimit = 4;
const isDarkTheme = true;
const headerEl = document.querySelector(".site-header");
const scrollTopBtn = document.getElementById("scrollTopBtn");
const modalBackdrop = document.getElementById("modalBackdrop");
const openModalButtons = document.querySelectorAll("[data-open-modal]");
const closeModalButton = document.querySelector("[data-close-modal]");
const postsContainer = document.getElementById("posts-container");
function openModal() {
    if (modalBackdrop) {
        modalBackdrop.classList.add("open");
    }
}
function closeModal() {
    if (modalBackdrop) {
        modalBackdrop.classList.remove("open");
    }
}
openModalButtons.forEach((btn) => {
    btn.addEventListener("click", () => openModal());
});
if (closeModalButton) {
    closeModalButton.addEventListener("click", () => closeModal());
}
if (modalBackdrop) {
    modalBackdrop.addEventListener("click", (event) => {
        if (event.target === modalBackdrop) {
            closeModal();
        }
    });
}
window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    if (headerEl) {
        if (scrollY > 80) {
            headerEl.classList.add("scrolled");
        }
        else {
            headerEl.classList.remove("scrolled");
        }
    }
    if (scrollTopBtn) {
        if (scrollY > 200) {
            scrollTopBtn.classList.add("visible");
        }
        else {
            scrollTopBtn.classList.remove("visible");
        }
    }
});
if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}
function loadPosts(limit) {
    const url = `https://jsonplaceholder.typicode.com/posts?_limit=${limit}`;
    fetch(url)
        .then((response) => {
        return response.json();
    })
        .then((posts) => {
        renderPosts(posts);
    })
        .catch((error) => {
        console.error("Помилка при завантаженні постів:", error);
        if (postsContainer) {
            postsContainer.innerHTML = "<p>Не вдалося завантажити дані.</p>";
        }
    });
}
function renderPosts(posts) {
    if (!postsContainer)
        return;
    postsContainer.innerHTML = "";
    posts.forEach((post) => {
        const card = document.createElement("div");
        card.className = "post-card";
        const titleEl = document.createElement("h3");
        titleEl.className = "post-title";
        titleEl.textContent = post.title;
        const bodyEl = document.createElement("p");
        bodyEl.className = "post-body";
        bodyEl.textContent = post.body;
        card.appendChild(titleEl);
        card.appendChild(bodyEl);
        postsContainer.appendChild(card);
    });
}
document.addEventListener("DOMContentLoaded", () => {
    document.title = siteTitle;
    loadPosts(postsLimit);
    console.log("Тема темна? ->", isDarkTheme);
});
