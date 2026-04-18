import { fetchApi } from '../api/config.js';

export const postService = {
    async getAllPosts() {
        const response = await fetchApi('/topics?sort=latest');
        return response.data; 
    },

    async getPostById(id) {
        const topicRes = await fetchApi(`/topics/${id}`);
        const commentsRes = await fetchApi(`/topics/${id}/posts`);
        
        const topic = topicRes.data;
        topic.comments = commentsRes.data.map(p => ({
            id: p.id,
            user: p.authorName,
            text: p.content,
            isReply: false
        }));
        
        topic.replies = topic.comments.length;
        
        return topic;
    },
    
    async createPost(title, content) {
         return await fetchApi('/topics', {
             method: 'POST',
             body: JSON.stringify({ title, content, recaptchaToken: 'dummy' })
         });
    },
    
    async addComment(topicId, content) {
        const formData = new FormData();
        formData.append('content', content);
        formData.append('recaptchaToken', 'dummy');
        
        return await fetchApi(`/topics/${topicId}/posts`, {
             method: 'POST',
             body: formData
        });
    },
    
    async toggleVote(targetId, targetType, vote, parentTopicId = null) {
        return await fetchApi('/votes', {
             method: 'POST',
             body: JSON.stringify({ targetId, targetType, vote, topicId: parentTopicId })
        });
    }
};
