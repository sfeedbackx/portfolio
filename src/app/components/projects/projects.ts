import { Component } from "@angular/core";

interface project {
	name: string;
	img: string;
	alt: string;
	description: string;
	link: string;
}

@Component({
	selector: "app-projects",
	imports: [],
	templateUrl: "./projects.html",
	styleUrl: "./projects.css",
})
export class Projects {
	projects: project[] = [
		{
			name: "livrili",
			img: "livrili.png",
			alt: "livrili",
			description:
				"A platform for clients and couriers to manage packages, offers and reviews.",
			link: "https://github.com/sfeedbackx/livrili",
		},
		{
			name: "ichat",
			img: "ichat.png",
			alt: "ichat",
			description: "An app for real-time conversations with sign-in and online status.",
			link: "https://github.com/sfeedbackx/Chat-app",
		},
	];
	capitalizeFirstLetter(str: string): string {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}
}
