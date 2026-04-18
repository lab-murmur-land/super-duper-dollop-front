import { fetchApi } from '../api/config.js';

export const authService = {
    async login(nick, pass) {
        const data = await fetchApi('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ uid: nick, password: pass, recaptchaToken: 'dummy' })
        });
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('activeUser', data.uid);
        return data.uid;
    },

    async signup(pass) {
        const data = await fetchApi('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ password: pass, recaptchaToken: 'dummy' })
        });
        return data.uid;
    },

    logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('activeUser');
    },

    getCurrentUser() {
        return localStorage.getItem('activeUser');
    },
    
    async freezeAccount(userId) {
        this.logout();
    },
    
    async deleteAccount(userId) {
        this.logout();
    },

    async changePassword(userId, currentPw, newPw) {
        throw new Error("ROTATE KEY NOT FULLY IMPLEMENTED ON BACKEND");
    }
};
