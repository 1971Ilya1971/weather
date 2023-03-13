import {App} from './app.js';

/**
 * Создаем экземпляр приложения
 * @type {App}
 */
const app = new App();

/**
 * Выбираем элемент-контейнер в котором будет разворачиваться наше приложение
 * @type {Element}
 */
const weatherAppElement = document.querySelector(`.weather-app`);

/**
 * Инициализируем приложение в выбранном элементе.
 */
app.init(weatherAppElement);
