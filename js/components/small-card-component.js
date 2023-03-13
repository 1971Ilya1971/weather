import {STATUS_CARD_SMALL} from '../utils.js';
import {AbstractComponent} from './abstract-component.js';

/**
 * Компонент карточки общего списка
 */
export class SmallCardComponent extends AbstractComponent {
  /**
   * Конструктор класса, параметром принимает данные для карточки и weatherService
   * @param data
   * @param weatherService
   */
  constructor(data, weatherService) {
    super();
    this._data = data;
    this.weatherService = weatherService;
  }

  /**
   * Метод генерирующий HTML шаблон и подставляет в шаблон данные
   * @returns {string}
   * @private
   */
  _getTemplate() {
    return `<div class="card small-card" id="${this._data.city.replaceAll(` `, `-`)}" data-status="${STATUS_CARD_SMALL}" draggable="true">
                <span class="small-card__city"> ${this._data.city} </span>
                <span class="small-card__temperature">
                    ${this._data.temperature > 0 ? `+` : ``}
                    ${this._data.temperature}°
                </span>
                <span class="icon icon--strips-small"></span>
            </div>`;
  }

  /**
   * Метод, который вызывается после создания DOM элемента на основе шаблона _getTemplate
   * @private
   */
  _afterCreateElement() {
    this.weatherService.makeCardDraggable(this._element, this._data);
  }
}
