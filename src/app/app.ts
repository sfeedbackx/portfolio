import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { ProfileInfo } from './components/profile-info/profile-info';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Header,ProfileInfo],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('portfolio');
}
