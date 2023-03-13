import {MapComponent} from './components/map-component.js';
import {WeatherComponent} from './components/weather-component.js';
import {InsertPosition, renderElement} from './utils.js';
import {WeatherService} from './weather-service.js';

/**
 * Основной класс приложения
 */
export class App {
  /**
   * Конструктор компонента
   * Для работы создаем экземпляр класса WeatherService
   */
  constructor() {
    this.weatherService = new WeatherService();
  }

  /**
   * Метод инициализации приложения
   * @param weatherAppElement - элемент в котором будет находиться приложение
   */
  init(weatherAppElement) {
    const weatherComponent = new WeatherComponent(this.weatherService);
    const weatherElement = weatherComponent.getElement();
    renderElement(weatherAppElement, weatherElement, InsertPosition.BEFOREEND);

    const mapComponent = new MapComponent(this.weatherService);
    const mapElement = mapComponent.getElement();
    renderElement(weatherAppElement, mapElement, InsertPosition.BEFOREEND);

    mapComponent.init();
  }
}
