// DOMContentLoaded listener for add-task init.
window.addEventListener("DOMContentLoaded", handleAddTaskReady);

/**
 * Defers add-task initialization until shared page setup has finished.
 */
function handleAddTaskReady() {
  withPageReady(runAddTaskInit);
}

/**
 * Initializes the standalone add-task form.
 * @returns {Promise<void>}
 */
async function runAddTaskInit() {
  await initAddTaskForm({
    onClose: () => {
      window.location.href = "board.html";
    },
  });
}
