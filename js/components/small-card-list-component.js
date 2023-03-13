import {InsertPosition, renderElement, StateActions, STATUS_CARD_SMALL} from '../utils.js';
import {AbstractComponent} from './abstract-component.js';
import {SmallCardComponent} from './small-card-component.js';

/**
 * Компонент общего список городов
 */
export class SmallCardListComponent extends AbstractComponent {
  /**
   * Конструктор класса, параметром принимает weatherService
   * @param weatherService
   */
  constructor(weatherService) {
    super();
    this.weatherService = weatherService;
    this._dataChangedHandler = this._dataChangedHandler.bind(this);
  }

  /**
   * Метод генерирующий HTML шаблон и подставляет в шаблон данные
   * @returns {string}
   * @private
   */
  _getTemplate() {
    return `<div class="card-list weather-content__small-cards" data-status="${STATUS_CARD_SMALL}"></div>`;
  }

  /**
   * Метод, который вызывается после создания DOM элемента на основе шаблона _getTemplate
   * @private
   */
  _afterCreateElement() {
    // Загружаем данные и рендерим их
    this.weatherService.getAllCities().then((cities) => {
      this._allCities = cities;
      this._render();
    });

    this._addEventListeners();
    this.weatherService.makeListDroppable(this.getElement());
  }

  /**
   * Метод добавляющий обработчики событий
   * @private
   */
  _addEventListeners() {
    window.addEventListener(StateActions.SORT_CHANGES, this._dataChangedHandler);
    window.addEventListener(StateActions.SEARCH_CHANGES, this._dataChangedHandler);
    window.addEventListener(StateActions.CARD_UPDATE_POSITION, this._dataChangedHandler);
  }

  /**
   * Обработчик события изменения данных в приложении
   * @private
   */
  _dataChangedHandler() {
    this._allCities = this.weatherService.getCitiesForSmallCardList();
    this._render();
  }

  /**
   * Метод рендеринга карточек списка
   * @private
   */
  _render() {
    // удаляем все карточки из списка
    this.getElement().querySelectorAll(`.card`).forEach((element) => element.remove());

    // рендерим новые карточки на основе данных сервиса
    this._allCities.forEach((city) => {
      const smallCardComponent = new SmallCardComponent(city, this.weatherService);
      const smallCardElement = smallCardComponent.getElement();

      renderElement(this.getElement(), smallCardElement, InsertPosition.BEFOREEND);
    });
  }
}
