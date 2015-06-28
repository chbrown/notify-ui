/*jslint browser: true */

export class Flash {
  private _cached_container: HTMLElement;
  private children: HTMLElement[] = [];

  constructor(public options = {id: 'flash', className: 'flash'}) { }

  get container() {
    if (!this._cached_container) {
      // try to find existing flash container
      this._cached_container = document.getElementById(this.options.id);
      if (!this._cached_container) {
        // create new [id=flash] element and attach it to the document
        this._cached_container = document.createElement('div');
        this._cached_container.setAttribute('class', this.options.className);
        this._cached_container.setAttribute('id', this.options.id);
        // insert it at the top of the body
        document.body.insertBefore(this._cached_container, document.body.firstChild);
      }
    }
    return this._cached_container;
  }

  addMessage(message: string, duration: number = 3000): HTMLElement {
    var child = document.createElement('span');
    child.textContent = message;
    this.container.appendChild(child);
    this.children.push(child);
    if (duration) {
      setTimeout(() => { this.removeChild(child) }, duration);
    }
    return child;
  }

  removeChild(child: HTMLElement) {
    this.container.removeChild(child);
    var index = this.children.indexOf(child);
    this.children.splice(index, 1);
  }

  removeAllChildren() {
    this.children.forEach(child => this.container.removeChild(child));
    this.children.length = 0;
  }
}

if (typeof window['angular'] !== 'undefined') {
  /**
  Inject $flash and use like:

      $flash('OMG it burns!', 5000)

  or

      $flash(asyncResultPromise)
  */
  window['angular'].module('flash-client', []).service('$flash', ($q) => {
    /**
    value can be a string or a promise

    default to a 3 second timeout, but allow permanent flashes by setting duration = null
    */
    var flash = new Flash();
    return (value, duration: number = 3000) => {
      var flash_child = flash.addMessage('...');
      // for some reason, .finally() doesn't get the promise's value,
      // so we have to use .then(a, a)
      var done = function(result) {
        flash_child.textContent = result.toString();
        // if duration is falsey (e.g., null or 0), leave the message permanently
        if (duration) {
          setTimeout(() => flash.removeChild(flash_child), duration);
        }
      };
      // wrap value with .when() to support both strings and promises of strings
      $q.when(value).then(done, done);
    };
  });
}
