function saveOption(e) {
  e.preventDefault();
  const param = e.target.name
  const value = e.target.value
  browser.storage.sync.set({
    [param]: value
  });
}

function restoreOptions() {
  function setCurrentChoice(result) {
    document.querySelector("#maxHeight").value = result.maxHeight || "500";
    // check the radio for OpenTab, set a default value if unavailable
    openTab = result.openTab || "_blank";
    document.querySelector("#" + openTab).checked = true;
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  let getting = browser.storage.sync.get(["maxHeight", "openTab"]);
  getting.then(setCurrentChoice, onError);
}

// load saved values in the options screen
document.addEventListener("DOMContentLoaded", restoreOptions);
// options input autosaves changes whenever inputs are touched
document.querySelectorAll("input").forEach(item => {
  item.addEventListener("input", saveOption);
});