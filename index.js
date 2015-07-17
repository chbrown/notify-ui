/*jslint browser: true */
var Notification = (function () {
    function Notification(message, className) {
        if (className === void 0) { className = 'notification'; }
        this._element = document.createElement('div');
        this._element.className = className;
        this.message = message;
    }
    Object.defineProperty(Notification.prototype, "message", {
        set: function (newMessage) {
            if (this._message !== newMessage) {
                this._message = this._element.textContent = newMessage;
            }
        },
        enumerable: true,
        configurable: true
    });
    Notification.prototype.appendTo = function (parentNode) {
        this._parentNode = parentNode;
        this._parentNode.appendChild(this._element);
    };
    Notification.prototype.remove = function () {
        if (this._parentNode) {
            this._parentNode.removeChild(this._element);
        }
    };
    return Notification;
})();
exports.Notification = Notification;
var NotifyUI = (function () {
    function NotifyUI(id, className) {
        if (className === void 0) { className = 'notification-container'; }
        this.id = id;
        this.className = className;
    }
    Object.defineProperty(NotifyUI, "singleton", {
        get: function () {
            if (NotifyUI._singleton === undefined) {
                NotifyUI._singleton = new NotifyUI('NotifyUI_container');
            }
            return NotifyUI._singleton;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NotifyUI.prototype, "container", {
        get: function () {
            if (!this._container) {
                // try to find existing flash container
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
        },
        enumerable: true,
        configurable: true
    });
    NotifyUI.prototype.add = function (message, duration) {
        if (duration === void 0) { duration = 3000; }
        var notification = new Notification(message);
        notification.appendTo(this.container);
        if (duration) {
            setTimeout(function () {
                notification.remove();
            }, duration);
        }
        return notification;
    };
    NotifyUI.add = function (message, duration) {
        if (duration === void 0) { duration = 3000; }
        return NotifyUI.singleton.add(message, duration);
    };
    NotifyUI.prototype.addPromise = function (promise, initial_message, duration) {
        if (initial_message === void 0) { initial_message = '...'; }
        if (duration === void 0) { duration = 3000; }
        var notification = new Notification(initial_message);
        notification.appendTo(this.container);
        function callback(result) {
            notification.message = result;
            if (duration) {
                setTimeout(function () {
                    notification.remove();
                }, duration);
            }
            return result;
        }
        promise.then(callback, callback);
        return notification;
    };
    NotifyUI.addPromise = function (promise, initial_message, duration) {
        if (initial_message === void 0) { initial_message = '...'; }
        if (duration === void 0) { duration = 3000; }
        return NotifyUI.singleton.addPromise(promise, initial_message, duration);
    };
    return NotifyUI;
})();
exports.NotifyUI = NotifyUI;
