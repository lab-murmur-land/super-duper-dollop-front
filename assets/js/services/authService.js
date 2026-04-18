import { USE_MOCK } from '../api/mockDB.js';

export const authService = {
    async login(nick, pass) {
        if (USE_MOCK) {
            const users = JSON.parse(localStorage.getItem('usersDB') || '{}');
            // check freeze status
            const statusDB = JSON.parse(localStorage.getItem('statusDB') || '{}');
            if (statusDB[nick] === 'FROZEN') {
                throw new Error("ACCESS DENIED: NODE IS IN CRYO-FREEZE.");
            }
            if (users[nick] && users[nick] === pass) {
                localStorage.setItem('activeUser', nick);
                return nick;
            }
            throw new Error("ACCESS DENIED: Trace Core Failed (Invalid ID or Password)");
        }
    },

    async signup(pass) {
        if (USE_MOCK) {
            const generatedId = Math.floor(100000 + Math.random() * 900000).toString();
            const users = JSON.parse(localStorage.getItem('usersDB') || '{}');
            users[generatedId] = pass;
            localStorage.setItem('usersDB', JSON.stringify(users));
            return generatedId;
        }
    },

    logout() {
        if (USE_MOCK) {
            localStorage.removeItem('activeUser');
        }
    },

    getCurrentUser() {
        if (USE_MOCK) return localStorage.getItem('activeUser');
    },
    
    // NEW SETTINGS ACTIONS
    async freezeAccount(userId) {
        if (USE_MOCK) {
            const statusDB = JSON.parse(localStorage.getItem('statusDB') || '{}');
            statusDB[userId] = 'FROZEN';
            localStorage.setItem('statusDB', JSON.stringify(statusDB));
            this.logout();
        }
    },
    
    async deleteAccount(userId) {
        if (USE_MOCK) {
            const users = JSON.parse(localStorage.getItem('usersDB') || '{}');
            delete users[userId];
            localStorage.setItem('usersDB', JSON.stringify(users));
            this.logout();
        }
    },

    async changePassword(userId, currentPw, newPw) {
        if (USE_MOCK) {
            const users = JSON.parse(localStorage.getItem('usersDB') || '{}');
            if (users[userId] === currentPw) {
                 users[userId] = newPw;
                 localStorage.setItem('usersDB', JSON.stringify(users));
                 return true;
            }
            throw new Error("Invalid current key.");
        }
    }
};
