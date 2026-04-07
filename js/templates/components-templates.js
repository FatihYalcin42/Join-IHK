/**
 * Builds the main navigation bar HTML.
 * @returns {string}
 */
function getNavBarTemplate() {
  return `
  ${getAppNavShellTemplate(getPrimaryNavLinksTemplate(), getFooterLinksTemplate())}
`;
}

/**
 * Builds the guest navigation bar HTML.
 * @returns {string}
 */
function getGuestNavTemplate() {
  return `
  ${getAppNavShellTemplate(getGuestNavLinksTemplate(), getFooterLinksTemplate())}
`;
}

/**
 * Builds the guest header HTML.
 * @returns {string}
 */
function getGuestHeaderTemplate() {
  return `
  <header class="topbar">
    <div class="topbar-inner">
      <div class="topbar-logo" aria-hidden="true"></div>

      <p class="topbar-title">Kanban Project Management Tool</p>

      <div class="topbar-actions">
        <a class="topbar-help" href="help.html" aria-label="Help">?</a>
      </div>
    </div>
  </header>
`;
}

/**
 * Builds the authenticated header HTML.
 * @returns {string}
 */
function getHeaderTemplate() {
  return `
  <header class="topbar">
    <div class="topbar-inner">
      <div class="topbar-logo" aria-hidden="true"></div>

      <p class="topbar-title">Kanban Project Management Tool</p>

      <div class="topbar-actions">
        <a class="topbar-help" href="help.html" aria-label="Help">?</a>
        ${getHeaderUserMenuTemplate()}
      </div>
    </div>
  </header>
`;
}

/**
 * Builds the shared app navigation shell.
 * @param {string} navLinks
 * @param {string} footerLinks
 * @returns {string}
 */
function getAppNavShellTemplate(navLinks, footerLinks) {
  return `
  <div class="nav-bar">
    <div class="nav-logo">
      <img class="nav-img" src="../../assets/img/capa-2.svg" alt="Join Logo" />
    </div>
    <div class="nav-links">
      <nav>${navLinks}</nav>
      ${footerLinks}
    </div>
  </div>
  `;
}

/**
 * Builds the main navigation links.
 * @returns {string}
 */
function getPrimaryNavLinksTemplate() {
  return [
    getNavLinkTemplate("summary.html", "summary", "../../assets/img/icons/summary.svg", "Summary"),
    getNavLinkTemplate("add-task.html", "add_task", "../../assets/img/icons/addtasks.svg", "Add Tasks"),
    getNavLinkTemplate("board.html", "board", "../../assets/img/icons/board.svg", "Board"),
    getNavLinkTemplate("contacts.html", "contacts", "../../assets/img/icons/contact.svg", "Contacts"),
  ].join("");
}

/**
 * Builds the guest navigation links.
 * @returns {string}
 */
function getGuestNavLinksTemplate() {
  return getNavLinkTemplate(
    "../../index.html",
    "login",
    "../../assets/img/icons/lock.svg",
    "Log In",
  );
}

/**
 * Builds a single navigation link.
 * @param {string} href
 * @param {string} route
 * @param {string} iconSrc
 * @param {string} label
 * @returns {string}
 */
function getNavLinkTemplate(href, route, iconSrc, label) {
  return `
        <a href="${href}" data-route="${route}">
          <img src="${iconSrc}" alt="" />
          <p>${label}</p>
        </a>
  `;
}

/**
 * Builds the shared footer links.
 * @returns {string}
 */
function getFooterLinksTemplate() {
  return `
      <div class="footer-links">
        <a href="privacy-policy.html">Privacy Policy</a>
        <a href="legal-notice.html">Legal notice</a>
      </div>
  `;
}

/**
 * Builds the authenticated header user menu.
 * @returns {string}
 */
function getHeaderUserMenuTemplate() {
  return `
        <div class="user-menu-wrap" id="user-menu-wrap">
          <button class="topbar-user" id="user-menu-btn" type="button" aria-label="User menu" aria-haspopup="menu" aria-expanded="false">
            <span id="user-initials">G</span>
          </button>
          <div class="user-dropdown" id="user-dropdown" role="menu" hidden>
            <a class="user-dropdown-item" href="legal-notice.html" role="menuitem">Legal Notice</a>
            <a class="user-dropdown-item" href="privacy-policy.html" role="menuitem">Privacy Policy</a>
            <button class="user-dropdown-item user-dropdown-logout" type="button" id="user-logout" role="menuitem">Log out</button>
          </div>
        </div>
  `;
}

/**
 * Generates the HTML for the confirm overlay dialog.
 * @param {Object} options - Title, message, and button texts
 * @returns {string} HTML string
 */
function getConfirmOverlayTemplate({
  title,
  message,
  confirmText,
  cancelText,
}) {
  return `<div class="confirm-backdrop" data-confirm-cancel></div><div class="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="confirmOverlayTitle"><h3 class="confirm-title" id="confirmOverlayTitle">${title}</h3><p class="confirm-message">${message}</p><div class="confirm-actions"><button type="button" class="confirm-btn confirm-btn-secondary" data-confirm-cancel>${cancelText}</button><button type="button" class="confirm-btn confirm-btn-primary" data-confirm-ok>${confirmText}</button></div></div>`;
}
