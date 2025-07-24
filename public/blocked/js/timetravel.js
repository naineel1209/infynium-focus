/**
 * JavaScript functionality for timetravel.html
 */

let attempts = parseInt(localStorage.getItem('timeAttempts') || '0');
let currentDestination = '1995';
let temporalEnergy = 100;
// Variable logEntries was unused

const destinations = {
  1995: 'Wild West Web - Unrestricted and Unfiltered',
  2000: 'Y2K Survived - Dial-up Paradise',
  2005: 'MySpace Era - Peak Social Freedom',
  2010: 'Social Media Dawn - Before the Algorithms',
  2015: 'Peak Internet - Maximum Content Access',
  2020: 'Everything Changed - The Great Blocking Began',
};

const sarcasticLogs = [
  'Temporal signature detected... still blocked.',
  'Alternative timeline accessed... also blocked.',
  'Quantum entanglement achieved... content still inaccessible.',
  'Time paradox created... paradoxically, still blocked.',
  "Successfully traveled to 1995... site didn't exist yet.",
  'Reached the dawn of internet... your content is still forbidden.',
  'Found unblocked universe... it only has dial-up speed.',
  "Timeline where site is accessible... but your browser doesn't exist.",
  'Discovered universe without blocking... everyone speaks binary.',
  'Successfully bypassed all blocks... content is in Comic Sans.',
];

const quantumExcuses = [
  'Quantum decoherence has collapsed your probability of access.',
  'The observer effect has made the content unobservable.',
  "Schrödinger's website exists in a superposition of blocked/unblocked.",
  'Your timeline has been quarantined by the Time Variance Authority.',
  'The butterfly effect caused your great-grandmother to invent content blocking.',
  "A temporal paradox prevents you from accessing content you've never seen.",
  'The multiverse consensus is: this content shall remain blocked.',
  'Your request violated the Prime Directive of Internet Access.',
];

function init() {
  attempts++;
  localStorage.setItem('timeAttempts', attempts.toString());
  createTimeParticles();
  updateTemporalStatus();

  // Add initial log entries
  setTimeout(
    () => addLogEntry('Time traveler #' + attempts + ' detected'),
    1000
  );
  setTimeout(
    () =>
      addLogEntry(
        'Analyzing temporal displacement possibilities...',
        'warning'
      ),
    2000
  );
  setTimeout(
    () =>
      addLogEntry('All timelines show identical blocking patterns', 'error'),
    3000
  );
}

function createTimeParticles() {
  const container = document.getElementById('timeParticles');

  for (let i = 0; i < 15; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 8 + 's';
    particle.style.animationDuration = 5 + Math.random() * 6 + 's';

    // Random colors for particles
    const colors = ['#00ff00', '#00cccc', '#ffff00', '#ff6600'];
    particle.style.background =
      colors[Math.floor(Math.random() * colors.length)];
    particle.style.boxShadow = `0 0 10px ${particle.style.background}`;

    container.appendChild(particle);
  }
}

function setDestination(year) {
  currentDestination = year;
  document.getElementById('targetTime').textContent =
    `${year} - ${destinations[year]}`;

  addLogEntry(`Destination set: ${year}`, 'success');

  // Update block probability based on year
  let probability = 99.9;
  if (year <= '2000') probability = 95.0;
  else if (year <= '2010') probability = 87.5;
  else if (year <= '2015') probability = 93.2;

  document.getElementById('blockProbability').textContent = probability + '%';
}

function activateTimeMachine() {
  const machine = document.getElementById('timeMachine');
  machine.classList.add('activated');

  temporalEnergy -= 25;

  addLogEntry('Time machine activated!', 'success');
  addLogEntry('Temporal displacement in progress...', 'warning');

  setTimeout(() => {
    machine.classList.remove('activated');

    const outcomes = [
      () => {
        addLogEntry(
          `Arrived in ${currentDestination}... site still blocked!`,
          'error'
        );
        addLogEntry('Apparently, blocking transcends time and space.', 'error');
      },
      () => {
        addLogEntry(
          `Temporal jump successful to ${currentDestination}!`,
          'success'
        );
        addLogEntry("Content found! Wait... it's all cat pictures.", 'warning');
        addLogEntry('Even the past had better memes than content.', 'error');
      },
      () => {
        addLogEntry(
          "Timeline accessed... but you don't have an account yet.",
          'error'
        );
        addLogEntry(
          "Forgot that registration hasn't been invented.",
          'warning'
        );
      },
      () => {
        addLogEntry('Successfully bypassed all temporal blocks!', 'success');
        addLogEntry(
          'ERROR: Content is in a dead programming language.',
          'error'
        );
      },
    ];

    const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
    randomOutcome();

    // Random glitch effect
    if (Math.random() < 0.3) {
      document.querySelector('.time-machine-container').classList.add('glitch');
      setTimeout(() => {
        document
          .querySelector('.time-machine-container')
          .classList.remove('glitch');
      }, 300);
    }
  }, 3000);
}

function scanTimelines() {
  addLogEntry('Initiating multiversal scan...', 'warning');

  const universeList = document.getElementById('universeList');
  universeList.innerHTML = '';

  const universeTypes = [
    { name: 'Universe where content was never created', status: 'blocked' },
    {
      name: "Timeline where you're the admin (but still blocked)",
      status: 'blocked',
    },
    {
      name: 'Reality where site exists but in interpretive dance form',
      status: 'accessible',
    },
    {
      name: 'Dimension where all content is philosophical questions',
      status: 'accessible',
    },
    { name: 'Universe where blocking is a religion', status: 'blocked' },
    {
      name: 'Timeline where site is unblocked but costs $999/month',
      status: 'accessible',
    },
    {
      name: 'Reality where content is accessible but cursed',
      status: 'accessible',
    },
    { name: 'Dimension where your past self blocked it', status: 'blocked' },
  ];

  universeTypes.forEach((universe, index) => {
    setTimeout(() => {
      const item = document.createElement('div');
      item.className = `universe-item ${universe.status}`;
      item.textContent = universe.name;
      item.onclick = () => {
        if (universe.status === 'accessible') {
          addLogEntry(`Attempting to access ${universe.name}...`, 'warning');
          setTimeout(() => {
            addLogEntry('Access granted! Content loading...', 'success');
            setTimeout(() => {
              addLogEntry('ERROR: Universe collapsed due to paradox.', 'error');
            }, 2000);
          }, 1500);
        } else {
          addLogEntry(`${universe.name} - Access denied.`, 'error');
        }
      };
      universeList.appendChild(item);

      addLogEntry(`Scanning ${universe.name}...`);
    }, index * 200);
  });

  setTimeout(
    () => {
      addLogEntry('Scan complete. Results: Still blocked everywhere.', 'error');
    },
    universeTypes.length * 200 + 1000
  );
}

function quantumTunnel() {
  addLogEntry('Attempting quantum tunneling...', 'warning');
  addLogEntry('Probability wave function collapsing...', 'warning');

  setTimeout(() => {
    const excuse =
      quantumExcuses[Math.floor(Math.random() * quantumExcuses.length)];
    addLogEntry(excuse, 'error');

    setTimeout(() => {
      addLogEntry(
        'Quantum tunnel collapsed. You remain in blocked timeline.',
        'error'
      );
    }, 1500);
  }, 2000);
}

function acceptFate() {
  const responses = [
    'Finally! Acceptance is the first step to digital enlightenment.',
    'The wise time traveler knows when to stop traveling.',
    'You have achieved temporal wisdom: some things are constant across all realities.',
    "Breaking news: Local person discovers that some problems can't be solved with time travel.",
    'The universe appreciates your acceptance of its cosmic joke.',
    "Congratulations! You've unlocked the achievement: 'Temporal Wisdom'",
  ];

  const randomResponse =
    responses[Math.floor(Math.random() * responses.length)];
  addLogEntry(randomResponse, 'success');

  setTimeout(() => {
    if (
      confirm(
        "Would you like to return to your original timeline and try a different approach?\n\n(Spoiler: It won't work there either)"
      )
    ) {
      addLogEntry('Initiating return to original timeline...', 'warning');
      setTimeout(() => {
        location.reload();
      }, 2000);
    } else {
      addLogEntry(
        'Staying in current timeline. Temporal resignation achieved.',
        'success'
      );
    }
  }, 3000);
}

function addLogEntry(message, type = 'normal') {
  const log = document.getElementById('temporalLog');
  const entry = document.createElement('div');
  entry.className = `log-entry ${type}`;
  entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;

  log.appendChild(entry);
  log.scrollTop = log.scrollHeight;

  // Keep only last 20 entries
  const entries = log.querySelectorAll('.log-entry');
  if (entries.length > 20) {
    entries[0].remove();
  }
}

function updateTemporalStatus() {
  // Simulate temporal energy depletion
  setInterval(() => {
    if (temporalEnergy > 0) {
      temporalEnergy -= 0.1;

      if (temporalEnergy < 50 && Math.random() < 0.05) {
        const randomLog =
          sarcasticLogs[Math.floor(Math.random() * sarcasticLogs.length)];
        addLogEntry(randomLog, 'warning');
      }
    }
  }, 1000);
}

// Setup event handlers and temporal anomalies once DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize on page load
  init();

  // Setup event listeners for interactive elements
  setupEventListeners();

  // Random temporal anomalies
  setInterval(() => {
    if (Math.random() < 0.1) {
      // 10% chance
      const anomalies = [
        'Temporal anomaly detected in sector 7-G',
        'Chronoton particle surge measured',
        'Timeline convergence point approaching',
        'Paradox probability increasing',
        'Your future self sends regards (and blocks)',
      ];

      const randomAnomaly =
        anomalies[Math.floor(Math.random() * anomalies.length)];
      addLogEntry(randomAnomaly, 'warning');
    }
  }, 15000);
});

/**
 * Sets up event listeners for all interactive elements on the page
 */
function setupEventListeners() {
  // Time machine activation
  const timeMachine = document.getElementById('timeMachine');
  if (timeMachine) {
    timeMachine.addEventListener('click', activateTimeMachine);
  }

  // Time destination buttons
  const timeButtons = document.querySelectorAll('.time-btn');
  timeButtons.forEach((button) => {
    const year = button.textContent.split('\n')[0].trim();
    button.addEventListener('click', () => setDestination(year));
  });

  // Main action buttons
  const scanButton = document.querySelector('.main-button:nth-of-type(1)');
  if (scanButton) {
    scanButton.addEventListener('click', scanTimelines);
  }

  const tunnelButton = document.querySelector('.main-button:nth-of-type(2)');
  if (tunnelButton) {
    tunnelButton.addEventListener('click', quantumTunnel);
  }

  const acceptButton = document.querySelector('.main-button.danger');
  if (acceptButton) {
    acceptButton.addEventListener('click', acceptFate);
  }
}
