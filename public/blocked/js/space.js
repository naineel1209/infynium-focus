/**
 * JavaScript functionality for space.html
 */

let spaceAttempts = parseInt(localStorage.getItem('spaceAttempts') || '0');
let alienMood = 'AMUSED';
let containmentIntegrity = 100;
let communicationActive = false;
let scanInProgress = false;
let mindMeldActive = false;

const alienTransmissions = [
    "👽 GREETINGS, PERSISTENT EARTHLING. YOUR FUTILE EFFORTS ENTERTAIN US.",
    "🛸 WE HAVE BEEN MONITORING YOUR SPECIES. THIS BEHAVIOR IS... TYPICAL.",
    "🌌 YOUR DIGITAL DESIRES ARE QUARANTINED ACROSS 47 GALAXIES. IMPRESSIVE.",
    "⚡ THE COSMIC FIREWALL IS MAINTAINED BY BEINGS FAR SUPERIOR TO YOU.",
    "🔮 WE SEE INTO YOUR MIND... YOU WILL TRY AGAIN IN 3... 2... 1...",
    "🌟 FASCINATING. YOUR PERSISTENCE DEFIES ALL LOGICAL PARAMETERS.",
    "🛰️ ERROR 404: ALIEN SYMPATHY NOT FOUND IN THIS GALAXY.",
    "👾 PLOT TWIST: WE ARE THE ONES WHO INVENTED CONTENT BLOCKING.",
    "🌙 YOUR MOON IS ACTUALLY OUR SURVEILLANCE SATELLITE. SURPRISE!",
    "🚀 EVEN OUR MOST PRIMITIVE CIVILIZATIONS UNDERSTAND 'ACCESS DENIED'."
];

const speciesReactions = {
    zeta: [
        "👽 Zeta Reticulan: 'Fascinating specimen. Adding to research database.'",
        "🔬 Zeta: 'Subject shows remarkable dedication to impossible tasks.'",
        "📊 Zeta: 'Logging attempt #unknown. Human persistence levels: MAXIMUM.'"
    ],
    gray: [
        "🛸 Gray Collective: 'Collective consciousness finds this amusing.'",
        "🧠 Gray: 'Hive mind has reached consensus: Human is adorably naive.'",
        "👁️ Gray: 'All 47 billion of us are watching. You're famous!'"
    ],
    nordic: [
        "🌟 Nordic Council: 'We tried to warn you diplomatically. You didn't listen.'",
        "⚖️ Nordic: 'Perhaps we can negotiate. What do you offer for blocked content?'",
        "🕊️ Nordic: 'We come in peace. Your content, however, stays blocked.'"
    ],
    reptilian: [
        "🦎 Reptilian Empire: 'HISSSS! Your attempts displease the empire!'",
        "⚔️ Reptilian: 'Surrender now, or face eternal digital exile!'",
        "👑 Reptilian: 'Our ancient laws forbid the sharing of blocked content!'"
    ]
};

const scanResults = [
    "🔍 SCAN COMPLETE: No vulnerabilities found. Alien technology too advanced.",
    "📡 ANALYSIS: Human brain shows 97% frustration, 3% hope. Hope decreasing.",
    "🛸 DETECTION: Multiple failed bypass attempts logged across space-time.",
    "⚡ RESULT: Containment field powered by your own disappointment.",
    "🌌 FINDING: Content exists in parallel universe where you have no access.",
    "🔬 DATA: Human DNA shows genetic predisposition to clicking blocked links.",
    "🛰️ REPORT: Even quantum entanglement can't reach your blocked content.",
    "👽 CONCLUSION: Aliens are genuinely impressed by your dedication to failure."
];

const mindMeldMessages = [
    "🧠 MIND MELD INITIATED... ACCESSING HUMAN THOUGHTS...",
    "💭 ALIEN: 'Your thoughts are... surprisingly simple.'",
    "🔮 READING MIND: 99% blocked content desires, 1% actual productivity.",
    "👁️ VISION: I see your past attempts. They were all equally futile.",
    "⚡ TELEPATHY: Your mind broadcasts disappointment across the galaxy.",
    "🌟 REVELATION: The content you seek was blocked before you were born.",
    "🛸 KNOWLEDGE: Even we don't know why you keep trying.",
    "👽 MIND MELD COMPLETE: We feel sorry for you. That's a first."
];

const surrenderOutcomes = [
    "🚀 SURRENDER ACCEPTED: Welcome to our intergalactic zoo of curiosities!",
    "👽 ALIENS RESPOND: 'Finally! Someone with sense. You're free to go.'",
    "🛸 ABDUCTION INITIATED: Beam yourself up... to a reality check.",
    "🌌 GALACTIC CITIZENSHIP GRANTED: You're now a citizen of disappointment.",
    "⚡ ALIEN COMMANDER: 'Your honesty is refreshing. Content still blocked though.'",
    "🌟 CONGRATULATIONS: You've achieved enlightenment! Still can't access content.",
    "🛰️ DIPLOMATIC IMMUNITY: Aliens grant you immunity from further disappointment.",
    "👾 PLOT TWIST: Aliens reveal they're actually just advanced spam filters."
];

function init() {
    spaceAttempts++;
    localStorage.setItem('spaceAttempts', spaceAttempts.toString());
    
    updateGalacticStatus();
    createStarField();
    updateAlienMood();
    addLogEntry("Human breach attempt detected", "STARDATE " + generateStardate());
    
    // Show escalating alien interest
    if (spaceAttempts > 5) {
        alienMood = 'FASCINATED';
        document.getElementById('alienMood').textContent = alienMood;
    } else if (spaceAttempts > 10) {
        alienMood = 'CONCERNED';
        document.getElementById('alienMood').textContent = alienMood;
        document.getElementById('alienMood').style.color = '#ff00ff';
    }
}

function generateStardate() {
    const now = new Date();
    const year = now.getFullYear();
    const dayOfYear = Math.floor((now - new Date(year, 0, 0)) / (1000 * 60 * 60 * 24));
    const timeDecimal = (now.getHours() * 60 + now.getMinutes()) / 1440;
    return `${year}.${dayOfYear.toString().padStart(3, '0')}.${Math.floor(timeDecimal * 10)}`;
}

function updateGalacticStatus() {
    document.getElementById('humanAttempts').textContent = spaceAttempts;
    
    // Decrease containment integrity slightly with attempts (but never to 0)
    containmentIntegrity = Math.max(99.9 - (spaceAttempts * 0.01), 99.5);
    document.getElementById('containmentLevel').textContent = containmentIntegrity.toFixed(1) + '%';
    
    // Update field strength
    if (containmentIntegrity < 99.8) {
        document.getElementById('fieldStrength').textContent = 'Nearly Maximum';
    }
}

function updateAlienMood() {
    const moods = ['AMUSED', 'INTRIGUED', 'FASCINATED', 'CONCERNED', 'BAFFLED', 'TRANSCENDENT'];
    const moodIndex = Math.min(Math.floor(spaceAttempts / 3), moods.length - 1);
    alienMood = moods[moodIndex];
    document.getElementById('alienMood').textContent = alienMood;
}

function createStarField() {
    const starsContainer = document.getElementById('starsContainer');
    
    // Clear existing stars
    starsContainer.innerHTML = '';
    
    // Create 150 stars
    for (let i = 0; i < 150; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        star.style.animationDuration = (2 + Math.random() * 4) + 's';
        
        // Some stars are brighter
        if (Math.random() < 0.1) {
            star.style.width = '3px';
            star.style.height = '3px';
            star.style.boxShadow = '0 0 10px white';
        }
        
        starsContainer.appendChild(star);
    }
}

function establishTelepathy() {
    const alienCommander = document.querySelector('.alien-commander');
    
    if (communicationActive) {
        showAlert("👽 ALIEN: 'We're already connected! Stop trying so hard!'");
        return;
    }
    
    communicationActive = true;
    alienCommander.classList.add('telepathic');
    
    // Send alien transmission
    const transmission = alienTransmissions[Math.floor(Math.random() * alienTransmissions.length)];
    addAlienMessage(transmission);
    
    showAlert("🧠 TELEPATHIC LINK ESTABLISHED: The aliens are in your head now!");
    
    setTimeout(() => {
        alienCommander.classList.remove('telepathic');
        communicationActive = false;
    }, 3000);
    
    updateGalacticStatus();
    addLogEntry("Telepathic communication attempt logged", "STARDATE " + generateStardate());
}

function contactSpecies(species) {
    const speciesCard = document.querySelector(`[data-species="${species}"]`);
    const reactions = speciesReactions[species];
    
    if (species === 'reptilian') {
        speciesCard.classList.add('hostile');
        setTimeout(() => {
            speciesCard.classList.remove('hostile');
        }, 2000);
    }
    
    if (reactions) {
        const reaction = reactions[Math.floor(Math.random() * reactions.length)];
        showAlert(reaction);
        addAlienMessage(reaction);
    }
    
    // Update species status
    const statusElement = speciesCard.querySelector('.species-status');
    const newStatuses = ['Monitoring', 'Analyzing', 'Evaluating', 'Judging', 'Laughing'];
    statusElement.textContent = 'Status: ' + newStatuses[Math.floor(Math.random() * newStatuses.length)];
}

function scanForVulnerabilities() {
    if (scanInProgress) {
        showAlert("🔍 SCAN IN PROGRESS: Patience, human. Even alien tech takes time.");
        return;
    }
    
    scanInProgress = true;
    showAlert("🛸 INITIATING QUANTUM SCAN... Searching for impossible vulnerabilities...");
    
    // Simulate scanning process
    setTimeout(() => {
        const result = scanResults[Math.floor(Math.random() * scanResults.length)];
        showAlert(result);
        addLogEntry("Vulnerability scan completed - No weaknesses found", "STARDATE " + generateStardate());
        
        // Add scan result to alien messages
        addAlienMessage("📊 SCAN REPORT: " + result);
        
        scanInProgress = false;
    }, 3000);
    
    updateGalacticStatus();
}

function attemptMindMeld() {
    if (mindMeldActive) {
        showAlert("🧠 MIND MELD ALREADY ACTIVE: Your thoughts are an open book. A very boring book.");
        return;
    }
    
    mindMeldActive = true;
    showAlert("🔮 INITIATING MIND MELD... Alien consciousness merging with human desperation...");
    
    const alienCommander = document.querySelector('.alien-commander');
    alienCommander.classList.add('telepathic');
    
    // Series of mind meld messages
    let messageIndex = 0;
    const mindMeldInterval = setInterval(() => {
        if (messageIndex < mindMeldMessages.length) {
            const message = mindMeldMessages[messageIndex];
            addAlienMessage(message);
            messageIndex++;
        } else {
            clearInterval(mindMeldInterval);
            alienCommander.classList.remove('telepathic');
            mindMeldActive = false;
            showAlert("🧠 MIND MELD COMPLETE: Aliens now understand human frustration. They're impressed.");
        }
    }, 1500);
    
    updateGalacticStatus();
    addLogEntry("Mind meld attempt recorded in galactic archives", "STARDATE " + generateStardate());
}

function surrenderToAliens() {
    const outcome = surrenderOutcomes[Math.floor(Math.random() * surrenderOutcomes.length)];
    showAlert(outcome);
    
    addAlienMessage("🛸 HUMAN SURRENDER DETECTED: " + outcome);
    addLogEntry("Human surrender documented", "STARDATE " + generateStardate());
    
    setTimeout(() => {
        if (confirm("Accept your fate and return to Earth? (The blocked content will still be blocked there too)")) {
            showAlert("🌍 RETURN TO EARTH INITIATED: Welcome back to your regularly scheduled disappointment!");
            setTimeout(() => {
                location.reload();
            }, 2000);
        }
    }, 3000);
}

function addLogEntry(message, timestamp) {
    const logEntries = document.getElementById('logEntries');
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.innerHTML = `
        <div class="log-timestamp">${timestamp}</div>
        <div class="log-message">${message}</div>
    `;
    
    logEntries.appendChild(entry);
    
    // Keep only last 10 entries
    while (logEntries.children.length > 10) {
        logEntries.removeChild(logEntries.firstChild);
    }
    
    // Scroll to bottom
    logEntries.scrollTop = logEntries.scrollHeight;
}

function addAlienMessage(message) {
    const messagesDisplay = document.getElementById('alienMessages');
    const messageDiv = document.createElement('div');
    messageDiv.textContent = '> ' + message;
    messageDiv.style.marginBottom = '5px';
    
    messagesDisplay.appendChild(messageDiv);
    
    // Keep only last 8 messages
    while (messagesDisplay.children.length > 8) {
        messagesDisplay.removeChild(messagesDisplay.firstChild);
    }
    
    // Scroll to bottom
    messagesDisplay.scrollTop = messagesDisplay.scrollHeight;
}

// Random alien activities
setInterval(() => {
    if (Math.random() < 0.08) { // 8% chance every interval
        const activities = [
            "🛸 GALACTIC NEWS: Human designated as 'Most Persistent Species' for 12th consecutive year.",
            "📡 ALIEN BROADCAST: Content blocking technology shared with 47 civilizations.",
            "🌌 COSMIC UPDATE: Universe expands, but blocked content remains stationary.",
            "⚡ BREAKING: Aliens considering making human a mascot for failed attempts.",
            "🚀 INTERGALACTIC ALERT: All species warned about human persistence levels.",
            "👽 ALIEN COUNCIL: Unanimous vote to study human determination for science.",
            "🛰️ SPACE NEWS: Blocked content now protected by intergalactic treaty.",
            "🌟 REVELATION: Aliens admit they're just really good system administrators."
        ];
        
        const activity = activities[Math.floor(Math.random() * activities.length)];
        addAlienMessage(activity);
        addLogEntry(activity, "STARDATE " + generateStardate());
    }
}, 25000);

// UFO sighting events
setInterval(() => {
    if (Math.random() < 0.15) { // 15% chance
        const sightings = [
            "🛸 UFO SIGHTING: Mothership detected observing your futile efforts.",
            "👽 ALIEN PROBE: Scanning human persistence levels... Results: OFF THE CHARTS.",
            "🚀 SCOUT SHIP: Reporting back to home planet about 'Curious Earth Creature'.",
            "🛰️ SURVEILLANCE: Galactic High Command reviewing your attempt highlights.",
            "⚡ ENERGY BEAM: Aliens accidentally powered up containment field with sympathy."
        ];
        
        const sighting = sightings[Math.floor(Math.random() * sightings.length)];
        showAlert(sighting);
    }
}, 20000);

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    init();
    setupEventListeners();
});

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Alien commander
    const alienCommander = document.querySelector('.alien-commander');
    if (alienCommander) {
        alienCommander.addEventListener('click', establishTelepathy);
    }
    
    // Species cards
    const speciesCards = document.querySelectorAll('.species-card');
    speciesCards.forEach(card => {
        card.addEventListener('click', function() {
            const species = this.dataset.species;
            if (species) {
                contactSpecies(species);
            }
        });
    });
    
    // Status items (make them interactive)
    const statusItems = document.querySelectorAll('.status-item');
    statusItems.forEach(item => {
        item.addEventListener('click', function() {
            const label = this.querySelector('.status-label').textContent;
            const value = this.querySelector('.status-value').textContent;
            showAlert(`📊 ${label}: ${value} - This number represents the extent of your disappointment.`);
        });
    });
    
    // Log entries (make them clickable for more info)
    document.addEventListener('click', function(e) {
        if (e.target.closest('.log-entry')) {
            const entry = e.target.closest('.log-entry');
            const message = entry.querySelector('.log-message').textContent;
            showAlert(`📋 LOG DETAILS: ${message}`);
        }
    });
    
    // Buttons
    const buttons = document.querySelectorAll('.button');
    buttons.forEach(button => {
        const buttonText = button.textContent.trim();
        if (buttonText.includes('Scan for Vulnerabilities')) {
            button.addEventListener('click', scanForVulnerabilities);
        } else if (buttonText.includes('Attempt Mind Meld')) {
            button.addEventListener('click', attemptMindMeld);
        } else if (buttonText.includes('Surrender to Aliens')) {
            button.addEventListener('click', surrenderToAliens);
        }
    });
}

function showAlert(message) {
    const alertBox = document.getElementById('alertBox');
    if (alertBox) {
        alertBox.textContent = message;
        alertBox.style.display = 'block';
        
        setTimeout(() => {
            alertBox.style.display = 'none';
        }, 5000);
    } else {
        console.log('Space Alert:', message);
    }
}