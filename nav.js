/* ============================================================
   こよりび ― 共通ヘッダー（三本線メニュー／右から出る目次）
   各ページに <script src="nav.js" defer></script> を置くだけで動きます。
   目次の項目を増やすときは、下の MENU を編集してください。
   ============================================================ */
(function(){
  "use strict";

  var MENU = [
    { label:"こよりびについて", href:"#about" },
    { label:"これからの活動",   href:"#activity", children:[
        { label:"NEWS",        href:"#news"   },
        { label:"REPORT",      href:"#report" },
        { label:"参加者の声",   href:"#voices" }
      ]},
    { label:"マガジン",        href:"magazine.html", page:true },
    { label:"会員とは",        href:"#perks"  },
    { label:"よくあるご質問",   href:"#faq"    },
    { label:"お問い合わせ",     href:"contact.html", page:true }
  ];

  var SNS = [
    { name:"Instagram", href:"https://www.instagram.com/koyoribi.jp/" },
    { name:"LINE",      href:"https://lin.ee/u3fz1Tz" },
    { name:"Mail",      href:"mailto:contact@tomoshibi-inc.co.jp" }
  ];

  var file = location.pathname.split("/").pop() || "index.html";
  var onTop = (file === "" || file === "index.html");
  function url(h, isPage){
    if(isPage) return h;
    return onTop ? h : "index.html" + h;
  }

  var header = document.getElementById("siteHeader");
  if(!header) return;

  /* 既存のテキストナビは目次に統合する */
  var oldNav = header.querySelector("nav.global");
  if(oldNav) oldNav.parentNode.removeChild(oldNav);

  /* ヘッダー右側 */
  var right = document.createElement("div");
  right.className = "head-right";
  right.innerHTML =
    '<a class="nav-join" href="' + (onTop ? "#member" : "index.html#member") + '">会員になる</a>' +
    '<button class="menu-btn" type="button" aria-label="メニューを開く" aria-expanded="false" aria-controls="siteDrawer">' +
      '<span></span><span></span><span></span>' +
    '</button>';
  header.appendChild(right);

  /* 目次本体 */
  var items = MENU.map(function(m){
    var kids = (m.children || []).map(function(c){
      return '<li><a class="dw-sub" href="' + url(c.href, c.page) + '">' + c.label + '</a></li>';
    }).join("");
    return '<li><a class="dw-main" href="' + url(m.href, m.page) + '">' + m.label + '</a>' +
           (kids ? '<ul class="dw-kids">' + kids + '</ul>' : '') + '</li>';
  }).join("");

  var sns = SNS.map(function(s){
    var ext = s.href.indexOf("mailto:") === 0 ? "" : ' target="_blank" rel="noopener"';
    return '<a href="' + s.href + '"' + ext + '>' + s.name + '</a>';
  }).join('<span aria-hidden="true">／</span>');

  var scrim = document.createElement("div");
  scrim.className = "dw-scrim";
  scrim.hidden = true;

  var drawer = document.createElement("nav");
  drawer.className = "drawer";
  drawer.id = "siteDrawer";
  drawer.setAttribute("aria-label", "目次");
  drawer.hidden = true;
  drawer.innerHTML =
    '<p class="dw-title">目次</p>' +
    '<ul class="dw-list">' + items + '</ul>' +
    '<div class="dw-foot">' +
      '<a class="dw-join" href="' + (onTop ? "#member" : "index.html#member") + '">こよりび会員になる</a>' +
      '<p class="dw-sns">' + sns + '</p>' +
    '</div>';

  document.body.appendChild(scrim);
  document.body.appendChild(drawer);

  var btn = right.querySelector(".menu-btn");
  var open = false;

  function setOpen(v){
    open = v;
    if(v){ scrim.hidden = false; drawer.hidden = false; }
    requestAnimationFrame(function(){
      document.body.classList.toggle("dw-open", v);
      btn.setAttribute("aria-expanded", v ? "true" : "false");
      btn.setAttribute("aria-label", v ? "メニューを閉じる" : "メニューを開く");
    });
    if(!v){
      setTimeout(function(){
        if(!open){ scrim.hidden = true; drawer.hidden = true; }
      }, 420);
    }
  }

  btn.addEventListener("click", function(){ setOpen(!open); });
  scrim.addEventListener("click", function(){ setOpen(false); });
  drawer.addEventListener("click", function(e){
    if(e.target.closest("a")) setOpen(false);
  });
  document.addEventListener("keydown", function(e){
    if(e.key === "Escape" && open) setOpen(false);
  });
})();
