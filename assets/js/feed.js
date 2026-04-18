const MOCK_POSTS = [];
const TOTAL_MOCK_POSTS = 25; // Create 25 mock posts so we have 3 pages

const rawTitles = [
    "CRITICAL SYS_FAILURE", "ROUTER COMPROMISED", "JUNIOR DEV MISTAKES", 
    "COFFEE MACHINE HACKED", "PRODUCTION DOWN AGAIN", "SILENT RESIGNATION", 
    "I HATE STANDUPS", "UNPAID OVERTIME"
];

const rawSignals = [
    "I've been writing code for 15 years, and I still look up how to center a div almost every week. The imposter syndrome never really goes away.",
    "We shipped the beta to production with a known memory leak because marketing had already bought the ad space. I’m spending my weekend restarting servers manually every 4 hours so no one notices.",
    "Sometimes I pretend my internet is down during daily standups just so I don't have to explain why my ticket has been blocked for three days.",
    "I intentionally leave a small bug in my PRs so the senior dev can find it and feel good about themselves without delaying the merge.",
    "My entire microservices architecture is just a bunch of bash scripts piping data to curl. The startup just raised $2M on this.",
    "I deleted the production database completely by accident. I restored it from my local dev dump and no one has noticed that 3 days of user data is missing except me.",
    "That critical bug fix that took me 'all weekend'? It was a typo in a JSON file. I spent the weekend playing Elden Ring.",
    "I've automated about 95% of my job and haven't told my boss. I work maybe 2 hours a week and spend the rest working on a rival startup."
];

const mockGifsAndImages = [
    "https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif", // matrix code
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCvN9PWRxlbhjgVjbeidtiNut0LY7_JL-www-csVPi0YlRHeFbelKLIAJSKI_zrEAt6PjW3fgXKAl8autj94Tuoy7y690aRs6-FPLzcqCZ7hh9IGOs59ZMDwMhTyq0Ueah0TduxTAr8bTo1pOMsYdqQlTKqxm33e67P-XZghDhJzBCyYl8uf2GNG6kqXJcsktG_3DRCdHUj0EPpl1EDQMfq-6z7TE4eyEAhhNpxbeq_STqS4jnAeLAv-pM3POZ6wcXaSOTdL53qtYE",
    "https://media.giphy.com/media/VbLZ2VpQosK23Q9x8N/giphy.gif", // hackerman
    null, null, null, null // mostly null so only *some* posts get images
];

// Generate 25 Posts
for(let i=0; i<TOTAL_MOCK_POSTS; i++) {
    const hasImage = Math.random() < 0.3; // 30% chance for an image
    MOCK_POSTS.push({
        id: `AX${Math.floor(100+Math.random()*899)}-${i}`,
        title: rawTitles[i % rawTitles.length],
        content: rawSignals[i % rawSignals.length],
        time: `T-MINUS ${Math.floor(Math.random()*60)} MIN`,
        upvotes: Math.floor(Math.random()*5000),
        replies: Math.floor(Math.random()*200),
        image: hasImage ? mockGifsAndImages[Math.floor(Math.random()*mockGifsAndImages.length)] : null,
        isHot: Math.random() > 0.8
    });
}

const POSTS_PER_PAGE = 10;
let currentPage = 1;

function renderFeed(page) {
    const container = document.getElementById('feed-container');
    if (!container) return; // safety
    
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
        <article class="${hasElevatedBg} p-6 md:p-8 flex flex-col gap-6 cursor-pointer" onclick="window.location.href='post-detail.html'">
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
            
            <h2 class="font-headline text-2xl font-bold uppercase tracking-tight text-primary">${post.title}</h2>
            <div class="${post.isHot ? 'font-headline text-xl md:text-2xl tracking-tight' : 'font-body text-base md:text-lg'} leading-relaxed text-on-surface text-pretty">
                ${post.content}
            </div>
            
            ${mediaHtml}
            
            <footer class="flex justify-between items-end border-t-0 pt-2">
                <div class="flex gap-4">
                    <button class="flex items-center gap-2 text-${post.isHot ? 'primary' : 'on-surface-variant hover:text-primary transition-colors'} font-label text-sm" onclick="event.stopPropagation()">
                        <span class="material-symbols-outlined text-base">arrow_upward</span> ${post.upvotes}
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
        const baseClass = "px-4 py-2 border font-label font-bold text-sm transition-colors cursor-pointer";
        const stateClass = isActive 
                            ? "bg-primary text-black border-primary" 
                            : "bg-surface-container-low text-on-surface-variant border-surface-variant hover:bg-surface-variant";
        
        controls.innerHTML += `
            <button class="${baseClass} ${stateClass}" onclick="goToPage(${i})">
                ${i}
            </button>
        `;
    }
}

function goToPage(page) {
    currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    renderFeed(currentPage);
}

document.addEventListener('DOMContentLoaded', () => {
    renderFeed(currentPage);
});
