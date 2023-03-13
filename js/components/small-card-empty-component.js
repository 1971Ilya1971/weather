import {AbstractComponent} from './abstract-component.js';

/**
 * Компонент пустой карточки, заглушка
 */
export class SmallCardEmptyComponent extends AbstractComponent {
  _getTemplate() {
    return `<div class="small-card small-card--empty"></div>`;
  }
}
