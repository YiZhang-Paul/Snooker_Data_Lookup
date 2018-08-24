import { HttpRequest, HttpResponse } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

export function compareTextContent(debugElement: DebugElement, expected: string): void {

    expect(debugElement.nativeElement.textContent).toEqual(expected);
}

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

export function triggerEventByCss(

    element: DebugElement,
    css: string,
    event: string,
    eventArgs: any = null

): void {

    queryByCss(element, css).triggerEventHandler(event, eventArgs);
}
