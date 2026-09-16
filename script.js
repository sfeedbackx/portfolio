(function () {
  "use strict";

  var isHovered = null;

  function toggleHover() {
    setTimeout(function () {
      isHovered = !isHovered;
      applyHighlightState();
    }, 200);
  }

  function applyHighlightState() {
    var picCard = document.getElementById("profile-pic-container");
    var highlights = document.querySelectorAll(".about-highlight");
    if (picCard) {
      if (isHovered === true) {
        picCard.classList.add("pic_card");
      } else {
        picCard.classList.remove("pic_card");
      }
    }
    highlights.forEach(function (el) {
      el.classList.remove("highlight", "highlight-left");
      if (isHovered === true) {
        el.classList.add("highlight-left");
      } else if (isHovered === false) {
        el.classList.add("highlight");
      }
    });
  }

  var hoverables = document.querySelectorAll("[data-hoverable]");
  hoverables.forEach(function (el) {
    el.addEventListener("mouseenter", toggleHover);
    el.addEventListener("mouseleave", toggleHover);
  });

  var technologies = [
    { name: "Node.js", image: "public/node-js.png", alt: "node-js", hoverColor: "nodejs-filter" },
    { name: "Spring Boot", image: "spring-boot.png", alt: "spring-boot", hoverColor: "springboot-filter" },
    { name: "Express.js", image: "express-js.png", alt: "express-js", hoverColor: "expressjs-filter" },
    { name: "Nest.js", image: "nest-js.png", alt: "Nest-js", hoverColor: "nestjs-filter" },
    { name: "Docker", image: "docker.png", alt: "docker", hoverColor: "docker-filter" },
    { name: "React", image: "react.png", alt: "react", hoverColor: "react-filter" },
    { name: "Linux", image: "linux-logo.png", alt: "linux", hoverColor: "linux-git-filter" },
    { name: "GitHub", image: "github.png", alt: "github", hoverColor: "linux-git-filter" },
    { name: "Tailwind", image: "tailwind.png", alt: "Tailwind", hoverColor: "tailwind-filter" },
    { name: "MongoDB", image: "mongoDB.png", alt: "mongoDB", hoverColor: "mongodb-filter" },
    { name: "PostgreSQL", image: "postgresql.png", alt: "postgresSQL", hoverColor: "postgresql-filter" },
  ];

  var skillsContainer = document.getElementById("skills-container");
  if (skillsContainer) {
    technologies.forEach(function (tech) {
      var card = document.createElement("div");
      card.className = "skill-card " + (tech.hoverColor || "");
      card.innerHTML =
        '<img src="' + tech.image + '" alt="' + tech.alt +
        '" class="skill-img snow-filter">' +
        '<div class="skill-name">' + tech.name + "</div>";
      skillsContainer.appendChild(card);
    });
  }

  var projects = [
    {
      name: "livrili",
      img: "livrili.png",
      alt: "livrili",
      description: "A platform for clients and couriers to manage packages, offers and reviews.",
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

  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  var projectsContainer = document.getElementById("projects-container");
  if (projectsContainer) {
    projects.forEach(function (pro) {
      var link = document.createElement("a");
      link.href = pro.link;
      link.target = "_blank";
      link.innerHTML =
        '<div class="project-card">' +
        '<img src="' + pro.img + '" alt="' + pro.alt + '" class="project-img">' +
        '<div class="project-name">' + capitalizeFirstLetter(pro.name) + "</div>" +
        '<div class="project-desc">' + pro.description + "</div>" +
        "</div>";
      projectsContainer.appendChild(link);
    });
  }

  var notesContainer = document.getElementById("notes-container");
  if (notesContainer && typeof notes !== "undefined") {
    var pinned = notes.filter(function (n) { return n.pin; }).slice(0, 3);
    pinned.forEach(function (note) {
      var wrapper = document.createElement("div");
      wrapper.className = "notes-card";
      var link = document.createElement("a");
      link.href = "notes.html?file=" + note.file;
      link.className = "notes-card-link";
      var dateStr = new Date(note.date).toLocaleDateString("en-GB", {
        year: "numeric", month: "short", day: "numeric"
      });
      link.innerHTML =
        '<div class="note-header">' +
        '<h3 class="note-name">' + note.title + "</h3>" +
        "</div>" +
        '<p class="note-desc">' + note.description + "</p>" +
        '<span class="notes-date">' + dateStr + "</span>";
      wrapper.appendChild(link);
      notesContainer.appendChild(wrapper);
    });
  }
})();
