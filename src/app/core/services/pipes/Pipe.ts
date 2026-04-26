import { Pipe } from '@angular/core';

@Pipe({
  name: 'noSpace',
  standalone: true,
})
class NoSpace {
  constructor() {}
}
