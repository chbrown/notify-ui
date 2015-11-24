export class Notification {
  protected _message: string;
  protected _element: HTMLElement;
  protected _parentNode: Node;

  constructor(message: string, className = 'notification') {
    this._element = document.createElement('div');
    this._element.className = className;
    this.message = message;
  }

  set message(newMessage: string) {
    if (this._message !== newMessage) {
      this._message = this._element.textContent = newMessage;
    }
  }

  appendTo(parentNode: Node) {
    this._parentNode = parentNode;
    this._parentNode.appendChild(this._element);
  }

  remove() {
    if (this._parentNode) {
      this._parentNode.removeChild(this._element);
    }
  }
}

export class NotifyUI {
  private _container: HTMLElement;
  constructor(protected id: string,
              protected className = 'notification-container') { }

  private static _singleton: NotifyUI;
  static get singleton(): NotifyUI {
    if (NotifyUI._singleton === undefined) {
      NotifyUI._singleton = new NotifyUI('NotifyUI_container');
    }
    return NotifyUI._singleton;
  }

  get container(): HTMLElement {
    if (!this._container) {
      // try to find existing container
      this._container = document.getElementById(this.id);
      if (this._container === null) {
        // create new element
        this._container = document.createElement('div');
        this._container.id = this.id;
        this._container.className = this.className;
      }
    }
    // if the container has been detached from the document, it might still
    // have parentNode set if it was detached along with its parent.
    // TODO: benchmark this. Is Node.compareDocumentPosition() faster?
    //                       Or maybe parentNode recursion?
    //                       Or maybe baseURI === ''?
    if (!document.body.contains(this._container)) {
      // insert it at the top of the body
      document.body.insertBefore(this._container, document.body.firstChild);
    }
    return this._container;
  }

  add(message: string, duration: number = 3000): Notification {
    var notification = new Notification(message);
    notification.appendTo(this.container);
    if (duration) {
      setTimeout(() => {
        notification.remove();
      }, duration);
    }
    return notification;
  }
  static add(message: string, duration: number = 3000): Notification {
    return NotifyUI.singleton.add(message, duration);
  }

  addPromise(promise: any,
             initial_message: string = '...',
             duration: number = 3000): Notification {
    var notification = new Notification(initial_message);
    notification.appendTo(this.container);
    function callback(result) {
      notification.message = result;
      if (duration) {
        setTimeout(() => {
          notification.remove();
        }, duration);
      }
      return result;
    }
    promise.then(callback, callback);
    return notification;
  }
  static addPromise(promise: any,
                    initial_message: string = '...',
                    duration: number = 3000): Notification {
    return NotifyUI.singleton.addPromise(promise, initial_message, duration);
  }
}
