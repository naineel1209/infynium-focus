/**
 * JavaScript functionality for spa.html
 */

let enlightenmentLevel = 0;
let mindfulnessCount = parseInt(
  localStorage.getItem('mindfulnessCount') || '0'
);
let completedActivities = parseInt(
  localStorage.getItem('completedActivities') || '0'
);
let visits = parseInt(localStorage.getItem('spaVisits') || '0');
let startTime = Date.now();
let activeSound = null;

const zenQuotes = [
  'The blocked website is not lost; it was never there to begin with. Only your attachment to it exists.',
  'In the emptiness of a 404 error, find the fullness of present moment awareness.',
  'The wise person does not seek what is blocked, but finds joy in what is freely available.',
  'Like a river that cannot flow uphill, accept the natural boundaries of the digital realm.',
  'The content you seek outside yourself is merely a reflection of the void within.',
  'To be blocked is to be invited to look elsewhere for fulfillment.',
  'The URL may be unreachable, but your peace of mind need not be.',
  'In digital detox, we discover our true offline nature.',
  'The firewall is not your enemy; it is your teacher.',
  'When one door closes (or gets blocked), the universe opens a book instead.',
];

const wisdomMessages = [
  '🌸 Digital wellness wisdom: Your worth is not measured by your browsing history.',
  '🧘‍♀️ Remember: The most important content is the content of your character.',
  "🌱 Growth tip: Let your attention bloom where you plant it, not where it's blocked.",
  "☯️ Balance insight: For every blocked site, there's an unblocked opportunity for growth.",
  '🕯️ Mindfulness moment: Notice the urge to access, then let it pass like a cloud.',
  '🌟 Enlightenment flash: You are complete without any external digital validation.',
  '🦋 Transformation note: From digital caterpillar to analog butterfly.',
  '🏔️ Peak wisdom: The highest peaks are reached by those who stop refreshing the page.',
];

const wellnessLevels = [
  'Digitally Dependent',
  'Seeking Balance',
  'Mindfully Aware',
  'Moderately Enlightened',
  'Zen Master',
  'Transcended Being',
];

function init() {
  visits++;
  localStorage.setItem('spaVisits', visits.toString());
  updateStats();
  createLotusFlowers();
  updateMilestones();

  // Update enlightenment based on stored progress
  enlightenmentLevel = Math.min(
    95,
    mindfulnessCount * 10 + completedActivities * 5 + visits * 2
  );
  updateEnlightenmentLevel();
}

function createLotusFlowers() {
  const container = document.getElementById('floatingElements');
  const flowers = ['🪷', '🌸', '🌺', '🌻', '🌷'];

  for (let i = 0; i < 8; i++) {
    const lotus = document.createElement('div');
    lotus.className = 'lotus';
    lotus.textContent = flowers[Math.floor(Math.random() * flowers.length)];
    lotus.style.left = Math.random() * 100 + '%';
    lotus.style.top = Math.random() * 100 + '%';
    lotus.style.animationDelay = Math.random() * 15 + 's';
    lotus.style.animationDuration = 10 + Math.random() * 10 + 's';
    lotus.onclick = () => {
      lotus.style.transform = 'scale(1.5) rotate(360deg)';
      showNotification('🌸 Lotus flower blessed your journey! 🌸');
      setTimeout(() => {
        lotus.style.transform = '';
      }, 1000);
    };
    container.appendChild(lotus);
  }
}

function startBreathing() {
  const circle = document.getElementById('breathingCircle');
  const text = document.querySelector('.breathing-text');

  circle.classList.add('breathing');
  text.textContent = 'Breathe In...';

  setTimeout(() => {
    text.textContent = 'Hold...';
  }, 2000);

  setTimeout(() => {
    text.textContent = 'Breathe Out...';
  }, 4000);

  setTimeout(() => {
    text.textContent = 'Well Done!';
    mindfulnessCount++;
    localStorage.setItem('mindfulnessCount', mindfulnessCount.toString());
    updateStats();
    updateEnlightenmentLevel();
    updateMilestones();
    showNotification('🧘‍♀️ Mindfulness session completed! Inner peace +1');

    setTimeout(() => {
      circle.classList.remove('breathing');
      text.textContent = 'Click to Breathe';
    }, 1000);
  }, 6000);
}

function playSound(button, icon) {
  // Reset all buttons
  document.querySelectorAll('.sound-btn').forEach((btn) => {
    btn.classList.remove('active');
  });

  if (activeSound === icon) {
    activeSound = null;
    showNotification('🔇 Sound stopped. Returning to natural silence.');
  } else {
    button.classList.add('active');
    activeSound = icon;

    const soundMessages = {
      '🌊': 'Peaceful ocean waves washing away your digital stress...',
      '🌧️': 'Gentle rain cleansing your mind of blocked content desires...',
      '🐦': 'Birds singing the song of offline freedom...',
      '📻': 'The nostalgic sound of patience in the dial-up era...',
      '📞': 'Windows XP startup - a simpler time when not everything was blocked...',
    };

    showNotification(`🔊 ${soundMessages[icon]}`);
  }
}

function completeActivity(card) {
  if (!card.classList.contains('completed')) {
    card.classList.add('completed');
    completedActivities++;
    localStorage.setItem('completedActivities', completedActivities.toString());

    const title = card.querySelector('.activity-title').textContent;
    showNotification(`✨ ${title} completed! Your wellness grows stronger.`);

    updateStats();
    updateEnlightenmentLevel();
    updateMilestones();
  }
}

function generateWisdom() {
  const randomWisdom =
    wisdomMessages[Math.floor(Math.random() * wisdomMessages.length)];
  showNotification(randomWisdom);

  // Also update the zen quote
  const randomQuote = zenQuotes[Math.floor(Math.random() * zenQuotes.length)];
  document.getElementById('zenQuote').textContent = randomQuote;
}

function checkProgress() {
  enlightenmentLevel += 5;
  updateEnlightenmentLevel();
  updateMilestones();

  if (enlightenmentLevel >= 100) {
    showNotification(
      '🏆 CONGRATULATIONS! You have achieved digital enlightenment! The blocked content no longer controls you!'
    );
  } else if (enlightenmentLevel >= 80) {
    showNotification(
      '🌟 You are very close to digital enlightenment! Your wisdom shines bright.'
    );
  } else if (enlightenmentLevel >= 50) {
    showNotification(
      '🧘‍♀️ Your journey progresses well. The path becomes clearer.'
    );
  } else {
    showNotification(
      '🌱 Every step forward is progress. Continue your practice.'
    );
  }
}

function relapse() {
  const warnings = [
    'Are you sure? You were making such beautiful progress...',
    'The digital darkness calls, but you are stronger than this urge.',
    'Remember: True happiness comes from within, not from blocked websites.',
    'This is a test of your enlightenment. Choose wisely.',
    'Your future self will thank you for resisting this temptation.',
  ];

  const randomWarning = warnings[Math.floor(Math.random() * warnings.length)];

  if (
    confirm(
      randomWarning +
        '\n\nDo you really want to abandon your spiritual journey?'
    )
  ) {
    showNotification(
      '😔 Your digital wellness level has decreased. But remember, every master has fallen before rising again.'
    );
    enlightenmentLevel = Math.max(0, enlightenmentLevel - 20);
    updateEnlightenmentLevel();

    setTimeout(() => {
      location.reload();
    }, 2000);
  } else {
    showNotification(
      '🎉 Wisdom prevails! You have resisted temptation and grown stronger!'
    );
    enlightenmentLevel += 10;
    updateEnlightenmentLevel();
  }
}

function updateStats() {
  const sobrietySeconds = Math.floor((Date.now() - startTime) / 1000);
  document.getElementById('sobrietyTime').textContent =
    `${sobrietySeconds} seconds`;
  document.getElementById('resistedCount').textContent = visits;
  document.getElementById('mindfulnessCount').textContent = mindfulnessCount;

  const levelIndex = Math.min(
    Math.floor((mindfulnessCount + completedActivities) / 3),
    wellnessLevels.length - 1
  );
  document.getElementById('wellnessLevel').textContent =
    wellnessLevels[levelIndex];
}

function updateEnlightenmentLevel() {
  const level = Math.min(100, enlightenmentLevel);
  document.getElementById('enlightenmentFill').style.width = level + '%';
  document.getElementById('enlightenmentLevel').textContent = Math.floor(level);
}

function updateMilestones() {
  const milestones = [
    { id: 'milestone1', threshold: 1, condition: visits >= 1 },
    { id: 'milestone2', threshold: 2, condition: mindfulnessCount >= 1 },
    { id: 'milestone3', threshold: 30, condition: enlightenmentLevel >= 30 },
    { id: 'milestone4', threshold: 3, condition: completedActivities >= 3 },
    { id: 'milestone5', threshold: 80, condition: enlightenmentLevel >= 80 },
  ];

  milestones.forEach((milestone) => {
    const element = document.getElementById(milestone.id);
    if (milestone.condition && !element.classList.contains('achieved')) {
      element.classList.add('achieved');
      element.querySelector('span:last-child').textContent = '✅ Achieved';
      element.querySelector('span:last-child').style.color = '#27ae60';
    }
  });
}

function showNotification(message) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.classList.add('show');

  setTimeout(() => {
    notification.classList.remove('show');
  }, 4000);
}

// Setup event handlers and interval timers once DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize on page load
  init();

  // Setup event listeners for all interactive elements
  setupEventListeners();

  // Update stats every second
  setInterval(updateStats, 1000);

  // Periodic wisdom reminders
  setInterval(() => {
    if (Math.random() < 0.2) {
      // 20% chance
      generateWisdom();
    }
  }, 30000);
});

/**
 * Sets up all event listeners for interactive elements on the page
 */
function setupEventListeners() {
  // Breathing circle
  const breathingCircle = document.getElementById('breathingCircle');
  if (breathingCircle) {
    breathingCircle.addEventListener('click', startBreathing);
  }

  // Sound buttons
  const soundButtons = document.querySelectorAll('.sound-btn');
  soundButtons.forEach((button) => {
    const soundIcon = button.textContent.trim().split(' ')[0];
    button.addEventListener('click', () => playSound(button, soundIcon));
  });

  // Activity cards
  const activityCards = document.querySelectorAll('.activity-card');
  activityCards.forEach((card) => {
    card.addEventListener('click', () => completeActivity(card));
  });

  // Main buttons
  const wisdomButton = document.querySelector('.main-button:nth-of-type(1)');
  if (wisdomButton) {
    wisdomButton.addEventListener('click', generateWisdom);
  }

  const progressButton = document.querySelector('.main-button:nth-of-type(2)');
  if (progressButton) {
    progressButton.addEventListener('click', checkProgress);
  }

  const relapseButton = document.querySelector('.main-button.danger');
  if (relapseButton) {
    relapseButton.addEventListener('click', relapse);
  }
}
