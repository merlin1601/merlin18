'use strict';
document.addEventListener('DOMContentLoaded', () => {
    // Загрузка корзины из localStorage при загрузке страницы
    loadCart();

    // Находим все кнопки "Купить" на странице
    const buyButtons = document.querySelectorAll('.item-btn, .btn-primary[href=""]');

    // Добавляем обработчик на каждую кнопку
    buyButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault(); // Отменяем стандартное поведение ссылки

            // Находим ближайший родительский элемент с товаром
            const productCard = this.closest('.item-wrapper, .card-box, .item-content');
            // цена
            const price = productCard.querySelector('.item-subtitle')?.textContent || "";
            // Извлекаем название товара из тега <strong>
            const productName = productCard.querySelector('strong')?.textContent || "Неизвестный товар";
            // Добавляем товар в корзину
            addToCart(productName, price);
            button.textContent = 'Товар добавлен в корзину';
            setTimeout(() => {
                button.textContent = 'Купить';
            }, 1000);
        });
    });

    // Обработка формы "Связаться с нами"
    const contactForm = document.querySelector('#contact-form-3-uMLZNhbaCn form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Получаем данные формы
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('number');
            const message = formData.get('textarea');
            
            // Валидация
            if (!name || !email || !phone) {
                alert('Пожалуйста, заполните обязательные поля: Имя, Почта и Телефон');
                return;
            }
            
            // Здесь можно добавить реальную отправку данных на сервер
            // Например, через fetch или XMLHttpRequest
            
            // Показываем сообщение об успешной отправке
            const successAlert = this.querySelector('[data-form-alert]');
            if (successAlert) {
                successAlert.hidden = false;
                setTimeout(() => {
                    successAlert.hidden = true;
                }, 7000);
            }
            
            // Очищаем форму
            this.reset();
            
            // В реальном проекте здесь будет код для отправки данных на сервер
            console.log('Форма отправлена:', { name, email, phone, message });
        });
    }

    function addToCart(productName, price) {
        const cartDropdown = document.getElementById('cartDropdown');

        // Получаем текущую корзину из localStorage
        const savedCart = localStorage.getItem('cart');
        let cartItems = savedCart ? JSON.parse(savedCart) : [];

        // Проверяем, нет ли уже такого товара в корзине
        const isAlreadyInCart = cartItems.some(item => item.name === productName);

        if (isAlreadyInCart) {
            alert(`Товар "${productName}" уже в корзине!`);
            return;
        }

        // Добавляем новый товар в корзину
        cartItems.push({ name: productName, price: price });

        // Сохраняем обновленную корзину в localStorage
        localStorage.setItem('cart', JSON.stringify(cartItems));

        // Обновляем отображение корзины
        updateCartDisplay();
    }

    function removeFromCart(productName) {
        // Получаем текущую корзину из localStorage
        const savedCart = localStorage.getItem('cart');
        if (!savedCart) return;

        let cartItems = JSON.parse(savedCart);

        // Удаляем товар из корзины
        cartItems = cartItems.filter(item => item.name !== productName);

        // Сохраняем обновленную корзину в localStorage
        localStorage.setItem('cart', JSON.stringify(cartItems));

        // Обновляем отображение корзины
        updateCartDisplay();
    }

    function checkout() {
        // Получаем текущую корзину из localStorage
        const savedCart = localStorage.getItem('cart');
        if (!savedCart || JSON.parse(savedCart).length === 0) {
            alert('Корзина пуста!');
            return;
        }

        // Показываем сообщение об успешном оформлении
        alert('Заказ успешно оформлен!');
        
        // Очищаем корзину
        localStorage.removeItem('cart');
        
        // Обновляем отображение корзины
        updateCartDisplay();
    }

    function updateCartDisplay() {
        const cartDropdown = document.getElementById('cartDropdown');
        cartDropdown.innerHTML = ''; // Очищаем текущее содержимое

        // Получаем текущую корзину из localStorage
        const savedCart = localStorage.getItem('cart');
        if (!savedCart) {
            // Если корзина пуста, показываем сообщение
            const emptyMessage = document.createElement('p');
            emptyMessage.textContent = 'Корзина пуста';
            emptyMessage.style.padding = '12px 16px';
            emptyMessage.style.color = '#666';
            cartDropdown.appendChild(emptyMessage);
            
            // Обновляем счетчик
            updateCounter();
            return;
        }

        const cartItems = JSON.parse(savedCart);

        // Добавляем каждый товар в выпадающий список
        cartItems.forEach(item => {
            const cartItem = document.createElement('a');
            cartItem.href = '#';
            cartItem.textContent = `${item.name} - ${item.price}`;
            
            // Добавляем обработчик для удаления товара
            cartItem.addEventListener('click', function(e) {
                e.preventDefault();
                removeFromCart(item.name);
            });
            
            cartDropdown.appendChild(cartItem);
        });

        // Добавляем кнопку оформления заказа
        const checkoutButton = document.createElement('button');
        checkoutButton.textContent = 'Оформить заказ';
        checkoutButton.style.display = 'block';
        checkoutButton.style.width = '100%';
        checkoutButton.style.padding = '12px 16px';
        checkoutButton.style.backgroundColor = '#4CAF50';
        checkoutButton.style.color = 'white';
        checkoutButton.style.border = 'none';
        checkoutButton.style.cursor = 'pointer';
        checkoutButton.style.textAlign = 'center';
        checkoutButton.style.marginTop = '10px';
        
        checkoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Предотвращаем закрытие dropdown
            checkout();
        });
        
        cartDropdown.appendChild(checkoutButton);

        // Обновляем счетчик товаров
        updateCounter();
    }

    function updateCounter() {
        const savedCart = localStorage.getItem('cart');
        const cartItems = savedCart ? JSON.parse(savedCart) : [];
        const counter = document.querySelector('.cart-counter');
        
        if (counter) {
            counter.textContent = cartItems.length;
        }
    }

    function loadCart() {
        // Создаем счетчик товаров, если его нет
        const cartButton = document.querySelector('.dropdown .nav-link');
        if (cartButton && !cartButton.querySelector('.cart-counter')) {
            const counter = document.createElement('span');
            counter.className = 'cart-counter';
            counter.style.marginLeft = '5px';
            counter.style.backgroundColor = '#4CAF50';
            counter.style.color = 'white';
            counter.style.borderRadius = '50%';
            counter.style.padding = '2px 6px';
            counter.style.fontSize = '12px';
            cartButton.appendChild(counter);
        }

        // Загружаем корзину из localStorage
        updateCartDisplay();
    }

    // Инициализация корзины при загрузке страницы
    loadCart();
});