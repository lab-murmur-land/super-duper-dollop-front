import { fetchApi } from '../api/config.js';

export const userService = {
    async getUserPosts(userId) {
        const res = await fetchApi('/auth/profile/topics');
        return res.data;
    },

    async getUserComments(userId) {
        try {
            const res = await fetchApi('/auth/profile/posts');
            return res.data.map(c => ({
                postId: c.topicId,
                postTitle: 'Encrypted Thread',
                text: c.content
            }));
        } catch (e) {
            return [];
        }
    }
};
