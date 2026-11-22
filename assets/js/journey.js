/*
  Interactive timeline (Gantt) for experience.html.
  Lanes: Learning, Building, Working. Bars = periods, dots = moments.
  Edit the DATA list below to change what the chart shows.
  Dates are "YYYY-MM". `when` overrides the date text shown to visitors
  (use it when only the year is known). `end: null` means "to today".
*/
(function () {
  "use strict";

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
    // Learning
    { lane: "learning", track: 0, start: "2020-01", end: "2024-01", // CONFIRM: graduation month
      title: "BSc Computer Science", org: "University of Nigeria, Nsukka",
      note: "ML/AI, data structures and algorithms, database design", href: "#education" },
    { lane: "learning", track: 1, date: "2020-04", when: "2020", label: true,
      title: "Started coding", note: "Picked up programming during the COVID-19 lockdown" },
    { lane: "learning", track: 1, date: "2024-06", when: "2024", label: true,
      title: "Aspire Leaders Program", org: "Harvard Business School", href: "#education" },

    // Building (dated projects and articles)
    { lane: "building", date: "2023-11", label: true,
      title: "Autism detection in toddlers", note: "ML model and article", href: "writing.html" },
    { lane: "building", date: "2024-01",
      title: "Parts of speech tagging with NLP", note: "Article", href: "writing.html" },
    { lane: "building", date: "2024-02",
      title: "VADER vs RoBERTa", note: "Sentiment analysis comparison", href: "writing.html" },
    { lane: "building", date: "2024-03",
      title: "Driver drowsiness detection", note: "Computer vision project and write-up", href: "writing.html" },
    { lane: "building", date: "2024-12",
      title: "Getting started with LangChain", note: "Article", href: "writing.html" },
    { lane: "building", date: "2026-11", label: true,
      title: "Silent failure detection", note: "ETL monitoring app and article", href: "projects.html" },

    // Working
    { lane: "working", track: 0, start: "2020-01", end: "2025-01",
      title: "Freelance Data Scientist", org: "Upwork", href: "#role-upwork" },
    { lane: "working", track: 0, start: "2025-01", end: null,
      title: "Customer Success Manager", org: "Thera (YC S22)", href: "#role-thera" },
    { lane: "working", track: 1, date: "2021-06", when: "2021", label: true,
      title: "HamoyeAI", org: "Internship", note: "Fine-tuned ML models, computer vision, energy efficiency prediction" },
    { lane: "working", track: 1, start: "2023-01", end: "2023-05",
      title: "Data Scientist (internship)", org: "OmdenaAI", href: "#role-omdena" },
    { lane: "working", track: 1, start: "2023-05", end: "2023-10",
      title: "Data Analyst (internship)", org: "Transcorp", href: "#role-transcorp" }
  ];

  var root = document.getElementById("journey");
  if (!root) return;

  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var now = new Date();
  var NOW = now.getFullYear() * 12 + now.getMonth();
  var START = 2020 * 12;
  var END = (now.getFullYear() + 1) * 12; // through the end of this year
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
    return fmt(toM(d.start)) + " to " + (d.end ? fmt(toM(d.end)) : "present");
  }
  function laneLabel(key) {
    for (var i = 0; i < LANES.length; i++) if (LANES[i].key === key) return LANES[i].label;
    return "";
  }

  // ---------- build chart ----------
  var scroller = el("div", "gantt-scroll");
  var chart = el("div", "gantt-chart");
  scroller.appendChild(chart);

  var plotCols = el("div", "gantt-plot");

  // year grid + axis
  var axis = el("div", "gantt-axis");
  for (var y = 2020; y <= now.getFullYear(); y++) {
    var x = pct(y * 12);
    var line = el("div", "gantt-grid");
    line.style.left = x + "%";
    plotCols.appendChild(line);
    var tick = el("span", "gantt-tick", String(y));
    x = pct(y * 12 + 6); // center the year label in its span
    tick.style.left = x + "%";
    axis.appendChild(tick);
  }

  // today marker
  var nowLine = el("div", "gantt-now");
  nowLine.style.left = pct(NOW + 0.5) + "%";
  nowLine.appendChild(el("span", "gantt-now-label", "Now"));
  plotCols.appendChild(nowLine);

  var marksByTrack = {};

  LANES.forEach(function (lane) {
    var row = el("div", "gantt-lane gantt-lane-" + lane.key);
    var name = el("div", "gantt-lane-name");
    name.appendChild(el("span", "gantt-key"));
    name.appendChild(el("span", null, lane.label));
    row.appendChild(name);

    var tracks = el("div", "gantt-tracks");
    tracks.style.setProperty("--tracks", lane.tracks);

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
      marksByTrack[lane.key + t] = { node: track, items: [] };
    }
    row.appendChild(tracks);
    chart.appendChild(row);
  });

  // marks
  DATA.forEach(function (d) {
    var slot = marksByTrack[d.lane + (d.track || 0)];
    var isBar = !!d.start;
    var mark = el(d.href ? "a" : "button", isBar ? "gantt-bar" : "gantt-dot");
    if (d.href) mark.href = d.href; else mark.type = "button";
    var desc = laneLabel(d.lane) + ": " + d.title + (d.org ? ", " + d.org : "") + ", " + dateText(d) + (d.note ? ". " + d.note : "");
    mark.setAttribute("aria-label", desc);

    var left, right;
    if (isBar) {
      left = toM(d.start);
      right = d.end ? toM(d.end) : NOW + 1;
      mark.style.left = pct(left) + "%";
      mark.style.width = "calc(" + (pct(right) - pct(left)) + "% - 2px)"; // 2px surface gap
      if (!d.end) mark.classList.add("is-current");
    } else {
      left = right = toM(d.date) + 0.5;
      mark.style.left = pct(left) + "%";
    }

    var text = el("span", "gantt-label", d.org && isBar ? d.org : d.title);
    mark.appendChild(text);
    slot.node.appendChild(mark);
    slot.items.push({ d: d, mark: mark, text: text, left: left, right: right, isBar: isBar });

    mark.addEventListener("pointerenter", function (e) { show(d, mark); });
    mark.addEventListener("pointerleave", hide);
    mark.addEventListener("focus", function () { show(d, mark); });
    mark.addEventListener("blur", hide);
  });

  var axisRow = el("div", "gantt-lane gantt-axis-row");
  axisRow.appendChild(el("div", "gantt-lane-name"));
  axisRow.appendChild(axis);
  chart.appendChild(axisRow);

  // overlay grid + now line across all lanes
  var overlay = el("div", "gantt-overlay");
  overlay.appendChild(plotCols);
  chart.appendChild(overlay);

  root.appendChild(scroller);

  // tooltip
  var tip = el("div", "gantt-tip");
  tip.setAttribute("role", "status");
  root.appendChild(tip);

  function show(d, mark) {
    tip.textContent = "";
    tip.appendChild(el("strong", null, d.title));
    if (d.org) tip.appendChild(el("span", "gantt-tip-org", d.org));
    tip.appendChild(el("span", "gantt-tip-date", dateText(d)));
    if (d.note) tip.appendChild(el("span", "gantt-tip-note", d.note));
    tip.classList.add("is-on");
    var r = mark.getBoundingClientRect();
    var host = root.getBoundingClientRect();
    var tw = tip.offsetWidth, th = tip.offsetHeight;
    var cx = Math.min(Math.max(r.left + r.width / 2 - host.left - tw / 2, 0), host.width - tw);
    var top = r.top - host.top - th - 10;
    if (top < 0) top = r.bottom - host.top + 10;
    tip.style.transform = "translate(" + cx + "px," + top + "px)";
  }
  function hide() { tip.classList.remove("is-on"); }

  // ---------- place labels: inside, else right, else left, else tooltip only ----------
  function placeLabels() {
    Object.keys(marksByTrack).forEach(function (k) {
      var items = marksByTrack[k].items.slice().sort(function (a, b) { return a.left - b.left; });
      var trackW = marksByTrack[k].node.getBoundingClientRect().width;
      var pxPerM = trackW / SPAN;
      var DOT = 8; // half the dot hit area that is painted
      var used = 0; // rightmost pixel already taken by a mark or label
      items.forEach(function (it, i) {
        var t = it.text;
        t.className = "gantt-label";
        var myLeft = (it.left - START) * pxPerM - (it.isBar ? 0 : DOT);
        var myRight = (it.right - START) * pxPerM + (it.isBar ? 0 : DOT);
        var next = items[i + 1];
        var nextLeft = next ? (next.left - START) * pxPerM - (next.isBar ? 0 : DOT) : trackW;
        var need = t.scrollWidth + 10;
        var place = "is-hidden";
        if (it.isBar || it.d.label) {
          if (it.isBar && need + 6 <= myRight - myLeft) place = "is-inside";
          else if (myRight + need <= nextLeft) place = "is-right";
          else if (myLeft - need >= used) place = "is-left";
        }
        t.classList.add(place);
        used = place === "is-right" ? myRight + need : myRight;
      });
    });
  }
  placeLabels();
  window.addEventListener("resize", placeLabels);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(placeLabels);

  // ---------- table view (text alternative) ----------
  var details = el("details", "gantt-table");
  details.appendChild(el("summary", null, "View as a table"));
  var table = el("table");
  var thead = el("thead");
  var hr = el("tr");
  ["Area", "What", "Where", "When"].forEach(function (h) { hr.appendChild(el("th", null, h)); });
  thead.appendChild(hr);
  table.appendChild(thead);
  var tbody = el("tbody");
  BANDS.concat(DATA).forEach(function (d) {
    var tr = el("tr");
    tr.appendChild(el("td", null, laneLabel(d.lane)));
    tr.appendChild(el("td", null, d.title || d.label));
    tr.appendChild(el("td", null, d.org || ""));
    tr.appendChild(el("td", null, d.title ? dateText(d) : fmt(toM(d.start)) + " to " + fmt(toM(d.end))));
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  details.appendChild(table);
  root.appendChild(details);
})();
