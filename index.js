/*jslint browser: true */
var Flash = (function () {
    function Flash(options) {
        if (options === void 0) { options = { id: 'flash', className: 'flash' }; }
        this.options = options;
        this.children = [];
    }
    Object.defineProperty(Flash.prototype, "container", {
        get: function () {
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
        },
        enumerable: true,
        configurable: true
    });
    Flash.prototype.addMessage = function (message, duration) {
        var _this = this;
        if (duration === void 0) { duration = 3000; }
        var child = document.createElement('span');
        child.textContent = message;
        this.container.appendChild(child);
        this.children.push(child);
        if (duration) {
            setTimeout(function () { _this.removeChild(child); }, duration);
        }
        return child;
    };
    Flash.prototype.removeChild = function (child) {
        this.container.removeChild(child);
        var index = this.children.indexOf(child);
        this.children.splice(index, 1);
    };
    Flash.prototype.removeAllChildren = function () {
        var _this = this;
        this.children.forEach(function (child) { return _this.container.removeChild(child); });
        this.children.length = 0;
    };
    return Flash;
})();
exports.Flash = Flash;
if (typeof window['angular'] !== 'undefined') {
    /**
    Inject $flash and use like:
  
        $flash('OMG it burns!', 5000)
  
    or
  
        $flash(asyncResultPromise)
    */
    window['angular'].module('flash-client', []).service('$flash', function ($q) {
        /**
        value can be a string or a promise
    
        default to a 3 second timeout, but allow permanent flashes by setting duration = null
        */
        var flash = new Flash();
        return function (value, duration) {
            if (duration === void 0) { duration = 3000; }
            var flash_child = flash.addMessage('...');
            // for some reason, .finally() doesn't get the promise's value,
            // so we have to use .then(a, a)
            var done = function (result) {
                flash_child.textContent = result.toString();
                // if duration is falsey (e.g., null or 0), leave the message permanently
                if (duration) {
                    setTimeout(function () { return flash.removeChild(flash_child); }, duration);
                }
            };
            // wrap value with .when() to support both strings and promises of strings
            $q.when(value).then(done, done);
        };
    });
}
