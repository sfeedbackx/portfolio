// Shared notes config — edit title/description for each markdown file.
// pin: true means it shows on the homepage (max 3 recommended).
// file paths are relative to the site root so they work on GitHub Pages
// and with a local python http.server.
var notes = [
  {
    file: "md/proxmox.md",
    title: "Proxmox Networking",
    description: "Bridges, USB tethering, NAT, and connecting VMs on a home lab.",
    date: "2025-10-05",
    pin: true
  },
  {
    file: "md/nestjs.md",
    title: "NestJS",
    description: "Modules, controllers, providers, and dependency injection with TypeScript.",
    date: "2025-09-28",
    pin: true
  },
  {
    file: "md/docker.md",
    title: "Docker",
    description: "Images, containers, and docker-compose for repeatable environments.",
    date: "2025-09-15",
    pin: false
  }
];