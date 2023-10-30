function injectButton() {
  console.log("Checking for injection...");

  if (window.location.hostname === 'www.youtube.com') {
      const timeElements = document.querySelectorAll('span[id="text"].style-scope.ytd-thumbnail-overlay-time-status-renderer');

      console.log(`Found ${timeElements.length} time elements.`);

      timeElements.forEach(timeElement => {
          let totalMinutes = 0;

          // Extract the video duration
          const timeParts = timeElement.textContent.trim().split(':').map(Number);

          if (timeParts.length === 2) {
              totalMinutes = timeParts[0] + timeParts[1] / 60;
          } else if (timeParts.length === 3) {
              totalMinutes = timeParts[0] * 60 + timeParts[1] + timeParts[2] / 60;
          }

          // If the video duration is less than 5 minutes, skip to the next iteration
          if (totalMinutes < 5) return;

          // Move upwards to find the nearest parent with id="content"
          let contentParent = timeElement.parentElement;
          while (contentParent && contentParent.id !== "content") {
              contentParent = contentParent.parentElement;
          }

          if (contentParent && !contentParent.querySelector(':scope > .summarize-button')) {              
              // Create the button
              const sumButton = document.createElement('button');
              sumButton.innerText = 'Summarize';
              sumButton.className = 'summarize-button';

              // Add rounded rectangle style
              sumButton.style.borderRadius = '12px';
              sumButton.style.padding = '8px 16px'; // Adjust padding to make the button larger
              sumButton.style.display = 'flex';      // Use flexbox for alignment
              sumButton.style.alignItems = 'center'; // Align items in the center vertically

              // Positioning and other styles
              sumButton.style.position = 'absolute'; // Position it absolutely within the relative container
              sumButton.style.bottom = '10px';       // Place it at the bottom
              sumButton.style.right = '10px';        // Place it to the right
              sumButton.style.backgroundColor = 'black';
              sumButton.style.color = 'white';
              sumButton.style.zIndex = '10';         // To ensure it appears on top
              sumButton.style.border = 'none';       // Remove default border
              sumButton.style.cursor = 'pointer';    // Make it look clickable

              // Create the image element and set its properties
              const img = document.createElement('img');
              img.src = chrome.runtime.getURL('src/img/icon.png');
              img.width = 24;
              img.height = 24;
              img.style.marginRight = '10px'; // Space between the image and the button text

              // Append the image to the button before the text
              sumButton.prepend(img);

              // If meta isn't already set to relative, set it to be relative
              if (getComputedStyle(contentParent).position === 'static') {
                  contentParent.style.position = 'relative';
              }

              // Append the button to the content parent
              contentParent.appendChild(sumButton);
          }
      });
  }
}

// Run the function to inject the summarize button
injectButton();

// Since YouTube uses a lot of AJAX, run the function every time the DOM changes
const observer = new MutationObserver(injectButton);
observer.observe(document.body, { childList: true, subtree: true });
