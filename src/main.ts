// Примітивні типи для базових змінних
const siteTitle: string = "Практична робота з TypeScript";
const postsLimit: number = 4;
const isDarkTheme: boolean = true;

// Тип для постів з API
interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

// Пошук елементів DOM з явною типізацією
const headerEl = document.querySelector(".site-header") as HTMLElement;
const scrollTopBtn = document.getElementById("scrollTopBtn") as HTMLButtonElement;
const modalBackdrop = document.getElementById("modalBackdrop") as HTMLDivElement;
const openModalButtons = document.querySelectorAll("[data-open-modal]") as NodeListOf<HTMLButtonElement>;
const closeModalButton = document.querySelector("[data-close-modal]") as HTMLButtonElement;
const postsContainer = document.getElementById("posts-container") as HTMLDivElement;

// Функції для модального вікна
function openModal(): void {
  if (modalBackdrop) {
    modalBackdrop.classList.add("open");
  }
}

function closeModal(): void {
  if (modalBackdrop) {
    modalBackdrop.classList.remove("open");
  }
}

// Привʼязка обробників до кнопок
openModalButtons.forEach((btn: HTMLButtonElement): void => {
  btn.addEventListener("click", () => openModal());
});

if (closeModalButton) {
  closeModalButton.addEventListener("click", () => closeModal());
}

if (modalBackdrop) {
  modalBackdrop.addEventListener("click", (event: MouseEvent) => {
    if (event.target === modalBackdrop) {
      closeModal();
    }
  });
}

// Обробник скролу: змінюємо шапку і показуємо кнопку "наверх"
window.addEventListener("scroll", (): void => {
  const scrollY: number = window.scrollY;

  if (headerEl) {
    if (scrollY > 80) {
      headerEl.classList.add("scrolled");
    } else {
      headerEl.classList.remove("scrolled");
    }
  }

  if (scrollTopBtn) {
    if (scrollY > 200) {
      scrollTopBtn.classList.add("visible");
    } else {
      scrollTopBtn.classList.remove("visible");
    }
  }
});

// Клік по кнопці "наверх"
if (scrollTopBtn) {
  scrollTopBtn.addEventListener("click", (): void => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Завантаження постів через fetch
function loadPosts(limit: number): void {
  const url: string = `https://jsonplaceholder.typicode.com/posts?_limit=${limit}`;

  fetch(url)
    .then((response: Response): Promise<Post[]> => {
      return response.json();
    })
    .then((posts: Post[]): void => {
      renderPosts(posts);
    })
    .catch((error: unknown): void => {
      console.error("Помилка при завантаженні постів:", error);
      if (postsContainer) {
        postsContainer.innerHTML = "<p>Не вдалося завантажити дані.</p>";
      }
    });
}

function renderPosts(posts: Post[]): void {
  if (!postsContainer) return;

  postsContainer.innerHTML = "";

  posts.forEach((post: Post): void => {
    const card: HTMLDivElement = document.createElement("div");
    card.className = "post-card";

    const titleEl: HTMLHeadingElement = document.createElement("h3");
    titleEl.className = "post-title";
    titleEl.textContent = post.title;

    const bodyEl: HTMLParagraphElement = document.createElement("p");
    bodyEl.className = "post-body";
    bodyEl.textContent = post.body;

    card.appendChild(titleEl);
    card.appendChild(bodyEl);
    postsContainer.appendChild(card);
  });
}

// Ініціалізація сторінки
document.addEventListener("DOMContentLoaded", (): void => {
  document.title = siteTitle;

  // Завантажуємо пости
  loadPosts(postsLimit);

  // Лог у консоль для перевірки
  console.log("Тема темна? ->", isDarkTheme);
});
