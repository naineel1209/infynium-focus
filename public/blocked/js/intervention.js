/**
 * JavaScript functionality for intervention.html
 */

let attempts = parseInt(localStorage.getItem('interventionAttempts') || '0');
let meditationActive = false;
let meditationTimer = null;
let meditationTime = 0;

const adviceMessages = [
  "Perhaps it's time to embrace the art of... not doing that thing you're trying to do.",
  'I see your chakras are aligned with procrastination today.',
  'The universe is telling you to find a hobby. Preferably offline.',
  'Your persistence is admirable, but so is knowing when to give up.',
  'Have you considered that maybe, just maybe, you have a problem?',
  "I'm sensing some deep-seated issues with authority. And productivity.",
  'The blocked website is just a metaphor for your blocked potential.',
  "Let's redirect this energy into something... literally anything else.",
  'Your dedication to distraction is truly inspiring.',
  "I'm not saying you're addicted, but... actually, I am saying that.",
];

const motivationalQuotes = [
  "You miss 100% of the shots you don't take... at being productive.",
  'The best time to plant a tree was 20 years ago. The second best time is... not while trying to access blocked sites.',
  'Be yourself; everyone else is already being more productive than you.',
  'Success is 1% inspiration, 99% not getting distracted by blocked websites.',
  'The only way to do great work is to... actually do work. Novel concept, right?',
  'Innovation distinguishes between a leader and someone repeatedly hitting refresh.',
  "Stay hungry, stay foolish, but maybe don't stay blocked.",
  'The future belongs to those who can function without constant digital stimulation.',
];

const productivityTips = [
  '📚 Read a chapter of a book',
  '🚶‍♂️ Take a 10-minute walk',
  '💧 Drink a glass of water',
  '🎨 Draw something (even a stick figure)',
  '📝 Write in a journal',
  '🧘‍♂️ Practice deep breathing',
  '🌱 Water a plant',
  '📞 Text a friend',
  '🎵 Listen to a podcast',
  '🧹 Clean one small area',
];

function init() {
  attempts++;
  localStorage.setItem('interventionAttempts', attempts.toString());
  updateCalculator();
  createFloatingIcons();

  // Show escalating concern based on attempts
  if (attempts > 5) {
    document.getElementById('adviceText').textContent =
      "Okay, now I'm genuinely concerned about you.";
  } else if (attempts > 10) {
    document.getElementById('adviceText').textContent =
      'This is an intervention. We need to talk.';
  }
}

function updateCalculator() {
  const wastedMinutes = attempts * 2;
  document.getElementById('wastedTime').textContent =
    `${wastedMinutes} minutes`;
  document.getElementById('booksCount').textContent = Math.floor(
    wastedMinutes / 30
  );
  document.getElementById('stepsCount').textContent = wastedMinutes * 10;
  document.getElementById('skillsCount').textContent = Math.floor(
    wastedMinutes / 60
  );

  const levels = [
    'Novice Procrastinator',
    'Skilled Avoider',
    'Expert Distractor',
    'Master Time-Waster',
    'Legendary Procrastinator',
    'Transcendent Slacker',
  ];
  const level = Math.min(Math.floor(attempts / 3), levels.length - 1);
  document.getElementById('productivityLevel').textContent = levels[level];
}

function createFloatingIcons() {
  const icons = ['📚', '💪', '🧘‍♂️', '🌱', '⏰', '🎯', '🏃‍♂️', '🧠', '💡', '🌟'];
  const container = document.getElementById('floatingIcons');

  for (let i = 0; i < 15; i++) {
    const icon = document.createElement('div');
    icon.className = 'floating-icon';
    icon.textContent = icons[Math.floor(Math.random() * icons.length)];
    icon.style.left = Math.random() * 100 + '%';
    icon.style.animationDelay = Math.random() * 10 + 's';
    icon.style.animationDuration = 10 + Math.random() * 10 + 's';
    container.appendChild(icon);
  }
}

function getAdvice() {
  const randomAdvice =
    adviceMessages[Math.floor(Math.random() * adviceMessages.length)];
  document.getElementById('adviceText').textContent = randomAdvice;

  // Animate guru
  const guru = document.querySelector('.guru');
  guru.style.transform = 'rotate(360deg) scale(1.2)';
  setTimeout(() => {
    guru.style.transform = '';
  }, 500);
}

function toggleChecklist(item) {
  const checkbox = item.querySelector('.checkbox');
  const isCompleted = item.classList.contains('completed');

  if (isCompleted) {
    checkbox.textContent = '☐';
    item.classList.remove('completed');
  } else {
    checkbox.textContent = '✅';
    item.classList.add('completed');
  }
}

function startMeditation() {
  if (meditationActive) return;

  meditationActive = true;
  meditationTime = 0;

  const button = event.target;
  button.textContent = '🧘‍♂️ Meditating...';
  button.disabled = true;

  meditationTimer = setInterval(() => {
    meditationTime++;
    const minutes = Math.floor(meditationTime / 60);
    const seconds = meditationTime % 60;
    document.getElementById('timerDisplay').textContent =
      `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    if (meditationTime >= 30) {
      // 30 seconds of "meditation"
      clearInterval(meditationTimer);
      button.textContent = '🧘‍♂️ Enlightenment Achieved!';
      button.disabled = false;
      meditationActive = false;

      setTimeout(() => {
        button.textContent = '🧘‍♂️ Start Forced Meditation';
      }, 3000);
    }
  }, 1000);
}

function getMotivation() {
  const randomQuote =
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
  document.getElementById('adviceText').textContent = randomQuote;
}

function tryAgain() {
  const responses = [
    "Really? REALLY? Fine, but I'm judging you.",
    "At this point, I'm genuinely impressed by your stubbornness.",
    'You know what? I give up. You win.',
    'This is the definition of insanity, my friend.',
    "I'm adding this to your permanent record.",
    'Your ancestors are disappointed in you right now.',
  ];

  const randomResponse =
    responses[Math.floor(Math.random() * responses.length)];
  document.getElementById('adviceText').textContent = randomResponse;

  setTimeout(() => {
    location.reload();
  }, 2000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  init();
  setupEventListeners();
});

/**
 * Setup all event listeners instead of using inline onclick attributes
 */
function setupEventListeners() {
  // Guru
  const guru = document.querySelector('.guru');
  if (guru) {
    guru.addEventListener('click', getAdvice);
  }

  // Checklist items
  const checklistItems = document.querySelectorAll('.checklist-item');
  checklistItems.forEach((item) => {
    item.addEventListener('click', function () {
      toggleChecklist(this);
    });
  });

  // Buttons
  const buttons = document.querySelectorAll('.button');
  buttons.forEach((button) => {
    const buttonText = button.textContent.trim();
    if (buttonText.includes('Start Forced Meditation')) {
      button.addEventListener('click', startMeditation);
    } else if (buttonText.includes('Get Motivational Quote')) {
      button.addEventListener('click', getMotivation);
    } else if (buttonText.includes('Try Blocked Site Again')) {
      button.addEventListener('click', tryAgain);
    }
  });
}
