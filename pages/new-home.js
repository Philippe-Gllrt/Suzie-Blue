export function init() {
  console.log("Page home initialisée");
  insertSvgIntoHomeQuartier();
  imageEntrance();
  offreHover();
  preloader();
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

//// COMPORTEMENT DES IMAGES /////

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
