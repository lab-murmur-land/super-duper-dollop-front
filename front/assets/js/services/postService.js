import { USE_MOCK, MockDB } from '../api/mockDB.js';

export const postService = {
    async getAllPosts() {
        if (USE_MOCK) {
            return await MockDB.getPosts();
        }
        // return getDocs(collection(db, "posts"))
    },

    async getPostById(id) {
        if (USE_MOCK) {
            return await MockDB.getPostById(id);
        }
        // return getDoc(doc(db, "posts", id))
    }
};
