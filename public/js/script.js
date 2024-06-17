(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

// public/js/script.js
document.addEventListener('DOMContentLoaded', function() {
  const exploreLink = document.querySelector('.navbar-nav .nav-link[href="/listings"]');
  const cityExploration = document.getElementById('cityExploration');

  let isCitySectionVisible = false;

  exploreLink.addEventListener('click', function(event) {
    event.preventDefault();
    toggleCityExploration();
  });

  document.addEventListener('click', function(event) {
    const isClickInside = cityExploration.contains(event.target) || exploreLink.contains(event.target);
    if (!isClickInside && isCitySectionVisible) {
      cityExploration.style.display = 'none';
      isCitySectionVisible = false;
    }
  });

  function toggleCityExploration() {
    if (!isCitySectionVisible) {
      cityExploration.style.display = 'block';
      isCitySectionVisible = true;
    } else {
      cityExploration.style.display = 'none';
      isCitySectionVisible = false;
    }
  }
});
