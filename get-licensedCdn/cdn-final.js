(function () {
  class SimpleCookieConsent {
    constructor(options = {}) {
      this.cookieName = options.cookieName || "cookie_consent";
      this.cookieValue = options.cookieValue || "accepted";
      this.expiryDays = options.expiryDays || 365;
      this.domain = options.domain || this.getMainDomain();
      this.popupId = options.popupId || "simpleCookieConsentPopup";
      this.acceptBtnId = options.acceptBtnId || "simpleCookieConsentAcceptBtn";
      this.popupHTML = options.popupHTML || this.defaultPopupHTML;
      this.popupText =
        options.popupText ||
        "This website uses cookies to ensure you get the best experience on our website.";
      this.acceptBtnText = options.acceptBtnText || "Accept";
      this.acceptedValues = options.acceptedValues || [
        "yes",
        "accepted",
        "true",
        "y",
        "1",
      ];
      this.init();
    }

    init() {
      if (!this.isConsentGiven()) {
        this.showPopup();
        this.setupEventListeners();
      }
    }

    getMainDomain() {
      const hostnameParts = window.location.hostname.split(".");
      return hostnameParts.slice(-2).join(".");
    }

    isConsentGiven() {
      const cookieValue = this.getCookie();
      return this.acceptedValues.includes(cookieValue.toLowerCase());
    }

    getCookie() {
      const name = this.cookieName + "=";
      const decodedCookie = decodeURIComponent(document.cookie);
      const ca = decodedCookie.split(";");
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    }

    setCookie() {
      const date = new Date();
      date.setTime(date.getTime() + this.expiryDays * 24 * 60 * 60 * 1000);
      const expires = "expires=" + date.toUTCString();
      document.cookie = `${this.cookieName}=${this.cookieValue}; ${expires}; path=/; domain=${this.domain}; SameSite=Lax`;
    }

    showPopup() {
      if (!document.getElementById(this.popupId)) {
        document.body.insertAdjacentHTML("beforeend", this.popupHTML);
      }
      document.getElementById(this.popupId).style.display = "block";
    }

    hidePopup() {
      document.getElementById(this.popupId).style.display = "none";
    }

    setupEventListeners() {
      const acceptBtn = document.getElementById(this.acceptBtnId);
      if (acceptBtn) {
        acceptBtn.addEventListener("click", () => this.acceptCookies());
      }
    }

    acceptCookies() {
      this.setCookie();
      this.hidePopup();
    }

    get defaultPopupHTML() {
      return `
          <div id="${this.popupId}" style="display:none; position:fixed; left:0; bottom:0; width:100%; background-color:#f1f1f1; color:#000; text-align:center; padding:10px; z-index:9999;">
            <p>${this.popupText}</p>
            <button id="${this.acceptBtnId}" style="background-color:#4CAF50; color:white; padding:10px 20px; border:none; cursor:pointer;">${this.acceptBtnText}</button>
          </div>
        `;
    }
  }

  // Export the class to make it globally accessible
  window.SimpleCookieConsent = SimpleCookieConsent;
})();
