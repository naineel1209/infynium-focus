/**
 * JavaScript functionality for gym.html
 */

let gymAttempts = parseInt(localStorage.getItem('gymAttempts') || '0');
let motivationLevel = 0;
let workoutInProgress = false;
let currentExercise = null;
let workoutTimer = null;
let musicPlaying = false;
let sweatDrops = 0;

const trainerQuotes = [
    "💪 COME ON! You think blocked content is gonna unblock itself?! PUSH HARDER!",
    "🔥 I've seen better effort from a broken keyboard! GIVE ME MORE!",
    "⚡ Your grandmother could bypass firewalls better than this! And she's 90!",
    "🚀 PAIN IS JUST WEAKNESS LEAVING THE BODY! Blocked sites are weakness entering!",
    "💀 You're not trying hard enough! The content is still blocked!",
    "🎯 FOCUS! Channel that frustration into pure clicking power!",
    "⭐ Winners never quit! But quitters never get blocked content either!",
    "🌟 I believe in you! Just kidding, this is impossible!",
    "🔥 BEAST MODE! Wait, even beasts can't access blocked content!",
    "💯 Give me 110%! And you'll still get 0% access!"
];

const exerciseMotivation = {
    refresh: [
        "🔄 Feel that F5 burn! Each refresh builds character!",
        "💻 Your fingers are getting SWOLE from all that refreshing!",
        "⚡ Channel your rage into rapid refreshing! Still won't work though!"
    ],
    url: [
        "🌐 Type that URL like your life depends on it! It doesn't matter!",
        "⌨️ Those typing muscles are getting RIPPED! Too bad the site isn't!",
        "🎯 Perfect form on that URL entry! Perfect disappointment too!"
    ],
    vpn: [
        "🔄 Switch those servers! Like changing clothes - useless but good exercise!",
        "🌍 Globe-hopping with VPNs! Still blocked in every country!",
        "🚀 Server switching speed is impressive! Results, not so much!"
    ],
    incognito: [
        "🕵️ Going incognito! The only thing hiding is your shame!",
        "👻 Stealth mode activated! Still visible to content blockers!",
        "🎭 Incognito pushups building that privacy muscle! Still blocked!"
    ],
    hope: [
        "🌟 Hold that plank! Just like you're holding onto false hope!",
        "⏰ Feel the burn of eternal waiting! Perfect form!",
        "💫 That's it! Planking while your dreams die! Excellent technique!"
    ]
};

const equipmentFailures = {
    treadmill: [
        "🏃‍♂️ Treadmill Status: Running in circles, just like your attempts!",
        "💨 Speed setting: Maximum futility achieved!",
        "⚡ Error: Treadmill refuses to run towards blocked content!"
    ],
    weights: [
        "🏋️‍♀️ Reality Check Weights: Too heavy for most people to lift!",
        "💪 Warning: May cause severe disappointment gains!",
        "⚖️ Weight of your decisions finally quantified!"
    ],
    bike: [
        "🚴‍♂️ Bike Status: Pedaling nowhere, just like your progress!",
        "🌪️ Wind resistance provided by your own sighs of frustration!",
        "🎯 Distance traveled: 0 miles closer to unblocked content!"
    ],
    rower: [
        "🚣‍♂️ Rowing upstream against the current of reality!",
        "🌊 Resistance setting: Maximum life disappointment!",
        "⛵ Navigation error: All routes lead to blocked content!"
    ]
};

const personalRecords = [
    "Most Tab Crashes in One Session",
    "Fastest Cache Clear Time",
    "Longest Staring Contest with Error Page",
    "Most Creative Excuse for Procrastination",
    "Best Impression of a Broken Website",
    "Highest Score in Disappointment Olympics"
];

function init() {
    gymAttempts++;
    localStorage.setItem('gymAttempts', gymAttempts.toString());
    
    updateStats();
    updateMotivationMeter();
    
    // Update member since date
    const joinDate = new Date();
    joinDate.setDate(joinDate.getDate() - gymAttempts);
    document.getElementById('memberSince').textContent = joinDate.toLocaleDateString();
    
    // Show escalating frustration
    if (gymAttempts > 5) {
        document.getElementById('frustrationLevel').textContent = "LEGENDARY";
        document.getElementById('frustrationLevel').style.color = '#9b59b6';
    }
}

function updateStats() {
    document.getElementById('attemptsCount').textContent = gymAttempts;
    document.getElementById('timeWasted').textContent = gymAttempts * 3;
    document.getElementById('recordSites').textContent = gymAttempts + Math.floor(gymAttempts / 2);
    
    // Update personal records occasionally
    if (gymAttempts % 3 === 0) {
        updatePersonalRecord();
    }
}

function updateMotivationMeter() {
    // Motivation decreases with attempts
    motivationLevel = Math.max(100 - (gymAttempts * 5), 0);
    document.getElementById('motivationFill').style.width = motivationLevel + '%';
    document.getElementById('motivationLevel').textContent = Math.floor(motivationLevel);
    
    if (motivationLevel <= 0) {
        document.getElementById('motivationLevel').textContent = "DEPLETED";
        document.querySelector('.motivation-fill').style.background = 'linear-gradient(45deg, #95a5a6, #7f8c8d)';
    } else if (motivationLevel <= 25) {
        document.querySelector('.motivation-fill').style.background = 'linear-gradient(45deg, #e74c3c, #c0392b)';
    }
}

function updatePersonalRecord() {
    const records = document.querySelectorAll('.record-item');
    const randomRecord = records[Math.floor(Math.random() * (records.length - 1))]; // Exclude last one
    const recordValue = randomRecord.querySelector('.record-value');
    
    if (recordValue && recordValue.id) {
        const currentValue = parseInt(recordValue.textContent) || 0;
        recordValue.textContent = currentValue + 1;
        
        // Animate the update
        randomRecord.style.background = 'rgba(243, 156, 18, 0.3)';
        setTimeout(() => {
            randomRecord.style.background = 'rgba(243, 156, 18, 0.1)';
        }, 1000);
    }
}

function motivateUser() {
    const trainer = document.querySelector('.trainer');
    const quote = trainerQuotes[Math.floor(Math.random() * trainerQuotes.length)];
    
    trainer.classList.add('frustrated');
    showAlert(quote);
    
    // Add sweat drops
    createSweatDrop();
    
    // Decrease motivation slightly
    motivationLevel = Math.max(motivationLevel - 5, 0);
    updateMotivationMeter();
    
    setTimeout(() => {
        trainer.classList.remove('frustrated');
    }, 2000);
}

function createSweatDrop() {
    sweatDrops++;
    const sweat = document.createElement('div');
    sweat.className = 'sweat-drop';
    sweat.textContent = '💧';
    sweat.style.left = (Math.random() * 80 + 10) + '%';
    sweat.style.top = '30%';
    
    document.querySelector('.gym-container').appendChild(sweat);
    
    setTimeout(() => {
        if (sweat.parentNode) {
            sweat.parentNode.removeChild(sweat);
        }
    }, 2000);
}

function startExercise(exercise) {
    if (workoutInProgress) {
        showAlert("🚫 One exercise at a time! Focus your futile energy!");
        return;
    }
    
    workoutInProgress = true;
    currentExercise = exercise;
    
    const exerciseElement = document.querySelector(`[data-exercise="${exercise}"]`);
    exerciseElement.style.background = 'rgba(46, 204, 113, 0.2)';
    exerciseElement.style.borderLeftColor = '#2ecc71';
    
    const motivationQuotes = exerciseMotivation[exercise];
    if (motivationQuotes) {
        const quote = motivationQuotes[Math.floor(Math.random() * motivationQuotes.length)];
        showAlert(quote);
    }
    
    // Simulate workout duration
    const workoutDuration = Math.random() * 3000 + 2000; // 2-5 seconds
    
    setTimeout(() => {
        completeExercise(exerciseElement);
    }, workoutDuration);
}

function completeExercise(exerciseElement) {
    workoutInProgress = false;
    currentExercise = null;
    
    exerciseElement.classList.add('completed');
    exerciseElement.querySelector('.exercise-reps').textContent = 'FAILED ✓';
    
    showAlert("🏆 Exercise completed! You're now stronger AND still blocked!");
    
    // Slight motivation boost for completing exercise
    motivationLevel = Math.min(motivationLevel + 2, 100);
    updateMotivationMeter();
    
    updateStats();
    createSweatDrop();
}

function useEquipment(equipment) {
    const equipmentElement = document.querySelector(`[data-equipment="${equipment}"]`);
    const failures = equipmentFailures[equipment];
    
    equipmentElement.classList.add('broken');
    
    if (failures) {
        const failure = failures[Math.floor(Math.random() * failures.length)];
        showAlert(failure);
    }
    
    // Update equipment status
    const statusElement = equipmentElement.querySelector('.equipment-status');
    statusElement.textContent = 'Status: Temporarily Broken';
    statusElement.style.color = '#e74c3c';
    
    setTimeout(() => {
        equipmentElement.classList.remove('broken');
        statusElement.textContent = 'Status: Existentially Questionable';
        statusElement.style.color = '#bdc3c7';
    }, 3000);
    
    updateStats();
}

function toggleMusic() {
    const musicIcon = document.getElementById('gymMusic');
    
    musicPlaying = !musicPlaying;
    
    if (musicPlaying) {
        musicIcon.textContent = '🔊';
        musicIcon.style.animation = 'musicBeat 0.5s ease-in-out infinite';
        showAlert("🎵 PUMP-UP MUSIC ACTIVATED! (Silence mode: ON)");
    } else {
        musicIcon.textContent = '🔇';
        musicIcon.style.animation = 'musicBeat 1s ease-in-out infinite';
        showAlert("🔇 Music stopped. Even the speakers gave up.");
    }
}

function startImpossibleWorkout() {
    if (workoutInProgress) {
        showAlert("💪 Already working out! Can't you see you're failing magnificently?");
        return;
    }
    
    showAlert("🔥 IMPOSSIBLE WORKOUT INITIATED! Prepare for maximum disappointment!");
    
    // Start a series of automatic exercises
    const exercises = ['refresh', 'url', 'vpn', 'incognito', 'hope'];
    let exerciseIndex = 0;
    
    const workoutInterval = setInterval(() => {
        if (exerciseIndex < exercises.length && !workoutInProgress) {
            startExercise(exercises[exerciseIndex]);
            exerciseIndex++;
        } else if (exerciseIndex >= exercises.length) {
            clearInterval(workoutInterval);
            showAlert("🏆 IMPOSSIBLE WORKOUT COMPLETE! You're impossibly disappointed!");
        }
    }, 6000);
}

function checkProgress() {
    const progressMessages = [
        "📈 Progress Report: You've made negative progress! Impressive!",
        "📊 Analysis Complete: 100% effort, 0% results. Perfect ratio!",
        "🎯 Goal Achievement: Successfully failed at every attempt!",
        "💯 Efficiency Rating: Perfectly inefficient! A true master!",
        "📋 Performance Review: Your dedication to futility is inspiring!",
        "🏆 Achievement Unlocked: Professional Time Waster!",
        "⭐ Progress Summary: Like a treadmill - lots of movement, no distance!"
    ];
    
    const message = progressMessages[Math.floor(Math.random() * progressMessages.length)];
    showAlert(message);
    
    // Update a random stat
    updatePersonalRecord();
    
    // Decrease motivation for checking non-existent progress
    motivationLevel = Math.max(motivationLevel - 3, 0);
    updateMotivationMeter();
}

function giveUpAndGoOutside() {
    const outdoorActivities = [
        "🌞 EXCELLENT CHOICE! The sun is a giant ball of nuclear fire, but less frustrating than blocked content!",
        "🏃‍♂️ Real exercise time! Your legs remember how to move without clicking!",
        "🌳 Nature therapy activated! Trees don't have Wi-Fi passwords!",
        "🦋 Fresh air detected! Your computer is jealous!",
        "🌸 Touching grass achievement unlocked! Your mouse feels abandoned!",
        "🏔️ Adventure mode enabled! No network required!",
        "🌈 Reality graphics upgrade successful! Better than any website!"
    ];
    
    const activity = outdoorActivities[Math.floor(Math.random() * outdoorActivities.length)];
    showAlert(activity);
    
    setTimeout(() => {
        if (confirm("Leave the gym and embrace the real world? (You can always come back to disappointment later)")) {
            showAlert("🎉 CONGRATULATIONS! You've graduated from Digital Disappointment Gym!");
            setTimeout(() => {
                location.reload();
            }, 2000);
        }
    }, 3000);
}

// Random gym announcements
setInterval(() => {
    if (Math.random() < 0.1) { // 10% chance every interval
        const announcements = [
            "🔊 GYM ANNOUNCEMENT: Remember to stay hydrated! Tears don't count as water intake.",
            "📢 ATTENTION: Lost and Found has your hopes and dreams. They're in terrible condition.",
            "🚨 SAFETY REMINDER: Please wipe down equipment after crying on it.",
            "📻 NOW PLAYING: The sound of your own disappointed sighs, on repeat.",
            "🎯 TRAINER TIP: The only thing you're lifting today is your own expectations. Put them down.",
            "⚡ POWER OUTAGE: The machines have given up trying to help you.",
            "🏆 MEMBER SPOTLIGHT: Everyone! You're all equally unsuccessful!"
        ];
        
        const announcement = announcements[Math.floor(Math.random() * announcements.length)];
        showAlert(announcement);
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
    // Trainer
    const trainer = document.querySelector('.trainer');
    if (trainer) {
        trainer.addEventListener('click', motivateUser);
    }
    
    // Exercises
    const exercises = document.querySelectorAll('.exercise');
    exercises.forEach(exercise => {
        exercise.addEventListener('click', function() {
            const exerciseType = this.dataset.exercise;
            if (exerciseType) {
                startExercise(exerciseType);
            }
        });
    });
    
    // Equipment
    const equipment = document.querySelectorAll('.equipment');
    equipment.forEach(item => {
        item.addEventListener('click', function() {
            const equipmentType = this.dataset.equipment;
            if (equipmentType) {
                useEquipment(equipmentType);
            }
        });
    });
    
    // Music
    const musicIcon = document.getElementById('gymMusic');
    if (musicIcon) {
        musicIcon.addEventListener('click', toggleMusic);
    }
    
    // Stat cards (make them interactive)
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('click', function() {
            const label = this.querySelector('.stat-label').textContent;
            showAlert(`📊 ${label}: You're in the top 1% of people who care about this useless statistic!`);
        });
    });
    
    // Buttons
    const buttons = document.querySelectorAll('.button');
    buttons.forEach(button => {
        const buttonText = button.textContent.trim();
        if (buttonText.includes('Start Impossible Workout')) {
            button.addEventListener('click', startImpossibleWorkout);
        } else if (buttonText.includes('Check Non-Existent Progress')) {
            button.addEventListener('click', checkProgress);
        } else if (buttonText.includes('Give Up and Go Outside')) {
            button.addEventListener('click', giveUpAndGoOutside);
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
        }, 4000);
    } else {
        console.log('Gym Alert:', message);
    }
}