import { postService } from '../services/postService.js';
import { authService } from '../services/authService.js';
import { ui } from '../components/ui.js';

let MOCK_POSTS = [];
const POSTS_PER_PAGE = 10;
let currentPage = 1;

async function init() {
    ui.setupNavbar(authService.getCurrentUser());

    // Fetch from Service API
    const container = document.getElementById('feed-container');
    if (!container) return;
    
    container.innerHTML = `<div class="text-primary font-headline uppercase animate-pulse">Establishing secure connection... Fetching signals.</div>`;
    
    MOCK_POSTS = await postService.getAllPosts();
    renderFeed(currentPage);
}

function renderFeed(page) {
    const container = document.getElementById('feed-container');
    container.innerHTML = '';
    
    const startIndex = (page - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    const postsToRender = MOCK_POSTS.slice(startIndex, endIndex);

    postsToRender.forEach(post => {
        const hasElevatedBg = post.isHot ? 'bg-surface-container-high relative' : 'bg-surface-container-low hover:bg-surface-container transition-colors duration-200';
        const elevatedBorder = post.isHot ? `<div class="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>` : '';
        const hotLabel = post.isHot ? `<span class="font-label text-primary text-xs uppercase tracking-wider flex items-center gap-1"><span class="material-symbols-outlined text-[10px]">local_fire_department</span> HOT SIGNAL</span>` : '';
        
        let mediaHtml = '';
        if (post.image) {
            mediaHtml = `
            <figure class="w-full bg-surface-container-lowest border-l-4 border-primary mt-4">
                <img src="${post.image}" class="w-full h-48 md:h-64 object-cover ${post.image.includes('giphy') ? '' : 'grayscale opacity-80 hover:grayscale-0 hover:opacity-100'} transition-all duration-300" />
            </figure>`;
        }

        const html = `
        <article class="${hasElevatedBg} p-6 md:p-8 flex flex-col gap-6 cursor-pointer" onclick="window.location.href='post-detail.html?id=${post.id}'">
            ${elevatedBorder}
            <header class="flex justify-between items-start">
                <div class="flex items-center gap-3">
                    <div class="bg-${post.isHot ? 'primary' : 'secondary'}-container text-${post.isHot ? 'on-primary' : 'secondary'} px-2 py-1 font-label text-xs uppercase tracking-wider">
                        ID: ${post.id}
                    </div>
                    <time class="font-label text-${post.isHot ? 'primary' : 'secondary'} text-xs uppercase tracking-wider">
                        ${post.time}
                    </time>
                    ${hotLabel}
                </div>
            </header>
            
            <h2 class="font-headline text-2xl font-bold uppercase tracking-tight text-primary">${post.title || 'UNKNOWN SIGNAL'}</h2>
            <div class="${post.isHot ? 'font-headline text-xl md:text-2xl tracking-tight' : 'font-body text-base md:text-lg'} leading-relaxed text-on-surface text-pretty">
                ${post.content}
            </div>
            
            ${mediaHtml}
            
            <footer class="flex justify-between items-end border-t-0 pt-2">
                <div class="flex gap-4">
                    <button class="flex items-center gap-2 text-${post.isHot ? 'primary' : 'on-surface-variant hover:text-primary transition-colors'} font-label text-sm" onclick="event.stopPropagation()">
                        <span class="material-symbols-outlined text-base">arrow_upward</span> ${post.upvotes}
                    </button>
                    <button class="flex items-center gap-2 text-${post.isHot ? 'error' : 'on-surface-variant hover:text-error transition-colors'} font-label text-sm" onclick="event.stopPropagation()">
                        <span class="material-symbols-outlined text-base">arrow_downward</span> ${post.downvotes || 0}
                    </button>
                </div>
                <button class="flex items-center gap-2 text-${post.isHot ? 'primary hover:text-primary-dim' : 'on-surface-variant hover:text-primary transition-colors'} font-label text-sm uppercase">
                    <span class="material-symbols-outlined text-base">forum</span> Thread (${post.replies})
                </button>
            </footer>
        </article>
        `;
        container.innerHTML += html;
    });

    renderPagination();
}

function renderPagination() {
    const controls = document.getElementById('pagination-controls');
    if (!controls) return;
    controls.innerHTML = '';
    const totalPages = Math.ceil(MOCK_POSTS.length / POSTS_PER_PAGE);

    for (let i = 1; i <= totalPages; i++) {
        const isActive = i === currentPage;
        const stateClass = isActive ? "bg-primary text-black border-primary" : "bg-surface-container-low text-on-surface-variant border-surface-variant hover:bg-surface-variant";
        controls.innerHTML += `<button class="px-4 py-2 border font-label font-bold text-sm transition-colors cursor-pointer ${stateClass}" data-page="${i}">${i}</button>`;
    }
}

// Global listeners for dynamic buttons inside feed
document.addEventListener('click', (e) => {
    if (e.target.dataset.page) {
        currentPage = parseInt(e.target.dataset.page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        renderFeed(currentPage);
    }
});

document.addEventListener('DOMContentLoaded', init);
