import { HttpRequest, HttpResponse } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

export function fakeRequest<T>(url: string, method: 'GET' | 'DELETE' = 'GET'): HttpRequest<T> {

    return new HttpRequest<T>(method, url);
}

export function fakeResponse(body: string): HttpResponse<any> {

    return new HttpResponse({ body });
}

export function queryByCss(element: DebugElement, css: string): DebugElement {

    return element.query(By.css(css));
}

export function queryAllByCss(element: DebugElement, css: string): DebugElement[] {

    return element.queryAll(By.css(css));
}

export function queryByDirective(element: DebugElement, directive: any): DebugElement {

    return element.query(By.directive(directive));
}

export function triggerNativeEventByCss(

    element: DebugElement,
    css: string,
    type: string,
    target: object = null

): void {

    const event = new Event(type);
    Object.defineProperty(event, 'target', { writable: false, value: target });
    queryByCss(element, css).nativeElement.dispatchEvent(event);
}

export function triggerEventByCss(

    element: DebugElement,
    css: string,
    type: string,
    payload: any = null

): void {

    queryByCss(element, css).triggerEventHandler(type, payload);
}
