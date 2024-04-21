// JavaScript code for QuickTrack application

// Function to initialize the application
function init() {
  // Check if there's existing session data in localStorage
  let sessionData = JSON.parse(localStorage.getItem('sessionData')) || [];
  
  // Display interface based on existing session data or default view
  if (sessionData.length === 0) {
      displayDefaultView();
  } else {
      displaySessionView(sessionData);
  }

  // Wait for the DOM content to be fully loaded before adding event listener
  document.addEventListener('DOMContentLoaded', () => {
      // Add event listener for reset button
      document.addEventListener('click', function(event) {
          const target = event.target;
          if (target && target.id === 'resetBtn') {
              resetData();
          } else if (target && target.id === 'addActivityBtn') {
              startNewSession();
          } else if (target && target.id === 'cancelBtn') {
              cancelOperation();
          }
      });

      // Add event listener for time unit selection
      const timeUnitSelect = document.getElementById('timeUnitSelect');
      timeUnitSelect.addEventListener('change', function() {
          const selectedUnit = timeUnitSelect.value;
          displaySummaryChart(selectedUnit);
      });
  });
}

function displayDefaultView() {
  // Clear main content
  document.querySelector('main').innerHTML = `
  <div class="buttons">
  <button id="startSessionBtn"><span>Start New Session</span></button>
  <button id="manualEventBtn" class="manualbutton1"><span>Log Manual Event</span></button>
</div>
  `;

  // Add event listener for starting a new session
  document.getElementById('startSessionBtn').addEventListener('click', startNewSession);

  // Add event listener for logging manual event
  document.getElementById('manualEventBtn').addEventListener('click', () => displayManualEventForm(new Date().getTime()));
}

// Function to start a new session
function startNewSession() {
  // Get current timestamp for session start time
  const startTime = new Date().getTime();

  // Update interface to logging activity view
  displayLoggingActivityView(startTime);
}

// Function to display the logging activity view
function displayLoggingActivityView(startTime) {
  // Clear main content
  const mainElement = document.querySelector('main');
  mainElement.innerHTML = `
  <section class="task_section">
  <h2>Logging Activity</h2>
  <div class="task_input">
      <input type="text" id="activityDescription" placeholder="Enter task description" required>
      <button id="startTimerBtn">Start Timer</button>
      <button id="stopTimerBtn" style="display:none;">Stop Timer</button> <!-- Initially hidden -->
      <button id="cancelBtn">Cancel</button> <!-- New Cancel Button -->
  </div>
</section>
  `;

  // Add event listener for starting timer
  document.getElementById('startTimerBtn').addEventListener('click', () => startTimer(startTime));

  // Add event listener for stopping timer
  document.getElementById('stopTimerBtn').addEventListener('click', () => stopTimer(startTime));

  // Add event listener for cancelling
  document.getElementById('cancelBtn').addEventListener('click', () => cancelOperation());

  // Add event listener for adding new activity
  document.getElementById('addActivityBtn').addEventListener('click', () => startNewSession());

  // Add event listener for logging manual event
  document.getElementById('manualEventBtn').addEventListener('click', () => displayManualEventForm(startTime));
}

// Function to start the timer
function startTimer(startTime) {
  // Hide the start timer button
  document.getElementById('startTimerBtn').style.display = 'none';

  // Show the stop timer button
  document.getElementById('stopTimerBtn').style.display = 'inline-block';

  // Update interface or perform any other actions related to starting the timer
}

// Function to stop the timer and log activity
function stopTimer(startTime) {
  // Get current timestamp for session end time
  const endTime = new Date().getTime();
  
  // Calculate duration in seconds
  const duration = (endTime - startTime) / 1000;

  // Get activity description from input field
  const activityDescription = document.getElementById('activityDescription').value;

  // Create session object
  const session = {
      startTime: startTime,
      endTime: endTime,
      duration: duration,
      activityDescription: activityDescription
  };

  // Retrieve existing session data from localStorage or create empty array
  let sessionData = JSON.parse(localStorage.getItem('sessionData')) || [];

  // Add current session to session data
  sessionData.push(session);

  // Save updated session data to localStorage
  localStorage.setItem('sessionData', JSON.stringify(sessionData));

  // Display session view with updated session data
  displaySessionView(sessionData);
}

function cancelOperation() {
  const sessionData = JSON.parse(localStorage.getItem('sessionData'));
  if (!sessionData || sessionData.length === 0) {
      displayDefaultView();
  } else {
      displaySessionView(sessionData);
  }
}

function displaySessionView(sessionData) {
  // Clear main content
  document.querySelector('main').innerHTML = `
  <div class="sessionlogs">
  <h2>Session Logs</h2>
  <ul id="logsList">
      <!-- Session logs will be dynamically added here -->
  </ul>
  <div class="allbtn">

  <button id="summaryBtn">View Summary</button>
  <button id="addActivityBtn">Add New Activity</button>
  <button id="resetBtn">Reset</button>
  <button id="manualEventBtn" class="manualbutton2">Log Manual Event</button>
  </div>
  </div>
  `;

  // Display each session log
  const logsList = document.getElementById('logsList');
  sessionData.forEach(session => {
      const logItem = document.createElement('li');
      logItem.innerHTML = `<div class="task_item"><p ><b class="task_heading">Activity : </b>${session.activityDescription}</p><p><b class="task_heading">Duration :</b> ${session.duration} seconds</p> </div> `
      
      logsList.appendChild(logItem);
  });

  // Add event listener for summary button
  document.getElementById('summaryBtn').addEventListener('click', displaySummaryChart);

  // Add event listener for "Add New Activity" button
  document.getElementById('addActivityBtn').addEventListener('click', startNewSession);

  // Add event listener for "Log Manual Event" button
  document.getElementById('manualEventBtn').addEventListener('click', () => displayManualEventForm(new Date().getTime()));

  // Add event listener for reset button
  document.getElementById('resetBtn').addEventListener('click', resetData);
}

// Function to display the manual event logging form
function displayManualEventForm(startTime) {
  // Clear main content
  document.querySelector('main').innerHTML = `
  <form>
  <h2>Manual Event Logging</h2>
      <label for="startDate">Start Date:</label>
      <input type="datetime-local" id="startDate" required><br>
      <label for="endDate">End Date:</label>
      <input type="datetime-local" id="endDate" required><br>
      <input type="text" id="manualActivityDescription" placeholder="Enter task description">
      <button id="logManualEventBtn">Log Event</button>
      <button id="cancelBtn">Cancel</button>
      </form>
  `;

  // Add event listener for manual event logging
  document.getElementById('logManualEventBtn').addEventListener('click', () => logManualEvent(startTime));

  // Add event listener for cancelling
  document.getElementById('cancelBtn').addEventListener('click', () => cancelOperation());
}

// Function to log a manual event
function logManualEvent(startTime) {
  // Get start date and end date from input fields
  const startDate = new Date(document.getElementById('startDate').value).getTime();
  const endDate = new Date(document.getElementById('endDate').value).getTime();

  // Check if start date is greater than end date
  if (startDate > endDate) {
      alert("Kindly select dates properly and Try again!");
      return;
  }
  
  // Calculate duration in seconds
  const duration = (endDate - startDate) / 1000;

  // Get activity description from input field
  const activityDescription = document.getElementById('manualActivityDescription').value;

  // Create session object
  const session = {
      startTime: startDate,
      endTime: endDate,
      duration: duration,
      activityDescription: activityDescription
  };

  // Retrieve existing session data from localStorage or create empty array
  let sessionData = JSON.parse(localStorage.getItem('sessionData')) || [];

  // Add current session to session data
  sessionData.push(session);

  // Save updated session data to localStorage
  localStorage.setItem('sessionData', JSON.stringify(sessionData));

  // Display session view with updated session data
  displaySessionView(sessionData);
}

function displaySummaryChart() {
  // Retrieve existing session data from localStorage
  const sessionData = JSON.parse(localStorage.getItem('sessionData')) || [];

  // Prepare data for the chart
  const activityDurations = {};
  sessionData.forEach(session => {
      if (activityDurations[session.activityDescription]) {
          activityDurations[session.activityDescription] += session.duration;
      } else {
          activityDurations[session.activityDescription] = session.duration;
      }
  });

  // Extract activity names and durations for chart
  const activityNames = Object.keys(activityDurations);
  const durations = Object.values(activityDurations);

  // Dropdown list for selecting duration unit
  const select = document.createElement('select');
  select.innerHTML = `
      <option value="seconds">Seconds</option>
      <option value="minutes">Minutes</option>
      <option value="hours">Hours</option>
      <option value="days">Days</option>
      <option value="weeks">Weeks</option>
      <option value="months">Months</option>
      <option value="years">Years</option>
  `;
  document.querySelector('main').appendChild(select);

  // Display summary chart
  const ctx = document.createElement('canvas');
  ctx.id = 'summaryChart';
  document.querySelector('main').appendChild(ctx);

  const summaryChart = new Chart(ctx, {
      type: 'bar',
          data: {
              labels: activityNames, // Use activity names as labels
              datasets: [{
                  label: 'Duration',
                  data: durations, // Use duration_time as data points
                  backgroundColor: 'dodgerblue',
                  opacity : 0.5,
                  borderColor: '#ffd401',
                  borderWidth: 'bold',
                  color:'white'
              }]
          },
          options: {
              scales: {
                  y: {
                      beginAtZero: true,
                      title: {
                          display: true,
                          text: 'Duration (seconds)', // Add Y-axis title
                          color:'cyan',
                      },
                      ticks: {
                          color: 'cyan',
                          fontWeight: 'bold',
                          fontSize: 12 // Adjust font size for readability
                      }
                  },
                  x: {
                      title: {
                          display: true,
                          text: 'Activity', // Add X-axis title
                          color:'cyan'
                      },
                  ticks: {
                          color: 'cyan',
                          fontWeight: 'bold',
                          fontSize: 12 // Adjust font size for readability
                      }
                  }
              }
          }
  });

  // Event listener for dropdown change
  select.addEventListener('change', function() {
      const selectedUnit = this.value;
      // Update y-axis title based on selected unit
      summaryChart.options.scales.y.title.text = `Duration (${selectedUnit})`;

      // Convert durations to the selected unit if necessary
      let updatedData = durations; // Default to current data
      if (selectedUnit === 'minutes') {
          updatedData = durations.map(duration => duration / 60); // Convert to minutes
      } else if (selectedUnit === 'hours') {
          updatedData = durations.map(duration => duration / 3600); // Convert to hours
      } else if (selectedUnit === 'days') {
          updatedData = durations.map(duration => duration / (3600 * 24)); // Convert to days
      } else if (selectedUnit === 'weeks') {
          updatedData = durations.map(duration => duration / (3600 * 24 * 7)); // Convert to weeks
      } else if (selectedUnit === 'months') {
          updatedData = durations.map(duration => duration / (3600 * 24 * 30)); // Approximate months as 30 days
      } else if (selectedUnit === 'years') {
          updatedData = durations.map(duration => duration / (3600 * 24 * 365)); // Approximate years as 365 days
      }

      // Update the chart with the new data
      summaryChart.data.datasets[0].data = updatedData;
      summaryChart.update();
  });
}


// Function to reset all data
function resetData() {
  localStorage.removeItem('sessionData');
   // After removing data, display the default view
   displayDefaultView();
}

// Initialize the application
init();
