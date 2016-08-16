'use strict';

/**
 * Galician Syllabler v1.1.1
 * Port and adaptation to galician language by Berto Yáñez <berto@ber.to>
 *
 * This is a port to Javascript of "Separador de Sílabas del Español"
 *
 * Hernández-Figueroa, Z; Rodríguez-Rodríguez, G; Carreras-Riudavets, F (2009).
 * Separador de sílabas del español - Silabeador TIP.
 * Available at http://tip.dis.ulpgc.es
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Syllabler = function () {
    function Syllabler(word) {
        _classCallCheck(this, Syllabler);

        if (!word) {
            throw new Error('Missing word.');
        }

        this.word = word.toLowerCase();
        this.length = word.length;
        this.pos = 0;

        this.totalSyllables = 0;
        this.tonicFound = false;
        this.tonicSyllable = -1;
        this.tildePosition = null;
        this.positions = [];

        this.maxSyllables = 20;
    }

    _createClass(Syllabler, [{
        key: 'process',
        value: function process() {
            var _this = this;

            this._analyze();

            var syllables = this.positions.map(function (pos, i) {
                return _this.word.slice(pos, _this.positions[i + 1]);
            });

            return {
                word: this.word,
                syllables: syllables,
                totalSyllables: this.totalSyllables,
                tildePosition: this.tildePosition,
                accentedPosition: this.tildePosition || this.positions[this.tonicSyllable] + this._getTonicLetter(syllables[this.tonicSyllable]),
                positions: this.positions,
                tonicSyllable: this.tonicSyllable,
                stress: this.positions.map(function (pos, i) {
                    if (i === _this.tonicSyllable) {
                        return 1;
                    }

                    return 0;
                }).join('/')
            };
        }
    }, {
        key: '_analyze',
        value: function _analyze() {
            var totalSyllables = 0;

            while (this.pos < this.length && totalSyllables <= this.maxSyllables) {
                totalSyllables++;
                this.positions.push(this.pos);

                this._onset();
                this._nucleus();
                this._coda();

                if (this.tonicFound && this.tonicSyllable < 0) {
                    this.tonicSyllable = totalSyllables - 1;
                }
            }

            this.totalSyllables = totalSyllables;

            if (!this.tonicFound) {
                this._applyAccentuationRules();
            }
        }
    }, {
        key: '_onset',
        value: function _onset() {
            var lastConsonant = void 0;

            while (this.pos < this.length && this._isConsonant(this.word[this.pos]) && this.word[this.pos] !== 'y') {
                lastConsonant = this.word[this.pos];
                this.pos++;
            }

            if (this.pos < this.length - 1) {
                if (this.word[this.pos] === 'u') {
                    if (lastConsonant === 'q') {
                        this.pos++;
                    } else {
                        if (lastConsonant === 'g') {
                            var letter = this.word[this.pos + 1];
                            if (letter === 'e' || letter === 'é' || letter === 'i' || letter === 'í') {
                                this.pos++;
                            }
                        }
                    }
                } else {
                    if (this.word[this.pos] === 'ü') {
                        if (lastConsonant === 'g') {
                            this.pos++;
                        }
                    }
                }
            }
        }
    }, {
        key: '_nucleus',
        value: function _nucleus() {
            var previous = 0;

            if (this.pos >= this.length) {
                return;
            }

            if (this.word[this.pos] === 'y') {
                this.pos++;
            }

            if (this.pos < this.length) {
                var letter = this.word[this.pos];

                switch (letter) {
                    case 'á':
                    case 'à':
                    case 'é':
                    case 'è':
                    case 'ó':
                    case 'ò':
                        this.tildePosition = this.pos;
                        this.tonicFound = true;
                        previous = 0;
                        this.pos++;
                        break;

                    case 'a':
                    case 'e':
                    case 'o':
                        previous = 0;
                        this.pos++;
                        break;
                    case 'í':
                    case 'ì':
                    case 'ú':
                    case 'ù':
                    case 'ü':
                        this.tildePosition = this.pos;
                        this.tonicFound = true;
                        previous = 1;
                        this.pos++;
                        return;
                    case 'i':
                    case 'u':
                        previous = 2;
                        this.pos++;
                        break;
                }
            }

            var h = false;
            if (this.pos < this.length) {
                if (this.word[this.pos] === 'h') {
                    this.pos++;
                    h = true;
                }
            }

            if (this.pos < this.length) {
                var _letter = this.word[this.pos];

                switch (_letter) {
                    case 'á':
                    case 'à':
                    case 'é':
                    case 'è':
                    case 'ó':
                    case 'ò':
                        this.tildePosition = this.pos;
                        if (previous !== 0) {
                            if (h) {
                                this.pos--;
                                return;
                            }
                        } else {
                            this.pos++;
                        }
                        break;

                    case 'a':
                    case 'e':
                    case 'o':
                        if (previous === 0) {
                            if (h) {
                                this.pos--;
                                return;
                            }
                        } else {
                            this.pos++;
                        }
                        break;
                    case 'í':
                    case 'ì':
                    case 'ú':
                    case 'ù':
                    case 'ü':
                        this.tildePosition = this.pos;
                        if (previous !== 0) {
                            this.tonicFound = true;
                            this.pos++;
                        } else {
                            if (h) {
                                this.pos++;
                            }
                        }

                        return;
                    case 'i':
                    case 'u':
                        if (this.pos < this.length - 1) {
                            var nextLetter = this.word[this.pos + 1];
                            if (!this._isConsonant(nextLetter)) {
                                var previousLetter = this.word[this.pos - 1];
                                if (previousLetter === 'h') {
                                    this.pos--;
                                    return;
                                }
                            }
                        }

                        if (this.word[this.pos] !== this.word[this.pos - 1]) {
                            this.pos++;
                        }

                        return;
                }
            }

            if (this.pos < this.length) {
                var _letter2 = this.word[this.pos];
                if (_letter2 === 'i' || _letter2 === 'u') {
                    this.pos++;
                    return;
                }
            }
        }
    }, {
        key: '_coda',
        value: function _coda() {
            if (this.pos >= this.length || !this._isConsonant(this.word[this.pos])) {
                return;
            } else {
                if (this.pos === this.length - 1) {
                    this.pos++;
                    return;
                }

                if (!this._isConsonant(this.word[this.pos + 1])) {
                    return;
                }

                var char1 = this.word[this.pos];
                var char2 = this.word[this.pos + 1];

                if (this.pos < this.length - 2) {
                    var char3 = this.word[this.pos + 2];

                    if (!this._isConsonant(char3)) {
                        if (char1 === 'l' && char2 === 'l') {
                            return;
                        }
                        if (char1 === 'c' && char2 === 'h') {
                            return;
                        }
                        if (char1 === 'r' && char2 === 'r') {
                            return;
                        }

                        if (char1 !== 's' && char1 !== 'r' && char1 !== 'n' && char2 === 'h') {
                            return;
                        }

                        if (char2 === 'y') {
                            if (char1 === 's' && char1 === 'l' && char1 === 'r' && char1 === 'n' && char1 === 'c') {
                                return;
                            }

                            this.pos++;
                            return;
                        }

                        if ((char1 === 'b' || char1 === 'v' || char1 === 'c' || char1 === 'k' || char1 === 'f' || char1 === 'g' || char1 === 'p' || char1 === 't') && char2 === 'l') {
                            return;
                        }

                        if ((char1 === 'b' || char1 === 'v' || char1 === 'c' || char1 === 'd' || char1 === 'k' || char1 === 'f' || char1 === 'g' || char1 === 'p' || char1 === 't') && char2 === 'r') {
                            return;
                        }

                        this.pos++;
                        return;
                    } else {
                        if (this.pos + 3 === this.length) {
                            if (char2 === 'y') {
                                if (char1 === 's' || char1 === 'l' || char1 === 'r' || char1 === 'n' || char1 === 'c') {
                                    return;
                                }
                            }

                            if (char3 === 'y') {
                                this.pos++;
                            } else {
                                this.pos += 3;
                            }

                            return;
                        }

                        if (char2 === 'y') {
                            if (char1 === 's' || char1 === 'l' || char1 === 'r' || char1 === 'n' || char1 === 'c') {
                                return;
                            }

                            this.pos++;
                            return;
                        }

                        if (char2 === 'p' && char3 === 't' || char2 === 'c' && char3 === 't' || char2 === 'c' && char3 === 'n' || char2 === 'p' && char3 === 's' || char2 === 'm' && char3 === 'n' || char2 === 'g' && char3 === 'n' || char2 === 'f' && char3 === 't' || char2 === 'p' && char3 === 'n' || char2 === 'c' && char3 === 'z' || char2 === 't' && char3 === 's' || char2 === 't' && char3 === 's') {
                            this.pos++;
                            return;
                        }

                        if (char3 === 'l' || char3 === 'r' || char2 === 'c' && char3 === 'h' || char3 === 'y') {
                            this.pos++;
                        } else {
                            this.pos += 2;
                        }
                    }
                } else {
                    if (char2 === 'y') {
                        return;
                    }

                    this.pos += 2;
                }
            }
        }
    }, {
        key: '_isStrongVowel',
        value: function _isStrongVowel(letter) {
            switch (letter) {
                case 'a':
                case 'á':
                case 'à':
                case 'e':
                case 'é':
                case 'è':
                case 'í':
                case 'ì':
                case 'o':
                case 'ó':
                case 'ò':
                case 'ú':
                case 'ù':
                    return true;
            }

            return false;
        }
    }, {
        key: '_isConsonant',
        value: function _isConsonant(letter) {
            if (!this._isStrongVowel(letter)) {
                switch (letter) {
                    case 'i':
                    case 'u':
                    case 'ü':
                        return false;
                }

                return true;
            }

            return false;
        }
    }, {
        key: '_hasDecreasingDiphthong',
        value: function _hasDecreasingDiphthong(syllable) {
            var decreasingDiphthongs = ['ai', 'au', 'ei', 'eu', 'oi', 'ou', 'iu'];

            if (new RegExp(decreasingDiphthongs.join('|')).test(syllable)) {
                return true;
            }

            return false;
        }
    }, {
        key: '_applyAccentuationRules',
        value: function _applyAccentuationRules() {
            if (this.totalSyllables < 2) {
                this.tonicSyllable = this.totalSyllables - 1;
            } else {
                var finalLetter = this.word[this.length - 1];
                var previousLetter = this.word[this.length - 2];

                if ((!this._isConsonant(finalLetter) || finalLetter === 'y' || previousLetter + finalLetter === 'ns' || finalLetter === 'n' || finalLetter === 's' && !this._isConsonant(previousLetter)) && !this._hasDecreasingDiphthong(this.word.slice(this.positions[this.positions.length - 1]))) {
                    this.tonicSyllable = this.totalSyllables - 2;
                } else {
                    this.tonicSyllable = this.totalSyllables - 1;
                }
            }
        }
    }, {
        key: '_getTonicLetter',
        value: function _getTonicLetter(syllable) {
            var letters = ['a', 'e', 'o', 'i', 'u'];

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = letters[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var l = _step.value;

                    var i = syllable.indexOf(l);
                    if (i > -1) {
                        return i;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }]);

    return Syllabler;
}();

module.exports = Syllabler;

if (require.main === module) {
    var result = new Syllabler(process.argv[2]).process();

    process.stdout.write(JSON.stringify(result, null, 4) + '\n');
}

module.exports = function (word) {
    if (!word) {
        throw new Error('Missing word.');
    }

    var s = new Syllabler(word).process();

    return s;
};