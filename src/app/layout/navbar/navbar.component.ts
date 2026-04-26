import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, NzMenuModule, NzButtonModule, NzIconModule, NzDrawerModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  scrolled = false;
  mobileOpen = false;

  navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ];

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled = window.scrollY > 50;
  }

  openMobile() {
    this.mobileOpen = true;
  }

  closeMobile() {
    this.mobileOpen = false;
  }
}
