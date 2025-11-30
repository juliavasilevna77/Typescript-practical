// Практична робота №5
// Тема: Розробка базових компонентів інтернет-магазину з використанням Generic типів у TypeScript

// =========================
// КРОК 1. Типи товарів
// =========================

// Базовий тип товару
type BaseProduct = {
  id: number;
  name: string;
  price: number;
  description?: string;     // необов'язковий опис
  inStock: boolean;         // наявність на складі
};

// Специфічний тип: електроніка
type Electronics = BaseProduct & {
  category: "electronics";
  brand: string;
  warrantyMonths: number;    // гарантія у місяцях
};

// Специфічний тип: одяг
type Clothing = BaseProduct & {
  category: "clothing";
  size: "XS" | "S" | "M" | "L" | "XL";
  material: string;
};

// Специфічний тип: книги
type Book = BaseProduct & {
  category: "book";
  author: string;
  pages: number;
};

// =========================
// КРОК 2. Generic-функції пошуку та фільтрації
// =========================

/**
 * Пошук товару за id в масиві товарів.
 * Повертає знайдений товар або undefined, якщо не знайдено.
 */
const findProduct = <T extends BaseProduct>(
  products: T[],
  id: number
): T | undefined => {
  if (!Array.isArray(products) || products.length === 0) {
    return undefined;
  }

  return products.find((product: T): boolean => product.id === id);
};

/**
 * Фільтрація товарів за максимальною ціною.
 * Повертає масив товарів з price <= maxPrice.
 */
const filterByPrice = <T extends BaseProduct>(
  products: T[],
  maxPrice: number
): T[] => {
  if (!Array.isArray(products) || products.length === 0) {
    return [];
  }

  if (maxPrice < 0) {
    // некоректне значення ціни — повертаємо порожній масив
    return [];
  }

  return products.filter(
    (product: T): boolean => product.price <= maxPrice
  );
};

// =========================
// КРОК 3. Кошик і робота з ним
// =========================

// Тип елемента кошика
type CartItem<T> = {
  product: T;
  quantity: number;
};

/**
 * Додавання товару в кошик.
 * Якщо товар уже є в кошику — збільшує кількість.
 * Якщо quantity некоректна (<=0) або product відсутній — повертає старий кошик.
 */
const addToCart = <T extends BaseProduct>(
  cart: CartItem<T>[],
  product: T | undefined,
  quantity: number
): CartItem<T>[] => {
  if (!product) {
    console.warn("Неможливо додати товар: product === undefined");
    return cart;
  }

  if (quantity <= 0) {
    console.warn("Неможливо додати товар з кількістю <= 0");
    return cart;
  }

  // знайдемо, чи є вже такий товар у кошику
  const existingIndex: number = cart.findIndex(
    (item: CartItem<T>): boolean => item.product.id === product.id
  );

  if (existingIndex !== -1) {
    // робимо копію масиву, щоб не мутувати вхідний
    const updatedCart: CartItem<T>[] = [...cart];
    const oldItem: CartItem<T> = updatedCart[existingIndex];
    updatedCart[existingIndex] = {
      ...oldItem,
      quantity: oldItem.quantity + quantity,
    };
    return updatedCart;
  }

  // якщо товару ще немає — додаємо новий елемент
  return [...cart, { product, quantity }];
};

/**
 * Підрахунок загальної вартості кошика.
 * Кожен елемент = product.price * quantity.
 * Якщо кількість < 0 — вважаємо її 0.
 */
const calculateTotal = <T extends BaseProduct>(
  cart: CartItem<T>[]
): number => {
  if (!Array.isArray(cart) || cart.length === 0) {
    return 0;
  }

  return cart.reduce((sum: number, item: CartItem<T>): number => {
    const safeQuantity: number = item.quantity > 0 ? item.quantity : 0;
    return sum + item.product.price * safeQuantity;
  }, 0);
};

// =========================
// КРОК 4. Тестові дані і приклади використання
// =========================

// Тестові дані: електроніка
const electronics: Electronics[] = [
  {
    id: 1,
    name: "Смартфон XPhone 12",
    price: 12000,
    description: "Смартфон з потрійною камерою",
    inStock: true,
    category: "electronics",
    brand: "XBrand",
    warrantyMonths: 24,
  },
  {
    id: 2,
    name: "Ноутбук UltraBook Pro",
    price: 35000,
    description: "Легкий ноутбук для роботи та навчання",
    inStock: true,
    category: "electronics",
    brand: "UltraTech",
    warrantyMonths: 12,
  },
];

// Тестові дані: одяг
const clothes: Clothing[] = [
  {
    id: 3,
    name: "Футболка чорна",
    price: 500,
    description: "Бавовняна футболка",
    inStock: true,
    category: "clothing",
    size: "M",
    material: "Cotton",
  },
  {
    id: 4,
    name: "Худі oversize",
    price: 1500,
    description: "Тепле худі з капюшоном",
    inStock: false,
    category: "clothing",
    size: "L",
    material: "Fleece",
  },
];

// Тестові дані: книги
const books: Book[] = [
  {
    id: 5,
    name: "Clean Code",
    price: 900,
    description: "Robert C. Martin, книга про чистий код",
    inStock: true,
    category: "book",
    author: "Robert C. Martin",
    pages: 464,
  },
  {
    id: 6,
    name: "You Don't Know JS",
    price: 700,
    description: "Серія книг про JavaScript",
    inStock: true,
    category: "book",
    author: "Kyle Simpson",
    pages: 350,
  },
];

// Демонстрація роботи — один кошик для Electronics
let electronicsCart: CartItem<Electronics>[] = [];

// Знаходимо телефон
const phone: Electronics | undefined = findProduct<Electronics>(
  electronics,
  1
);

console.log("Знайдений телефон:", phone);

// Додаємо телефон у кошик
electronicsCart = addToCart<Electronics>(electronicsCart, phone, 1);
console.log("Кошик після додавання телефону:", electronicsCart);

// Фільтрація електроніки за ціною до 20000
const midPriceElectronics: Electronics[] = filterByPrice<Electronics>(
  electronics,
  20000
);
console.log("Електроніка до 20000 грн:", midPriceElectronics);

// Окремий кошик для одягу
let clothingCart: CartItem<Clothing>[] = [];
const tshirt: Clothing | undefined = findProduct<Clothing>(clothes, 3);
const hoodie: Clothing | undefined = findProduct<Clothing>(clothes, 4);

clothingCart = addToCart<Clothing>(clothingCart, tshirt, 2);
clothingCart = addToCart<Clothing>(clothingCart, hoodie, 1);
console.log("Кошик з одягом:", clothingCart);

// Підрахунок загальної вартості
const electronicsTotal: number = calculateTotal<Electronics>(electronicsCart);
const clothingTotal: number = calculateTotal<Clothing>(clothingCart);
const booksTotal: number = calculateTotal<Book>([]); // порожній кошик

console.log("Сума за електроніку:", electronicsTotal);
console.log("Сума за одяг:", clothingTotal);
console.log("Сума за книги (порожній кошик):", booksTotal);
