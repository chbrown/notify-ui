export declare class Notification {
    protected _message: string;
    protected _element: HTMLElement;
    protected _parentNode: Node;
    constructor(message: string, className?: string);
    message: string;
    appendTo(parentNode: Node): void;
    remove(): void;
}
export declare class NotifyUI {
    protected id: string;
    protected className: string;
    private _container;
    constructor(id: string, className?: string);
    private static _singleton;
    static singleton: NotifyUI;
    container: HTMLElement;
    add(message: string, duration?: number): Notification;
    static add(message: string, duration?: number): Notification;
    addPromise(promise: any, initial_message?: string, duration?: number): Notification;
    static addPromise(promise: any, initial_message?: string, duration?: number): Notification;
}
