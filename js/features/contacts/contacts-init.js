/**
 * Initializes the contacts page and its live reload wiring.
 * @returns {Promise<void>}
 */
async function initContactsPage() {
  const listElement = document.querySelector(".contact-list");
  if (!listElement) {
    return;
  }
  await loadContactsFromFirebase();
  renderContactList(listElement, getContactData());
  setupAddContactOverlay(listElement);
  setupHeaderBackButton();
  onPageVisible(() => reloadContactsData(listElement));
}

/**
 * Reloads contacts from Firebase and updates the list.
 * @param {HTMLElement} listElement
 */
async function reloadContactsData(listElement) {
  try {
    await loadContactsFromFirebase();
    renderContactList(listElement, getContactData());
  } catch (error) {
    console.error("Error reloading contacts:", error);
  }
}

/**
 * Defers contacts initialization until shared page setup has finished.
 */
function handleContactsReady() {
  withPageReady(initContactsPage);
}

// DOMContentLoaded listener for contacts init.
document.addEventListener("DOMContentLoaded", handleContactsReady);
