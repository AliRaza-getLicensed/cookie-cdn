// simple-cookie-consent.js
(function () {
  class SimpleCookieConsent {
    constructor(options = {}) {
      this.cookieName = options.cookieName || "cookie_consent";
      this.expiryDays = options.expiryDays || 365;
      this.popupId = "simpleCookieConsentPopup";
      this.acceptBtnId = "simpleCookieConsentAcceptBtn";
      this.popupHTML = options.popupHTML || this.defaultPopupHTML;
      this.init();
    }

    init() {
      if (!this.getCookie()) {
        this.showPopup();
        this.setupEventListeners();
      }
    }

    getCookie() {
      const name = this.cookieName + "=";
      const decodedCookie = decodeURIComponent(document.cookie);
      const ca = decodedCookie.split(";");
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == " ") {
          c = c.substring(1);
        }
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
      document.cookie =
        this.cookieName + "=accepted; " + expires + "; path=/; SameSite=Lax";
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
      document.addEventListener("DOMContentLoaded", () => {
        const acceptBtn = document.getElementById(this.acceptBtnId);
        if (acceptBtn) {
          acceptBtn.addEventListener("click", () => this.acceptCookies());
        }
      });
    }

    acceptCookies() {
      this.setCookie();
      this.hidePopup();
    }

    get defaultPopupHTML() {
      return `
                <div id="${this.popupId}" style="display:none; position:fixed; left:0; bottom:0; width:100%; background-color:#f1f1f1; color:#000; text-align:center; padding:10px; z-index:9999;">
                    <p>This website uses cookies to ensure you get the best experience on our website.</p>
                    <button id="${this.acceptBtnId}" style="background-color:#4CAF50; color:white; padding:10px 20px; border:none; cursor:pointer;">Accept</button>
                </div>
            `;
    }
  }

  // Automatically initialize the cookie consent
  window.addEventListener("load", () => {
    new SimpleCookieConsent();
  });
})();
