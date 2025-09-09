/**
 * JavaScript functionality for detective.html
 */

let caseAttempts = parseInt(localStorage.getItem('detectiveAttempts') || '0');
let cluesFound = 0;
let evidenceGathered = false;
let caseProgress = 0;

const detectiveNames = [
    'Sherlock Browser', 'Inspector Gadget', 'Detective Pixel', 'Agent 404',
    'Commissioner Gordon', 'Miss Marple Mouse', 'Columbo Click', 'Hercule Pointer'
];

const caseConclude = [
    "After thorough investigation, the evidence is clear: the website is indeed blocked.",
    "The case reveals a conspiracy of productivity. Someone actually wants you to work.",
    "Mystery solved: The real crime was the time we wasted along the way.",
    "Elementary, my dear Watson. The butler did it. (The butler being network security.)",
    "Case closed: The website was guilty of being too distracting.",
    "Investigation complete: The perpetrator is your own poor impulse control.",
    "Final verdict: The content filter is innocent. You, however, are not.",
    "After careful analysis: The website is in witness protection from your productivity."
];

const evidenceItems = [
    "Suspicious Cache Files", "Encrypted DNS Requests", "Phantom Cookie Crumbs",
    "Mysterious 403 Traces", "Banned IP Fingerprints", "Firewall Footprints",
    "Proxy Server Alibis", "Administrator Hair Follicle", "Blocked Domain DNA",
    "VPN Tunnel Blueprints", "Incognito Mode Residue"
];

const witnessStatements = [
    "I saw the user clicking frantically around 3:47 PM",
    "The browser was acting suspicious, Your Honor",
    "There were multiple tab sounds coming from the computer",
    "I heard someone whisper 'maybe if I refresh one more time...'",
    "The keyboard showed signs of aggressive pressing",
    "WiFi router reported unusual desperation levels",
    "Mouse complained of repetitive stress from constant clicking"
];

function init() {
    caseAttempts++;
    localStorage.setItem('detectiveAttempts', caseAttempts.toString());
    
    // Update case details
    document.getElementById('caseNumber').textContent = 404 + caseAttempts;
    document.getElementById('detectiveName').textContent = 
        detectiveNames[caseAttempts % detectiveNames.length];
    
    if (caseAttempts > 5) {
        document.getElementById('caseStatus').textContent = 'COLD CASE';
        document.getElementById('caseStatus').style.color = '#3498db';
    } else if (caseAttempts > 10) {
        document.getElementById('caseStatus').textContent = 'UNSOLVABLE MYSTERY';
        document.getElementById('caseStatus').style.color = '#9b59b6';
    }
    
    updateLastSeen();
}

function updateLastSeen() {
    const timeOptions = [
        "Just now (you're persistent)", "5 minutes ago (before the coffee break)",
        "This morning (before productivity kicked in)", "Yesterday (simpler times)",
        "In a parallel universe where it wasn't blocked", "In your dreams",
        "Right before you realized it was blocked", "When you still had hope"
    ];
    
    document.getElementById('lastSeen').textContent = 
        timeOptions[Math.floor(Math.random() * timeOptions.length)];
}

function searchForClues() {
    cluesFound++;
    const magnifyingGlass = document.querySelector('.magnifying-glass');
    
    // Animate magnifying glass
    magnifyingGlass.style.transform = 'scale(1.5) rotate(360deg)';
    setTimeout(() => {
        magnifyingGlass.style.transform = '';
    }, 500);
    
    // Add random evidence
    if (Math.random() < 0.7) {
        addEvidence();
    }
    
    // Progress investigation
    progressInvestigation();
    
    // Random witness statement
    if (Math.random() < 0.3) {
        showWitnessStatement();
    }
}

function addEvidence() {
    const evidenceBoard = document.querySelector('.evidence-board');
    const newEvidence = document.createElement('div');
    newEvidence.className = 'evidence-item';
    newEvidence.textContent = evidenceItems[Math.floor(Math.random() * evidenceItems.length)];
    newEvidence.style.animation = 'none';
    newEvidence.style.transform = 'scale(0)';
    evidenceBoard.appendChild(newEvidence);
    
    setTimeout(() => {
        newEvidence.style.animation = 'bounce 0.6s ease';
        newEvidence.style.transform = 'rotate(' + (Math.random() * 6 - 3) + 'deg)';
    }, 100);
}

function progressInvestigation() {
    caseProgress = Math.min(caseProgress + 1, 4);
    const clueCards = document.querySelectorAll('.clue-card');
    
    if (caseProgress <= clueCards.length) {
        const currentClue = clueCards[caseProgress - 1];
        currentClue.classList.add('discovered');
        const statusDiv = currentClue.querySelector('div:last-child');
        statusDiv.textContent = 'Status: Completed ✓';
        statusDiv.style.color = '#2ecc71';
    }
    
    if (caseProgress >= 4) {
        setTimeout(solveCase, 1000);
    }
}

function showWitnessStatement() {
    const statement = witnessStatements[Math.floor(Math.random() * witnessStatements.length)];
    showAlert(`🎭 Witness Statement: "${statement}"`);
}

function interrogateSuspect(suspect) {
    const suspectElement = suspect;
    const suspectType = suspectElement.dataset.suspect;
    
    suspectElement.classList.add('guilty');
    
    let response = "";
    switch(suspectType) {
        case 'admin':
            response = "Admin: 'I was just following the content policy, I swear!'";
            break;
        case 'filter':
            response = "Filter: 'I'm just doing my job! Don't blame me!'";
            break;
        case 'productivity':
            response = "Productivity: 'I've been trying to help you all along!'";
            break;
        case 'sense':
            response = "Common Sense: 'I've been shouting at you this whole time!'";
            break;
        default:
            response = "Suspect: 'I'll never talk! You'll never make me confess!'";
    }
    
    showAlert(response);
    
    setTimeout(() => {
        suspectElement.classList.remove('guilty');
    }, 2000);
}

function gatherMoreEvidence() {
    evidenceGathered = true;
    
    for (let i = 0; i < 3; i++) {
        setTimeout(() => addEvidence(), i * 300);
    }
    
    showAlert("🔍 Additional evidence gathered! The plot thickens...");
    
    // Chance to progress case
    if (Math.random() < 0.5) {
        progressInvestigation();
    }
}

function callBackup() {
    const backupResponses = [
        "🚨 Backup arrives but they're also blocked!",
        "📞 Called IT support. They laughed and hung up.",
        "🕵️‍♀️ Detective duo assembled! Still can't solve it.",
        "👮‍♂️ Police arrived but arrested your productivity instead.",
        "🚁 Helicopter backup can't reach blocked airspace.",
        "📡 Satellite surveillance also blocked by network policy.",
        "🤖 Sent in robots. They got distracted by cat videos.",
        "🦸‍♂️ Called superhero. They said this is beyond their powers."
    ];
    
    const response = backupResponses[Math.floor(Math.random() * backupResponses.length)];
    showAlert(response);
}

function closeCase() {
    showCaseClosed();
    
    setTimeout(() => {
        if (confirm("Case closed as unsolvable. Start a new investigation?")) {
            location.reload();
        }
    }, 3000);
}

function solveCase() {
    const conclusion = document.getElementById('conclusion');
    const conclusionText = document.getElementById('conclusionText');
    
    conclusion.style.display = 'block';
    
    const finalConclusion = caseConclude[Math.floor(Math.random() * caseConclude.length)];
    typewriterEffect(conclusionText, finalConclusion, () => {
        setTimeout(showCaseClosed, 2000);
    });
}

function typewriterEffect(element, text, callback) {
    element.textContent = '';
    let i = 0;
    
    function typeChar() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(typeChar, 50);
        } else {
            element.style.borderRight = 'none';
            if (callback) callback();
        }
    }
    
    typeChar();
}

function showCaseClosed() {
    const caseClosed = document.getElementById('caseClosed');
    caseClosed.classList.add('show');
    
    setTimeout(() => {
        caseClosed.classList.remove('show');
    }, 3000);
}

function showAlert(message) {
    const alertBox = document.getElementById('alertBox');
    if (alertBox) {
        alertBox.textContent = message;
        alertBox.style.display = 'block';
        
        setTimeout(() => {
            alertBox.style.display = 'none';
        }, 4000);
    } else {
        console.log('Detective Alert:', message);
    }
}

// Random case updates
setInterval(() => {
    if (Math.random() < 0.08) { // 8% chance every interval
        const updates = [
            "📂 New case file discovered in the archives...",
            "🔍 Security camera footage is mysteriously corrupted.",
            "📞 Anonymous tip: 'The websites are hiding in plain sight'",
            "🕵️ Plot twist: The content was the friends we made along the way.",
            "📋 Forensics report: High levels of procrastination detected.",
            "🚨 Breaking: Similar cases reported worldwide.",
            "🔬 Lab results: 99.9% chance of permanent blocking."
        ];
        
        const randomUpdate = updates[Math.floor(Math.random() * updates.length)];
        showAlert(randomUpdate);
    }
}, 12000);

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    init();
    setupEventListeners();
});

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Magnifying glass
    const magnifyingGlass = document.querySelector('.magnifying-glass');
    if (magnifyingGlass) {
        magnifyingGlass.addEventListener('click', searchForClues);
    }
    
    // Suspects
    const suspects = document.querySelectorAll('.suspect');
    suspects.forEach(suspect => {
        suspect.addEventListener('click', function() {
            interrogateSuspect(this);
        });
    });
    
    // Evidence items (existing ones)
    const evidenceItems = document.querySelectorAll('.evidence-item');
    evidenceItems.forEach(item => {
        item.addEventListener('click', function() {
            this.style.transform = 'rotate(0deg) scale(1.2)';
            showAlert(`📋 Evidence examined: "${this.textContent}"`);
            
            setTimeout(() => {
                this.style.transform = '';
            }, 1000);
        });
    });
    
    // Clue cards
    const clueCards = document.querySelectorAll('.clue-card');
    clueCards.forEach(card => {
        card.addEventListener('click', function() {
            if (!this.classList.contains('discovered')) {
                progressInvestigation();
                this.classList.add('discovered');
                const statusDiv = this.querySelector('div:last-child');
                statusDiv.textContent = 'Status: Completed ✓';
                statusDiv.style.color = '#2ecc71';
            }
        });
    });
    
    // Buttons
    const buttons = document.querySelectorAll('.button');
    buttons.forEach(button => {
        const buttonText = button.textContent.trim();
        if (buttonText.includes('Gather More Evidence')) {
            button.addEventListener('click', gatherMoreEvidence);
        } else if (buttonText.includes('Call for Backup')) {
            button.addEventListener('click', callBackup);
        } else if (buttonText.includes('Close Case')) {
            button.addEventListener('click', closeCase);
        }
    });
}