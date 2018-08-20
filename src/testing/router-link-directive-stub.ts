import { Directive, Input } from '@angular/core';

@Directive({
    selector: '[routerLink]',
    host: { '(click)': 'onClick()' }
})
export class RouterLinkDirectiveStub {

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
        RouterLinkDirectiveStub
    ]
})
export class RouterStubsModule { }
