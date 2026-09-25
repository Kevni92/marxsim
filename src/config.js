(function (root) {
  'use strict';
  const MS = root.MarxSim = root.MarxSim || {};
  MS.CONFIG = Object.freeze({
    version: 1,
    startYear: 1850,
    startMonth: 1,
    ticksPerYear: 12,
    alpha: 0.65,
    wageAdjustment: 0.12,
    priceAdjustmentLimit: 0.03,
    corporateTaxRate: 0.08,
    depreciationRateMonthly: 0.006,
    investmentShareOfCash: 0.16,
    insolvencyGraceMonths: 3,
    householdDemandShares: Object.freeze({ food: 0.50, textiles: 0.30, goods: 0.20 })
  });
})(typeof globalThis !== 'undefined' ? globalThis : window);
