export const USE_MOCK = true;

// A module mimicking a backend database
export const MockDB = {
    _delay: ms => new Promise(res => setTimeout(res, ms)),

    async init() {
        if (!localStorage.getItem('MOCK_POSTS')) {
            const rawTitles = ["CRITICAL SYS_FAILURE", "ROUTER COMPROMISED", "JUNIOR DEV MISTAKES", "COFFEE MACHINE HACKED", "PRODUCTION DOWN AGAIN"];
            const rawSignals = [
                "I've been writing code for 15 years, and I still look up how to center a div almost every week. The imposter syndrome never really goes away.",
                "We shipped the beta to production with a known memory leak because marketing had already bought the ad space. I’m spending my weekend restarting servers manually every 4 hours so no one notices.",
                "Sometimes I pretend my internet is down during daily standups just so I don't have to explain why my ticket has been blocked for three days.",
                "I intentionally leave a small bug in my PRs so the senior dev can find it and feel good about themselves without delaying the merge."
            ];
            const imgs = ["https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif", null, null];
            
            const initialPosts = [];
            for(let i=0; i<15; i++) {
                initialPosts.push({
                    id: `AX${Math.floor(100+Math.random()*899)}-${i}`,
                    title: rawTitles[i % rawTitles.length],
                    content: rawSignals[i % rawSignals.length],
                    time: `T-MINUS ${Math.floor(Math.random()*60)} MIN`,
                    upvotes: Math.floor(Math.random()*5000),
                    downvotes: Math.floor(Math.random()*1500),
                    replies: Math.floor(Math.random()*200),
                    image: Math.random() < 0.3 ? imgs[0] : null,
                    isHot: Math.random() > 0.8,
                    comments: [
                        { id: `c-${i}-1`, user: '#B92-L1', text: "Are you serious right now?", isReply: false },
                        { id: `c-${i}-2`, user: '#C11-Z0', text: "I did the exact same thing.", isReply: true }
                    ]
                });
            }
            localStorage.setItem('MOCK_POSTS', JSON.stringify(initialPosts));
        }
    },

    async getPosts() {
        await this._delay(300); // simulate network latency
        return JSON.parse(localStorage.getItem('MOCK_POSTS')) || [];
    },

    async getPostById(id) {
        await this._delay(200);
        const posts = JSON.parse(localStorage.getItem('MOCK_POSTS')) || [];
        return posts.find(p => p.id === id);
    }
};

MockDB.init();
