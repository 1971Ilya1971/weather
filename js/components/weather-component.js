import {InsertPosition, renderElement} from '../utils.js';
import {AbstractComponent} from './abstract-component.js';
import {BigCardListComponent} from './big-card-list-component.js';
import {HeaderNavComponent} from './header-nav-component.js';
import {SmallCardListComponent} from './small-card-list-component.js';

/**
 * Компонент прогноза погоды
 */
export class WeatherComponent extends AbstractComponent {
  /**
   * Конструктор класса, параметром принимает weatherService
   * @param weatherService
   */
  constructor(weatherService) {
    super();
    this.weatherService = weatherService;
  }

  /**
   * Метод генерирующий HTML шаблон и подставляет в шаблон данные
   * @returns {string}
   * @private
   */
  _getTemplate() {
    return `<div class="weather-app__content weather-content">
              <section class="weather-content__result">
                <h2 class="visually-hidden">Результаты сортировки</h2>
              </section>
            </div>`;
  }

  /**
   * Метод, который вызывается после создания DOM элемента на основе шаблона _getTemplate
   * @private
   */
  _afterCreateElement() {
    // Создается и рендерится компонент шапки с навигацией/сортировкой/фильтрацией
    const headerNavComponent = new HeaderNavComponent(this.weatherService);
    const headerNavElement = headerNavComponent.getElement();
    renderElement(this.getElement(), headerNavElement, InsertPosition.AFTERBEGIN);

    // Создается и рендерится общий список городов
    const smallCardListComponent = new SmallCardListComponent(this.weatherService);
    const smallCardListElement = smallCardListComponent.getElement();
    const weatherContentResultElement = this.getElement().querySelector(`.weather-content__result`);
    renderElement(weatherContentResultElement, smallCardListElement, InsertPosition.AFTERBEGIN);

    // Создается и рендерится список избранных городов
    const bigCardListComponent = new BigCardListComponent(this.weatherService);
    const bigCardListElement = bigCardListComponent.getElement();
    renderElement(weatherContentResultElement, bigCardListElement, InsertPosition.BEFOREEND);
  }
}
