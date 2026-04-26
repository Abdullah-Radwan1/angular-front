import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[appTest]',
})
export class Test {
  @Input() apphighlighter = 'royalblue';

  constructor() {}
}
