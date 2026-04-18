import { authService } from '../services/authService.js';
import { userService } from '../services/userService.js';
import { ui } from '../components/ui.js';

async function init() {
    const active = authService.getCurrentUser();
    ui.setupNavbar(active);

    const urlParams = new URLSearchParams(window.location.search);
    const targetUserId = urlParams.get('id');

    const profIdEl = document.getElementById('prof-id');
    if (!targetUserId) {
        if(profIdEl) profIdEl.innerText = "NOT_FOUND";
        return;
    }

    if(profIdEl) profIdEl.innerText = "#" + targetUserId;

    if (active === targetUserId) {
        const btn = document.getElementById('btn-settings');
        if (btn) btn.style.display = 'block';
    }

    // Load Posts
    const posts = await userService.getUserPosts(targetUserId);
    const postContainer = document.getElementById('prof-posts');
    if (postContainer) {
        if (posts.length === 0) postContainer.innerHTML = '<p class="text-on-surface-variant font-body">No signals logged.</p>';
        posts.forEach(p => {
            postContainer.innerHTML += `
            <article class="bg-surface-container-low p-4 border-l-2 border-primary cursor-pointer hover:bg-surface-container transition-colors" onclick="window.location.href='post-detail.html?id=${p.id}'">
                <h3 class="font-headline text-lg font-bold text-on-surface uppercase">${p.title}</h3>
                <p class="font-body text-sm text-on-surface-variant mt-1 line-clamp-2">${p.content}</p>
            </article>`;
        });
    }

    // Load Comments
    const comments = await userService.getUserComments(targetUserId);
    const commentContainer = document.getElementById('prof-comments');
    if (commentContainer) {
        if (comments.length === 0) commentContainer.innerHTML = '<p class="text-on-surface-variant font-body">No commits logged.</p>';
        comments.forEach(c => {
            commentContainer.innerHTML += `
            <article class="bg-surface-container p-4 border-l-2 border-secondary cursor-pointer hover:bg-surface-container-low transition-colors" onclick="window.location.href='post-detail.html?id=${c.postId}'">
                <p class="font-label text-xs uppercase tracking-widest text-secondary-dim mb-1">ON: ${c.postTitle}</p>
                <p class="font-body text-sm text-on-surface">${c.text}</p>
            </article>`;
        });
    }

    // Setup global window actions for modal (self only)
    window.profileActions = {
        freeze: async () => {
            if(confirm('Are you sure you want to freeze your trace? You will be logged out.')) {
                await authService.freezeAccount(active);
                window.location.href = 'index.html';
            }
        },
        destruct: async () => {
            if(confirm('WARNING: Destroying account. Proceed?')) {
                await authService.deleteAccount(active);
                window.location.href = 'index.html';
            }
        },
        changePw: async () => {
            const oldp = document.getElementById('old-pw').value;
            const newp = document.getElementById('new-pw').value;
            const err = document.getElementById('pw-err');
            if(newp.length < 4) { err.innerText='Too weak'; err.classList.remove('hidden'); return; }
            try {
                await authService.changePassword(active, oldp, newp);
                alert('Key rotated successfully.');
                document.getElementById('pwd-input').classList.add('hidden');
                err.classList.add('hidden');
            } catch(e) {
                err.innerText = e.message;
                err.classList.remove('hidden');
            }
        }
    };
}

document.addEventListener('DOMContentLoaded', init);
