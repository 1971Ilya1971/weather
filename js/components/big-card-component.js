import {STATUS_CARD_BIG} from '../utils.js';
import {AbstractComponent} from './abstract-component.js';

/**
 * Компонент карточки избранного списка
 */
export class BigCardComponent extends AbstractComponent {
  /**
   * Конструктор класса, параметром принимает данные для карточки и weatherService
   * @param favoriteCity
   * @param weatherService
   */
  constructor(favoriteCity, weatherService) {
    super();
    this._favoriteCity = favoriteCity;
    this.weatherService = weatherService;
  }

  /**
   * Метод генерирующий HTML шаблон и подставляет в шаблон данные
   * @returns {string}
   * @private
   */
  _getTemplate() {
    return `<div class="card big-card" id="${this._favoriteCity.city.replaceAll(` `,
      `-`)}" data-status="${STATUS_CARD_BIG}" draggable="true">
                <div class="big-card__header">
                    <span class="icon icon--strips-big"></span>
                    <span class="big-card__city">${this._favoriteCity.city}</span>
                </div>
                <div class="big-card__content">
                    <div class="big-card__content-wrapper">
                        <div class="big-card__weather-conditions">
                            ${this._getConditionsTemplate(this._favoriteCity.weather)}
                        </div>
                        <div class="big-card__wind">
                            <span class="icon icon--wind"></span>
                            <span class="big-card__wind-info">
                                Ветер ${this._favoriteCity.wind.direction}, ${this._favoriteCity.wind.speed} м/с
                            </span>
                        </div>
                    </div>
                    <span class="big-card__temperature">
                      ${this._favoriteCity.temperature > 0 ? `+` : ``}
                      ${this._favoriteCity.temperature}°
                    </span>
                </div>
            </div>`;
  }

  /**
   * Метод, который вызывается после создания DOM элемента на основе шаблона _getTemplate
   * @private
   */
  _afterCreateElement() {
    this.weatherService.makeCardDraggable(this._element, this._favoriteCity);
  }

  /**
   * Метод генерирующий иконки погоды в карточке
   * @param weather
   * @returns {string}
   * @private
   */
  _getConditionsTemplate(weather) {
    return Object.keys(weather).map((condition) => {
      return weather[condition] ? `<span class="icon icon--${condition}"></span>` : ``;
    }).join(``);
  }
}
