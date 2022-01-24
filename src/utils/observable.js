export class Observable {
  state = {
    observers: [],
  };

  subscribe(observerFn) {
    this.state.observers.push(observerFn);
  }

  notifyAll(data) {
    for (const observerFn of this.state.observers) {
      observerFn(data);
    }
  }

  unsubscribeAll() {
    this.state.observers = [];
  }
}
