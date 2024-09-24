function saveOptions(e) {
  e.preventDefault();
  browser.storage.sync.set({
    maxHeight: document.querySelector("#maxHeight").value,
  });
}

function restoreOptions() {
  function setCurrentChoice(result) {
    document.querySelector("#maxHeight").value = result.maxHeight || "500";
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  let getting = browser.storage.sync.get("maxHeight");
  getting.then(setCurrentChoice, onError);
}

// load saved values in the options screen
document.addEventListener("DOMContentLoaded", restoreOptions);
// height value in options screen is autosaved whenever it's changed
document.querySelector("#maxHeight").addEventListener("input", saveOptions);