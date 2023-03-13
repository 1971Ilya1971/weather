import {
  DEFAULT_ZOOM,
  InsertPosition,
  OPACITY_DEFAULT,
  OPACITY_INACTIVE,
  renderElement,
  setElementVisibility,
  StateActions,
  STATUS_CARD_BIG,
} from '../utils.js';
import {AbstractComponent} from './abstract-component.js';
import {BigCardComponent} from './big-card-component.js';
import {BigCardEmptyComponent} from './big-card-empty-component.js';

export class BigCardListComponent extends AbstractComponent {
  /**
   * Конструктор класса, параметром принимает weatherService
   * @param weatherService
   */
  constructor(weatherService) {
    super();
    this.weatherService = weatherService;
    this._favoritesCities = this.weatherService.getFavoriteCities();
    this._dataChangedHandler = this._dataChangedHandler.bind(this);
  }

  /**
   * Метод генерирующий HTML шаблон и подставляет в шаблон данные
   * @returns {string}
   * @private
   */
  _getTemplate() {
    return `<div class="card-list weather-content__big-cards" data-status="${STATUS_CARD_BIG}">
                ${this._favoritesCities.length === 0 ? this._getEmptyTemplate() : ``}
            </div>`;
  }

  /**
   * Метод генерирующий HTML шаблон пустого списка
   * @returns {string}
   * @private
   */
  _getEmptyTemplate() {
    return `<div class="weather-content__help">Перетащите сюда города, погода в которых вам интересна</div>`;
  }

  /**
   * Метод, который вызывается после создания DOM элемента на основе шаблона _getTemplate
   * @private
   */
  _afterCreateElement() {
    this._render();
    this._addEventListeners();
    this.weatherService.makeListDroppable(this.getElement());
  }

  /**
   * Метод добавляющий обработчики событий
   * @private
   */
  _addEventListeners() {
    window.addEventListener(StateActions.FILTER_CHANGES, this._dataChangedHandler);
    window.addEventListener(StateActions.CARD_UPDATE_POSITION, this._dataChangedHandler);
  }

  /**
   * Обработчик события изменения данных в приложении
   * @private
   */
  _dataChangedHandler() {
    this._favoritesCities = this.weatherService.getFavoriteCities();
    this._render();
  }

  /**
   * Метод рендеринга пустого списка
   * @private
   */
  _renderEmptyComponent() {
    const emptyItemComponent = new BigCardEmptyComponent();
    const emptyItemElement = emptyItemComponent.getElement();

    setElementVisibility(emptyItemElement, this._favoritesCities.length !== 0);
    renderElement(this.getElement().querySelector(`.card-list`), emptyItemElement, InsertPosition.BEFOREEND);
  }

  /**
   * Метод рендеринга списка
   * @private
   */
  _render() {
    // удаляем все карточки из списка
    this.getElement().querySelectorAll(`.card`).forEach((element) => element.remove());

    // рендерим новые карточки на основе данных сервиса
    this._favoritesCities.forEach((favoriteCity) => {
      const bigCardComponent = new BigCardComponent(favoriteCity, this.weatherService);
      const bigCardElement = bigCardComponent.getElement();
      // Добавляем обработчики событий
      bigCardElement.addEventListener(`click`, this.bigCardClickHandler.bind(this, favoriteCity, bigCardElement));
      bigCardElement.addEventListener(`mouseenter`, this.mouseEnterHandler.bind(this, favoriteCity));
      bigCardElement.addEventListener(`mouseleave`, this.mouseLeaveHandler.bind(this, favoriteCity, bigCardElement));

      renderElement(this.getElement(), bigCardElement, InsertPosition.BEFOREEND);
    });
  }

  /**
   * Обработчик события MouseEnter на карточке, нужно подсветить точку на карте
   * @param favoriteCity
   */
  mouseEnterHandler(favoriteCity) {
    // выбираем отмеченный маркер соответствующий favoriteCity
    const selectedMarker = this.weatherService.markers.find((marker) => marker.options.title === favoriteCity.city);

    if (selectedMarker) {
      selectedMarker.setOpacity(OPACITY_DEFAULT);
    }
  }

  /**
   * Обработчик события MouseLeave на карточке, нужно убрать подсветку точки на карте
   * @param favoriteCity
   * @param bigCardElement
   */
  mouseLeaveHandler(favoriteCity, bigCardElement) {
    this.weatherService.markers.forEach((marker) => {
      if (marker.options.title === favoriteCity.city && !bigCardElement.classList.contains(`active`)) {
        marker.setOpacity(OPACITY_INACTIVE);
      }
    });
  }

  /**
   * Обработчик события клика по карточки в избранном, нужно подсветить карточку
   * @param favoriteCity
   * @param bigCardElement
   */
  bigCardClickHandler(favoriteCity, bigCardElement) {
    // проверяем, была ли уже активирована карточка
    const isAlreadyActive = bigCardElement.classList.contains(`active`);
    // снимаем активацию у других карточек
    document.querySelectorAll(`.card-list .card`).forEach((city) => city.classList.remove(`active`));

    if (!isAlreadyActive) {
      // если до этого карточка не была активирована - активируем её
      bigCardElement.classList.add(`active`);
      this.weatherService.map.setView([favoriteCity.coordinates.latitude, favoriteCity.coordinates.longitude],
        DEFAULT_ZOOM);
    } else {
      const group = L.featureGroup(this.weatherService.markers);
      // центрируем карту
      this.weatherService.map.fitBounds(group.getBounds());
    }

    const selectedMarker = this.weatherService.markers.find((marker) => marker.options.title === favoriteCity.city);

    if (selectedMarker) {
      selectedMarker.setOpacity(bigCardElement.classList.contains(`active`) ? OPACITY_DEFAULT : OPACITY_INACTIVE);
    }
  }
}
