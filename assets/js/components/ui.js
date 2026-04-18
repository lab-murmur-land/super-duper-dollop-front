export const ui = {
    enforceCaptcha(id) {
        const el = document.getElementById(id);
        if (el && !el.checked) {
            alert("ACCESS DENIED: Human verification protocol required.");
            return false;
        }
        return true;
    },

    setupNavbar(currentUser) {
        const newPostBtn = document.getElementById('nav-new-post');
        const mobileNewPostBtn = document.getElementById('mobile-new-post');
        const accountBtn = document.getElementById('nav-account-btn');
        const logoutBtn = document.getElementById('nav-logout-btn');
        const searchBtn = document.getElementById('nav-search-btn');
        const searchBar = document.getElementById('nav-search-bar');
        const profileBtn = document.getElementById('nav-profile-btn');

        if (searchBtn && searchBar) {
            searchBtn.addEventListener('click', () => {
                searchBar.classList.toggle('hidden');
                if(!searchBar.classList.contains('hidden')) searchBar.querySelector('input').focus();
            });
        }

        if (currentUser) {
            if (newPostBtn) newPostBtn.style.display = '';
            if (mobileNewPostBtn) mobileNewPostBtn.style.display = '';
            if (accountBtn) accountBtn.style.display = 'none';
            if (logoutBtn) logoutBtn.classList.remove('hidden');
            if (profileBtn) {
                profileBtn.style.display = '';
                profileBtn.href = `profile.html?id=${currentUser}`;
            }
        }
    },

    toggleInlineReply(id) {
        const form = document.getElementById(`reply-form-${id}`);
        if (form) form.classList.toggle('hidden');
    }
};
