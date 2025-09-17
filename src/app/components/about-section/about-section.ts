import { Component, signal } from '@angular/core';
import { ProfileInfo } from '../profile-info/profile-info';

@Component({
  selector: 'app-about-section',
  imports: [ProfileInfo],
  templateUrl: './about-section.html',
  styleUrl: './about-section.css'
})
export class AboutSection {

  isHovered = ProfileInfo.isHovered

}
