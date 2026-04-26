import { Component } from '@angular/core';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-button',
  imports: [NzButtonModule, RouterLink],
  templateUrl: './button.component.html',
  styles: `
    [nz-button] {
      margin-right: 8px;
      margin-bottom: 12px;
    }
  `,
})
export class ButtonComponent {}
