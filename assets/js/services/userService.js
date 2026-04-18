import { MockDB, USE_MOCK } from '../api/mockDB.js';

export const userService = {
    async getUserPosts(userId) {
        if (USE_MOCK) {
            const allPosts = await MockDB.getPosts();
            // Since our mock database generator doesn't explicitly link posts to users,
            // we will simulate user posts by running a hash and filtering.
            // For B92-L1, C11-Z0 we will return specific mocks, otherwise random static subslice.
            const seed = Array.from(userId).reduce((acc, char) => acc + char.charCodeAt(0), 0);
            return allPosts.filter((_, idx) => (idx + seed) % 3 === 0);
        }
        // return getDocs(query(collection(db, "posts"), where("author", "==", userId)))
    },

    async getUserComments(userId) {
        if (USE_MOCK) {
            const allPosts = await MockDB.getPosts();
            let userComments = [];
            
            allPosts.forEach(post => {
                const coms = (post.comments || []).filter(c => c.user === userId);
                coms.forEach(c => {
                    userComments.push({
                        postId: post.id,
                        postTitle: post.title,
                        ...c
                    });
                });
            });

            // If user has no comments, generate some mock ones based on seed
            if (userComments.length === 0) {
                 const seed = Array.from(userId).reduce((acc, char) => acc + char.charCodeAt(0), 0);
                 const posts = allPosts.slice(0, 3);
                 posts.forEach((p, idx) => {
                     if ((idx + seed) % 2 === 0) {
                         userComments.push({
                             postId: p.id,
                             postTitle: p.title,
                             id: 'cx-'+idx,
                             user: userId,
                             text: "This trace log resonates with local node memory.",
                             isReply: false
                         });
                     }
                 });
            }
            return userComments;
        }
        // return getDocs(...)
    }
};
