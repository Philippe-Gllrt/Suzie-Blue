function getCurrentPage() {
  return window.location.pathname.split("/").filter(Boolean)[0] || "home";
}

async function loadPageScript() {
  gsap.registerPlugin(Flip, ScrollTrigger, SplitText, DrawSVGPlugin);
  const page = getCurrentPage();
  console.log(`Chargement du script pour la page: ${page}`);

  try {
    // const module = await import(`./pages/${page}.js`);
    const module = await import(`https://cdn.jsdelivr.net/gh/Philippe-Gllrt/Suzie-Blue/pages/${page}.js`);
    if (module.init) {
      module.init(); // Convention: chaque module exporte `init()`
    } else {
      console.log(`Le module ${page}.js n'exporte pas de fonction 'init'`);
    }
  } catch (err) {
    console.error(`Erreur lors du chargement de la page "${page}"`, err);
  }
}

document.addEventListener("DOMContentLoaded", loadPageScript);
