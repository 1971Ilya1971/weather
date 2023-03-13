import {createElement} from '../utils.js';

/**
 * Абстрактный класс для компонентов приложения
 * Содержит базовые для всех компонентов методы
 */
export class AbstractComponent {
  /**
   * Конструктор абстрактного класса
   */
  constructor() {
    /**
     * Запрет на создание экземпляра абстрактного компонент
     */
    if (new.target === AbstractComponent) {
      throw new Error(`It's AbstractComponent, we don't need to create them!`);
    }
    this._element = null;
  }

  /**
   * Абстрактный метод получения шаблона компонента
   * Обязательно должен быть переопределён в дочернем классе
   * @private
   */
  _getTemplate() {
    throw new Error(`It's AbstractComponent method, please implement it!`);
  }

  /**
   * Метод который создает DOM элемент для компонента
   * Элемент создается на основе HTML шаблона полученного из _getTemplate
   * @returns Element
   */
  getElement() {
    if (!this._element) {
      this._element = createElement(this._getTemplate());
      this._afterCreateElement();
    }
    return this._element;
  }

  /**
   * Метод, который будет вызываться перед созданием DOM элемента
   * @private
   */
  _afterCreateElement() {
    // abstract hook method
  }
}
