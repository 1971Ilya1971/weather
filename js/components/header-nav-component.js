import {FilterState, SortType} from '../utils.js';
import {AbstractComponent} from './abstract-component.js';

/**
 * Компонент шапки с навигацией/сортировкой/фильтрацией
 */
export class HeaderNavComponent extends AbstractComponent {
  /**
   * Конструктор класса, параметром принимает weatherService
   * @param weatherService
   */
  constructor(weatherService) {
    super();
    this.weatherService = weatherService;
    // привязка контекста обработчиков событий
    this._changeSortHandler = this._changeSortHandler.bind(this);
    this._filterByTextHandler = this._filterByTextHandler.bind(this);
    this._filterSortHandler = this._filterSortHandler.bind(this);
  }

  /**
   * Метод генерирующий HTML шаблон и подставляет в шаблон данные
   * @returns {string}
   * @private
   */
  _getTemplate() {
    return `<section class="sort-form weather-content__sort">
    <h2 class="visually-hidden">Форма сортировки</h2>
    <form action="#" method="GET">
      <div class="sort-form__group">
        <div class="sort-form__input-wrapper input-wrapper input-wrapper--radio">
          <input
            checked
            id="alphabet-sort"
            name="alphabet-sort"
            type="radio"
            value="${SortType.ASC}"
          />
          <label aria-label="Сортировка по алфавиту" for="alphabet-sort">
            <span class="icon icon--arrow-down"></span>
          </label>
        </div>
        <div class="sort-form__input-wrapper input-wrapper input-wrapper--radio">
          <input
            id="alphabet-sort-reverse"
            name="alphabet-sort"
            type="radio"
            value="${SortType.DESC}"
          />
          <label
            aria-label="Сортировка по алфавиту в обратном направлении"
            for="alphabet-sort-reverse"
          >
            <span class="icon icon--arrow-up"></span>
          </label>
        </div>
      </div>
      <div class="sort-form__group">
        <div class="sort-form__input-wrapper input-wrapper input-wrapper--search">
          <input
            id="search"
            name="city-search"
            placeholder="Название города"
            type="search"
          />
          <label aria-label="Поиск городов" for="search"></label>
        </div>
      </div>
      <div class="sort-form__group">
        <div class="sort-form__input-wrapper input-wrapper input-wrapper--checkbox">
          <input
            id="rainy"
            name="weather-conditions"
            type="checkbox"
            value="${FilterState.RAINY}"
          />
          <label aria-label="Дождливо" for="rainy">
            <span class="icon icon--rainy"></span>
          </label>
        </div>
        <div class="sort-form__input-wrapper input-wrapper input-wrapper--checkbox">
          <input
            id="sunny"
            name="weather-conditions"
            type="checkbox"
            value="${FilterState.SUNNY}" />
          <label aria-label="Солнечно" for="sunny">
            <span class="icon icon--sunny"></span>
          </label>
        </div>
        <div class="sort-form__input-wrapper input-wrapper input-wrapper--checkbox">
          <input
            id="cloudy"
            name="weather-conditions"
            type="checkbox"
            value="${FilterState.CLOUDY}" />
          <label aria-label="Облачно" for="cloudy">
            <span class="icon icon--cloudy"></span>
          </label>
        </div>
        <div class="sort-form__input-wrapper input-wrapper input-wrapper--checkbox">
          <input
            id="snowy"
            name="weather-conditions"
            type="checkbox"
            value="${FilterState.SNOWY}" />
          <label aria-label="Снежно" for="snowy">
            <span class="icon icon--snowy"></span>
          </label>
        </div>
        <div class="sort-form__input-wrapper input-wrapper input-wrapper--checkbox">
          <input
            id="stormy"
            name="weather-conditions"
            type="checkbox"
            value="${FilterState.STORMY}" />
          <label aria-label="Торнадо" for="stormy">
            <span class="icon icon--stormy"></span>
          </label>
        </div>
        <div class="sort-form__input-wrapper input-wrapper input-wrapper--checkbox">
          <input
            id="blizzard"
            name="weather-conditions"
            type="checkbox"
            value="${FilterState.BLIZZARD}"
          />
          <label aria-label="Гроза" for="blizzard">
            <span class="icon icon--blizzard"></span>
          </label>
        </div>
        <div class="sort-form__input-wrapper input-wrapper input-wrapper--checkbox">
          <input
            id="metorite"
            name="weather-conditions"
            type="checkbox"
            value="${FilterState.METORITE}"
          />
          <label aria-label="Метеоритный дождь" for="metorite">
            <span class="icon icon--metorite"></span>
          </label>
        </div>
      </div>
    </form>
  </section>`;
  }

  /**
   * Метод, который вызывается после создания DOM элемента на основе шаблона _getTemplate
   * @private
   */
  _afterCreateElement() {
    this._addEventListeners();
  }

  /**
   * Метод добавляющий обработчики событий
   * @private
   */
  _addEventListeners() {
    this.getElement().querySelector(`#alphabet-sort`).addEventListener(`change`, this._changeSortHandler);
    this.getElement().querySelector(`#alphabet-sort-reverse`).addEventListener(`change`, this._changeSortHandler);
    this.getElement().querySelector(`#search`).addEventListener(`input`, this._filterByTextHandler);
    this.getElement().querySelector(`#rainy`).addEventListener(`change`, this._filterSortHandler);
    this.getElement().querySelector(`#sunny`).addEventListener(`change`, this._filterSortHandler);
    this.getElement().querySelector(`#cloudy`).addEventListener(`change`, this._filterSortHandler);
    this.getElement().querySelector(`#snowy`).addEventListener(`change`, this._filterSortHandler);
    this.getElement().querySelector(`#stormy`).addEventListener(`change`, this._filterSortHandler);
    this.getElement().querySelector(`#blizzard`).addEventListener(`change`, this._filterSortHandler);
    this.getElement().querySelector(`#metorite`).addEventListener(`change`, this._filterSortHandler);
  }

  /**
   * Обработчик события изменения способа сортировки
   * @param evt
   * @private
   */
  _changeSortHandler(evt) {
    evt.preventDefault();
    this.weatherService.setSortType(evt.target.value);
  }

  /**
   * Обработчик события фильтрации
   * @param evt
   * @private
   */
  _filterByTextHandler(evt) {
    evt.preventDefault();
    this.weatherService.setSearch(evt.target.value);
  }

  /**
   * Обработчик события изменения способа сортировки и фильтрации
   * @param evt
   * @private
   */
  _filterSortHandler(evt) {
    evt.preventDefault();
    this.weatherService.setFilter(evt.target.value, evt.target.checked);
  }
}
