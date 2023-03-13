import {
  createElement,
  SortType,
  SortTypeMethods,
  StateActions,
  STATUS_CARD_BIG,
  STATUS_CARD_SMALL,
  URL,
} from './utils.js';

/**
 * Сервис класс, который будет хранить состояние приложения и управлять им
 */
export class WeatherService {
  /**
   * Конструктор класса, инициализирует данные
   */
  constructor() {
    // выбранные города
    this._favoritesCities = [];
    // состояние поискового запроса
    this._search = '';
    // сортировка по умолчанию
    this._sortType = SortType.ASC;
    // состояние фильтра
    this._filter = {
      sunny: false,
      cloudy: false,
      snowy: false,
      metorite: false,
      rainy: false,
      blizzard: false,
      stormy: false,
    };
    // данные приложения
    this._data = [];
    // инстанс карты будет храниться в этом свойстве
    this._map = undefined;
    // маркеры карты
    this._markers = [];
    // создаем шаблон пустой карточки, используется при DnD
    this.emptyCardElement = createElement(`<div class="card big-card big-card--empty card-draggable"></div>`);
  }

  /**
   * геттер для карты
   * т.к. свойство приватное, то доступа из вне к нему нету, и делается это через геттер
   * @returns {*}
   */
  get map() {
    return this._map;
  }

  /**
   * сеттер для карты
   * т.к. свойство приватное, то доступа из вне к нему нету, и делается это через сеттер
   * @param value
   */
  set map(value) {
    this._map = value;
  }

  /**
   * геттер точек на карте
   * т.к. свойство приватное, то доступа из вне к нему нету, и делается это через геттер
   * @returns {[]}
   */
  get markers() {
    return this._markers;
  }

  /**
   * сеттер точек на карте
   * т.к. свойство приватное, то доступа из вне к нему нету, и делается это через сеттер
   * @param value
   */
  set markers(value) {
    this._markers = value;
  }

  /**
   * Метод загрузки данных
   * @see https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Statements/async_function
   * @returns {Promise<[]>}
   */
  async getAllCities() {
    // используя метод fetch сперва загружаем данные
    this._data = await fetch(URL).then(res => res.json()).then(data => data.cities).catch(() => ([]));
    // возвращаем данные с применением сортировки
    return this._data.sort(SortTypeMethods[this._sortType]);
  }

  /**
   * Получаем список городов для общего списка
   * @returns {*[]}
   */
  getCitiesForSmallCardList() {
    return this._data.filter((item) => item.city.toLowerCase().includes(this._search)).
      sort(SortTypeMethods[this._sortType]);
  }

  /**
   * Метод изменение параметров сортировки
   * @param sortType
   */
  setSortType(sortType) {
    // запоминаем состояние
    this._sortType = sortType;
    // выбрасываем событие об изменениях
    this._emitEvent(StateActions.SORT_CHANGES, this._sortType);
  }

  /**
   * Метод поиска по запросу
   * @param text
   */
  setSearch(text) {
    // запоминаем состояние
    this._search = text.toLowerCase();
    // выбрасываем событие об изменениях
    this._emitEvent(StateActions.SEARCH_CHANGES, this._sortType);
  }

  /**
   * Метод установки условий фильтрации
   * @param filterKey
   * @param value
   */
  setFilter(filterKey, value) {
    // запоминаем состояние
    this._filter[filterKey] = value;
    // выбрасываем событие об изменениях
    this._emitEvent(StateActions.FILTER_CHANGES, this._sortType);
  }

  /**
   * Метод получения избранных городов
   * @returns {*[]}
   */
  getFavoriteCities() {
    // получаем фильтры
    const keysForFilter = Object.keys(this._filter).filter(f => this._filter[f]);

    // фильтруем карточки согласно условиям
    return this._favoritesCities.filter((city) => {
      return keysForFilter.length ? keysForFilter.every(key => city.weather[key]) : true;
    });
  }

  /**
   * Метод изменения позиции карточки в списке (после перетаскивания)
   * @param card
   * @param prevCardId
   * @param list
   */
  updatePosition(card, prevCardId, list) {
    const status = this._favoritesCities.includes(card) ? STATUS_CARD_BIG : STATUS_CARD_SMALL;

    if (list === STATUS_CARD_BIG && status === STATUS_CARD_BIG) {
      // Если карточку переместили внутри списка избранного

      const cardIndex = this._favoritesCities.findIndex((city) => city.city === card.city);
      this._favoritesCities.splice(cardIndex, 1);

      const prevCardIndex = this._favoritesCities.findIndex((city) => city.city === prevCardId);
      this._favoritesCities.splice(prevCardIndex + 1, 0, card);
    } else if (list === STATUS_CARD_BIG && status === STATUS_CARD_SMALL) {
      // если карточку переместили из общего списка в избранное

      const cardIndex = this._data.findIndex((city) => city.city === card.city);
      this._data.splice(cardIndex, 1);

      // дополнительное условие позволяющее менять порядок карточек в списке избранного
      if (prevCardId) {
        const prevCardIndex = this._favoritesCities.findIndex((city) => city.city === prevCardId);
        this._favoritesCities.splice(prevCardIndex + 1, 0, card);
      } else {
        this._favoritesCities.push(card);
      }
    } else if (list === STATUS_CARD_SMALL && status === STATUS_CARD_BIG) {
      // если карточку переместили из избранного в общий список

      const cardIndex = this._favoritesCities.findIndex((city) => city.city === card.city);
      this._favoritesCities.splice(cardIndex, 1);

      this._data.push(card);
    }

    this._emitEvent(StateActions.CARD_UPDATE_POSITION, card);
  }

  /**
   * Метод добавляющий функциональность Drag and Drop к карточке
   * @see https://developer.mozilla.org/ru/docs/Web/API/HTML_Drag_and_Drop_API
   * @param element
   * @param city
   */
  makeCardDraggable(element, city) {
    this._draggedElement = null;

    // добавляется обработчик события DragStart, когда мы начали перемещать карточку
    element.addEventListener(`dragstart`, () => {
      // запоминаем перемещаемый элемент
      this._draggedElement = element;
      // добавляем CSS класс с тенью
      this._draggedElement.classList.add(`small-card--shadow`);
    });

    // добавляется обработчик события DragEnd, когда мы закончили перемещать карточку
    element.addEventListener(`dragend`, () => {
      // Запоминаем предыдущую карточку, нужно для правильного порядка
      const prevCardId = this.emptyCardElement.previousElementSibling
        ? this.emptyCardElement.previousElementSibling.id
        : undefined;

      // удаляем CSS класс с тенью
      this._draggedElement.classList.remove(`small-card--shadow`);
      this.updatePosition(city, prevCardId, this._draggedElement.dataset.status);
      // забываем перемещаемый элемент
      this._draggedElement = null;
    });
  }

  /**
   * Метод добавляющий функциональность Drag and Drop к списку
   * @see https://developer.mozilla.org/ru/docs/Web/API/HTML_Drag_and_Drop_API
   * @param listElement
   */
  makeListDroppable(listElement) {
    // добавляется обработчик события DragOver, когда карточка находиться над элементом
    listElement.addEventListener(`dragover`, (evt) => {
      // отменяем действие по умолчанию
      evt.preventDefault();

      // Запоминаем элемент над которым находится курсор
      const underElement = evt.target;
      // Выбираем ближайшую карточку
      const underCardElement = underElement.closest(`.card`);
      // Выбираем ближайший список
      const underListElement = underElement.closest(`.card-list`);

      // проверка что курсор находиться над необходимым элементом
      if (!underListElement || (underCardElement === this._draggedElement)) {
        return;
      }

      // Обновляем новый статус каточки, основываясь на списке, над которым карточка находиться
      this._draggedElement.dataset.status = underListElement.dataset.status;

      if (underCardElement && (underListElement.dataset.status !== STATUS_CARD_SMALL)) {
        underListElement.insertBefore(this.emptyCardElement, underCardElement.nextElementSibling);
      } else {
        underListElement.append(this.emptyCardElement);
      }
    });
  }

  /**
   * Служебный метод, который создает событие после того как данные в приложении были изменены или удалены
   * @see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
   * @param type - тип события
   * @param data - данные
   * @private
   */
  _emitEvent(type, data) {
    window.dispatchEvent(new CustomEvent(type, {data}));
  }
}
