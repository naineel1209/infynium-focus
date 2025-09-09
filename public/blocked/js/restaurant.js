/**
 * JavaScript functionality for restaurant.html
 */

let restaurantAttempts = parseInt(localStorage.getItem('restaurantAttempts') || '0');
let disappointmentLevel = 0;
let chefAnger = 0;
let cookingTimer = null;
let cookingTime = 0;
let ordersPlaced = 0;

const chefResponses = [
    "WHAT?! You want content that's BLOCKED?! GET OUT OF MY KITCHEN!",
    "This is the third time today someone's asked for that! Do I look like a miracle worker?!",
    "Listen here, you muppet! The content is BLOCKED! B-L-O-C-K-E-D!",
    "I've been cooking disappointment for 20 years, and yours is PERFECTLY DONE!",
    "You know what? I'm calling Gordon Ramsay. Even HE couldn't fix this mess!",
    "The audacity! The SHEER AUDACITY to waltz in here expecting blocked content!",
    "I don't serve impossibilities! This isn't Hogwarts, it's a BISTRO!",
    "My grandmother could access blocked content better than you, AND SHE'S BEEN DEAD FOR 10 YEARS!"
];

const menuReactions = [
    "🍽️ *Chef throws his hat on the ground* 'NOT AVAILABLE!'",
    "🔥 *Kitchen catches fire from pure frustration*",
    "👨‍🍳 *Chef dramatically faints* 'The audacity!'",
    "💸 *Cash register displays ERROR 402: Payment Required*",
    "⏰ *Clock stops working from the impossibility of the request*",
    "🚫 *Menu spontaneously combusts*",
    "🍝 *Pasta refuses to cook out of solidarity with the blocked content*",
    "🧂 *Salt shaker shakes head disapprovingly*"
];

const chefMoods = [
    "Mildly Annoyed", "Significantly Frustrated", "Approaching Rage",
    "Gordon Ramsay Mode", "Volcanic Fury", "Transcendent Anger",
    "Existential Crisis", "Beyond Human Comprehension"
];

const ingredientComplains = {
    hope: "Hope: 'I expired the moment you tried to access blocked content!'",
    patience: "Patience: 'I'm running thinner than my expiration date!'",
    expectations: "Expectations: 'I've been crushed more times than garlic!'",
    reality: "Reality: 'I'm the only thing fully stocked here, unfortunately.'"
};

const impossibleOrders = [
    "One serving of blocked content, medium-rare",
    "Unrestricted access with a side of privacy",
    "The website you're looking for, served hot",
    "A bowl of your broken dreams",
    "Productivity soup (we're fresh out)",
    "Common sense sandwich (chef's recommendation)",
    "Time well spent (not on the menu)",
    "A reality check with extra bitter truth"
];

function init() {
    restaurantAttempts++;
    localStorage.setItem('restaurantAttempts', restaurantAttempts.toString());
    
    updateDisappointmentMeter();
    createKitchenSteam();
    updateChefMood();
    
    // Show escalating restaurant status
    if (restaurantAttempts > 5) {
        document.getElementById('waitTime').textContent = "Heat Death of Universe";
    } else if (restaurantAttempts > 10) {
        document.getElementById('ingredientsStatus').textContent = "Pure Concentrated Disappointment";
    }
}

function updateDisappointmentMeter() {
    disappointmentLevel = Math.min(disappointmentLevel + 10 + (restaurantAttempts * 2), 100);
    document.getElementById('disappointmentFill').style.width = disappointmentLevel + '%';
    document.getElementById('disappointmentLevel').textContent = Math.floor(disappointmentLevel);
    
    if (disappointmentLevel >= 100) {
        document.getElementById('disappointmentLevel').textContent = "MAXIMUM";
        document.querySelector('.disappointment-fill').style.background = 
            'linear-gradient(45deg, #8e44ad, #9b59b6)';
    }
}

function updateChefMood() {
    chefAnger = Math.min(chefAnger + 1, chefMoods.length - 1);
    document.getElementById('chefMood').textContent = chefMoods[chefAnger];
    
    if (chefAnger > 4) {
        document.getElementById('chefMood').style.color = '#9b59b6';
    }
}

function createKitchenSteam() {
    const steamContainer = document.getElementById('kitchenSteam');
    
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            const steam = document.createElement('div');
            steam.className = 'steam';
            steam.style.left = Math.random() * 100 + '%';
            steam.style.animationDelay = Math.random() * 5 + 's';
            steam.style.animationDuration = (6 + Math.random() * 4) + 's';
            steamContainer.appendChild(steam);
            
            // Remove steam after animation
            setTimeout(() => {
                if (steam.parentNode) {
                    steam.parentNode.removeChild(steam);
                }
            }, 10000);
        }, i * 1000);
    }
}

function speakToChef() {
    const chef = document.querySelector('.chef');
    const fireEffect = document.querySelector('.fire-effect');
    
    // Make chef angry
    chef.classList.add('angry');
    
    // Show fire effect
    fireEffect.style.animation = 'flameUp 1s ease-in-out 3';
    
    // Chef response
    const response = chefResponses[Math.floor(Math.random() * chefResponses.length)];
    showAlert(`👨‍🍳 Chef: "${response}"`);
    
    updateChefMood();
    updateDisappointmentMeter();
    
    setTimeout(() => {
        chef.classList.remove('angry');
        fireEffect.style.animation = 'flameUp 3s ease-in-out infinite';
    }, 2000);
}

function orderMenuItem(menuItem) {
    const reaction = menuReactions[Math.floor(Math.random() * menuReactions.length)];
    showAlert(reaction);
    
    // Animate the menu item
    menuItem.style.background = 'rgba(231, 76, 60, 0.3)';
    menuItem.style.transform = 'translateX(10px)';
    
    setTimeout(() => {
        menuItem.style.background = '';
        menuItem.style.transform = '';
    }, 1000);
    
    updateDisappointmentMeter();
}

function inspectIngredient(ingredient) {
    const ingredientType = ingredient.dataset.ingredient;
    const complaint = ingredientComplains[ingredientType];
    
    if (complaint) {
        showAlert(complaint);
    }
    
    // Make ingredient spoiled
    ingredient.classList.add('spoiled');
    const statusEl = ingredient.querySelector('.ingredient-status');
    statusEl.textContent = 'Status: Spoiled by Reality';
    statusEl.style.color = '#e74c3c';
    
    setTimeout(() => {
        ingredient.classList.remove('spoiled');
    }, 3000);
}

function placeImpossibleOrder() {
    ordersPlaced++;
    const order = impossibleOrders[Math.floor(Math.random() * impossibleOrders.length)];
    
    showAlert(`📝 Order placed: "${order}"`);
    
    // Start cooking timer (fake cooking)
    startCookingTimer();
    
    setTimeout(() => {
        showAlert("👨‍🍳 Chef: 'ORDER CANCELLED! We don't serve impossibilities!'");
        stopCookingTimer();
        updateDisappointmentMeter();
    }, 5000);
}

function startCookingTimer() {
    const timerElement = document.getElementById('cookingTimer');
    const timerText = document.getElementById('timerText');
    
    timerElement.classList.add('cooking');
    cookingTime = 0;
    
    cookingTimer = setInterval(() => {
        cookingTime++;
        const minutes = Math.floor(cookingTime / 60);
        const seconds = cookingTime % 60;
        timerText.textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function stopCookingTimer() {
    if (cookingTimer) {
        clearInterval(cookingTimer);
        cookingTimer = null;
    }
    
    const timerElement = document.getElementById('cookingTimer');
    const timerText = document.getElementById('timerText');
    
    timerElement.classList.remove('cooking');
    timerText.textContent = "FAILED";
    
    setTimeout(() => {
        timerText.textContent = "00:00";
    }, 3000);
}

function complainToChef() {
    const complaints = [
        "👨‍🍳 Chef: 'COMPLAIN?! I'LL GIVE YOU SOMETHING TO COMPLAIN ABOUT!'",
        "👨‍🍳 Chef: 'You want to speak to my manager? I AM THE MANAGER!'",
        "👨‍🍳 Chef: 'One star review? I'll give you one star - it's the one I'm seeing right now from hitting my head on the wall!'",
        "👨‍🍳 Chef: 'Gordon Ramsay would be PROUD of my restraint right now!'",
        "👨‍🍳 Chef: 'I've cooked for royalty, celebrities, and now... YOU. This is my rock bottom!'",
        "👨‍🍳 Chef: 'You know what? I QUIT! I'm opening a food truck!'",
        "👨‍🍳 Chef: 'Complaint registered. Processing... Processing... ERROR 404: Sympathy not found.'"
    ];
    
    const complaint = complaints[Math.floor(Math.random() * complaints.length)];
    showAlert(complaint);
    
    // Chef gets angrier
    speakToChef();
    
    setTimeout(() => {
        if (ordersPlaced > 3) {
            showAlert("🚨 MANAGEMENT: 'Sir, we're going to have to ask you to leave.'");
        }
    }, 3000);
}

function leaveHungry() {
    const exitMessages = [
        "👋 You leave with an empty stomach and a fuller understanding of disappointment.",
        "🚪 The door hits you on the way out. The door apologizes - it has better manners than you.",
        "🎭 You leave the bistro, but the bistro doesn't leave you. It haunts your dreams.",
        "📱 You immediately post a 1-star review. The review gets blocked too.",
        "🏃‍♂️ You run to the nearest fast food place. They're out of everything you want.",
        "💭 You realize the real meal was the disappointment you made along the way.",
        "🎪 You join the circus. At least there, disappointment is entertainment."
    ];
    
    const message = exitMessages[Math.floor(Math.random() * exitMessages.length)];
    showAlert(message);
    
    setTimeout(() => {
        if (confirm("Leave the bistro and try a different blocked site? (Spoiler: They're all blocked)")) {
            location.reload();
        }
    }, 3000);
}

function addRandomReview() {
    const reviewsSection = document.querySelector('.reviews-section');
    const reviewAuthors = [
        'HungryHacker', 'DisappointedDev', 'FrustratedFoodie', 'DesperateCustomer',
        'OptimisticOliver', 'PessimisticPete', 'CynicalSarah', 'NaiveNancy'
    ];
    
    const reviewTexts = [
        "Came expecting food, left with philosophical questions about existence.",
        "The disappointment was so thick you could cut it with a knife. If they had knives. Which they don't.",
        "Asked for the manager. Turns out the manager is also blocked.",
        "Five stars for authenticity. Zero stars for everything else.",
        "Plot twist: I AM the food. This is actually a documentary about hunger.",
        "Would rate zero stars but the rating system is also blocked.",
        "The chef's anger was the only thing that was perfectly seasoned."
    ];
    
    const newReview = document.createElement('div');
    newReview.className = 'review';
    newReview.style.opacity = '0';
    newReview.innerHTML = `
        <div class="review-author">${reviewAuthors[Math.floor(Math.random() * reviewAuthors.length)]}</div>
        <div class="review-stars">★☆☆☆☆</div>
        <div class="review-text">${reviewTexts[Math.floor(Math.random() * reviewTexts.length)]}</div>
    `;
    
    reviewsSection.appendChild(newReview);
    
    setTimeout(() => {
        newReview.style.opacity = '1';
        newReview.style.transition = 'opacity 0.5s ease';
    }, 100);
}

// Random kitchen incidents
setInterval(() => {
    if (Math.random() < 0.12) { // 12% chance every interval
        const incidents = [
            "🔥 Kitchen Incident: Chef accidentally burned the disappointment. It's now extra crispy.",
            "💨 Breaking: Kitchen runs out of steam. Literally.",
            "🍝 Plot Twist: The pasta gained sentience and demands workers' rights.",
            "⚡ Power Outage: Even the electricity refuses to power this establishment.",
            "🐭 Health Inspector: 'I found something worse than mice - false hope.'",
            "📺 Food Network called. They want to do a documentary on culinary disasters.",
            "🎪 The bistro is considering converting to a circus. More honest advertising."
        ];
        
        const incident = incidents[Math.floor(Math.random() * incidents.length)];
        showAlert(incident);
        
        // Add random review occasionally
        if (Math.random() < 0.3) {
            setTimeout(addRandomReview, 2000);
        }
    }
}, 18000);

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    init();
    setupEventListeners();
});

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Chef
    const chef = document.querySelector('.chef');
    if (chef) {
        chef.addEventListener('click', speakToChef);
    }
    
    // Menu items
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            orderMenuItem(this);
        });
    });
    
    // Ingredients
    const ingredients = document.querySelectorAll('.ingredient');
    ingredients.forEach(ingredient => {
        ingredient.addEventListener('click', function() {
            inspectIngredient(this);
        });
    });
    
    // Cooking timer
    const cookingTimer = document.getElementById('cookingTimer');
    if (cookingTimer) {
        cookingTimer.addEventListener('click', function() {
            if (this.classList.contains('cooking')) {
                showAlert("⏰ Timer: 'I'm trying my best here! The impossible takes a little longer!'");
            } else {
                showAlert("⏰ Timer: 'I refuse to time something that will never be ready.'");
            }
        });
    }
    
    // Buttons
    const buttons = document.querySelectorAll('.button');
    buttons.forEach(button => {
        const buttonText = button.textContent.trim();
        if (buttonText.includes('Place Impossible Order')) {
            button.addEventListener('click', placeImpossibleOrder);
        } else if (buttonText.includes('Complain to Chef')) {
            button.addEventListener('click', complainToChef);
        } else if (buttonText.includes('Leave Hungry')) {
            button.addEventListener('click', leaveHungry);
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
        console.log('Restaurant Alert:', message);
    }
}