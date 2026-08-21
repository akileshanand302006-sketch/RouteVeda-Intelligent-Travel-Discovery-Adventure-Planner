import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  readonly techStack = [
    { name: 'Angular 22', role: 'Frontend Framework & Architecture' },
    { name: 'TypeScript 6', role: 'Type Safety & Interfaces' },
    { name: 'Angular Signals', role: 'Reactive State Management' },
    { name: 'Bootstrap 5', role: 'Responsive Grid & Base Components' },
    { name: 'Bootstrap Icons', role: 'UI Iconography' },
    { name: 'LocalStorage', role: 'Client Persistence Layer' }
  ];
}
