import {
  DEFAULT_LAT,
  DEFAULT_LON,
  DEFAULT_ZOOM,
  LOCATION_API_URL,
  OPACITY_INACTIVE,
  StateActions,
  toggleActiveClassForPointHandler,
} from '../utils.js';
import {AbstractComponent} from './abstract-component.js';

/**
 * Компонент карты
 */
export class MapComponent extends AbstractComponent {
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
   * Метод инициализации компонента-карты
   */
  init() {
    // пытаемся получить текущее местоположение
    this._getLocation().then(([lat = DEFAULT_LAT, long = DEFAULT_LON]) => {

      // инициализируем плагин карты и устанавливаем параметры по умолчанию
      this.weatherService.map = L.map(`map`).setView([lat, long], DEFAULT_ZOOM);
      L.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`).addTo(this.weatherService.map);

      // добавляем обработчик события изменения карточки
      window.addEventListener(StateActions.CARD_UPDATE_POSITION, this._dataChangedHandler);
    });
  }

  /**
   * Метод генерирующий HTML шаблон и подставляет в шаблон данные
   * @returns {string}
   * @private
   */
  _getTemplate() {
    return `<div id="map" class="weather-app__map weather-map"></div>`;
  }

  /**
   * Метод получающий текущую локацию пользователя
   * @returns {Promise<any>}
   * @private
   */
  _getLocation() {
    return fetch(LOCATION_API_URL).then((res) => res.json()).then((data) => data.loc.split(`,`));
  }

  /**
   * Обработчик события изменения данных
   * @private
   */
  _dataChangedHandler() {
    // получаем избранные города
    const favoritesCities = this.weatherService.getFavoriteCities();
    // очищаем карту
    this.weatherService.map.remove();
    // устанавливаем положение и приближение карты
    this.weatherService.map = L.map(`map`).setView([DEFAULT_LAT, DEFAULT_LON], DEFAULT_ZOOM);
    L.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`).addTo(this.weatherService.map);
    // добавляем на карту избранные города и сохраняем маркеры
    this.weatherService.markers = favoritesCities.map((city) => {
      return L.marker([city.coordinates.latitude, city.coordinates.longitude], {title: city.city}).
        addTo(this.weatherService.map).
        setOpacity(OPACITY_INACTIVE).
        on(`mouseover`, toggleActiveClassForPointHandler).
        on(`mouseout`, toggleActiveClassForPointHandler);
    });
    // если избранные города не пустые то устанавливает вид карты, который содержит заданные географические границы с максимально возможным уровнем масштабирования.
    if (favoritesCities.length) {
      const group = L.featureGroup(this.weatherService.markers);
      this.weatherService.map.fitBounds(group.getBounds());
    } else {
      this.weatherService.map.setView([DEFAULT_LAT, DEFAULT_LON], DEFAULT_ZOOM);
    }
  }
}
