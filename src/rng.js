(function (root) {
  'use strict';
  const MS = root.MarxSim = root.MarxSim || {};

  class SeededRng {
    constructor(seed) {
      this.state = (Number(seed) >>> 0) || 0x6d2b79f5;
    }

    next() {
      let t = this.state += 0x6D2B79F5;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      const result = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      this.state >>>= 0;
      return result;
    }

    range(min, max) {
      return min + (max - min) * this.next();
    }

    int(min, maxInclusive) {
      return Math.floor(this.range(min, maxInclusive + 1));
    }

    getState() {
      return this.state >>> 0;
    }
  }

  MS.SeededRng = SeededRng;
})(typeof globalThis !== 'undefined' ? globalThis : window);
