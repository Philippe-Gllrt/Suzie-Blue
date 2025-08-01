export function init() {
  console.log("Page home initialisée");
  if (window.innerWidth > 991) {
    //code a jouer que sur desktop
    offreHover();
  };

  if (window.innerWidth <= 991) {
    //code a jouer que sur mobile
    mobileMenuHandler()
  }

  setLenis();
  insertSvgIntoHomeQuartier();
  imageEntrance();
  preloader();
  setAllParallax();
  buttonHover();
  navButtonHover();
  cardOpeningOnScroll();
  footerAnimation();
  cardAnimation();
  markSiteAsVisited();
}

////////////// a deplacer dans utils ////////
function buttonHover() {
  const $buttons = $(".button");
  $buttons.each(function () {
    const $this = $(this);
    const $outHover = $this.find(".button_content-wrapper.is-out-hover");
    const $onHover = $this.find(".button_content-wrapper.is-on-hover");
    const $contentOutHover = $outHover.find(".button_content");

    $this.on("mouseenter", function () {
      const tl = gsap.timeline();
      console.log("moove");
      tl.to($onHover, {
        xPercent: -100,
        duration: 0.4,
        ease: "power2.out",
      });

      tl.to(
        $contentOutHover,
        {
          xPercent: -5,
          duration: 0.3,
          ease: "power2.out",
        },
        "<"
      );
    });

    $this.on("mouseleave", function () {
      const tl = gsap.timeline();

      tl.to($onHover, {
        xPercent: 0,
        duration: 0.4,
        ease: "power2.out",
      });

      tl.to(
        $contentOutHover,
        {
          xPercent: 0,
          duration: 0.3,
          ease: "power2.out",
        },
        "<"
      );
    });
  });
}

function navButtonHover() {
  const $buttonContainer = $(".nav_dropdown");
  const $button = $(".nav_button");
  const $menuItems = $(".nav_dopdown_linkblock");
  const $outHover = $button.find(".nav_button_content-wrapper.is-out-hover");
  const $onHover = $button.find(".nav_button_content-wrapper.is-on-hover");
  const $contentOutHover = $outHover.find(".button_content");

  $buttonContainer.on("mouseenter", function () {
    const tl = gsap.timeline();

    tl.to($onHover, {
      yPercent: 100,
      duration: 0.4,
      ease: "power2.out",
    });

    tl.to(
      $contentOutHover,
      {
        yPercent: 5,
        duration: 0.3,
        ease: "power2.out",
      },
      "<"
    );

    tl.set($menuItems, { display: "block" }, "<");

    tl.from(
      $menuItems,
      {
        yPercent: -80,
        opacity: 0,
        duration: 0.4,
        ease: "power2.out",
        stagger: {
          each: 0.1,
          //from: "end", // 👈 inverse l’ordre (du dernier au premier)
        },
      },
      "<"
    );
  });

  $buttonContainer.on("mouseleave", function () {
    const tl = gsap.timeline();

    tl.to($onHover, {
      yPercent: 0,
      duration: 0.4,
      ease: "power2.out",
    });

    tl.to(
      $contentOutHover,
      {
        yPercent: 0,
        duration: 0.3,
        ease: "power2.out",
      },
      "<"
    );

    tl.to(
      $menuItems,
      {
        yPercent: -80,
        opacity: 0,
        duration: 0.4,
        ease: "power2.out",
        stagger: {
          each: 0.1,
        },
      },
      "<"
    );

    tl.set($menuItems, { display: "none", yPercent: 0, opacity: 1 });
  });
}

function markSiteAsVisited() {
  sessionStorage.setItem("siteVisited", "true");
}

function hasVisitedSite() {
  return sessionStorage.getItem("siteVisited") === "true";
}

function setLenis() {
  const lenis = new Lenis({
    lerp: 0.05, // entre 0 et 1. Plus la valeur est faible, plus le scroll sera fluide
    wheelMultiplier: 1, // Plus la valeur est haute, plus le défilement sera rapide
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

function mobileMenuHandler() {
  const $menu = $(".nav_mobile-menu");
  const $menuButton = $(".is-mobile-menu-logo");

  // Positionne le menu hors écran
  gsap.set($menu, { yPercent: -110 });
  $menu.addClass("closed");

  $menuButton.on("click", function () {
    const isClosed = $menu.hasClass("closed");

    gsap.to($menu, {
      yPercent: isClosed ? 0 : -110,
      duration: 0.5,
      ease: "power1.out",
      onComplete: () => {
        $menu.toggleClass("closed", !isClosed);
      },
    });
  });
}

/////// INSERER LE SVG ET GERER LES EFFETS AU HOVER /////////////////
///INSERER LE SVG////
async function insertSvgIntoHomeQuartier() {
  const container = document.querySelector(".home-quartier_svg-wrapper");
  if (!container)
    return console.warn("'.home-quartier_svg-wrapper' introuvable");

  // Résout le chemin du SVG par rapport à ce script
  const svgUrl = new URL("../src/suzie-map-quartier.svg", import.meta.url).href;

  try {
    const response = await fetch(svgUrl);
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);

    const svgText = await response.text();
    container.innerHTML = svgText;
    mapPinHover();
  } catch (error) {
    console.error("Erreur lors du chargement du SVG :", error);
  }
}

///PIN HOVER///
function mapPinHover() {
  $("[data-map-pin]").each(function () {
    const $group = $(this);
    const bbox = $group[0].getBBox();
    const pinNumber = $(this).data("map-pin");
    const $card = $('[data-card-map-pin="' + pinNumber + '"]');
    let rotationSign = 1;

    // Mettre à jour le rect.hitbox avec les dimensions du groupe
    let $hitbox = $group.find("rect.hitbox");
    if ($hitbox.length) {
      $hitbox.attr({
        x: bbox.x,
        y: bbox.y,
        width: bbox.width,
        height: bbox.height,
      });
    }

    //On applique transformOrigin à tout le <g> pour que path + circle scalent ensemble
    gsap.set($group[0], {
      transformOrigin: `bottom`,
    });

    //On set l'état initial de la carte
    gsap.set($card, { rotation: 0, opacity: 0 });

    // Hover in
    $group.on("mouseenter", function (e) {
      var cursorX = e.clientX;
      var cursorY = e.clientY;
      var screenWidth = $(window).width();

      if (cursorX > screenWidth / 2) {
        // Curseur à droite → origine en bas à gauche de l'élément
        rotationSign = -1;
        $card.css({
          left: cursorX - $card.outerWidth() - 40 + "px",
          top: cursorY - $card.outerHeight() + "px",
        });
      } else {
        // Curseur à gauche → origine en bas à droite de l'élément
        rotationSign = 1;
        $card.css({
          left: cursorX + 40 + "px",
          top: cursorY - $card.outerHeight() + "px",
        });
      }

      const tl = gsap.timeline();
      tl.to($group[0], { scale: 1.1, duration: 0.2, ease: "power1.out" });
      tl.set($card, { display: "block" }, "<");
      tl.to(
        $card,
        {
          rotation: rotationSign * 7,
          opacity: 1,
          duration: 0.2,
          ease: "power1.out",
        },
        "<"
      );
    });

    // Hover out
    $group.on("mouseleave", function () {
      const tl = gsap.timeline();
      tl.to($group[0], { scale: 1, duration: 0.2, ease: "power1.out" });
      tl.to($card, {
        rotation: 0,
        opacity: 0,
        duration: 0.2,
        ease: "power1.out",
      });
      tl.set($card, { display: "none" });
    });
  });
}

//////////////////// COMPORTEMENT DES IMAGES /////////////////////
//// ENTREE TYPE PHOTO JETEE SUR UNE TABLE
function imageEntrance() {
  const $images = $("[data-image-entrance]");

  $images.each(function () {
    const entrance = $(this).data("image-entrance");

    let xPercentValue = 0;
    if (entrance === "left") {
      xPercentValue = -70;
    } else if (entrance === "right") {
      xPercentValue = 70;
    }

    gsap.from($(this), {
      scrollTrigger: {
        trigger: this,
        start: "top 70%",
        // toggleActions: "play none none reverse",
      },
      opacity: 0,
      rotation: 0,
      xPercent: xPercentValue,
      yPercent: 15,
      duration: 0.7,
      ease: "power3.out",
    });
  });
}

///// PARTIE OFFRES DU MOMENT /////
function offreHover() {
  // Fermer tous les items au chargement
  const $items = $(".offers_list-item");

  $items.each(function () {
    const $this = $(this);
    const $button = $this.find(".offers_list-item-button");
    const $description = $this.find(".offers_list-item-description");
    const $image = $this.find(".offers_list-item-img-wrapper");

    $button.css({ display: "none" });
    $description.css({ display: "none" });
    $image.css({ position: "absolute", top: 0, right: 0, left: 0, bottom: 0 });

    $this.on("mouseenter", function () {
      // Capturer l'état initial avec Flip.getState()
      const state = Flip.getState([$image, $button, $description]);

      // Masquer les éléments

      $button.css({ display: "block" });
      $description.css({ display: "block" });
      $image.css({
        position: "relative",
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
      });

      // Animer vers le nouvel état avec Flip.from()
      Flip.from(state, {
        duration: 0.7,
        ease: "power2.out",
        absolute: true,
        onEnter: (elements) =>
          gsap.fromTo(
            elements,
            { opacity: 0, delay: 0.1 },
            { opacity: 1, delay: 0.1 }
          ),
      });
    });

    $this.on("mouseleave", function () {
      // Capturer l'état initial avec Flip.getState()
      const state = Flip.getState([$image, $button, $description]);

      // Masquer les éléments
      $button.css({ display: "none" });
      $description.css({ display: "none" });
      $image.css({
        position: "absolute",
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
      });

      // Animer vers le nouvel état avec Flip.from()
      Flip.from(state, {
        duration: 0.7,
        ease: "power2.out",
        absolute: true,
        onLeave: (elements) =>
          gsap.fromTo(
            elements,
            { opacity: 1, delay: 0.1 },
            { opacity: 0, delay: 0.1 }
          ),
      });
    });
  });
}

///////////// PRELOADER ///////////////
function preloader() {
  if (hasVisitedSite()) {
    return; //Don't play preloader if the site has been visited already
  }

  const $nav = $(".navbar");
  const $navItems = $nav.children();
  const $logo = $(".home-hero_logo");
  const $logoSVG = $logo.find("svg");
  const $videoBg = $(".home-hero_content_wrapper");
  const $headerText = $(".home-hero_text");
  const splitText = new SplitText($headerText, { type: "words,chars" });

  // Initial setup
  gsap.set($videoBg, { clipPath: "inset(100% 0 0 0)" });
  gsap.set($navItems, { yPercent: -50, opacity: 0 });
  gsap.set(splitText.chars, { xPercent: 50, opacity: 0 });

  const windowHeight = window.innerHeight;
  const elementHeight = $logoSVG[0].getBoundingClientRect().height;
  const elementTop = $logoSVG[0].getBoundingClientRect().top;

  // 🧮 Distance nécessaire pour que l'élément soit centré dans la fenêtre
  const centerY = windowHeight / 2 - (elementTop + elementHeight / 2);

  gsap.set($logoSVG, {
    scale: 0.6,
    y: centerY,
    transformOrigin: "center",
    opacity: 1,
  });

  // Prepare SVG paths for drawSVG,
  const $svgPaths = $logoSVG.find("path");
  gsap.set($svgPaths, { fillOpacity: 0 });
  $svgPaths.each(function () {
    $(this).attr("stroke", "currentColor");
    $(this).attr("stroke-width", 1);
  });

  // Timeline
  const tl = gsap.timeline();

  // 1. Trace SVG logo

  tl.from($svgPaths, {
    duration: 3,
    drawSVG: "0%",
    ease: "power3.inOut",
    stagger: 0.05,
  });

  // 2. Remplissage de l'intérieur du logo
  tl.to($svgPaths, {
    fillOpacity: 1,
    duration: 0.3,
    ease: "power1.out",
  });

  // 3. Déplacement du logo à sa position finale
  tl.to($logoSVG, {
    scale: 1,
    y: 0,
    top: 0,
    strokeWidth: 0,
    duration: 1,
    ease: "power2.inOut",
  });

  tl.to(
    $svgPaths,
    {
      strokeWidth: 0,
      duration: 1,
      ease: "power1.inOut",
    },
    "<"
  );

  // 4. Reveal du fond vidéo
  tl.to(
    $videoBg,
    {
      clipPath: "inset(0% 0 0 0)",
      duration: 1,
      ease: "power2.inOut",
    },
    "-=0.5"
  );

  // 5. Apparition des éléments de la navbar
  tl.to(
    $navItems,
    {
      yPercent: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out",
    },
    "-=0.6"
  );

  // 6. Apparition du header text (char par char)
  tl.to(
    splitText.chars,
    {
      xPercent: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.02,
      ease: "power2.out",
    },
    "-=0.5"
  );
}

/////// PARALLAX ///////////
function setAllParallax() {
  const $parallaxElements = $("[data-parallax-speed]");

  $parallaxElements.each(function () {
    const $el = $(this);
    // const speed = parseFloat($el.data('parallax-speed')) || 0;
    const speed = $el.data("parallax-speed");

    gsap.to($el, {
      scrollTrigger: {
        trigger: $el,
        start: "top 70%",
        end: "bottom top",
        scrub: true,
      },
      yPercent: speed,
      ease: "none",
      overwrite: true, // évite l'accumulation d'animations
    });
  });
}

//////// ANIMATION OuVERTURE DES CARTES //////////////
function cardOpeningOnScroll() {
  const $section = $(".section_home-shop");
  const $cardWappers = $(".home-shop_cell");
  let delay = 0;

  $cardWappers.each(function () {
    const $card = $(this).find(".home-shop_card");
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: $section,
        start: "top 50%",
      },
    });

    tl.from($(this), {
      clipPath: "inset(0 0 100% 0)",
      duration: 0.6,
      delay: delay,
      ease: "power1.in",
    });

    tl.from(
      $card,
      {
        opacity: 0,
        yPercent: 10,
        duration: 0.7,
        delay: delay + 0.2,
        ease: "power2.out",
      },
      "<"
    );
    delay += 0.2;
  });
}

function cardAnimation() {
  const $cards = $(".offers_list-item");
  const $wrapper = $(".offers_list-wrapper");

  gsap.from($cards, {
    scrollTrigger: {
      trigger: $wrapper,
      start: "top 35%",
    },
    opacity: 0,
    yPercent: 10,
    duration: 0.7,
    stagger: 0.15,
    ease: "power2.out",
  });
}
////// Footer Animation /////
function footerAnimation() {
  const $footer = $(".footer");
  const $footerCard = $(".footer_card");
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: $footer,
      start: "top 40%",
    },
  });

  tl.from($footer, {
    clipPath: "inset(0 0 100% 0)",
    duration: 0.6,
    ease: "power1.in",
  });

  tl.from(
    $footerCard,
    {
      opacity: 0,
      yPercent: 10,
      duration: 0.7,
      delay: 0.2,
      ease: "power2.out",
    },
    "<"
  );
}
