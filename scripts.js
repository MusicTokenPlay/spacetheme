const levelValues = [100, 1000, 5000, 10000, 20000];

// Функция для сброса счетчиков и таймера
function resetCountersAndTimer() {
    updateCounter(0);
    saveProgress(0, getCircleLevels());
}

// Функция для анимации круга по круговой траектории
function animateCircle(circle, radius, speed, centerX, centerY) {
    let angle = 0;
    setInterval(function() {
        angle += speed;
        const x = radius * Math.cos(angle) + centerX - circle.offsetWidth / 2;
        const y = radius * Math.sin(angle) + centerY - circle.offsetHeight / 2;
        circle.style.left = `${x}px`;
        circle.style.top = `${y}px`;
    }, 1000 / 60);
}

// Функция для увеличения счетчика при нажатии на круг
function incrementCounter(event, element) {
    const counter = document.getElementById('coin-counter');
    let count = parseInt(counter.textContent, 10);
    const level = parseInt(element.getAttribute('data-level'), 10);
    count += level; // Увеличиваем счетчик в соответствии с уровнем круга
    updateCounter(count);
    saveProgress(count, getCircleLevels());

    // Показать летящее число
    showFlyingNumber(event, `+${level}`);
}

// Функция для показа летящего числа
function showFlyingNumber(event, text) {
    const number = document.createElement('div');
    number.className = 'flying-number';
    number.textContent = text;
    number.style.position = 'absolute';
    number.style.left = `${event.clientX}px`;
    number.style.top = `${event.clientY}px`;
    document.body.appendChild(number);

    setTimeout(() => {
        document.body.removeChild(number);
    }, 1000);
}

// Функция для обновления счетчика
function updateCounter(count) {
    const counter = document.getElementById('coin-counter');
    counter.textContent = count;
}

// Функция для получения уровней кругов
function getCircleLevels() {
    const circles = document.querySelectorAll('.circle');
    let circleLevels = {};
    circles.forEach(circle => {
        circleLevels[circle.id] = circle.getAttribute('data-level');
    });
    return circleLevels;
}

// Функция для сохранения прогресса в localStorage
function saveProgress(count, circleLevels) {
    localStorage.setItem('coin-counter', count);
    localStorage.setItem('circle-levels', JSON.stringify(circleLevels));
}

// Функция для загрузки прогресса из localStorage
function loadProgress() {
    const savedCount = localStorage.getItem('coin-counter');
    if (savedCount !== null) {
        updateCounter(parseInt(savedCount, 10));
    }

    const savedLevels = localStorage.getItem('circle-levels');
    if (savedLevels !== null) {
        const circleLevels = JSON.parse(savedLevels);
        for (const id in circleLevels) {
            const circle = document.getElementById(id);
            const level = circleLevels[id];
            circle.setAttribute('data-level', level);
            circle.querySelector('.level-display').textContent = `Level ${level}`;

            // Обновление текста на кнопках в соответствии с уровнем
            const circleSize = circle.getAttribute('data-value');
            const button = document.querySelector(`.button[onclick="handleButtonClick(${circleSize})"]`);
            if (button) {
                button.querySelector('span').textContent = getReward(level);
            }
        }
    }
}

// Функция для переключения отображения меню
function toggleMenu() {
    const menu = document.getElementById('menu-window');
    if (menu.style.display === 'flex' || menu.style.display === '') {
        menu.style.display = 'none';
    } else {
        menu.style.display = 'flex';
    }
}

// Функция для закрытия меню при клике вне его
function closeMenuOnClickOutside(event) {
    const menu = document.getElementById('menu-window');
    const menuButton = document.querySelector('.menu-button');
    if (!menu.contains(event.target) && !menuButton.contains(event.target)) {
        menu.style.display = 'none';
    }
}

document.addEventListener('click', closeMenuOnClickOutside);

// Функция для получения награды на основе уровня
function getReward(level) {
    if (level <= 5) {
        return levelValues[level - 1];
    } else {
        return levelValues[4] + (level - 5) * 10000;
    }
}

// Функция для обработки нажатия на кнопку
function handleButtonClick(circleSize) {
    const counter = document.getElementById('coin-counter');
    let count = parseInt(counter.textContent, 10);

    let circle = document.querySelector(`.circle[data-value="${circleSize}"]`);
    let level = parseInt(circle.getAttribute('data-level'), 10);
    let reward = getReward(level);

    if (count >= reward) {
        // Списание со счета
        count -= reward;
        updateCounter(count);

        // Обновление уровня
        level += 1;
        circle.setAttribute('data-level', level);
        circle.querySelector('.level-display').textContent = `Level ${level}`;

        // Обновление текста на кнопке
        const button = document.querySelector(`.button[onclick="handleButtonClick(${circleSize})"]`);
        if (button) {
            button.querySelector('span').textContent = getReward(level);
        }

        saveProgress(count, getCircleLevels());
    }
}

// Инициализация при загрузке страницы
window.onload = function() {
    loadProgress();

    const circle1 = document.getElementById('circle1');
    const circle2 = document.getElementById('circle2');
    const circle3 = document.getElementById('circle3');

    if (circle1 && circle2 && circle3) {
        animateCircle(circle1, 200, 0.02, window.innerWidth / 2, window.innerHeight / 2 - 50);
        animateCircle(circle2, 150, 0.03, window.innerWidth / 2, window.innerHeight / 2 - 50);
        animateCircle(circle3, 100, 0.04, window.innerWidth / 2, window.innerHeight / 2 - 50);
    }

    document.addEventListener('touchstart', function(e) {
        if (e.touches.length > 1) {
            for (let i = 0; i < e.touches.length; i++) {
                const touch = e.touches[i];
                const target = document.elementFromPoint(touch.clientX, touch.clientY);
                if (target && target.classList.contains('circle')) {
                    incrementCounter({ clientX: touch.clientX, clientY: touch.clientY }, target);
                }
            }
        }
    }, { passive: false });
};

function addMillionCoins() {
    const coinCounter = document.getElementById('coin-counter');
    let currentCoins = parseInt(coinCounter.textContent, 10);
    currentCoins += 1000000;
    updateCounter(currentCoins);
    saveProgress(currentCoins, getCircleLevels());
}

