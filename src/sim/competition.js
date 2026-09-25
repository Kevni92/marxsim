(function (root) {
  'use strict';
  const MS = root.MarxSim = root.MarxSim || {};

  MS.updateCompetition = function updateCompetition(state) {
    const result = {};
    for (const sector of state.sectors) {
      const firms = state.firms.filter(f => f.active && f.sector === sector.id);
      const totalSales = firms.reduce((sum, f) => sum + f.sales, 0);
      const totalCapital = firms.reduce((sum, f) => sum + f.capital_stock, 0);
      const shares = firms.map(f => {
        const basis = totalSales > 0 ? f.sales / totalSales : (totalCapital > 0 ? f.capital_stock / totalCapital : 0);
        f.market_share = basis;
        return basis;
      }).sort((a, b) => b - a);

      result[sector.id] = {
        firms: firms.length,
        top1: shares[0] || 0,
        top3: shares.slice(0, 3).reduce((sum, share) => sum + share, 0),
        hhi: shares.reduce((sum, share) => sum + share * share, 0)
      };
    }
    state.economy.concentration = result;
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
