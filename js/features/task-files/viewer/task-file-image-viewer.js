let taskFileViewerState = createTaskFileViewerState();

/**
 * Opens the task file image viewer.
 * @param {Array} files
 * @param {number} index
 */
function openTaskFileViewer(files, index = 0) {
  const items = normalizeTaskViewerFiles(files);
  if (items.length === 0) return;
  taskFileViewerState.files = items;
  taskFileViewerState.index = clampTaskViewerIndex(index, items.length);
  renderTaskFileViewer();
  attachTaskFileViewerKeydown();
}

/**
 * Closes the task file image viewer.
 */
function closeTaskFileViewer() {
  detachTaskFileViewerKeydown();
  taskFileViewerState = createTaskFileViewerState();
  const root = document.getElementById("taskFileViewerRoot");
  if (!root) return;
  root.classList.add("hidden");
  root.setAttribute("aria-hidden", "true");
  root.innerHTML = "";
}

/**
 * Creates the initial viewer state.
 * @returns {Object}
 */
function createTaskFileViewerState() {
  return {
    files: [],
    index: 0,
    keydownHandler: null,
  };
}

/**
 * Normalizes task viewer files.
 * @param {Array} files
 * @returns {Array}
 */
function normalizeTaskViewerFiles(files) {
  return (files || []).filter((file) => file?.base64);
}

/**
 * Clamps the viewer index.
 * @param {number} index
 * @param {number} length
 * @returns {number}
 */
function clampTaskViewerIndex(index, length) {
  const normalized = Number(index) || 0;
  return Math.max(0, Math.min(normalized, Math.max(0, length - 1)));
}

/**
 * Renders the task file image viewer.
 */
function renderTaskFileViewer() {
  const root = ensureTaskFileViewerRoot();
  root.classList.remove("hidden");
  root.setAttribute("aria-hidden", "false");
  root.innerHTML = getTaskFileViewerTemplate();
  updateTaskFileViewerContent(root);
  wireTaskFileViewerActions(root);
}

/**
 * Ensures the viewer root exists.
 * @returns {HTMLElement}
 */
function ensureTaskFileViewerRoot() {
  let root = document.getElementById("taskFileViewerRoot");
  if (root) return root;
  root = document.createElement("div");
  root.id = "taskFileViewerRoot";
  root.className = "task-file-viewer-root hidden";
  root.setAttribute("aria-hidden", "true");
  document.body.appendChild(root);
  return root;
}

/**
 * Returns the current viewer file.
 * @returns {Object|null}
 */
function getCurrentTaskViewerFile() {
  return taskFileViewerState.files[taskFileViewerState.index] || null;
}

/**
 * Updates the viewer content.
 * @param {HTMLElement} root
 */
function updateTaskFileViewerContent(root) {
  const file = getCurrentTaskViewerFile();
  if (!file) return closeTaskFileViewer();
  updateTaskViewerImage(root, file);
  updateTaskViewerMeta(root, file);
  updateTaskViewerCounter(root);
  updateTaskViewerNav(root);
}

/**
 * Updates the viewer image.
 * @param {HTMLElement} root
 * @param {Object} file
 */
function updateTaskViewerImage(root, file) {
  const image = root.querySelector("[data-task-file-viewer-image]");
  if (!image) return;
  image.src = file.base64;
  image.alt = file.name || "Task image";
}

/**
 * Updates the viewer metadata.
 * @param {HTMLElement} root
 * @param {Object} file
 */
function updateTaskViewerMeta(root, file) {
  setTaskViewerText(root, "[data-task-file-viewer-name]", file.name || "Image");
  setTaskViewerText(root, "[data-task-file-viewer-type]", formatTaskViewerType(file.type));
  setTaskViewerText(root, "[data-task-file-viewer-size]", formatTaskViewerSize(file.size));
  updateTaskViewerDownload(root, file);
}

/**
 * Sets viewer text content.
 * @param {HTMLElement} root
 * @param {string} selector
 * @param {string} text
 */
function setTaskViewerText(root, selector, text) {
  const element = root.querySelector(selector);
  if (element) element.textContent = text;
}

/**
 * Updates the viewer download link.
 * @param {HTMLElement} root
 * @param {Object} file
 */
function updateTaskViewerDownload(root, file) {
  const link = root.querySelector("[data-task-file-viewer-download]");
  if (!link) return;
  link.href = file.base64 || "#";
  link.download = file.name || "image";
}

/**
 * Updates the viewer counter text.
 * @param {HTMLElement} root
 */
function updateTaskViewerCounter(root) {
  const counter = root.querySelector("[data-task-file-viewer-counter]");
  if (!counter) return;
  counter.textContent = `${taskFileViewerState.index + 1} / ${taskFileViewerState.files.length}`;
}

/**
 * Updates navigation button state.
 * @param {HTMLElement} root
 */
function updateTaskViewerNav(root) {
  const prev = root.querySelector("[data-task-file-viewer-prev]");
  const next = root.querySelector("[data-task-file-viewer-next]");
  const disabled = taskFileViewerState.files.length <= 1;
  if (prev) prev.disabled = disabled;
  if (next) next.disabled = disabled;
}

/**
 * Wires viewer buttons.
 * @param {HTMLElement} root
 */
function wireTaskFileViewerActions(root) {
  root.querySelectorAll("[data-task-file-viewer-close]").forEach((element) => {
    element.addEventListener("click", closeTaskFileViewer);
  });
  root.querySelector("[data-task-file-viewer-prev]")?.addEventListener("click", () => {
    stepTaskFileViewer(-1);
  });
  root.querySelector("[data-task-file-viewer-next]")?.addEventListener("click", () => {
    stepTaskFileViewer(1);
  });
}

/**
 * Steps the viewer to another image.
 * @param {number} direction
 */
function stepTaskFileViewer(direction) {
  const length = taskFileViewerState.files.length;
  if (length <= 1) return;
  const nextIndex = (taskFileViewerState.index + direction + length) % length;
  taskFileViewerState.index = nextIndex;
  const root = document.getElementById("taskFileViewerRoot");
  if (root) updateTaskFileViewerContent(root);
}

/**
 * Attaches the keydown handler.
 */
function attachTaskFileViewerKeydown() {
  detachTaskFileViewerKeydown();
  taskFileViewerState.keydownHandler = handleTaskFileViewerKeydown;
  document.addEventListener("keydown", taskFileViewerState.keydownHandler);
}

/**
 * Detaches the keydown handler.
 */
function detachTaskFileViewerKeydown() {
  if (!taskFileViewerState.keydownHandler) return;
  document.removeEventListener("keydown", taskFileViewerState.keydownHandler);
  taskFileViewerState.keydownHandler = null;
}

/**
 * Handles viewer keyboard navigation.
 * @param {KeyboardEvent} event
 */
function handleTaskFileViewerKeydown(event) {
  if (event.key === "Escape") return closeTaskFileViewer();
  if (event.key === "ArrowLeft") return stepTaskFileViewer(-1);
  if (event.key === "ArrowRight") return stepTaskFileViewer(1);
}

/**
 * Formats a viewer mime type.
 * @param {string} type
 * @returns {string}
 */
function formatTaskViewerType(type) {
  const value = String(type || "image").split("/").pop() || "image";
  return value.toUpperCase();
}

/**
 * Formats a viewer file size.
 * @param {number} size
 * @returns {string}
 */
function formatTaskViewerSize(size) {
  const bytes = Number(size) || 0;
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/**
 * Returns the viewer template.
 * @returns {string}
 */
function getTaskFileViewerTemplate() {
  return `
    <div class="task-file-viewer-backdrop" data-task-file-viewer-close></div>
    <div class="task-file-viewer-panel" role="dialog" aria-modal="true" aria-label="Task image viewer">
      <button class="task-file-viewer-close" type="button" data-task-file-viewer-close aria-label="Close image viewer">×</button>
      <div class="task-file-viewer-stage">
        <button class="task-file-viewer-nav" type="button" data-task-file-viewer-prev aria-label="Previous image">‹</button>
        <div class="task-file-viewer-image-wrap">
          <img class="task-file-viewer-image" data-task-file-viewer-image src="" alt="" />
        </div>
        <button class="task-file-viewer-nav" type="button" data-task-file-viewer-next aria-label="Next image">›</button>
      </div>
      <div class="task-file-viewer-meta">
        <div class="task-file-viewer-meta-main">
          <strong class="task-file-viewer-name" data-task-file-viewer-name></strong>
          <span class="task-file-viewer-counter" data-task-file-viewer-counter></span>
        </div>
        <div class="task-file-viewer-meta-row">
          <span data-task-file-viewer-type></span>
          <span data-task-file-viewer-size></span>
        </div>
        <a class="task-file-viewer-download" data-task-file-viewer-download href="#" download>Download</a>
      </div>
    </div>
  `;
}

