(function (root) {
  'use strict';
  const MS = root.MarxSim = root.MarxSim || {};
  MS.advanceClock = function advanceClock(state) {
    state.tick += 1;
    state.date.month += 1;
    if (state.date.month > 12) {
      state.date.month = 1;
      state.date.year += 1;
    }
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
