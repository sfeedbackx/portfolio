(function() {
  "use strict";

  // ---- Markdown fetching & rendering (adapted from md_parser) ----

  async function readMarkdown(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("HTTP error: " + response.status);
    }
    return await response.text();
  }

  function slugify(text) {
    return text.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  }

  function check_and_parse_title(line) {
    var numhead = 0;
    for (var i = 0; line[i] === '#'; i++) {
      ++numhead;
    }
    if (line[numhead] !== ' ') {
      return { head_numb: 0, head_tit: line };
    }
    return { head_numb: numhead, head_tit: line.slice(numhead + 1) };
  }

  function parseInline(text) {
    text = text.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, '<img src="$2" alt="$1">');
    text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    text = text.replace(/\*(.+?)\*/g, "<em>$1</em>");
    //this problem with my treeseter nvim
    var codeRegex = new RegExp("`([^`]+)`", "g");
    text = text.replace(codeRegex, "<code>$1</code>");
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    text = text.replace(/\n/g, "<br>");
    return text;
  }

  function parseTable(lines) {
    var table = document.createElement("table");
    var thead = document.createElement("thead");
    var tbody = document.createElement("tbody");

    var headerCells = lines[0].split("|").filter(function(c) { return c.trim() !== ""; });
    var tr_h = document.createElement("tr");
    headerCells.forEach(function(cell) {
      var th = document.createElement("th");
      th.innerHTML = parseInline(cell.trim());
      tr_h.appendChild(th);
    });
    thead.appendChild(tr_h);

    var startRow = lines[1].match(/^[\s|:-]+$/) ? 2 : 1;

    for (var r = startRow; r < lines.length; r++) {
      var cells = lines[r].split("|").filter(function(c) { return c.trim() !== ""; });
      var tr = document.createElement("tr");
      cells.forEach(function(cell) {
        var td = document.createElement("td");
        td.innerHTML = parseInline(cell.trim());
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    }

    table.appendChild(thead);
    table.appendChild(tbody);
    return table;
  }

  function processMd(markdownText, container) {
    var lines = markdownText.split("\n");
    var i = 0;

    while (i < lines.length) {
      var line = lines[i];
var fenceWithLang = new RegExp("^```");
      if (line.match(fenceWithLang)) {
        var codeLines = [];
        i++;
        while (i < lines.length && !lines[i].match(fenceWithLang)) {
          codeLines.push(lines[i]);
          i++;
        }
        i++;
        var pre = document.createElement("pre");
        var code = document.createElement("code");
        code.textContent = codeLines.join("\n");
        pre.appendChild(code);
        container.appendChild(pre);
        continue;
      }

      if (line.match(/^#{1,6}\s/)) {
        var titleObj = check_and_parse_title(line);
        var h = document.createElement("h" + titleObj.head_numb);
        h.innerHTML = parseInline(titleObj.head_tit);
        h.id = slugify(titleObj.head_tit);
        container.appendChild(h);
        i++;
        continue;
      }

      if (line.match(/^---+$/) || line.match(/^\*\*\*+$/) || line.match(/^___+$/)) {
        container.appendChild(document.createElement("hr"));
        i++;
        continue;
      }

      if (line.match(/^>\s/)) {
        var quoteLines = [];
        while (i < lines.length && lines[i].match(/^>\s?/)) {
          quoteLines.push(lines[i].replace(/^>\s?/, ""));
          i++;
        }
        var bq = document.createElement("blockquote");
        bq.innerHTML = parseInline(quoteLines.join("\n"));
        container.appendChild(bq);
        continue;
      }

      if (line.match(/^\|.*\|$/)) {
        var tableLines = [];
        while (i < lines.length && lines[i].match(/^\|.*\|$/)) {
          tableLines.push(lines[i]);
          i++;
        }
        container.appendChild(parseTable(tableLines));
        continue;
      }

      if (line.match(/^[-*+]\s/)) {
        var ul = document.createElement("ul");
        while (i < lines.length && lines[i].match(/^[-*+]\s/)) {
          var li = document.createElement("li");
          li.innerHTML = parseInline(lines[i].replace(/^[-*+]\s/, ""));
          ul.appendChild(li);
          i++;
        }
        container.appendChild(ul);
        continue;
      }

      if (line.match(/^\d+\.\s/)) {
        var ol = document.createElement("ol");
        while (i < lines.length && lines[i].match(/^\d+\.\s/)) {
          var li2 = document.createElement("li");
          li2.innerHTML = parseInline(lines[i].replace(/^\d+\.\s/, ""));
          ol.appendChild(li2);
          i++;
        }
        container.appendChild(ol);
        continue;
      }

      if (line.trim() === "") {
        i++;
        continue;
      }

      var paraLines = [];
      while (i < lines.length &&
        lines[i].trim() !== "" &&
        !lines[i].match(/^#{1,6}\s/) &&
        !lines[i].match(fenceWithLang) &&
        !lines[i].match(/^[-*+]\s/) &&
        !lines[i].match(/^\d+\.\s/) &&
        !lines[i].match(/^>\s/) &&
        !lines[i].match(/^\|.*\|$/) &&
        !lines[i].match(/^---+$/)) {
        paraLines.push(lines[i]);
        i++;
      }
      if (paraLines.length > 0) {
        var p = document.createElement("p");
        p.innerHTML = parseInline(paraLines.join("\n"));
        container.appendChild(p);
      }
    }
  }

  // ---- Notes page wiring ----

  var params = new URLSearchParams(window.location.search);
  var mdFile = params.get("file");


  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      year: "numeric", month: "short", day: "numeric"
    });
  }

  function buildNoteCard(note) {
    var wrapper = document.createElement("div");
    wrapper.className = "notes-card";
    var link = document.createElement("a");
    link.href = "notes.html?file=" + note.file;
    link.className = "notes-card-link";
    link.innerHTML =
      '<div class="note-header">' +
      '<h3 class="note-name">' + note.title + "</h3>" +
      "</div>" +
      '<p class="note-desc">' + note.description + "</p>" +
      '<span class="notes-date">' + formatDate(note.date) + "</span>";
    wrapper.appendChild(link);
    return wrapper;
  }

  function renderGrid(container) {
    notes.forEach(function(note) {
      container.appendChild(buildNoteCard(note));
    });
  }

  function renderNote(container) {
    container.innerHTML = "";

    var backLink = document.createElement("a");
    backLink.href = "index.html";
    backLink.className = "notes-back";
    backLink.innerHTML = "&larr; home";
    container.appendChild(backLink);

    var backGrid = document.createElement("a");
    backGrid.href = "notes.html";
    backGrid.className = "notes-back";
    backGrid.innerHTML = "&larr; all notes";
    backGrid.style.marginLeft = "1.5rem";
    container.appendChild(backGrid);

    var article = document.createElement("article");
    article.className = "note-content";
    article.innerHTML = '<p class="about-text">Loading…</p>';
    container.appendChild(article);
    readMarkdown(mdFile).then(function(text) {
      article.innerHTML = "";
      processMd(text, article);
    }).catch(function(err) {
      article.innerHTML = '<p class="about-text">Failed to load note: ' + err + "</p>";
    });
  }

  var gridEl = document.getElementById("notes-grid");
  var noteEl = document.getElementById("note-view");
  var headingEl = document.getElementById("notes-heading");

  if (mdFile && noteEl) {
    if (gridEl) gridEl.style.display = "none";
    if (headingEl) headingEl.style.display = "none";
    noteEl.style.display = "block";
    renderNote(noteEl);
  } else if (gridEl) {
    renderGrid(gridEl);
  }
})();
