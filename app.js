/* RecallBook explainer — tiny interactions, no dependencies.
   1) Sticky-nav active-link highlight on scroll.
   2) Smooth scroll for in-page anchors (with reduced-motion respect).
   3) Signature touch: the hero recall board runs the loop live —
      Aarav's due-today cleaning goes due -> recall sent -> done, and
      the next one auto-schedules while the Due-today / Overdue counts
      tick over. A live demo of the promise. */

(function () {
  "use strict";

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Active nav link on scroll ---------- */
  var links = Array.prototype.slice.call(
    document.querySelectorAll('.nav__links a[href^="#"]')
  );
  var sections = links
    .map(function (a) {
      return document.getElementById(a.getAttribute("href").slice(1));
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var byId = {};
    links.forEach(function (a) {
      byId[a.getAttribute("href").slice(1)] = a;
    });
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          var a = byId[e.target.id];
          if (!a) return;
          if (e.isIntersecting) {
            links.forEach(function (l) {
              l.style.color = "";
            });
            a.style.color = "var(--accent)";
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (s) {
      io.observe(s);
    });
  }

  /* ---------- 2. Smooth scroll for anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (ev) {
      var id = a.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      var el = document.querySelector(id);
      if (!el) return;
      ev.preventDefault();
      el.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start"
      });
      history.replaceState(null, "", id);
    });
  });

  /* ---------- 3. Signature: the recall board runs the loop ---------- */
  var rows = document.getElementById("reg-rows");
  var liveTag = document.getElementById("reg-live-tag");
  var caption = document.getElementById("reg-caption");
  var dueTodayEl = document.getElementById("reg-collected");
  var overdueEl = document.getElementById("reg-pending");

  if (!rows || !liveTag || !dueTodayEl || !overdueEl) return;

  // Aarav Sharma's row is the due-today cleaning that runs the loop.
  var aaravRow = rows.querySelector('[data-state="due"]');

  var BASE_DUE_TODAY = 3;   // three recalls due today to start
  var BASE_OVERDUE = 5;     // five overdue

  // Cycle: due today -> recall sent -> done + next auto-scheduled -> reset.
  var stages = [
    {
      tag: "Due today",
      tagClass: "tag--due",
      caption: "Aarav's cleaning is due today → send the WhatsApp recall.",
      dueToday: BASE_DUE_TODAY,
      overdue: BASE_OVERDUE,
      state: "due",
      flash: false
    },
    {
      tag: "Recall sent",
      tagClass: "tag--week",
      caption: "WhatsApp recall staged in the outbox — sent from your clinic number.",
      dueToday: BASE_DUE_TODAY,
      overdue: BASE_OVERDUE,
      state: "week",
      flash: false
    },
    {
      tag: "Done ✓",
      tagClass: "tag--paid",
      caption: "Aarav came in. Mark done → next cleaning auto-scheduled in 6 months.",
      dueToday: BASE_DUE_TODAY - 1,
      overdue: BASE_OVERDUE,
      state: "paid",
      flash: true
    }
  ];

  var i = 0;

  function applyStage(s) {
    liveTag.textContent = s.tag;
    liveTag.className = "reg-row__tag " + s.tagClass;
    if (aaravRow) aaravRow.setAttribute("data-state", s.state);
    caption.textContent = s.caption;
    dueTodayEl.textContent = String(s.dueToday);
    overdueEl.textContent = String(s.overdue);
    if (aaravRow && s.flash) {
      aaravRow.classList.add("flash");
      setTimeout(function () {
        aaravRow.classList.remove("flash");
      }, 900);
    }
  }

  function advance() {
    i = (i + 1) % stages.length;
    applyStage(stages[i]);
  }

  // If the user prefers reduced motion, show the "done" end-state once
  // (the promise fulfilled) and don't loop.
  if (reduceMotion) {
    applyStage(stages[2]);
    caption.textContent =
      "Due → recall sent → done → next auto-scheduled — the whole loop, hands-free.";
    return;
  }

  // Only animate while the widget is on screen (saves work, feels intentional).
  var running = false;
  var timer = null;

  function loop() {
    timer = setTimeout(function () {
      advance();
      loop();
    }, i === 0 ? 2600 : 2000);
  }

  var vis = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !running) {
          running = true;
          loop();
        } else if (!e.isIntersecting && running) {
          running = false;
          clearTimeout(timer);
        }
      });
    },
    { threshold: 0.35 }
  );
  vis.observe(rows.closest(".register"));
})();
