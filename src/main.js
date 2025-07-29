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

function submitForm() {
  var userObjectString = document.forms["widgetForm"]["userObject"].value;
  console.log(userObjectString);

  var jsonUserObject = JSON.parse(userObjectString);

  //TODO: add in try catch check for whether the user object is valid JSON
  console.log(jsonUserObject);
  console.log(JSON.stringify(jsonUserObject));
  //console.log(encodeURIComponent(userObjectString));
  //userObjectString = encodeURIComponent(JSON.stringify(jsonUserObject));
  document.forms["widgetForm"]["userObject"].value = JSON.stringify(jsonUserObject);

  //console.log(document.forms["widgetForm"]["userObject"].value);

  document.getElementById("widgetForm").submit();
}

function initWidget() {
  var meta = document.createElement("meta");
  var deviceWidthMeta = getQueryString("deviceWidthMeta");

  if (deviceWidthMeta == "deviceWidthMeta") {
    meta.name = "viewport";
    meta.content = "width=device-width, initial-scale=1";
    document.getElementsByTagName("head")[0].appendChild(meta);
  }

  var temp = document.getElementById("tenantAlias");
  var tenantAlias = getQueryString("tenantAlias");
  temp.value = tenantAlias;

  var temp = document.getElementById("jwt");
  var jwt = getQueryString("jwt");
  temp.value = jwt;

  var temp = document.getElementById("engagementMedium");
  var engagementMedium = getQueryString("engagementMedium");
  temp.value = engagementMedium;

  var temp = document.getElementById("programId");
  var programId = getQueryString("programId");
  temp.value = programId;

  var temp = document.getElementById("widgetId");
  var widgetId = getQueryString("widgetId");
  temp.value = widgetId;

  var temp = document.getElementById("userObject");
  var userObject = getQueryString("userObject");
  //console.log(getQueryString('userObject'));
  console.log(userObject);

  if (userObject) {
    userObject = JSON.parse(decodeURIComponent(userObject));
    console.log(userObject);
    temp.value = JSON.stringify(userObject, null, 4);
    console.log(temp.value);
  } else {
    temp.value = JSON.stringify(JSON.parse('{"user":{"id": "","accountId":""}}'), null, 4);
  }

  var isTrackingScript = getQueryString("isTrackingScript");
  if (isTrackingScript == "isTrackingScript") {
    document.getElementById("isTrackingScript").checked = true;
  }

  var isCookieUser = getQueryString("isCookieUser");
  if (isCookieUser == "isCookieUser") {
    document.getElementById("isCookieUser").checked = true;
  }

  if (deviceWidthMeta == "deviceWidthMeta") {
    document.getElementById("deviceWidthMeta").checked = true;
  }

  var squatchURL = "https://d2rcp9ak152ke1.cloudfront.net/assets/javascripts/v2/squatch.min.js";
  var temp = document.getElementById("squatchURL");
  if (getQueryString("squatchURL")) {
    squatchURL = decodeURIComponent(getQueryString("squatchURL"));
    temp.value = squatchURL;
  }

  var sqtVersion = getQueryString("sqtVersion");
  if (sqtVersion == 1) {
    document.getElementById("sqtVersion1").checked = true;
    document.getElementById("sqtVersion2").checked = false;
  }
  if (sqtVersion == 2) {
    document.getElementById("sqtVersion2").checked = true;
    document.getElementById("sqtVersion1").checked = false;
  }

  !(function (a, b) {
    a("squatch", squatchURL, b);
  })(function (a, b, c) {
    var d, e, f;
    (c["_" + a] = {}),
      (c[a] = {}),
      (c[a].ready = function (b) {
        c["_" + a].ready = c["_" + a].ready || [];
        c["_" + a].ready.push(b);
      }),
      (e = document.createElement("script")),
      (e.async = 1),
      (e.src = b),
      (f = document.getElementsByTagName("script")[0]),
      f.parentNode.insertBefore(e, f);
  }, this);

  var temp = document.getElementById("domain");
  var domain = decodeURIComponent(getQueryString("domain"));
  if (domain && domain != "null") {
    temp.value = domain;
  }

  if (engagementMedium == "EMBED") {
    console.log("loading embedded widget");
    var embedDiv = document.createElement("div");
    embedDiv.id = "squatchembed";
    embedDiv.classList.add("squatchembed");

    document.body.appendChild(embedDiv);
  }

  if (engagementMedium == "POPUP") {
    var popupButton = document.createElement("button");
    popupButton.classList.add("squatchpop");
    popupButton.innerText = "Referral Widget";
    document.body.appendChild(popupButton);
  }

  window.squatch.ready(function () {
    //configure squatch.js for the tenant you are using

    var squatchInitObj = {
      tenantAlias: tenantAlias,
    };

    if (domain) {
      squatchInitObj["domain"] = domain;
    }

    squatch.init(squatchInitObj);

    var initObj = userObject;

    if (isCookieUser) {
      initObj = {};
    }

    if (jwt) {
      initObj["jwt"] = jwt;
    }

    if (!isTrackingScript) {
      initObj["engagementMedium"] = engagementMedium;
      if (widgetId == "REFERRER_WIDGET") {
        initObj["widgetType"] = "REFERRER_WIDGET";
      } else if (widgetId == "CONVERSION_WIDGET") {
        initObj["widgetType"] = "CONVERSION_WIDGET";
      } else {
        initObj["widgetType"] = "p/" + programId + "/w/" + widgetId;
      }
      console.log(initObj);
    }

    console.log(squatchInitObj);
    console.log(initObj);

    squatch
      .widgets()
      .upsertUser(initObj)
      .then(function (response) {
        user = response.user;
      })
      .catch(function (error) {
        console.log(error);
      });
  });
}
