import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
interface Technology {
  name: string;
  image: string;
  alt: string;
  size: string;
}
@Component({
  selector: 'app-skills',
  imports: [CommonModule],
  templateUrl: './skills.html',
  styleUrl: './skills.css'
})
export class Skills {
  technologiesTitle = signal("Technologies")
 technologies: Technology[] = [
    { name: 'Node.js', image: 'node-js.png', alt: 'node-js', size: 'w-7 h-7' },
    { name: 'Spring Boot', image: 'spring-boot.png', alt: 'spring-boot', size: 'w-7 h-7' },
    { name: 'Express.js', image: 'express-js.png', alt: 'express-js', size: 'w-7 h-7' },
    { name: 'Angular', image: 'angular.png', alt: 'angular', size: 'w-7 h-7' },
    { name: 'Nest.js', image: 'Nest-js.png', alt: 'Nest-js', size: 'w-7 h-7' },
    { name: 'Docker', image: 'docker.png', alt: 'docker', size: 'w-7 h-7' },
    { name: 'React', image: 'react.png', alt: 'react', size: 'w-7 h-7' },
    { name: 'Linux', image: 'linux-logo.png', alt: 'linux', size: 'w-7 h-7' },
    { name: 'GitHub', image: 'github.png', alt: 'github', size: 'w-7 h-7' },
    { name: 'Tailwind', image: 'Tailwind.png', alt: 'Tailwind', size: 'w-7 h-7' },
    { name: 'MongoDB', image: 'mongoDB.png', alt: 'mongoDB', size: 'w-7 h-7' },
    { name: 'PostgreSQL', image: 'postgresql.png', alt: 'postgresSQL', size: 'w-7 h-7' }
  ];


}
