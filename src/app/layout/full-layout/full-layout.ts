import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavContainer, MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-full-layout',
  imports: [
    CommonModule,
    MatSidenavContainer,
    MatSidenavModule,
    MatSidenav,
    MatToolbar,
    MatIconModule,
    RouterOutlet,
    RouterLink,
    MatListModule,
  ],
  templateUrl: './full-layout.html',
  styleUrl: './full-layout.scss',
  standalone: true,
})
export class FullLayout {
  isSmallScreen = false;
  private breakpointObserver = inject(BreakpointObserver);

  constructor() {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.isSmallScreen = result.matches;
    });
  }
}
