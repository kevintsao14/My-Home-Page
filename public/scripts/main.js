// Initialize Lucide icons
lucide.createIcons();

// Global state to track if name has been revealed
let nameRevealed = false;

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

    // Check if message is asking about name
    const lowerMessage = userMessage.toLowerCase();
    if (!nameRevealed && (
        lowerMessage.includes("what is your name") || 
        lowerMessage.includes("who are you") ||
        lowerMessage.includes("your name") ||
        lowerMessage.includes("what's your name") ||
        lowerMessage.includes("whats your name")
    )) {
        nameRevealed = true;
        
        // Update name in sidebar and hero section
        document.querySelector('.profile-name').textContent = "Kevin Tsao";
        document.querySelector('.name-glow').textContent = "Kevin";
        
        // Show notification that name was revealed
        showUnlockNotification('My real name!');
    }

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
    // FIX: Use responseDiv not responseEl
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

// Function to scroll to an element within the scrollable sidebar area
function scrollToSidebarElement(element) {
    const scrollableArea = document.querySelector('.profile-scrollable');
    if (!element || !scrollableArea) return;
    
    // Calculate the element's position relative to the scrollable container
    const elementTop = element.offsetTop;
    const containerScrollTop = scrollableArea.scrollTop;
    const containerHeight = scrollableArea.clientHeight;
    
    // Only scroll if the element is not already fully visible
    if (elementTop < containerScrollTop || elementTop > containerScrollTop + containerHeight) {
        // Smooth scroll to the element
        scrollableArea.scrollTo({
            top: elementTop - 20, // 20px padding from the top
            behavior: 'smooth'
        });
    }
}

// Updated unlockSection function with improved handling for all section types
function unlockSection(sectionName, displayName = null) {
    console.log(`Attempting to unlock section: ${sectionName}`);
    let wasUnlocked = false;

    // Handle section reveals (in main content)
    const sectionLink = document.querySelector(`.profile-link[data-section="${sectionName}"]`);
    if (sectionLink) {
        console.log(`Found section link for ${sectionName}`);
        if (sectionLink.classList.contains('locked')) {
            console.log(`Unlocking section link for ${sectionName}`);
            sectionLink.classList.remove('locked');
            sectionLink.classList.add('unlocked');
            wasUnlocked = true;
        }

        // Always ensure the section is revealed, even if the link was already unlocked
        const section = document.querySelector('.' + sectionName);
        if (section) {
            console.log(`Revealing section ${sectionName}`);
            section.classList.add('reveal');
        } else {
            console.log(`Could not find section element with class ${sectionName}`);
        }
    } else {
        console.log(`Could not find section link for ${sectionName}`);
    }

    // Handle dropdown toggles
    const toggleLink = document.querySelector(`.profile-link[data-toggle="${sectionName}"]`);
    if (toggleLink) {
        console.log(`Found toggle link for ${sectionName}`);
        if (toggleLink.classList.contains('locked')) {
            console.log(`Unlocking toggle link for ${sectionName}`);
            toggleLink.classList.remove('locked');
            toggleLink.classList.add('unlocked');
            wasUnlocked = true;
        }

        // Always ensure the dropdown is shown, even if the link was already unlocked
        const dropdown = document.querySelector('.' + sectionName);
        if (dropdown) {
            console.log(`Showing dropdown ${sectionName}`);
            dropdown.classList.add('show');
        } else {
            console.log(`Could not find dropdown with class ${sectionName}`);
        }
    }

    // Handle profile picture reveal
    if (sectionName === 'profile-pic' && !document.getElementById('profile-pic').classList.contains('reveal')) {
        console.log('Revealing profile picture');
        document.getElementById('profile-pic').classList.add('reveal');
        wasUnlocked = true;
    }

    // Show unlock notification if something was unlocked
    if (wasUnlocked) {
        // Use provided display name or fallback to link text content
        const unlockName = displayName ||
            (sectionLink ? sectionLink.querySelector('span').textContent :
                (toggleLink ? toggleLink.querySelector('span').textContent : sectionName));

        console.log(`Showing unlock notification for ${unlockName}`);
        showUnlockNotification(unlockName);
        
        // Scroll to the newly unlocked section in the sidebar
        if (sectionLink) {
            scrollToSidebarElement(sectionLink);
        } else if (toggleLink) {
            scrollToSidebarElement(toggleLink);
        }
    } else {
        console.log(`No unlock was needed for ${sectionName}`);
    }
    
    return wasUnlocked;
}
// Updated process keywords function to properly reveal sections
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
    if (lowerMsg.includes('project') || lowerMsg.includes('portfolio') || 
        lowerMsg.includes('work') || lowerMsg.includes('app')) {
        console.log("Project keywords detected");
        document.querySelector('.projects-section').classList.add('reveal');
        unlockSection('projects-section', 'Projects');
    }

    // Hobby keywords
    if (lowerMsg.includes('hobby') || lowerMsg.includes('hobbies') || lowerMsg.includes('interest') ||
        lowerMsg.includes('free time') || lowerMsg.includes('fun') || lowerMsg.includes('passion')) {
        console.log("Hobby keywords detected");
        document.querySelector('.hobbies-section').classList.add('reveal');
        unlockSection('hobbies-section', 'Hobbies');
    }

    // Educational background keywords
    if (lowerMsg.includes('education') || lowerMsg.includes('school') || lowerMsg.includes('university') ||
        lowerMsg.includes('degree') || lowerMsg.includes('study') || lowerMsg.includes('college') ||
        lowerMsg.includes('academic') || lowerMsg.includes('graduate')) {
        console.log("Education keywords detected");
        document.querySelector('.education-section').classList.add('reveal');
        unlockSection('education-section', 'Education');
    }

    // Background keywords
    if (lowerMsg.includes('born') || lowerMsg.includes('live') || lowerMsg.includes('location') ||
        lowerMsg.includes('childhood') || lowerMsg.includes('background') || lowerMsg.includes('from') ||
        lowerMsg.includes('origin') || lowerMsg.includes('hometown') || lowerMsg.includes('cultural') ||
        lowerMsg.includes('language') || lowerMsg.includes('values')) {
        console.log("Background keywords detected");
        document.querySelector('.background-section').classList.add('reveal');
        unlockSection('background-section', 'Background');
    }

    // Career keywords
    if (lowerMsg.includes('career') || lowerMsg.includes('job') || lowerMsg.includes('employment') ||
        lowerMsg.includes('profession') || lowerMsg.includes('company') || lowerMsg.includes('role') ||
        lowerMsg.includes('technology') || lowerMsg.includes('working') || lowerMsg.includes('intern') ||
        lowerMsg.includes('experience') || lowerMsg.includes('professional')) {
        console.log("Career keywords detected");
        document.querySelector('.career-section').classList.add('reveal');
        unlockSection('career-section', 'Career');
    }

    // Contact keywords
    if (lowerMsg.includes('contact') || lowerMsg.includes('email') || lowerMsg.includes('reach out') ||
        lowerMsg.includes('connect') || lowerMsg.includes('message') || lowerMsg.includes('social media') ||
        lowerMsg.includes('instagram') || lowerMsg.includes('linkedin') || lowerMsg.includes('github')) {
        unlockSection('contact-dropdown', 'Contact Info');
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
        
        // If the dropdown is being shown and we're on mobile, scroll to it
        const contactDropdown = document.querySelector('.contact-dropdown');
        if (contactDropdown.classList.contains('show') && window.innerWidth <= 768) {
            // Wait for the dropdown to expand before scrolling
            setTimeout(() => {
                // Scroll to the bottom of the dropdown
                const scrollableArea = document.querySelector('.profile-scrollable');
                if (scrollableArea) {
                    scrollableArea.scrollTo({
                        top: contactLink.offsetTop + 200, // Approximate height to see content
                        behavior: 'smooth'
                    });
                }
            }, 300); // Match this to your transition time
        }
    }
});

document.addEventListener('click', function (e) {
    if (e.target.classList.contains('copy-email') || e.target.closest('.copy-email')) {
        // Prevent the default behavior which would open mail app
        e.preventDefault();

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

// Sidebar toggle functionality with body scroll locking
document.addEventListener('DOMContentLoaded', function() {
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.profile-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    function toggleSidebar(show) {
        if (show) {
            sidebar.classList.add('open');
            overlay.classList.add('active');
            document.body.classList.add('sidebar-open');
        } else {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
            document.body.classList.remove('sidebar-open');
        }
    }
    
    // Toggle sidebar when hamburger menu is clicked
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            const isOpen = sidebar.classList.contains('open');
            toggleSidebar(!isOpen);
        });
    }
    
    // Close sidebar when overlay is clicked
    if (overlay) {
        overlay.addEventListener('click', function() {
            toggleSidebar(false);
        });
    }
    
    // Close sidebar when certain sidebar links are clicked (except contact and other dropdown toggles)
    const sidebarLinks = document.querySelectorAll('.profile-link:not([data-toggle])');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Only close if we're on mobile and this is not a dropdown toggle link
            if (window.innerWidth <= 768 && !this.hasAttribute('data-toggle')) {
                toggleSidebar(false);
            }
        });
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            toggleSidebar(false);
        }
    });

    // Initialize the UI with question marks instead of real name
    document.querySelector('.profile-name').textContent = "??? ????";
    document.querySelector('.name-glow').textContent = "????";
});