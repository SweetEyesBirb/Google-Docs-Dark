// This should allow the extension to work on other browsers. Not tested yet.
const browserAPI = typeof browser !== "undefined" ? browser : chrome;

// Elements
const html = document.querySelector("html");
const imgs = document.querySelectorAll("img");

// Google Docs canvas container
const canvasesContainer = document.querySelector(".kix-rotatingtilemanager-content"); // canvas < kix-page-paginated (multiple) < kix-rotatingtilemanager-content (canvases parent element)

// Spreadsheet in Google Sheets
const spreadsheet = document.querySelector("#waffle-grid-container"); //  #docs-editor


/**
 * This function allows the execution of a callback function in the current active tab. This prevents the
 * execution of JavaScript in the popup html
 * @param {*} callbackFunction - The callback function to be executed in the current active tab
 */
function executeInCurrentTab(callbackFunction) {
    browserAPI.tabs.query({ active: true, currentWindow: true }, tabs => {
        browserAPI.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: callbackFunction
        });
    });
}

// if the popup exists, execute code
if (document.querySelector("#popup-body")) {
    // Buttons
    let btnTogglePage = document.querySelector("#toggle-page");
    let btnToggleDocument = document.querySelector("#toggle-doc");


    btnTogglePage.addEventListener("change", event => {
        // If the toggle is checked
        if (event.target.checked) {

            // activate dark mode
            executeInCurrentTab(() => {
                html.style.filter = "invert(1) hue-rotate(180deg)";
                imgs.forEach(media => {
                    media.style.filter = "invert(1) hue-rotate(180deg)";
                })
            });
        } else {
            // restore colors if the user toggles the button again
            executeInCurrentTab(() => {
                html.style.filter = "invert(0) hue-rotate(0deg)";
                imgs.forEach(media => {
                    media.style.filter = "invert(0) hue-rotate(0deg)";
                })
            });
        }
    });

    btnToggleDocument.addEventListener("change", event => {
        if (event.target.checked) {

            executeInCurrentTab(() => {
                // Ternary operator added to check for the existence of the elements.
                // canvas is only present in Google Docs while spreadsheet only in Google Sheets.
                canvasesContainer ? canvasesContainer.style.filter = "invert(1) hue-rotate(180deg)" : console.log('Canvases Container not found');
                spreadsheet ? spreadsheet.style.filter = "invert(1) hue-rotate(180deg)" : console.log('Spreadsheet not found');
            })
        } else {
            executeInCurrentTab(() => {
                canvasesContainer ? canvasesContainer.style.filter = "invert(0) hue-rotate(0deg)" : console.log('Canvases Container not found');
                spreadsheet ? spreadsheet.style.filter = "invert(0) hue-rotate(0deg)" : console.log('Spreadsheet not found');
            })
        }
    });
}

/*
Keeping this as a reminder that the Mutation Observer ain't good here.
I was trying to invert colors if a new page is created while typing.
Turns out that inverting colors in the parent container does that automatically.
Not good as it changes the color every time you type

const observer = new MutationObserver(() => {
    canvasesContainer.style.filter = "invert(1) hue-rotate(180deg)";
});

observer.observe(document.body, { childList: true, subtree: true });
*/