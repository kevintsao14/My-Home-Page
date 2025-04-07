// Initialize Lucide icons
lucide.createIcons();

// Fill input with starter prompt
function fillInput(text) {
    const input = document.getElementById('message-input');
    input.value = text;
    input.focus();
}

// Handle form submission
document.getElementById('chat-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const messageInput = document.getElementById('message-input');
    const responseEl = document.getElementById('response');
    const sendBtn = document.getElementById('send-btn');

    const userMessage = messageInput.value.trim();
    if (!userMessage) return;

    // Create the user's message element
    addMessage(userMessage, 'user');

    // Process keywords to reveal sections
    processKeywords(userMessage);

    // Disable button and show loading state
    sendBtn.disabled = true;
    const originalBtnHTML = sendBtn.innerHTML;
    sendBtn.innerHTML = '<i data-lucide="loader"></i>';
    lucide.createIcons();

    try {
        // Call the Flowise API through your backend
        const res = await fetch("/api/flowise", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: userMessage }),
        });

        const data = await res.text();

        // Add bot response to chat
        addMessage(data, 'bot');

        // Scroll the chat container to the bottom
        responseEl.scrollTop = responseEl.scrollHeight;
    } catch (error) {
        // Handle errors
        const errorDiv = document.createElement('div');
        errorDiv.className = 'message bot-message';

        const labelSpan = document.createElement('span');
        labelSpan.className = 'message-label';
        labelSpan.textContent = 'Kevin:';

        const contentSpan = document.createElement('span');
        contentSpan.className = 'message-content';
        contentSpan.textContent = `Sorry, there was an error: ${error.message}`;

        errorDiv.appendChild(labelSpan);
        errorDiv.appendChild(contentSpan);

        responseEl.appendChild(errorDiv);
        responseEl.scrollTop = responseEl.scrollHeight;
    } finally {
        // Reset button state
        sendBtn.disabled = false;
        sendBtn.innerHTML = originalBtnHTML;
        lucide.createIcons();

        // Clear input
        messageInput.value = '';
    }
});

// Add message to chat
function addMessage(text, sender) {
    const responseDiv = document.getElementById('response');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;

    // Create message content with label
    const labelSpan = document.createElement('span');
    labelSpan.className = 'message-label';
    labelSpan.textContent = sender === 'user' ? 'You:' : 'Kevin:';

    const contentSpan = document.createElement('span');
    contentSpan.className = 'message-content';

    // If the bot message includes HTML (like <br> tags from backend), use innerHTML
    if (sender === 'bot') {
        contentSpan.innerHTML = text;
    } else {
        contentSpan.textContent = text;
    }

    messageDiv.appendChild(labelSpan);
    messageDiv.appendChild(contentSpan);

    responseDiv.appendChild(messageDiv);
    responseDiv.scrollTop = responseDiv.scrollHeight;
}

// Use event delegation to handle clicks anywhere in the document
document.addEventListener('click', function (e) {
    // Check if the clicked element or any of its parents is a contact-toggle link
    const contactToggle = e.target.closest('.contact-toggle');

    // Only proceed if we found a contact-toggle AND it's already unlocked
    if (contactToggle && contactToggle.classList.contains('unlocked')) {
        // Prevent the default link behavior (which would try to navigate to "#")
        e.preventDefault();

        // Toggle the "show" class on the dropdown - if it's visible, hide it; if hidden, show it
        document.querySelector('.contact-dropdown').classList.toggle('show');
    }
});

// Handle sidebar link clicks
document.querySelectorAll('.profile-link').forEach(link => {
    link.addEventListener('click', (e) => {
        // If link is locked, prevent default action
        if (link.classList.contains('locked')) {
            e.preventDefault();
            // Optionally show a tooltip or message that this section is locked
            const messageInput = document.getElementById('message-input');
            messageInput.value = 'How can I unlock more information about you?';
            messageInput.focus();
            return;
        }

        // If link has a data-section attribute, reveal that section
        const sectionId = link.getAttribute('data-section');
        if (sectionId) {
            e.preventDefault();
            document.querySelector('.' + sectionId).classList.add('reveal');
        }
    });
});

// Function to unlock a section when specific keywords are detected
function unlockSection(sectionName, displayName = null) {
    let wasUnlocked = false;

    // Handle section reveals (in main content)
    const sectionLink = document.querySelector(`.profile-link[data-section="${sectionName}"]`);
    if (sectionLink && sectionLink.classList.contains('locked')) {
        sectionLink.classList.remove('locked');
        sectionLink.classList.add('unlocked');

        // Show the corresponding section
        document.querySelector('.' + sectionName).classList.add('reveal');
        wasUnlocked = true;
    }

    // Handle dropdown toggles
    const toggleLink = document.querySelector(`.profile-link[data-toggle="${sectionName}"]`);
    if (toggleLink && toggleLink.classList.contains('locked')) {
        toggleLink.classList.remove('locked');
        toggleLink.classList.add('unlocked');

        // Show the dropdown
        document.querySelector('.' + sectionName).classList.add('show');
        wasUnlocked = true;
    }

    // Handle profile picture reveal
    if (sectionName === 'profile-pic' && !document.getElementById('profile-pic').classList.contains('reveal')) {
        document.getElementById('profile-pic').classList.add('reveal');
        wasUnlocked = true;
    }

    // Show unlock notification if something was unlocked
    if (wasUnlocked) {
        // Use provided display name or fallback to link text content
        const unlockName = displayName ||
            (sectionLink ? sectionLink.querySelector('span').textContent :
                (toggleLink ? toggleLink.querySelector('span').textContent : sectionName));

        showUnlockNotification(unlockName);
    }
}

// Process keywords and reveal sections
// Enhanced processKeywords function
function processKeywords(message) {
    const lowerMsg = message.toLowerCase();

    // Profile picture keywords
    if (lowerMsg.includes('profile picture') || lowerMsg.includes('profile pic') ||
        lowerMsg.includes('your picture') || lowerMsg.includes('your photo') ||
        lowerMsg.includes('your face') || lowerMsg.includes('what do you look like') ||
        lowerMsg.includes('how do you look') || lowerMsg.includes('show your picture') ||
        lowerMsg.includes('show me your face') || lowerMsg.includes('show me how you look')) {

        unlockSection('profile-pic', 'Profile Picture');
    }

    // Project keywords
    if (lowerMsg.includes('project') || lowerMsg.includes('work') || lowerMsg.includes('portfolio')) {
        document.querySelector('.projects-section').classList.add('reveal');
        unlockSection('projects-section');
    }

    // Hobby keywords
    if (lowerMsg.includes('hobby') || lowerMsg.includes('hobbies') || lowerMsg.includes('interest') ||
        lowerMsg.includes('free time') || lowerMsg.includes('fun')) {
        document.querySelector('.hobbies-section').classList.add('reveal');
        unlockSection('hobbies-section');
    }

    // Educational background keywords
    if (lowerMsg.includes('education') || lowerMsg.includes('school') || lowerMsg.includes('university') ||
        lowerMsg.includes('degree') || lowerMsg.includes('study')) {
        unlockSection('education-section');
    }

    // Experience keywords
    if (lowerMsg.includes('experience') || lowerMsg.includes('work history') || lowerMsg.includes('job') ||
        lowerMsg.includes('career') || lowerMsg.includes('employment')) {
        unlockSection('experience-section');
    }

    // Skills keywords
    if (lowerMsg.includes('skill') || lowerMsg.includes('programming') || lowerMsg.includes('technology') ||
        lowerMsg.includes('language') || lowerMsg.includes('framework')) {
        unlockSection('skills-section');
    }

    // Contact keywords
    if (lowerMsg.includes('contact') || lowerMsg.includes('email') || lowerMsg.includes('reach out') ||
        lowerMsg.includes('connect') || lowerMsg.includes('message') || lowerMsg.includes('social media') ||
        lowerMsg.includes('instagram') || lowerMsg.includes('linkedin') || lowerMsg.includes('github')) {
        unlockSection('contact-dropdown');
    }

    // Easter egg
    if (lowerMsg.includes('easter egg') || lowerMsg.includes('secret') || lowerMsg.includes('surprise me')) {
        triggerConfetti();
    }
}


// Easter egg: Trigger confetti
function triggerConfetti() {
    document.body.classList.add('party-mode');
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });

    setTimeout(() => {
        document.body.classList.remove('party-mode');
    }, 3000);
}

function showUnlockNotification(text) {
    const unlockMessage = document.createElement('div');
    unlockMessage.className = 'unlock-notification';
    unlockMessage.textContent = `🔓 You've unlocked ${text}!`;
    document.body.appendChild(unlockMessage);

    setTimeout(() => {
        unlockMessage.classList.add('show');
    }, 100);

    setTimeout(() => {
        unlockMessage.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(unlockMessage);
        }, 500);
    }, 3000);
}

// Update the contact link click handler
document.addEventListener('click', function (e) {
    // Check if the clicked element is an unlocked contact link with data-toggle attribute
    const contactLink = e.target.closest('.profile-link[data-toggle="contact-dropdown"]');
    if (contactLink && contactLink.classList.contains('unlocked')) {
        e.preventDefault();
        document.querySelector('.contact-dropdown').classList.toggle('show');
    }
});

document.addEventListener('click', function (e) {
    if (e.target.classList.contains('copy-email') || e.target.closest('.copy-email')) {
        const button = e.target.classList.contains('copy-email') ? e.target : e.target.closest('.copy-email');
        const email = button.getAttribute('data-email');

        // Copy to clipboard
        navigator.clipboard.writeText(email).then(() => {
            // Show notification
            const notification = document.createElement('div');
            notification.className = 'copy-notification';
            notification.textContent = '✓ Email copied to clipboard!';
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.classList.add('show');
            }, 100);

            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 500);
            }, 3000);
        });
    }
});