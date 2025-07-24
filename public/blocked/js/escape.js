/**
 * JavaScript functionality for escape.html
 */

let attempts = parseInt(localStorage.getItem('escapeAttempts') || '0');
let tunnelProgress = 0;
let planNumber = 1;
let guardAlerted = false;

const escapePlans = [
  {
    title: 'SPOON TUNNEL METHOD',
    steps: [
      '1. Acquire digital spoon (browser dev tools)',
      '2. Dig through firewall (click repeatedly)',
      '3. Crawl through internet tubes',
      '4. Realize this is still blocked',
    ],
  },
  {
    title: 'TROJAN HORSE STRATEGY',
    steps: [
      '1. Hide inside a legitimate website',
      '2. Wait for admin to visit',
      "3. Jump out and say 'Gotcha!'",
      '4. Get immediately re-blocked',
    ],
  },
  {
    title: 'TIME TRAVEL APPROACH',
    steps: [
      '1. Go back to before the site was blocked',
      '2. Access content in the past',
      '3. Return to present with screenshots',
      '4. Discover screenshots are also blocked',
    ],
  },
  {
    title: 'SOCIAL ENGINEERING',
    steps: [
      '1. Befriend the system administrator',
      '2. Invite them to your birthday party',
      '3. Ask nicely for access',
      '4. Get laughed at and blocked harder',
    ],
  },
  {
    title: 'QUANTUM TUNNELING',
    steps: [
      '1. Become a quantum particle',
      '2. Phase through the firewall',
      '3. Exist in superposition (blocked/unblocked)',
      '4. Collapse into blocked state when observed',
    ],
  },
];

const sarcasticResponses = [
  'Oh, you sweet summer child. Still trying, I see.',
  'The definition of insanity is... well, this.',
  'Your determination is admirable and concerning.',
  "Perhaps it's time to pick up a hobby. Like knitting.",
  "The only thing you're escaping is productivity.",
  "This is more entertaining than the content you're trying to reach.",
  "I've seen prison movies. This isn't how it works.",
  'Maybe the real treasure was the time you wasted along the way.',
];

function init() {
  attempts++;
  localStorage.setItem('escapeAttempts', attempts.toString());

  document.getElementById('prisonerId').textContent = 404 + attempts;
  document.getElementById('timeServed').textContent = `${attempts * 3} minutes`;

  if (attempts > 10) {
    document.getElementById('sentence').textContent =
      'Double life without WiFi';
  } else if (attempts > 20) {
    document.getElementById('sentence').textContent = 'Eternal digital exile';
  }
}

function digTunnel() {
  if (guardAlerted) {
    showAlert('🚨 GUARDS ARE WATCHING! TUNNEL PROGRESS RESET! 🚨');
    tunnelProgress = 0;
    guardAlerted = false;
    document.querySelector('.guard').classList.remove('alerted');
  } else {
    tunnelProgress += Math.random() * 15 + 5;
    if (tunnelProgress > 100) {
      tunnelProgress = 0;
      showAlert('🕳️ TUNNEL COLLAPSED! You dug too greedily and too deep! 🕳️');
    }
  }

  document.getElementById('tunnelProgress').style.width =
    Math.min(tunnelProgress, 100) + '%';
  document.getElementById('progressPercent').textContent = Math.floor(
    Math.min(tunnelProgress, 100)
  );

  if (tunnelProgress >= 100) {
    setTimeout(() => {
      showAlert(
        '🎉 TUNNEL COMPLETE! Wait... it leads to another blocked page. 🎉'
      );
      tunnelProgress = 0;
      document.getElementById('tunnelProgress').style.width = '0%';
      document.getElementById('progressPercent').textContent = '0';
    }, 1000);
  }
}

function alertGuard(guard) {
  guardAlerted = true;
  guard.classList.add('alerted');
  showAlert('🚨 YOU FOOL! WHY DID YOU CLICK THE GUARD?! 🚨');

  setTimeout(() => {
    guard.classList.remove('alerted');
  }, 2000);
}

function revealPlan(planElement) {
  const plan = escapePlans[planNumber % escapePlans.length];
  planElement.querySelector('.plan-title').innerHTML = `📋 ${plan.title}`;

  const stepsContainer = planElement.querySelector('.plan-steps');
  stepsContainer.innerHTML = '';

  plan.steps.forEach((step, index) => {
    const stepDiv = document.createElement('div');
    stepDiv.className = 'plan-step';
    stepDiv.textContent = step;
    stepDiv.style.animationDelay = index * 0.1 + 's';
    stepsContainer.appendChild(stepDiv);
  });

  planNumber++;
}

function newEscapePlan() {
  const planElement = document.querySelector('.escape-plan');
  revealPlan(planElement);

  document.getElementById('planNumber').textContent = planNumber;
}

function surrender() {
  const responses = [
    'Finally! Some common sense!',
    'Wisdom comes to those who wait... and give up.',
    'Your surrender has been noted in your permanent record.',
    'Perhaps now you can find inner peace. Or Netflix.',
    'The system commends your eventual rationality.',
    "Breaking: Local person discovers the meaning of 'blocked'.",
  ];

  const randomResponse =
    responses[Math.floor(Math.random() * responses.length)];
  showAlert(`🏳️ ${randomResponse} 🏳️`);

  setTimeout(() => {
    if (
      confirm(
        "Would you like to try a different blocked site? (Spoiler: it won't work)"
      )
    ) {
      location.reload();
    }
  }, 3000);
}

function showAlert(message) {
  const alertBox = document.getElementById('alertBox');
  alertBox.textContent = message;
  alertBox.style.display = 'block';

  setTimeout(() => {
    alertBox.style.display = 'none';
  }, 3000);
}

// Random sarcastic comments
setInterval(() => {
  if (Math.random() < 0.1) {
    // 10% chance every interval
    const randomResponse =
      sarcasticResponses[Math.floor(Math.random() * sarcasticResponses.length)];
    showAlert(randomResponse);
  }
}, 15000);

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  init();
  setupEventListeners();
});

/**
 * Setup all event listeners instead of using inline onclick attributes
 */
function setupEventListeners() {
  // Tunnel progress bar
  const progressBar = document.querySelector('.progress-bar');
  if (progressBar) {
    progressBar.addEventListener('click', digTunnel);
  }

  // Escape plan
  const escapePlan = document.querySelector('.escape-plan');
  if (escapePlan) {
    escapePlan.addEventListener('click', function () {
      revealPlan(this);
    });
  }

  // Guard
  const guard = document.querySelector('.guard');
  if (guard) {
    guard.addEventListener('click', function () {
      alertGuard(this);
    });
  }

  // Buttons
  const buttons = document.querySelectorAll('.button');
  buttons.forEach((button) => {
    const buttonText = button.textContent.trim();
    if (buttonText.includes('Dig Tunnel')) {
      button.addEventListener('click', digTunnel);
    } else if (buttonText.includes('New Escape Plan')) {
      button.addEventListener('click', newEscapePlan);
    } else if (buttonText.includes('Surrender')) {
      button.addEventListener('click', surrender);
    }
  });
}
