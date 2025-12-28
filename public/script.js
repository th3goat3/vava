const form = document.getElementById('scrapeForm');
const usernameInput = document.getElementById('usernameInput');
const scrapeBtn = document.getElementById('scrapeBtn');
const errorMessage = document.getElementById('errorMessage');
const results = document.getElementById('results');
const profilePicture = document.getElementById('profilePicture');
const profileUsername = document.getElementById('profileUsername');
const followersCount = document.getElementById('followersCount');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = usernameInput.value.trim();
    
    if (!username) {
        showError('Please enter a username');
        return;
    }

    // Clear previous results and errors
    hideError();
    hideResults();
    
    // Show loading state
    setLoading(true);
    
    try {
        const response = await fetch('/api/scrape', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: username }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            console.error('Server error response:', data);
            const errorMsg = data.error || data.message || 'Failed to scrape profile';
            console.error('Error message:', errorMsg);
            if (data.details) {
                console.error('Error details:', data.details);
            }
            showError(errorMsg);
            return;
        }
        
        // Display results
        displayResults(data);
        
    } catch (error) {
        console.error('Error:', error);
        showError('Network error. Please check if the server is running.');
    } finally {
        setLoading(false);
    }
});

function setLoading(loading) {
    if (loading) {
        scrapeBtn.disabled = true;
        document.querySelector('.btn-text').style.display = 'none';
        document.querySelector('.btn-loader').style.display = 'inline-block';
    } else {
        scrapeBtn.disabled = false;
        document.querySelector('.btn-text').style.display = 'inline';
        document.querySelector('.btn-loader').style.display = 'none';
    }
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    results.style.display = 'none';
}

function hideError() {
    errorMessage.style.display = 'none';
}

function hideResults() {
    results.style.display = 'none';
}

function displayResults(data) {
    profileUsername.textContent = '@' + data.username;
    
    if (data.profilePicture) {
        profilePicture.src = data.profilePicture;
        profilePicture.alt = `${data.username}'s profile picture`;
        profilePicture.onerror = function() {
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgZmlsbD0iI2RkZCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Ob0ltYWdlPC90ZXh0Pjwvc3ZnPg==';
        };
    } else {
        // Use a default placeholder image
        profilePicture.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgZmlsbD0iI2RkZCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Ob0ltYWdlPC90ZXh0Pjwvc3ZnPg==';
        profilePicture.alt = 'Profile picture not available';
    }
    
    followersCount.textContent = data.followers || 'N/A';
    
    results.style.display = 'block';
    hideError();
}

// Allow Enter key to submit
usernameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        form.dispatchEvent(new Event('submit'));
    }
});



