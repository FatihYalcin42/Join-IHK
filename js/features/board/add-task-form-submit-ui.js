/**
 * Wires priority button handlers.
 */
function wirePrioButtons(state) {
  state.form.querySelectorAll(".prio-btn").forEach((btn) => {
    btn.addEventListener("click", () => handlePrioButton(state, btn));
  });
}

/**
 * Handles a priority button click.
 */
function handlePrioButton(state, btn) {
  clearPrioActive(state);
  btn.classList.add("is-active");
  state.selectedPrio = btn.dataset.prio;
}

/**
 * Clears active priority styles.
 */
function clearPrioActive(state) {
  state.form.querySelectorAll(".prio-btn").forEach((b) => {
    b.classList.remove("is-active");
  });
}

/**
 * Wires the clear button handler.
 */
function wireClearButton(state, resets) {
  document.getElementById("clear-btn")?.addEventListener("click", () => {
    clearAddTaskForm(state, resets);
  });
}

/**
 * Clears the add-task form state and UI.
 */
function clearAddTaskForm(state, resets) {
  resetAddTaskFormState(state);
  resetAddTaskFormUi(state, resets);
}

/**
 * Resets the add-task form state values.
 * @param {Object} state
 */
function resetAddTaskFormState(state) {
  resetForm(state);
  resetStatusPreset();
  resetPrioSelection(state);
  clearTaskFileUpload(state);
  resetSelectionState(state);
}

/**
 * Resets the add-task form UI after clearing.
 * @param {Object} state
 * @param {Object} resets
 */
function resetAddTaskFormUi(state, resets) {
  updateAddTaskCounters(state);
  clearTitleLimitState(state);
  clearDescriptionLimitState();
  clearSubtaskLimitState();
  clearCategoryInput(state);
  resets.resetCategoryUi?.();
  resets.resetAssignedUi?.();
  renderSubtasks(state);
  clearAddTaskErrors(state);
  updateCreateButtonState(state);
}

/**
 * Resets the priority selection.
 */
function resetPrioSelection(state) {
  state.selectedPrio = "medium";
  applyPrioButtonStyles(state);
}

/**
 * Resets the form element.
 */
function resetForm(state) {
  state.form.reset();
}

/**
 * Resets the status preset value.
 */
function resetStatusPreset() {
  const statusField = document.getElementById("task-status-preset");
  if (statusField) statusField.value = statusField.value || "todo";
}

/**
 * Resets selection state.
 */
function resetSelectionState(state) {
  state.selectedCategory = "";
  state.selectedAssigned = [];
  state.selectedSubtasks = [];
}
