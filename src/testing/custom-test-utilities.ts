import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

export function QueryByCss(element: DebugElement, css: string): DebugElement {

    return element.query(By.css(css));
}

export function QueryByDirective(element: DebugElement, directive: any): DebugElement {

    return element.query(By.directive(directive));
}

export function TriggerEventByCss(

    element: DebugElement,
    css: string,
    event: string,
    eventArgs: any = null

): void {

    QueryByCss(element, css).triggerEventHandler(event, eventArgs);
}
