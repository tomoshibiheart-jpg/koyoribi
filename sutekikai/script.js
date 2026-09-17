/* ============================================================
   素敵会 縁日 ｜ script.js
   ============================================================ */

/* ============================================================
   ★★ ここだけ書き換えればリンクが一括で変わります ★★
   空文字 "" のままにすると、HTML側に書いてあるリンクがそのまま使われます。
   例）GoogleフォームのURLが決まったら↓に貼り付ける
       FORM_URL: "https://forms.gle/xxxxxxxxxxxx",
   ============================================================ */
const CONFIG = {
  FORM_URL: "https://forms.gle/tsuHBca2GwUbTWYn9",   // Googleフォーム（参加申し込み）
  IG_URL:   "https://www.instagram.com/koyoribi.jp",   // Instagram
  HP_URL:   "https://tomoshibiheart-jpg.github.io/koyoribi/",   // こよりび公式HP
};
/* ========================================================== */


(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----------------------------------------------------------
     1. CONFIG のURLをリンクへ反映
     ---------------------------------------------------------- */
  function applyConfig() {
    const map = [
      [".js-form-link", CONFIG.FORM_URL],
      [".js-ig-link",   CONFIG.IG_URL],
      [".js-hp-link",   CONFIG.HP_URL],
    ];
    map.forEach(function (pair) {
      if (!pair[1]) return;
      document.querySelectorAll(pair[0]).forEach(function (a) {
        a.setAttribute("href", pair[1]);
      });
    });
  }

  /* ----------------------------------------------------------
     2. 流入元パラメータ（?utm_source=poster&utm_medium=qr ...）を
        申し込みリンクへ引き継ぐ
        → ポスターのQRから来た人が判別できるようになります
     ---------------------------------------------------------- */
  function passThroughUtm() {
    const params = new URLSearchParams(window.location.search);
    const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
    const picked = new URLSearchParams();
    keys.forEach(function (k) {
      const v = params.get(k);
      if (v) picked.set(k, v);
    });
    if (![...picked].length) return;

    document.querySelectorAll(".js-form-link").forEach(function (a) {
      const href = a.getAttribute("href");
      if (!href || href.indexOf("http") !== 0) return;
      try {
        const url = new URL(href);
        picked.forEach(function (v, k) { url.searchParams.set(k, v); });
        a.setAttribute("href", url.toString());
      } catch (e) { /* URLが未設定の場合は何もしない */ }
    });
  }

  /* ----------------------------------------------------------
     3. ローディング（提灯がともる）
     ---------------------------------------------------------- */
  function opening() {
    const op = document.getElementById("opening");
    if (!op) return;
    if (reduceMotion) { op.style.display = "none"; return; }
    document.body.classList.add("op-lock");
    setTimeout(function () { document.body.classList.remove("op-lock"); }, 3100);
    setTimeout(function () { op.style.display = "none"; }, 3400);
  }

  /* ----------------------------------------------------------
     4. 提灯を1つずつ点灯させる
     ---------------------------------------------------------- */
  function lightLanterns() {
    document.querySelectorAll(".lantern-row").forEach(function (row) {
      const isHero = !row.classList.contains("small");
      row.querySelectorAll(".lantern").forEach(function (l, i) {
        const base = isHero ? 2.2 : 0;
        l.style.animationDelay = (base + i * 0.12) + "s, " + (i * 0.35) + "s";
        if (reduceMotion) l.style.opacity = "1";
      });
    });
  }

  /* ----------------------------------------------------------
     5. スクロールで柔らかく浮き上がる（IntersectionObserver）
     ---------------------------------------------------------- */
  function revealOnScroll() {
    const targets = document.querySelectorAll(".reveal");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      targets.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    // 同じ列に並ぶカードは少しずつ遅らせて、リズムを出す
    document.querySelectorAll(".exp-grid, .ex-grid, .outline-grid, .past-grid, .faq-list, .food-list")
      .forEach(function (group) {
        Array.prototype.forEach.call(group.children, function (child, i) {
          const el = child.classList.contains("reveal") ? child : child.querySelector(".reveal");
          if (el) el.style.setProperty("--d", (Math.min(i, 8) * 0.07) + "s");
        });
      });

    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -6% 0px" });

    targets.forEach(function (el) { io.observe(el); });
  }

  /* ----------------------------------------------------------
     6. 背景装飾のごく控えめなパララックス
     ---------------------------------------------------------- */
  function parallax() {
    if (reduceMotion) return;
    const glow = document.querySelector(".quote-glow");
    const sky = document.querySelector(".hero-sky");
    if (!glow && !sky) return;

    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        const y = window.scrollY;
        if (sky && y < window.innerHeight * 1.2) {
          sky.style.transform = "translateY(" + (y * 0.16) + "px)";
        }
        if (glow) {
          const r = glow.getBoundingClientRect();
          if (r.bottom > 0 && r.top < window.innerHeight) {
            const p = (window.innerHeight - r.top) * 0.03;
            glow.style.marginTop = (-p) + "px";
          }
        }
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ----------------------------------------------------------
     7. ヘッダーとスマホ固定CTAの表示切り替え
     ---------------------------------------------------------- */
  function stickyUI() {
    const header = document.getElementById("siteHeader");
    const cta = document.getElementById("stickyCta");
    const hero = document.querySelector(".hero");
    const finalCta = document.getElementById("join");
    if (!header) return;

    function update() {
      const heroBottom = hero ? hero.offsetHeight - 80 : 600;
      const passed = window.scrollY > heroBottom;
      header.classList.toggle("show", passed);

      if (cta) {
        // 最終CTAが見えているときは固定CTAを隠す（重複を避ける）
        let nearFinal = false;
        if (finalCta) {
          const r = finalCta.getBoundingClientRect();
          nearFinal = r.top < window.innerHeight * 0.9;
        }
        const show = passed && !nearFinal;
        cta.classList.toggle("show", show);
        cta.setAttribute("aria-hidden", show ? "false" : "true");
      }
    }
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ----------------------------------------------------------
     8. FAQアコーディオン（キーボード操作対応）
     ---------------------------------------------------------- */
  function faq() {
    document.querySelectorAll(".faq-item").forEach(function (item, i) {
      const btn = item.querySelector(".faq-q");
      const panel = item.querySelector(".faq-a");
      if (!btn || !panel) return;

      const pid = "faq-panel-" + (i + 1);
      panel.id = pid;
      panel.setAttribute("role", "region");
      btn.setAttribute("aria-controls", pid);

      function close() {
        btn.setAttribute("aria-expanded", "false");
        panel.style.maxHeight = "0px";
      }
      function open() {
        btn.setAttribute("aria-expanded", "true");
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
      close();

      btn.addEventListener("click", function () {
        const isOpen = btn.getAttribute("aria-expanded") === "true";
        if (isOpen) { close(); } else { open(); }
      });
    });

    // 画面幅が変わったときに開いているパネルの高さを測り直す
    window.addEventListener("resize", function () {
      document.querySelectorAll('.faq-q[aria-expanded="true"]').forEach(function (btn) {
        const panel = document.getElementById(btn.getAttribute("aria-controls"));
        if (panel) panel.style.maxHeight = panel.scrollHeight + "px";
      });
    });
  }

  /* ----------------------------------------------------------
     9. CTAのクリックを記録（将来の計測用の受け口）
        ※ 現時点では外部送信しません。コンソールに出るだけです。
     ---------------------------------------------------------- */
  function trackClicks() {
    document.querySelectorAll("[data-track]").forEach(function (el) {
      el.addEventListener("click", function () {
        const name = el.getAttribute("data-track");
        // 将来ここに計測タグを追加できます
        if (window.console && console.info) {
          console.info("[track]", name, new Date().toISOString());
        }
      });
    });
  }

  /* ---------------------------------------------------------- */
  function init() {
    applyConfig();
    passThroughUtm();
    opening();
    lightLanterns();
    revealOnScroll();
    parallax();
    stickyUI();
    faq();
    trackClicks();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
