import {AbstractComponent} from './abstract-component.js';

/**
 * Компонент пустой карточки избранного, заглушка
 */
export class BigCardEmptyComponent extends AbstractComponent {
  _getTemplate() {
    return `<li class="card">
              <div class="big-card--empty"></div>
            </li>`;
  }
}
