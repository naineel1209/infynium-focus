/**
 * JavaScript functionality for persistence.html
 */

let attempts = localStorage.getItem('blockAttempts') || 0;
let totalRefreshes = localStorage.getItem('totalRefreshes') || 0;

const badges = [
  { name: '🔥 First Timer', threshold: 1, message: 'Welcome to the club!' },
  {
    name: '🎯 Persistent Pete',
    threshold: 5,
    message: "You're getting warmer...",
  },
  { name: '🏃 Marathon Runner', threshold: 10, message: 'Still going strong!' },
  { name: '🤖 Automation Expert', threshold: 25, message: 'Are you a bot?' },
  {
    name: '🎪 Circus Performer',
    threshold: 50,
    message: 'Ladies and gentlemen...',
  },
  {
    name: '🦾 Unstoppable Force',
    threshold: 100,
    message: "Physics laws don't apply",
  },
  {
    name: '🌟 Legend Status',
    threshold: 200,
    message: "You've transcended reality",
  },
];

const sarcasticMessages = [
  "We admire your optimism. Really. It's... inspiring.",
  'Have you considered taking up stamp collecting instead?',
  'Your determination could power a small city.',
  'Maybe the 47th time will be the charm?',
  "We're starting a support group. You'll be our first member.",
  'Your persistence has been noted by NASA.',
  'Breaking news: Local person discovers definition of insanity.',
  'Your browser history must be fascinating.',
  'We should write a book about your journey.',
  'Your dedication deserves its own documentary.',
];

const excuses = [
  'The server is taking a coffee break ☕',
  'Our hamsters are on strike 🐹',
  'The internet ran out of pixels 🎨',
  "We're updating our blocking algorithms 🤖",
  'The website is social distancing 😷',
  'Our servers are having an existential crisis 🤔',
  'The content is stuck in traffic 🚗',
  "We're teaching the site to play hide and seek 👻",
  'The database is learning quantum physics 🔬',
  'Our IT team is fighting dragons 🐉',
];

function init() {
  attempts++;
  totalRefreshes++;
  localStorage.setItem('blockAttempts', attempts);
  localStorage.setItem('totalRefreshes', totalRefreshes);

  document.getElementById('attempts').textContent = attempts;
  document.getElementById('productivity').textContent = Math.floor(
    attempts * 0.5
  );
  document.getElementById('refreshes').textContent = totalRefreshes;

  updateAchievements();
  updateMessage();

  // Add event listeners for elements
  document
    .getElementById('trophyElement')
    .addEventListener('click', celebrateTrophy);
  document.getElementById('tryAgainBtn').addEventListener('click', tryAgain);
  document.getElementById('newExcuseBtn').addEventListener('click', newExcuse);
}

function updateAchievements() {
  const badgesContainer = document.getElementById('achievementsBadges');
  badgesContainer.innerHTML = '';

  badges.forEach((badge) => {
    if (attempts >= badge.threshold) {
      const badgeElement = document.createElement('span');
      badgeElement.className = 'badge';
      badgeElement.textContent = badge.name;
      badgeElement.title = badge.message;
      badgesContainer.appendChild(badgeElement);

      setTimeout(() => {
        badgeElement.classList.add('unlocked');
      }, 100);
    }
  });
}

function updateMessage() {
  const messageElement = document.getElementById('message');
  if (attempts > 10) {
    const randomMessage =
      sarcasticMessages[Math.floor(Math.random() * sarcasticMessages.length)];
    messageElement.textContent = randomMessage;
  }
}

function celebrateTrophy() {
  const trophy = document.querySelector('.trophy');
  trophy.style.animation = 'shake 0.5s ease-in-out';

  // Create confetti
  for (let i = 0; i < 20; i++) {
    createConfetti();
  }

  setTimeout(() => {
    trophy.style.animation = '';
  }, 500);
}

function createConfetti() {
  const confetti = document.createElement('div');
  confetti.className = 'confetti';
  confetti.style.left = Math.random() * 100 + '%';
  confetti.style.animationDelay = Math.random() * 3 + 's';
  confetti.style.backgroundColor = [
    '#ff6b6b',
    '#4ecdc4',
    '#45b7d1',
    '#96ceb4',
    '#feca57',
  ][Math.floor(Math.random() * 5)];

  document.querySelector('.ceremony-container').appendChild(confetti);

  setTimeout(() => {
    confetti.remove();
  }, 3000);
}

function tryAgain() {
  location.reload();
}

function newExcuse() {
  const randomExcuse = excuses[Math.floor(Math.random() * excuses.length)];
  document.getElementById('message').textContent = randomExcuse;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);
