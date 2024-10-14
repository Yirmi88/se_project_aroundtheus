export default class Section {
  constructor({ items, renderer }, container) {
    this._items = items;
    this._renderer = renderer;

    this._container = container;
  }

  renderItems() {
    this._items.forEach((item) => {
      this._renderer(item);
    });
  }

  appendItem(element) {
    this._container.append(element);
  }

  clear() {
    this._container.innerHTML = "";
  }

  addItem(element) {
    this._container.prepend(element);
  }
}
