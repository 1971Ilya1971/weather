/**
 * URL для загрузки данных приложения
 * @type {string}
 */
export const URL = `https://mock.pages.academy/weather_report/db`;
/**
 * CSS класс для скрытия блока
 * @type {string}
 */
export const HIDE_BLOCK_CLASS = `hidden-block`;
/**
 * CSS класс для "большой" карточки блока избранного
 * @type {string}
 */
export const STATUS_CARD_BIG = `big`;
/**
 * CSS класс для "маленькой" карточки общего блока
 * @type {string}
 */
export const STATUS_CARD_SMALL = `small`;
/**
 * Способы вставки элементов в контейнер
 * @type {{BEFOREEND: string, AFTERBEGIN: string}}
 */
export const InsertPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
};

/**
 * Способы сортировки
 * @type {{ASC: string, DESC: string}}
 */
export const SortType = {
  ASC: `asc`,
  DESC: `desc`,
};

/**
 * Перечисление событий, которые могут возникать в приложении
 * @type {{FILTER_CHANGES: string, CARD_UPDATE_POSITION: string, SORT_CHANGES: string, SEARCH_CHANGES: string}}
 */
export const StateActions = {
  SORT_CHANGES: `sort-changes`,
  SEARCH_CHANGES: `search-changes`,
  FILTER_CHANGES: `filter-changes`,
  CARD_UPDATE_POSITION: `card-update-position`,
};
/**
 * Перечисление возможных фильтров
 * @type {{SNOWY: string, BLIZZARD: string, METORITE: string, RAINY: string, STORMY: string, CLOUDY: string, SUNNY: string}}
 */
export const FilterState = {
  SUNNY: `sunny`,
  CLOUDY: `cloudy`,
  SNOWY: `snowy`,
  METORITE: `metorite`,
  RAINY: `rainy`,
  BLIZZARD: `blizzard`,
  STORMY: `stormy`,
};

/**
 * Метод создания DOM элемента из строки содержащей HTML разметку
 * @param template
 * @return {Element}
 */
export function createElement(template) {
  const element = document.createElement(`div`);
  element.innerHTML = template;
  return element.firstElementChild;
}

/**
 * Метод для вставки DOM элемента в необходимое место
 * @param container
 * @param element
 * @param insertPosition
 */
export function renderElement(container, element, insertPosition = InsertPosition.AFTERBEGIN) {
  switch (insertPosition) {
    case InsertPosition.BEFOREEND:
      container.append(element);
      break;
    case InsertPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case InsertPosition.AFTEREND:
      container.insertAdjacentElement(`afterend`, element);
      break;
  }
}

/**
 * Метод для скрытия/отображения отдельных элементов
 * @param element
 * @param visibility
 */
export function setElementVisibility(element, visibility) {
  element.classList.toggle(HIDE_BLOCK_CLASS, !visibility);
}

/**
 * Константа центральной точки по умолчанию LAT
 * @type {number}
 */
export const DEFAULT_LAT = 55.751244;
/**
 * Константа центральной точки по умолчанию LON
 * @type {number}
 */
export const DEFAULT_LON = 37.618423;
/**
 * Константа приближения по умолчанию
 * @type {number}
 */
export const DEFAULT_ZOOM = 10;
/**
 * Константа управления прозрачностью в обычном состоянии карточки
 * @type {number}
 */
export const OPACITY_DEFAULT = 1.0;
/**
 * Константа управления прозрачностью в состоянии карточки перетаскивания
 * @type {number}
 */
export const OPACITY_INACTIVE = 0.7;
/**
 * Методы сортировки данных
 * @type {{asc: (function(*, *): number), desc: (function(*, *): number)}}
 */
export const SortTypeMethods = {
  asc: (a, b) => a.city.localeCompare(b.city),
  desc: (a, b) => -a.city.localeCompare(b.city),
};

/**
 * Метод, меняющий подсветку активной карточки
 * @param evt
 */
export function toggleActiveClassForPointHandler(evt) {
  const idByName = evt.target.options.title.replaceAll(` `, `-`);
  const bigCardElement = document.querySelector(`#${idByName}`);
  let isShouldBeActive = false;

  switch (evt.type) {
    case `click`:
      isShouldBeActive = !bigCardElement.classList.contains(`active`);
      break;
    case `mouseover`:
      isShouldBeActive = true;
      break;
    case `mouseout`:
      isShouldBeActive = false;
      break;
  }

  document.querySelectorAll(`.card-list .card`).forEach((city) => city.classList.remove(`active`));
  bigCardElement.classList.toggle(`active`, isShouldBeActive);
  this.setOpacity(isShouldBeActive ? OPACITY_DEFAULT : OPACITY_INACTIVE);
}

/**
 * URL для получения текущей локации
 * @type {string}
 */
export const LOCATION_API_URL = `https://ipinfo.io/json?token=c53e5677671c54`;
