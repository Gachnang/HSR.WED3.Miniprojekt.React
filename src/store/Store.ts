function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

function mergeDeep(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}

export class Store<S> {
  protected state: S;
  protected observers: ((newState: S, prevState: S) => void)[] = [];

  constructor (initialState: S) {
    this.state = initialState;
  }

  addObserver (observer: (state: S) => void): () => void {
    this.observers.push(observer);
    const removeObserver = () => {
      this.observers = this.observers.filter((o) => observer !== o);
    };
    return removeObserver;
  }

  setState (...states: Partial<S>[]) {
    const prevState = mergeDeep({}, this.state);
    this.state = mergeDeep(this.state, ...states);

    for (const observer of this.observers) {
      observer(this.state, prevState);
    }
  }

  getState(): S {
    return this.state;
  }
}

export default Store;