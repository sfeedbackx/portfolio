import { Component, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Header } from "./components/header/header";
import { ProfileInfo } from "./components/profile-info/profile-info";
import { AboutSection } from "./components/about-section/about-section";
import { Skills } from "./components/skills/skills";
import { Projects } from "./components/projects/projects";
import { Internships } from "./components/internships/internships";

@Component({
	selector: "app-root",
	imports: [RouterOutlet, Header, ProfileInfo, AboutSection, Skills,Internships,Projects],
	templateUrl: "./app.html",
	styleUrl: "./app.css",
})
export class App {
	protected readonly title = signal("portfolio");
}
