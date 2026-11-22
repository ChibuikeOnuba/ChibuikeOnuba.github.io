/*
  Experience page: Path / Timeline view switch + interactive timeline (Gantt).
  Lanes: Learning, Building, Working. Bars = periods, dots = moments.
  Edit DATA to change the chart. Dates are "YYYY-MM".
  `when` overrides the date text shown (use when only the year is known).
  `end: null` = to today. `extend: true` = lighter bar that runs past today.
  `private: true` = purple dot (code not public).
*/
(function () {
  "use strict";

  var GITHUB = "https://github.com/ChibuikeOnuba";

  var LANES = [
    { key: "learning", label: "Learning", tracks: 2 },
    { key: "building", label: "Building", tracks: 1 },
    { key: "working", label: "Working", tracks: 2 }
  ];

  var BANDS = [
    // CONFIRM: lockdown / campus closure range
    { lane: "learning", start: "2020-03", end: "2021-01", label: "COVID-19 lockdown" }
  ];

  var DATA = [
    // ---------- Learning ----------
    { lane: "learning", track: 0, start: "2020-01", end: "2024-03",
      title: "BSc Computer Science", org: "University of Nigeria, Nsukka",
      note: "ML/AI, data structures and algorithms, database design", href: "#education" },
    { lane: "learning", track: 0, start: "2024-03", end: null, extend: true,
      title: "Always learning", note: "Courses, papers, and learning on the job. It never really stops." },
    { lane: "learning", track: 1, date: "2020-04", when: "2020", label: true,
      title: "Started coding", note: "Picked up programming during the COVID-19 lockdown" },
    { lane: "learning", track: 1, start: "2024-01", end: "2024-04",
      title: "Aspire Leaders Program", org: "Harvard Business School", short: "HBS Aspire", href: "#education" },

    // ---------- Building (approximate dates unless noted) ----------
    { lane: "building", date: "2021-03", title: "Diabetes Prediction", note: "ML classification", href: "projects.html" },
    { lane: "building", date: "2021-09", title: "Mall Customer Segmentation", note: "K-means clustering", href: "projects.html" },
    { lane: "building", date: "2022-03", title: "Diamond Quality and Price Classifier", note: "Regression and classification", href: "projects.html" },
    { lane: "building", date: "2022-09", title: "LB Editor", note: "Photo editor built with OpenCV", href: "projects.html" },
    { lane: "building", date: "2023-06", label: true, title: "ReviewScope", note: "Customer review analysis dashboard (NLP)", href: "projects.html" },
    { lane: "building", date: "2023-11", title: "Autism Detection in Toddlers", note: "ML app and article", href: "projects.html" }, // article date known
    { lane: "building", date: "2024-01", title: "Parts of Speech Tagging", note: "Article", href: "writing.html" },        // known
    { lane: "building", date: "2024-02", title: "VADER vs RoBERTa", note: "Article", href: "writing.html" },                 // known
    { lane: "building", date: "2024-03", title: "Driver Drowsiness Detection", note: "Computer vision project and write-up", href: "projects.html" }, // known
    { lane: "building", date: "2024-08", title: "Condition Classification", note: "ML vs Transformers on drug reviews", href: "projects.html" },
    { lane: "building", date: "2024-12", title: "Getting Started with LangChain", note: "Article", href: "writing.html" },   // known
    { lane: "building", date: "2025-03", title: "FastAPI Blog API", note: "JWT auth, CRUD API", href: "projects.html" },
    { lane: "building", date: "2025-07", title: "Document Chunking and Embedding Pipeline", note: "Semantic search", href: "projects.html" },
    { lane: "building", date: "2025-10", label: true, title: "askDB", note: "Plain-English questions to SQL", href: "projects.html" },
    { lane: "building", date: "2026-03", private: true, label: true, title: "CertainML", note: "Private project", href: "projects.html" },
    { lane: "building", date: "2026-07", title: "ETL Silent Failure Detection", note: "Data pipeline monitoring app", href: "projects.html" },
    { lane: "building", date: "2026-10", title: "Probe", note: "AI agent that writes help center articles", href: "projects.html" }, // known
    { lane: "building", date: "2026-11", title: "Exit Code 0, Broken Data", note: "Article", href: "writing.html" },          // known

    // ---------- Working ----------
    { lane: "working", track: 0, start: "2023-01", end: "2025-01",
      title: "Freelance Data Scientist", org: "Upwork", href: "#role-upwork" },
    { lane: "working", track: 0, start: "2025-01", end: null,
      title: "Customer Success Manager", org: "Thera (YC S22)", href: "#role-thera" },
    { lane: "working", track: 1, start: "2022-07", end: "2022-11",
      title: "Data Science Intern", org: "Hamoye", href: "#role-hamoye" },
    { lane: "working", track: 1, start: "2022-11", end: "2023-01",
      title: "Data Science and Analytics Intern", org: "Sparks Foundation", href: "#role-sparks" },
    { lane: "working", track: 1, start: "2023-01", end: "2023-05",
      title: "Data Scientist (internship)", org: "Omdena", href: "#role-omdena" },
    { lane: "working", track: 1, start: "2023-05", end: "2023-10",
      title: "Data Analyst (internship)", org: "Transcorp Group", href: "#role-transcorp" }
  ];

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- view switch ----------
  var switcher = document.querySelector("[data-view-switch]");
  var panels = document.querySelectorAll("[data-view-panel]");
  var built = false;

  function setView(v) {
    panels.forEach(function (p) { p.hidden = p.getAttribute("data-view-panel") !== v; });
    if (switcher) {
      switcher.querySelectorAll("button").forEach(function (b) {
        b.setAttribute("aria-pressed", String(b.getAttribute("data-view") === v));
      });
    }
    if (v === "chart") { if (!built) build(); layout(); }
  }

  if (switcher) {
    switcher.hidden = false;
    switcher.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-view]");
      if (b) setView(b.getAttribute("data-view"));
    });
  }
  setView("path"); // default view

  // ---------- helpers ----------
  var root = document.getElementById("journey");
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var now = new Date();
  var NOW = now.getFullYear() * 12 + now.getMonth();
  var START = 2020 * 12;
  var END = (now.getFullYear() + 1) * 12;
  var SPAN = END - START;

  function toM(s) { var p = s.split("-"); return +p[0] * 12 + (+p[1] - 1); }
  function pct(m) { return ((m - START) / SPAN) * 100; }
  function fmt(m) { return MONTHS[m % 12] + " " + Math.floor(m / 12); }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function dateText(d) {
    if (d.when) return d.when;
    if (d.date) return fmt(toM(d.date));
    if (d.extend) return "Ongoing";
    return fmt(toM(d.start)) + " to " + (d.end ? fmt(toM(d.end)) : "present");
  }
  function laneLabel(key) {
    for (var i = 0; i < LANES.length; i++) if (LANES[i].key === key) return LANES[i].label;
    return "";
  }
  function goTo(href) {
    if (href.indexOf("#role-") === 0) setView("path");
    var target = document.getElementById(href.slice(1));
    if (target) target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    if (history.replaceState) history.replaceState(null, "", href);
  }

  // ---------- tooltip ----------
  var tip;
  function showTip(items, mark) {
    tip.textContent = "";
    items.forEach(function (d, i) {
      var row = el("div", "gantt-tip-item");
      var head = el("strong", null, d.title);
      if (d.private) head.appendChild(el("em", "gantt-tip-private", " Private"));
      row.appendChild(head);
      if (d.org) row.appendChild(el("span", "gantt-tip-org", d.org));
      row.appendChild(el("span", "gantt-tip-date", dateText(d)));
      if (d.note && items.length === 1) row.appendChild(el("span", "gantt-tip-note", d.note));
      tip.appendChild(row);
    });
    tip.classList.add("is-on");
    var r = mark.getBoundingClientRect();
    var host = root.getBoundingClientRect();
    var tw = tip.offsetWidth, th = tip.offsetHeight;
    var cx = Math.min(Math.max(r.left + r.width / 2 - host.left - tw / 2, 0), host.width - tw);
    var top = r.top - host.top - th - 10;
    if (top < 0) top = r.bottom - host.top + 10;
    tip.style.transform = "translate(" + cx + "px," + top + "px)";
  }
  function hideTip() { tip.classList.remove("is-on"); }
  function wire(mark, items) {
    mark.addEventListener("pointerenter", function () { showTip(items, mark); });
    mark.addEventListener("pointerleave", hideTip);
    mark.addEventListener("focus", function () { showTip(items, mark); });
    mark.addEventListener("blur", hideTip);
    var href = items.length === 1 && items[0].href;
    if (href && href.charAt(0) === "#") {
      mark.addEventListener("click", function (e) { e.preventDefault(); goTo(href); });
    }
  }
  function describe(d) {
    return laneLabel(d.lane) + ": " + d.title + (d.private ? " (private)" : "") +
      (d.org ? ", " + d.org : "") + ", " + dateText(d) + (d.note ? ". " + d.note : "");
  }

  // ---------- build (once, when the chart is first shown) ----------
  var tracksByKey = {};

  function build() {
    if (!root) return;
    built = true;

    var legend = el("p", "gantt-legend");
    var k1 = el("span", "gantt-legend-item");
    k1.appendChild(el("span", "gantt-swatch gantt-swatch-public"));
    k1.appendChild(document.createTextNode("Project or article"));
    var k2 = el("span", "gantt-legend-item");
    k2.appendChild(el("span", "gantt-swatch gantt-swatch-private"));
    k2.appendChild(document.createTextNode("Private project"));
    var k3 = el("span", "gantt-legend-item");
    k3.appendChild(el("span", "gantt-swatch gantt-swatch-group", "+2"));
    k3.appendChild(document.createTextNode("More in one spot, hover to see"));
    legend.appendChild(k1); legend.appendChild(k2); legend.appendChild(k3);
    root.appendChild(legend);

    var scroller = el("div", "gantt-scroll");
    var chart = el("div", "gantt-chart");
    scroller.appendChild(chart);

    var plot = el("div", "gantt-plot");
    var axis = el("div", "gantt-axis");
    for (var y = 2020; y <= now.getFullYear(); y++) {
      var line = el("div", "gantt-grid");
      line.style.left = pct(y * 12) + "%";
      plot.appendChild(line);
      var tick = el("span", "gantt-tick", String(y));
      tick.style.left = pct(y * 12 + 6) + "%";
      axis.appendChild(tick);
    }
    var nowLine = el("div", "gantt-now");
    nowLine.style.left = pct(NOW + 0.5) + "%";
    nowLine.appendChild(el("span", "gantt-now-label", "Now"));
    plot.appendChild(nowLine);

    LANES.forEach(function (lane) {
      var row = el("div", "gantt-lane gantt-lane-" + lane.key);
      var name = el("div", "gantt-lane-name");
      name.appendChild(el("span", "gantt-key"));
      name.appendChild(el("span", null, lane.label));
      row.appendChild(name);

      var tracks = el("div", "gantt-tracks");
      BANDS.filter(function (b) { return b.lane === lane.key; }).forEach(function (b) {
        var band = el("div", "gantt-band");
        band.style.left = pct(toM(b.start)) + "%";
        band.style.width = (pct(toM(b.end)) - pct(toM(b.start))) + "%";
        band.appendChild(el("span", "gantt-band-label", b.label));
        tracks.appendChild(band);
      });
      for (var t = 0; t < lane.tracks; t++) {
        var track = el("div", "gantt-track");
        tracks.appendChild(track);
        tracksByKey[lane.key + t] = { node: track, bars: [], dots: [] };
      }
      row.appendChild(tracks);

      var end = el("div", "gantt-end");
      if (lane.key === "building") {
        var gh = el("a", "gantt-github", "GitHub");
        gh.href = GITHUB;
        gh.target = "_blank";
        gh.rel = "noopener";
        gh.setAttribute("aria-label", "All public code on GitHub");
        end.appendChild(gh);
      }
      row.appendChild(end);
      chart.appendChild(row);
    });

    // bars are fixed; dots are laid out (and grouped) on every resize
    DATA.forEach(function (d) {
      var slot = tracksByKey[d.lane + (d.track || 0)];
      if (d.start) {
        var left = toM(d.start);
        var right = d.extend ? END : (d.end ? toM(d.end) : NOW + 1);
        var bar = el(d.href ? "a" : "button", "gantt-bar" + (d.extend ? " is-extend" : "") + (!d.end && !d.extend ? " is-current" : ""));
        if (d.href) bar.href = d.href; else bar.type = "button";
        bar.setAttribute("aria-label", describe(d));
        bar.style.left = pct(left) + "%";
        bar.style.width = "calc(" + (pct(right) - pct(left)) + "% - 2px)";
        var label = el("span", "gantt-label", d.extend ? d.title : (d.short || d.org || d.title));
        bar.appendChild(label);
        slot.node.appendChild(bar);
        slot.bars.push({ d: d, left: left, right: right, text: label });
        wire(bar, [d]);
      } else {
        slot.dots.push(d);
      }
    });

    var axisRow = el("div", "gantt-lane gantt-axis-row");
    axisRow.appendChild(el("div", "gantt-lane-name"));
    axisRow.appendChild(axis);
    axisRow.appendChild(el("div", "gantt-end"));
    chart.appendChild(axisRow);

    var overlay = el("div", "gantt-overlay");
    overlay.appendChild(plot);
    chart.appendChild(overlay);
    root.appendChild(scroller);

    var foot = el("p", "gantt-foot");
    foot.appendChild(document.createTextNode("Private projects are shown here but their code isn't public. Everything else is "));
    var a = el("a", null, "on GitHub");
    a.href = GITHUB; a.target = "_blank"; a.rel = "noopener";
    foot.appendChild(a);
    foot.appendChild(document.createTextNode("."));
    root.appendChild(foot);

    tip = el("div", "gantt-tip");
    tip.setAttribute("role", "status");
    root.appendChild(tip);


    window.addEventListener("resize", function () { if (!root.closest("[hidden]")) layout(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (!root.closest("[hidden]")) layout(); });
  }

  // ---------- layout: group close dots into "+N", then place labels ----------
  var GROUP_PX = 34;

  function layout() {
    if (!built) return;
    Object.keys(tracksByKey).forEach(function (k) {
      var slot = tracksByKey[k];
      var w = slot.node.getBoundingClientRect().width;
      if (!w) return;
      var pxPerM = w / SPAN;

      slot.node.querySelectorAll(".gantt-dot").forEach(function (n) { n.remove(); });

      // group dots that sit too close together
      var dots = slot.dots.slice().sort(function (a, b) { return toM(a.date) - toM(b.date); });
      var groups = [];
      dots.forEach(function (d) {
        var x = (toM(d.date) + 0.5 - START) * pxPerM;
        var g = groups[groups.length - 1];
        if (g && x - g.last < GROUP_PX) { g.items.push(d); g.last = x; }
        else groups.push({ x0: x, last: x, items: [d] });
      });

      var marks = [];
      slot.bars.forEach(function (b) {
        marks.push({ left: (b.left - START) * pxPerM, right: (b.right - START) * pxPerM, text: b.text, bar: true, show: true });
      });

      groups.forEach(function (g) {
        var first = g.items[0];
        var single = g.items.length === 1;
        var mark = el(single && first.href ? "a" : "button", "gantt-dot" + (first.private && single ? " is-private" : "") + (single ? "" : " is-group"));
        if (single && first.href) mark.href = first.href; else mark.type = "button";
        mark.style.left = (g.x0 / w) * 100 + "%";
        mark.setAttribute("aria-label", single ? describe(first)
          : g.items.length + " items: " + g.items.map(function (d) { return d.title + " (" + dateText(d) + ")"; }).join(", "));
        var text = el("span", "gantt-label", single ? first.title : "+" + (g.items.length - 1));
        mark.appendChild(text);
        slot.node.appendChild(mark);
        wire(mark, g.items);
        marks.push({ left: g.x0 - 8, right: g.x0 + 8, text: text, bar: false, group: !single, show: single ? !!first.label : true });
      });

      // labels: inside the bar, else right, else left, else tooltip only
      marks.sort(function (a, b) { return a.left - b.left; });
      var used = 0;
      marks.forEach(function (m, i) {
        var t = m.text;
        t.className = "gantt-label";
        var next = marks[i + 1];
        var nextLeft = next ? next.left : w;
        var need = t.scrollWidth + 10;
        var place = "is-hidden";
        if (m.group) place = "is-count";
        else if (m.show) {
          if (m.bar && need + 6 <= m.right - m.left) place = "is-inside";
          else if (m.right + need <= nextLeft) place = "is-right";
          else if (m.left - need >= used) place = "is-left";
        }
        t.classList.add(place);
        used = place === "is-right" ? m.right + need : (place === "is-count" ? m.right + need : m.right);
      });
    });
  }

})();
