class TrieNode {
    constructor() {
        this.children = {};
        this.isEndOfWord = false;
        this.userIds = [];
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    insert(word, userId) {
        if (!word) return;
        
        word = word.toLowerCase().trim();
        let node = this.root;

        for (let char of word) {
            if (!node.children[char]) {
                node.children[char] = new TrieNode();
            }
            node = node.children[char];
            if (!node.userIds.includes(userId)) {
                node.userIds.push(userId);
            }
        }
        
        node.isEndOfWord = true;
    }

    searchPrefix(prefix) {
        if (!prefix) return [];
        
        prefix = prefix.toLowerCase().trim();
        let node = this.root;
        for (let char of prefix) {
            if (!node.children[char]) {
                return [];
            }
            node = node.children[char];
        }

        return node.userIds;
    }

    autocomplete(prefix, maxResults = 10) {
        if (!prefix) return [];
        
        prefix = prefix.toLowerCase().trim();
        let node = this.root;
        const results = [];

        for (let char of prefix) {
            if (!node.children[char]) {
                return [];
            }
            node = node.children[char];
        }

        this._dfs(node, prefix, results, maxResults);
        return results;
    }

    _dfs(node, currentWord, results, maxResults) {
        if (results.length >= maxResults) return;

        if (node.isEndOfWord) {
            results.push({
                word: currentWord,
                userIds: node.userIds
            });
        }

        for (let char in node.children) {
            this._dfs(node.children[char], currentWord + char, results, maxResults);
        }
    }

    clear() {
        this.root = new TrieNode();
    }
}

module.exports = Trie;
