const Trie = require('./Trie');
const User = require('../models/user');

class SearchCache {
    constructor() {
        this.trie = new Trie();
        this.isInitialized = false;
        this.lastUpdated = null;
    }

    async buildTrie() {
        try {
            console.log('Building search index...');
            this.trie.clear();

            const users = await User.find({}, 'firstName lastName _id');
            
            for (const user of users) {
                const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
                const userId = user._id.toString();
                this.trie.insert(fullName, userId);
                this.trie.insert(user.firstName.toLowerCase(), userId);
                this.trie.insert(user.lastName.toLowerCase(), userId);
            }

            this.isInitialized = true;
            this.lastUpdated = new Date();
            console.log(`Search index built successfully with ${users.length} users`);
        } catch (error) {
            console.error('Error building search index:', error);
            throw error;
        }
    }

    search(query) {
        if (!this.isInitialized) {
            throw new Error('Search index not initialized');
        }

        if (!query || query.trim().length === 0) {
            return [];
        }

        const userIds = this.trie.searchPrefix(query);
        return [...new Set(userIds)];
    }

    addUser(user) {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        const userId = user._id.toString();

        this.trie.insert(fullName, userId);
        this.trie.insert(user.firstName.toLowerCase(), userId);
        this.trie.insert(user.lastName.toLowerCase(), userId);
    }

    needsRebuild() {
        if (!this.isInitialized) return true;
        const hoursSinceUpdate = (Date.now() - this.lastUpdated) / (1000 * 60 * 60);
        return hoursSinceUpdate > 24;
    }
}

const searchCache = new SearchCache();

module.exports = searchCache;
