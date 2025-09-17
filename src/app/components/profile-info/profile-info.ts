import { Component, signal } from '@angular/core';
import { SocialLinks } from '../social-links/social-links';

@Component({
  selector: 'app-profile-info',
  imports: [SocialLinks],
  templateUrl: './profile-info.html',
  styleUrl: './profile-info.css'
})
export class ProfileInfo {
  myName = signal("Ahmed Khalil Sfar")
 static isHovered = signal<boolean | null>(null)
  togole(){
    setTimeout(()=>{
      ProfileInfo.isHovered.update((isHovered) => !isHovered)

    },0)
    console.log(ProfileInfo.isHovered)
  }
  getStatus(){
    return ProfileInfo.isHovered()
  }


}
