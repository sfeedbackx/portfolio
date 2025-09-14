import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
interface Technology {
  name: string;
  image: string;
  alt: string;
  size: string;
  hoverColor?: string;
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
    { name: 'Node.js', image: 'node-js.png', alt: 'node-js', size: 'w-7 h-7', hoverColor:"nodejs-filter" },
    { name: 'Spring Boot', image: 'spring-boot.png', alt: 'spring-boot', size: 'w-7 h-7' ,hoverColor:"springboot-filter"},
    { name: 'Express.js', image: 'express-js.png', alt: 'express-js', size: 'w-7 h-7',hoverColor:"expressjs-filter" },
    { name: 'Angular', image: 'angular.png', alt: 'angular', size: 'w-7 h-7',hoverColor:"angularjs-filter" },
    { name: 'Nest.js', image: 'Nest-js.png', alt: 'Nest-js', size: 'w-7 h-7',hoverColor:"nestjs-filter" },
    { name: 'Docker', image: 'docker.png', alt: 'docker', size: 'w-7 h-7',hoverColor:"docker-filter" },
    { name: 'React', image: 'react.png', alt: 'react', size: 'w-7 h-7' , hoverColor:"react-filter"},
    { name: 'Linux', image: 'linux-logo.png', alt: 'linux', size: 'w-7 h-7', hoverColor:"linux-git-filter" },
    { name: 'GitHub', image: 'github.png', alt: 'github', size: 'w-7 h-7' , hoverColor:"linux-git-filter"},
    { name: 'Tailwind', image: 'Tailwind.png', alt: 'Tailwind', size: 'w-7 h-7',hoverColor:"tailwind-filter" },
    { name: 'MongoDB', image: 'mongoDB.png', alt: 'mongoDB', size: 'w-7 h-7',hoverColor:"mongodb-filter" },
    { name: 'PostgreSQL', image: 'postgresql.png', alt: 'postgresSQL', size: 'w-7 h-7', hoverColor:"postgress-filter" }
  ];
}
