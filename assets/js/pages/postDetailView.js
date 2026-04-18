import { postService } from '../services/postService.js';
import { authService } from '../services/authService.js';
import { ui } from '../components/ui.js';

async function init() {
    ui.setupNavbar(authService.getCurrentUser());

    // Routing Logic
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    const container = document.getElementById('post-skeleton-wrapper');
    if (!postId) {
        if(container) container.innerHTML = `<div class="text-error font-headline text-2xl text-center pt-24 uppercase">ERR_MISSING_ID: SIGNAL NOT FOUND</div>`;
        return;
    }

    if (!container) return;

    try {
        const post = await postService.getPostById(postId);
        if (!post) {
            container.innerHTML = `<div class="text-error font-headline text-2xl text-center pt-24 uppercase">ERR_404: SIGNAL EXPunged</div>`;
            return;
        }

        // Hydrate DOM
        document.getElementById('pd-id').innerText = `ID: ${post.id}`;
        document.getElementById('pd-time').innerText = post.time;
        document.getElementById('pd-title').innerText = post.title || 'UNKNOWN SIGNAL';
        document.getElementById('pd-content').innerText = post.content;
        
        const mediaContainer = document.getElementById('pd-media');
        if (post.image) {
            mediaContainer.innerHTML = `<img alt="Attached evidence" class="w-full h-auto object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-300" src="${post.image}"/>`;
        } else {
            mediaContainer.classList.add('hidden');
        }

        document.getElementById('pd-upvotes').innerText = post.upvotes;
        const dwEl = document.getElementById('pd-downvotes');
        if(dwEl) dwEl.innerText = post.downvotes || 0;
        document.getElementById('pd-comment-count').innerText = `${post.replies}k`;

        const commentStream = document.getElementById('pd-comments');
        commentStream.innerHTML = '';
        
        document.getElementById('pd-toggle-title').innerText = `DATA STREAM ACTIVE (${post.comments?.length || 0} COMMS) - PRESS TO TOGGLE`;
        document.getElementById('pd-node-count').innerText = `ACTIVE_NODES [ ${post.comments?.length || 0} ]`;

        (post.comments || []).forEach(comment => {
            const html = `
                <div class="${comment.isReply ? 'ml-4 pl-4 thread-line flex flex-col gap-3' : 'flex flex-col gap-3'}">
                    <div class="${comment.isReply ? 'bg-surface-container-high' : 'bg-surface-container'} p-4">
                        <header class="flex items-center gap-3 mb-3">
                            <span class="${comment.isReply ? 'bg-surface-container-lowest border border-secondary/20' : 'bg-surface-container-highest'} text-secondary font-label px-2 py-0.5 text-[10px] tracking-widest">ID: ${comment.user}</span>
                        </header>
                        <p class="text-on-surface text-sm sm:text-base">${comment.text}</p>
                        <div class="flex gap-4 mt-3">
                            <button onclick="window.ui.toggleInlineReply('${comment.id}')" class="text-on-surface-variant hover:text-primary font-label text-[10px] uppercase font-bold">REPLY</button>
                        </div>
                    </div>
                    
                    <div id="reply-form-${comment.id}" class="hidden ml-4 pl-4 thread-line flex flex-col border-l border-primary/20 bg-surface-container-low p-4 mt-2 ${comment.isReply ? '' : 'mb-4'}">
                            <div class="font-label text-xs text-primary uppercase tracking-widest mb-2 border-b border-surface-variant pb-1">Inject Reply Module</div>
                            <textarea class="w-full bg-surface-container-lowest border border-outline-variant text-on-surface font-body p-3 outline-none resize-none focus:border-primary transition-colors focus:ring-0 min-h-[80px]" placeholder="Transmit thoughts..." rows="2"></textarea>
                            <div class="flex justify-between mt-3 items-center">
                                <button class="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center p-1"><span class="material-symbols-outlined text-lg">image</span></button>
                                <div class="flex items-center gap-3">
                                <div class="flex items-center gap-2 border border-surface-variant px-2 py-1 bg-surface-dim hover:border-primary transition-colors cursor-pointer" onclick="document.getElementById('captcha-${comment.id}').click();">
                                    <input type="checkbox" id="captcha-${comment.id}" class="h-3 w-3 bg-transparent border-outline-variant text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer pointer-events-none"/>
                                    <label for="captcha-${comment.id}" class="font-label text-[10px] uppercase tracking-wider text-on-surface-variant cursor-pointer pointer-events-none select-none">VERIFY HUMAN ORIGIN</label>
                                </div>
                                <button onclick="if(window.ui.enforceCaptcha('captcha-${comment.id}')){ alert('Reply Sent'); window.ui.toggleInlineReply('${comment.id}'); }" class="bg-primary text-black px-4 py-1 text-xs font-headline uppercase font-bold tracking-widest hover:bg-primary-dim transition-colors">Execute</button>
                                </div>
                            </div>
                    </div>
                </div>
            `;
            commentStream.innerHTML += html;
        });

    } catch (e) {
        console.error(e);
        container.innerHTML = `<div class="text-error font-headline text-2xl text-center pt-24 uppercase">ERR_500: TRACE CORE FAILED</div>`;
    }
}

// Make UI global for inline HTML onclicks 
window.ui = ui;

document.addEventListener('DOMContentLoaded', init);
