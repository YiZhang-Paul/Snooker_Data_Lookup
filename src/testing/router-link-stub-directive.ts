import { Directive, Input } from '@angular/core';

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

import { NgModule } from '@angular/core';

@NgModule({
    declarations: [
        RouterLinkStubDirective
    ]
})
export class RouterStubsModule { }
