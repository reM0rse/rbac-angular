import {
  LayoutModule,
  BreakpointObserver,
  Breakpoints,
} from '@angular/cdk/layout';
import { Component, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  standalone: true,
})
export class Dashboard {
  features = [
    { title: 'Fast Setup', desc: 'Deploy your site in minutes with Angular.' },
    { title: 'Modern Design', desc: 'Built with Angular Material and SCSS.' },
    {
      title: 'Standalone App',
      desc: 'Powered by Angular 20 standalone components.',
    },
  ];
}
