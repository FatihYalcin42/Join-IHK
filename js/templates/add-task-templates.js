/**
 * Builds the priority selection block HTML.
 * @returns {string}
 */
function getAddTaskPriorityBlockTemplate() {
  return `
    <label>Priority</label>
    <div class="prio-row">
      ${getAddTaskPriorityButtonTemplate("urgent", "Urgent", "M4 10L10 4L16 10", "M4 14L10 8L16 14")}
      ${getAddTaskPriorityButtonTemplate("medium", "Medium", "M4 6H16", "M4 10H16", true)}
      ${getAddTaskPriorityButtonTemplate("low", "Low", "M4 2L10 8L16 2", "M4 6L10 12L16 6")}
    </div>
  `;
}

/**
 * Builds a priority button template.
 * @param {string} value
 * @param {string} label
 * @param {string} primaryPath
 * @param {string} secondaryPath
 * @param {boolean} isActive
 * @returns {string}
 */
function getAddTaskPriorityButtonTemplate(
  value,
  label,
  primaryPath,
  secondaryPath,
  isActive = false,
) {
  const classes = isActive ? "prio-btn is-active" : "prio-btn";
  return `
      <button type="button" class="${classes}" data-prio="${value}">
        <span class="prio-label">${label}</span>
        ${getAddTaskPriorityIconTemplate(primaryPath, secondaryPath)}
      </button>
  `;
}

/**
 * Builds the priority icon template.
 * @param {string} primaryPath
 * @param {string} secondaryPath
 * @returns {string}
 */
function getAddTaskPriorityIconTemplate(primaryPath, secondaryPath) {
  return `
        <svg class="prio-icon" viewBox="0 0 20 16" aria-hidden="true">
          <path d="${primaryPath}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="${secondaryPath}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
  `;
}

/**
 * Builds the add-task form with an optional status preset.
 * @param {string} presetStatus
 * @returns {string}
 */
function getAddTaskFormTemplate(presetStatus = "todo") {
  return [
    getAddTaskFormOpen(presetStatus),
    getAddTaskRightColumn(),
    getAddTaskFormFooter(),
    getAddTaskFormClose(),
  ].join("");
}

/**
 * Builds the form header including the preset status.
 * @param {string} presetStatus
 * @returns {string}
 */
function getAddTaskFormOpen(presetStatus) {
  return `
    <form id="add-task-form" class="addtask-form" novalidate>
      <input type="hidden" id="task-status-preset" value="${presetStatus}" />
      <input type="hidden" id="task-category-value" value="" />
      <div class="addtask-grid">
        <div>
          ${getAddTaskLeftFields()}
        </div>
  `;
}

/**
 * Builds the left column fields HTML.
 * @returns {string}
 */
function getAddTaskLeftFields() {
  return `
      <label>Title<span class="req">*</span></label>
      <input id="task-title" type="text" placeholder="Enter a title" />
      <div class="field-error" id="task-title-error"></div>
      <div class="field-counter" id="task-title-counter">0/40</div>
      <label>Description</label>
      <textarea id="task-description" placeholder="Enter a Description"></textarea>
      <div class="field-error" id="task-description-error"></div>
      <div class="field-counter" id="task-description-counter">0/200</div>
    <label>Due date<span class="req">*</span></label>
    <input id="task-due-date" type="date" />
  `;
}

/**
 * Builds the right column container HTML.
 * @returns {string}
 */
function getAddTaskRightColumn() {
  return `
        <div>
          ${getAddTaskPriorityBlock()}
          ${getAddTaskAssignedBlock()}
          ${getAddTaskCategoryBlock()}
          ${getAddTaskFileUploadBlock()}
          ${getAddTaskSubtaskBlock()}
        </div>
      </div>
  `;
}

/**
 * Returns the priority block HTML.
 * @returns {string}
 */
function getAddTaskPriorityBlock() {
  return getAddTaskPriorityBlockTemplate();
}

/**
 * Builds the assigned-to block HTML.
 * @returns {string}
 */
function getAddTaskAssignedBlock() {
  return `
    <label>Assigned to</label>
    <div class="dropdown dropdown--select assigned-dropdown" id="assigned-dropdown">
      <div class="dropdown-toggle" data-assigned-toggle role="button" tabindex="0" aria-haspopup="listbox" aria-expanded="false">
        <input type="text" class="assigned-input" data-assigned-input placeholder="Select contacts to assign" aria-label="Search contacts" autocomplete="off" />
        <span class="dropdown-caret" aria-hidden="true"></span>
      </div>
      <div class="dropdown-menu" data-assigned-menu hidden></div>
    </div>
    <div class="assigned-selected" data-assigned-avatars hidden></div>
  `;
}

/**
 * Builds the category dropdown block HTML.
 * @returns {string}
 */
function getAddTaskCategoryBlock() {
  return (
    `<label>Category<span class="req">*</span></label>\n` +
    `<div class="dropdown dropdown--select" id="category-dropdown">\n` +
    `  <button type="button" class="dropdown-toggle" data-category-toggle aria-haspopup="listbox" aria-expanded="false">\n` +
    `    <span class="dropdown-placeholder" data-category-value>Select task category</span>\n` +
    `    <span class="dropdown-caret" aria-hidden="true"></span>\n` +
    `  </button>\n` +
    `  <div class="dropdown-menu" data-category-menu hidden>\n` +
    `    <button type="button" class="dropdown-item" data-category-item data-value="userstory" data-label="User Story">User Story</button>\n` +
    `    <button type="button" class="dropdown-item" data-category-item data-value="technical" data-label="Technical Task">Technical Task</button>\n` +
    `  </div>\n` +
    `</div>\n`
  );
}

/**
 * Builds the file upload block HTML.
 * @returns {string}
 */
function getAddTaskFileUploadBlock() {
  return `
    <label for="task-files">Files</label>
    <div class="file-upload-field">
      ${getAddTaskFileInputTemplate()}
      ${getAddTaskFileTriggerTemplate()}
    </div>
    <ul class="file-upload-preview" data-task-file-preview hidden></ul>
    <div class="field-error" id="task-files-error"></div>
  `;
}

/**
 * Builds the native file input HTML.
 * @returns {string}
 */
function getAddTaskFileInputTemplate() {
  return `
      <input
        id="task-files"
        class="file-upload-native"
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
      />
  `;
}

/**
 * Builds the styled file upload trigger HTML.
 * @returns {string}
 */
function getAddTaskFileTriggerTemplate() {
  return `
      <label for="task-files" class="file-upload-trigger">
        <span class="file-upload-placeholder">Upload images</span>
        <img class="file-upload-icon" src="/assets/img/icons/plus-button-1.svg" alt="" aria-hidden="true" />
      </label>
  `;
}

/**
 * Builds the subtask input block HTML.
 * @returns {string}
 */
function getAddTaskSubtaskBlock() {
  return `
  <label>Subtasks</label>
  <div class="subtask-row">
    <div class="subtask-input-actions">
      ${getAddTaskSubtaskActionTemplate("clear", "Clear subtask", "/assets/img/icons/delete.svg")}
      ${getAddTaskSubtaskActionTemplate("save", "Save subtask", "/assets/img/icons/done.svg")}
    </div>
    <input id="subtask-input" type="text" placeholder="Add new subtask" />
  </div>
  <div class="field-error" id="subtask-error"></div>
  <div id="subtask-list"></div>
`;
}

/**
 * Builds a subtask action button.
 * @param {string} action
 * @param {string} label
 * @param {string} iconSrc
 * @returns {string}
 */
function getAddTaskSubtaskActionTemplate(action, label, iconSrc) {
  return `
      <button type="button" class="subtask-input-action" data-subtask-input-action="${action}" aria-label="${label}">
        <img src="${iconSrc}" alt="" aria-hidden="true" />
      </button>
  `;
}

/**
 * Builds the form footer HTML.
 * @returns {string}
 */
function getAddTaskFormFooter() {
  return `
      <div id="add-task-form-msg" class="form-msg" aria-live="polite"></div>
      <p class="req-note"><span class="req">*</span>This field is required</p>
      <div class="addtask-footer">
        ${getAddTaskFooterButtonTemplate("button", "clear-btn", "Clear", "M4 4L12 12M12 4L4 12")}
        ${getAddTaskFooterButtonTemplate("submit", "create-btn", "Create Task", "M3 8L6 11L13 4")}
      </div>
  `;
}

/**
 * Builds a footer action button.
 * @param {string} type
 * @param {string} id
 * @param {string} label
 * @param {string} path
 * @returns {string}
 */
function getAddTaskFooterButtonTemplate(type, id, label, path) {
  return `
        <button type="${type}" id="${id}">
          <span class="btn-label">${label}</span>
          <svg class="btn-icon" viewBox="0 0 16 16" aria-hidden="true">
            <path d="${path}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
  `;
}

/**
 * Builds the closing form tag HTML.
 * @returns {string}
 */
function getAddTaskFormClose() {
  return `
    </form>
  `;
}
