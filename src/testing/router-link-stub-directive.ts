import { NgModule, DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { Directive, Input } from '@angular/core';
import { By } from '@angular/platform-browser';

// tslint:disable:directive-selector
// tslint:disable:use-host-property-decorator
// tslint:disable:no-input-rename
@Directive({
    selector: '[routerLink]',
    host: { '(click)': 'onClick()' }
})
export class RouterLinkStubDirective {

    @Input('routerLink') linkParams: string;
    private _navigatedTo: string = null;

    get navigatedTo(): string {

        return this._navigatedTo;
    }

    public onClick() {

        this._navigatedTo = this.linkParams;
    }
}

@NgModule({

    declarations: [

        RouterLinkStubDirective
    ]
})
export class RouterStubsModule { }

export function getLinkStub(debugElement: DebugElement): RouterLinkStubDirective {

    return debugElement.injector.get(RouterLinkStubDirective);
}

export function getLinkStubs(fixture: ComponentFixture<any>): [DebugElement[], RouterLinkStubDirective[]] {

    const filter = By.directive(RouterLinkStubDirective);
    const debugElements = fixture.debugElement.queryAll(filter);

    return [debugElements, debugElements.map(getLinkStub)];
}
