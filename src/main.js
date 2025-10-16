initAccordion();
initWidget();

function getQueryString(field, url) {
  var href = url ? url : window.location.href;
  var reg = new RegExp("[?&]" + field + "=([^&#]*)", "i");
  var string = reg.exec(href);
  return string ? string[1] : null;
}

function initAccordion() {
  var acc = document.getElementsByClassName("accordion");
  var i;

  for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function () {
      this.classList.toggle("active");
      var panel = this.nextElementSibling;

      var accordionArrow = document.getElementById("accordionArrow");
      if (panel.style.display === "block") {
        accordionArrow.style.transform = "rotate(-45deg)";
        accordionArrow.style.webkitTransform = "rotate(-45deg)";

        panel.style.display = "none";
      } else {
        panel.style.display = "block";

        accordionArrow.style.transform = "rotate(45deg)";
        accordionArrow.style.webkitTransform = "rotate(45deg)";
      }
    });
  }
}
