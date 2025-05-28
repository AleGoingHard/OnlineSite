document.addEventListener("DOMContentLoaded", () => {
    document.body.style.backgroundColor = "#101820";
    document.body.style.color = "white";
    document.body.style.transition = "background-color 0.8s ease, color 0.5s ease";

    window.addEventListener("scroll", () => {
      const trigger = 100;

      if (window.scrollY > trigger) {
        document.body.style.backgroundColor = "#202731";
        document.body.style.color = "white";
      } else {
        document.body.style.backgroundColor = "#101820";
        document.body.style.color = "white";
      }
    });
  });