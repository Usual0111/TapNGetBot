// TONTap Mini App JavaScript

// Initialize Telegram WebApp
let tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// User data structure (in real app this would sync with server)
let userData = {
    balance: 0,
    totalEarned: 0,
    adsWatched: 0,
    referrals: 0,
    questProgress: 0,
    walletConnected: false,
    userId: tg.initDataUnsafe?.user?.id || 123456
};

// Load user data from local storage (simulation)
function loadUserData() {
    const saved = localStorage.getItem('tontap_data');
    if (saved) {
        userData = { ...userData, ...JSON.parse(saved) };
    }
    updateUI();
}

// Save user data
function saveUserData() {
    // In real app this would be API call to server
    localStorage.setItem('tontap_data', JSON.stringify(userData));
}

// Update UI elements
function updateUI() {
    document.getElementById('balance').textContent = userData.balance.toFixed(3) + ' TON';
    document.getElementById('totalEarned').textContent = userData.totalEarned.toFixed(3);
    document.getElementById('adsWatched').textContent = userData.adsWatched;
    document.getElementById('referrals').textContent = userData.referrals;
    document.getElementById('questCurrent').textContent = userData.questProgress;
    
    const progressPercent = Math.min((userData.questProgress / 3) * 100, 100);
    document.getElementById('questProgress').style.width = progressPercent + '%';
    
    // Update referral link
    document.getElementById('referralLink').textContent = 
        `https://t.me/YourBot?start=ref_${userData.userId}`;
}

// Show notification messages
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Add earnings to user balance
function addEarning(amount) {
    userData.balance += amount;
    userData.totalEarned += amount;
    saveUserData();
    updateUI();
    showNotification(`+${amount.toFixed(3)} TON earned!`);
}

// Watch advertisement function
function watchAd() {
    // Simulate ad watching
    showNotification('Opening advertisement...');
    
    // Simulate viewing delay
    setTimeout(() => {
        userData.adsWatched++;
        addEarning(0.001);
    }, 2000);

    // In real app this would redirect to actual ad link
    // window.open('https://example.com/ad', '_blank');
}

// Tap advertisement function
function tapAd() {
    addEarning(0.0005);
    userData.adsWatched++;
    saveUserData();
}

// Visit website function
function visitSite() {
    showNotification('Redirecting to website...');
    setTimeout(() => {
        addEarning(0.002);
        userData.adsWatched++;
        saveUserData();
    }, 1000);
}

// Follow channel function
function followChannel() {
    if (tg.initDataUnsafe?.user) {
        // In real app this would check actual subscription
        showNotification('Checking subscription...');
        setTimeout(() => {
            addEarning(0.003);
            saveUserData();
        }, 1500);
    }
}

// Share referral link function
function shareReferral() {
    const referralLink = `https://t.me/YourBot?start=ref_${userData.userId}`;
    const message = `🚀 Join TONTap and earn TON cryptocurrency!\n\n💰 Watch ads, complete tasks, get rewards!\n🎯 Daily bonuses and fast withdrawals\n\n👉 ${referralLink}`;
    
    if (tg.initDataUnsafe?.user) {
        tg.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(message)}`);
    } else {
        copyReferral();
        showNotification('Link copied! Share with friends');
    }
}

// Copy referral link function
function copyReferral() {
    const referralLink = document.getElementById('referralLink').textContent;
    navigator.clipboard.writeText(referralLink).then(() => {
        showNotification('Link copied to clipboard!');
    }).catch(() => {
        // Fallback for older browsers
        showNotification('Please copy the link manually');
    });
}

// Connect wallet function
function connectWallet() {
    if (!userData.walletConnected) {
        showNotification('Connecting wallet...');
        // In real app this would integrate with TON Connect
        setTimeout(() => {
            userData.walletConnected = true;
            saveUserData();
            showNotification('Wallet connected successfully!');
        }, 2000);
    } else {
        showNotification('Wallet already connected!');
    }
}

// Withdraw funds function
function withdraw() {
    if (!userData.walletConnected) {
        showNotification('Please connect your wallet first!');
        return;
    }

    if (userData.balance < 0.01) {
        showNotification('Minimum withdrawal amount: 0.01 TON');
        return;
    }

    // Simulate withdrawal process
    showNotification('Processing withdrawal...');
    setTimeout(() => {
        const withdrawAmount = userData.balance;
        userData.balance = 0;
        saveUserData();
        updateUI();
        showNotification(`${withdrawAmount.toFixed(3)} TON sent to your wallet!`);
    }, 3000);
}

// App initialization
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    
    // Configure Telegram WebApp
    tg.MainButton.setText('Close App');
    tg.MainButton.onClick(() => tg.close());
    
    // Welcome message for new users
    if (userData.totalEarned === 0) {
        setTimeout(() => {
            showNotification('Welcome to TONTap! Start earning right now! 🚀');
        }, 1000);
    }
});

// Handle back button
tg.BackButton.onClick(() => tg.close());

// Simulate receiving referral rewards
setInterval(() => {
    if (Math.random() < 0.1) { // 10% chance every 10 seconds
        userData.referrals++;
        userData.questProgress = Math.min(userData.questProgress + 1, 3);
        if (userData.questProgress === 3) {
            addEarning(0.01);
            userData.questProgress = 0;
            showNotification('🎯 Daily quest completed! +0.01 TON');
        } else {
            addEarning(0.005);
            showNotification('👥 New referral! +0.005 TON');
        }
        saveUserData();
        updateUI();
    }
}, 10000);
