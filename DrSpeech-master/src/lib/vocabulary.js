'use strict';

function Vocabulary() {
    this._catalog = {
        "default": ["cat", "gender", "balloon", "park"],
        "noun": ["sheep", "problem", "beard", "fork", "doctor", "peanut"],
        "verb": ["jump", "validate", "think", "draw", "start"],
        "adjective": ["free", "subtle", "brilliant"]
    }
}

Vocabulary.prototype.getRandomWord = function (categoryOfWord) {
    var category = this._catalog[categoryOfWord];
    var length = category.length;
    return category[this.random(length)];
};

Vocabulary.prototype.random = function (length) {
    return Math.floor(Math.random() * length);
};

module.exports = Vocabulary;
