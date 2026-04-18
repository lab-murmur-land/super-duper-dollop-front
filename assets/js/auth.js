document.addEventListener('DOMContentLoaded', () => {
    const activeUser = localStorage.getItem('activeUser');
    const newPostBtn = document.getElementById('nav-new-post');
    const mobileNewPostBtn = document.getElementById('mobile-new-post');
    const accountBtn = document.getElementById('nav-account-btn');
    const logoutBtn = document.getElementById('nav-logout-btn');
    const searchBtn = document.getElementById('nav-search-btn');
    const searchBar = document.getElementById('nav-search-bar');

    // Setup Search Toggle
    if (searchBtn && searchBar) {
        searchBtn.addEventListener('click', () => {
            searchBar.classList.toggle('hidden');
            if(!searchBar.classList.contains('hidden')){
                searchBar.querySelector('input').focus();
            }
        });
    }

    // Auth State styling updates
    if (activeUser) {
        if (newPostBtn) newPostBtn.classList.remove('hidden');
        if (mobileNewPostBtn) mobileNewPostBtn.classList.remove('hidden');
        if (accountBtn) accountBtn.classList.add('hidden');
        if (logoutBtn) logoutBtn.classList.remove('hidden');
        
        const loggedInBox = document.getElementById('logged-in-box');
        if (loggedInBox) {
            loggedInBox.classList.remove('hidden');
            document.getElementById('auth-box').classList.add('hidden');
        }
    }
});

function enforceCaptcha(id) {
    const el = document.getElementById(id);
    if (el && !el.checked) {
        alert("ACCESS DENIED: Human verification protocol required.");
        return false;
    }
    return true;
}

function handleSignup() {
    if (!enforceCaptcha('captcha-signup')) return;
    const pw = document.getElementById('signup-pass').value;
    if (!pw || pw.length < 4) {
        alert("Enter a stronger password to initialize trace.");
        return;
    }
    
    // Generate 6 digit pin
    const generatedId = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Save to primitive mock DB in localStorage
    const users = JSON.parse(localStorage.getItem('usersDB') || '{}');
    users[generatedId] = pw;
    localStorage.setItem('usersDB', JSON.stringify(users));

    // Show step 2
    document.getElementById('signup-step-1').classList.add('hidden');
    document.getElementById('signup-step-2').classList.remove('hidden');
    document.getElementById('signup-step-2').classList.add('flex');
    document.getElementById('signup-generated-id').innerText = generatedId;
}

function handleLogin() {
    if (!enforceCaptcha('captcha-login')) return;
    const nick = document.getElementById('login-nick').value;
    const pass = document.getElementById('login-pass').value;
    const errorEl = document.getElementById('login-error');

    const users = JSON.parse(localStorage.getItem('usersDB') || '{}');
    
    if (users[nick] && users[nick] === pass) {
        localStorage.setItem('activeUser', nick);
        window.location.href = 'index.html';
    } else {
        errorEl.innerText = "ACCESS DENIED: Trace Core Failed (Invalid ID or Password)";
        errorEl.classList.remove('hidden');
    }
}

function logoutUser() {
    localStorage.removeItem('activeUser');
    window.location.href = 'index.html';
}
