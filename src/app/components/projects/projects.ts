import { Component } from '@angular/core';

interface project {
  name: string,
  img: string,
  alt: string
}

@Component({
  selector: 'app-projects',
  imports: [],
  templateUrl: './projects.html',
  styleUrl: './projects.css'
})
export class Projects {
   projects : project[] =[
    {name:"livrili", img: "livrili.png" , alt: "livrili"},
    {name:"ichat", img: "ichat.png" , alt: "ichat"}
  ]
   capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

}
