import React, { useMemo, useState } from 'react';
import type { SubjectId } from '../../types';
import {
  computeBreakEvenUnits,
  computeDepreciation,
  computeInsuranceAverageClaim,
  computeMarkupAndMargin,
  computeReorderLevel,
  computeTrialBalance,
  type JournalEntry,
} from '../../utils/studioCalculators';

const STARTER_ENTRIES: JournalEntry[] = [
  { id: 'e1', label: 'Owner starts shop with cash', debitAccount: 'Cash', creditAccount: 'Capital', amount: 500000 },
  { id: 'e2', label: 'Bought goods for resale by cash', debitAccount: 'Purchases', creditAccount: 'Cash', amount: 180000 },
  { id: 'e3', label: 'Cash sales to customers', debitAccount: 'Cash', creditAccount: 'Sales', amount: 245000 },
  { id: 'e4', label: 'Paid shop rent', debitAccount: 'Rent expense', creditAccount: 'Cash', amount: 60000 },
];

const ACCOUNTS_LIST = ['Cash', 'Bank', 'Capital', 'Purchases', 'Sales', 'Rent expense', 'Equipment', 'Trade receivables', 'Trade payables', 'Drawings'];

export function AccountingAndBusinessStudio({ subj }: { subj: SubjectId }) {
  const isAccounting = subj === 'acct' || subj === 'bookkeep';

  // Accounting workbench state
  const [entries, setEntries] = useState<JournalEntry[]>(STARTER_ENTRIES);
  const [label, setLabel] = useState<string>('Sold goods on credit');
  const [drAcc, setDrAcc] = useState<string>('Trade receivables');
  const [crAcc, setCrAcc] = useState<string>('Sales');
  const [amount, setAmount] = useState<number>(85000);

  // Depreciation state
  const [assetCost, setAssetCost] = useState<number>(400000);
  const [salvage, setSalvage] = useState<number>(40000);
  const [years, setYears] = useState<number>(5);
  const [ratePct, setRatePct] = useState<number>(20);
  const [depMethod, setDepMethod] = useState<'straight-line' | 'reducing-balance'>('straight-line');

  // Business / Commerce / Insurance / Store calculators
  const [costPrice, setCostPrice] = useState<number>(12000);
  const [sellingPrice, setSellingPrice] = useState<number>(15000);
  const [fixedCost, setFixedCost] = useState<number>(300000);
  const [varCost, setVarCost] = useState<number>(9000);
  const [sumInsured, setSumInsured] = useState<number>(6000000);
  const [actualValue, setActualValue] = useState<number>(10000000);
  const [actualLoss, setActualLoss] = useState<number>(2500000);
  const [maxUsage, setMaxUsage] = useState<number>(50);
  const [maxLead, setMaxLead] = useState<number>(10);
  const [minUsage, setMinUsage] = useState<number>(20);
  const [minLead, setMinLead] = useState<number>(4);
  const [reorderQty, setReorderQty] = useState<number>(400);

  const tb = useMemo(() => computeTrialBalance(entries), [entries]);
  const depRows = useMemo(
    () => computeDepreciation(assetCost, salvage, years, ratePct, depMethod),
    [assetCost, salvage, years, ratePct, depMethod]
  );

  const markup = useMemo(() => computeMarkupAndMargin(costPrice, sellingPrice), [costPrice, sellingPrice]);
  const breakEven = useMemo(() => computeBreakEvenUnits(fixedCost, sellingPrice, varCost), [fixedCost, sellingPrice, varCost]);
  const claim = useMemo(() => computeInsuranceAverageClaim(sumInsured, actualValue, actualLoss), [sumInsured, actualValue, actualLoss]);
  const stock = useMemo(() => computeReorderLevel(maxUsage, maxLead, minUsage, minLead, reorderQty), [maxUsage, maxLead, minUsage, minLead, reorderQty]);

  const addEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0 || drAcc === crAcc) return;
    setEntries((prev) => [
      ...prev,
      {
        id: `e-${Date.now()}`,
        label: label.trim() || `${drAcc} / ${crAcc}`,
        debitAccount: drAcc,
        creditAccount: crAcc,
        amount: Number(amount),
      },
    ]);
    setLabel('');
  };

  if (isAccounting) {
    return (
      <div className="flex flex-col gap-5">
        {/* Double Entry Journal + Live Trial Balance */}
        <section className="rtc-card rounded-[28px] p-5 sm:p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div>
              <h2 className="h22 text-[var(--ink)]">Double-entry ledger & trial balance</h2>
              <p className="text-[13.5px] text-[var(--dim)]">
                Every debit entry has a matching credit entry. Post a transaction and watch the Trial Balance update live.
              </p>
            </div>
            <span className={tb.balanced ? 'tile-mint px-3.5 py-1.5 rounded-full text-[12.5px] font-bold' : 'tile-peach px-3.5 py-1.5 rounded-full text-[12.5px] font-bold'}>
              {tb.balanced ? 'Trial balance agrees ✓' : 'Out of balance'}
            </span>
          </div>

          <form onSubmit={addEntry} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end bg-[var(--bg)] p-4 rounded-[20px] border-2 border-[var(--line)]">
            <div className="sm:col-span-4 flex flex-col gap-1">
              <label htmlFor="acct-desc" className="text-[12px] font-bold text-[var(--dim)]">Description</label>
              <input
                id="acct-desc"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Bought shop van"
                className="min-h-[42px] px-3 rounded-[14px] bg-[var(--card)] border-2 border-[var(--line)] text-[14px] text-[var(--ink)]"
              />
            </div>
            <div className="sm:col-span-3 flex flex-col gap-1">
              <label htmlFor="acct-dr" className="text-[12px] font-bold text-[var(--dim)]">Debit (Dr)</label>
              <select
                id="acct-dr"
                value={drAcc}
                onChange={(e) => setDrAcc(e.target.value)}
                className="min-h-[42px] px-3 rounded-[14px] bg-[var(--card)] border-2 border-[var(--line)] text-[13.5px] font-bold text-[var(--ink)]"
              >
                {ACCOUNTS_LIST.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div className="sm:col-span-3 flex flex-col gap-1">
              <label htmlFor="acct-cr" className="text-[12px] font-bold text-[var(--dim)]">Credit (Cr)</label>
              <select
                id="acct-cr"
                value={crAcc}
                onChange={(e) => setCrAcc(e.target.value)}
                className="min-h-[42px] px-3 rounded-[14px] bg-[var(--card)] border-2 border-[var(--line)] text-[13.5px] font-bold text-[var(--ink)]"
              >
                {ACCOUNTS_LIST.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2 flex flex-col gap-1">
              <label htmlFor="acct-amt" className="text-[12px] font-bold text-[var(--dim)]">Amount (₦)</label>
              <input
                id="acct-amt"
                type="number"
                min={1}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="min-h-[42px] px-3 rounded-[14px] bg-[var(--card)] border-2 border-[var(--line)] text-[14px] font-bold text-[var(--ink)]"
              />
            </div>
            <div className="sm:col-span-12 flex justify-between items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setEntries(STARTER_ENTRIES)}
                className="text-[12.5px] font-bold text-[var(--dim)] hover:text-[var(--ink)] cursor-pointer"
              >
                Reset sample shop
              </button>
              <button type="submit" className="btn-tactile indigo py-2 px-4 text-[13.5px]">
                Post entry
              </button>
            </div>
          </form>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Journal List */}
            <div className="flex flex-col gap-2">
              <h3 className="h16 text-[var(--ink)]">Posted journal entries ({entries.length})</h3>
              {entries.map((en) => (
                <div key={en.id} className="rounded-[16px] bg-[var(--bg)] border-2 border-[var(--line)] px-3.5 py-2.5 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-[13.5px] font-bold text-[var(--ink)] truncate">{en.label}</div>
                    <div className="text-[12px] text-[var(--dim)]">
                      Dr {en.debitAccount} · Cr {en.creditAccount}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-extrabold text-[13.5px] text-[var(--gold)]">
                      ₦{en.amount.toLocaleString()}
                    </span>
                    <button
                      type="button"
                      onClick={() => setEntries((prev) => prev.filter((item) => item.id !== en.id))}
                      className="text-[12px] font-bold text-[var(--dim)] hover:text-[var(--ink)] cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Trial Balance Table */}
            <div className="flex flex-col gap-2">
              <h3 className="h16 text-[var(--ink)]">Trial balance</h3>
              <div className="rounded-[18px] border-2 border-[var(--line)] overflow-hidden">
                <table className="w-full text-[13.5px]">
                  <thead className="bg-[var(--acc-soft)] text-[var(--ink)]">
                    <tr>
                      <th className="text-left p-2.5 font-bold">Account</th>
                      <th className="text-right p-2.5 font-bold">Debit (₦)</th>
                      <th className="text-right p-2.5 font-bold">Credit (₦)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tb.lines.map((line) => (
                      <tr key={line.account} className="border-t border-[var(--line)]">
                        <td className="p-2.5 font-semibold text-[var(--ink)]">{line.account}</td>
                        <td className="p-2.5 text-right font-mono">{line.debit ? line.debit.toLocaleString() : '—'}</td>
                        <td className="p-2.5 text-right font-mono">{line.credit ? line.credit.toLocaleString() : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-[var(--bg)] border-t-2 border-[var(--line)] font-extrabold">
                    <tr>
                      <td className="p-2.5 text-[var(--ink)]">Total</td>
                      <td className="p-2.5 text-right text-[var(--gold)]">₦{tb.totalDebit.toLocaleString()}</td>
                      <td className="p-2.5 text-right text-[var(--gold)]">₦{tb.totalCredit.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Depreciation Schedule */}
        <section className="rtc-card rounded-[26px] p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h3 className="h18 text-[var(--ink)]">Depreciation schedule calculator</h3>
            <div className="flex gap-2">
              {(['straight-line', 'reducing-balance'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setDepMethod(m)}
                  className={`px-3 py-1.5 rounded-[14px] border-2 text-[12.5px] font-bold cursor-pointer ${
                    depMethod === m
                      ? 'bg-[var(--gold)] text-[var(--on-acc)] border-[var(--acc-d)]'
                      : 'bg-[var(--bg)] text-[var(--ink)] border-[var(--line)]'
                  }`}
                >
                  {m === 'straight-line' ? 'Straight-line' : 'Reducing balance'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <label className="flex flex-col gap-1 text-[12px] font-bold text-[var(--dim)]">
              Asset cost (₦)
              <input type="number" value={assetCost} onChange={(e) => setAssetCost(Number(e.target.value))} className="min-h-[40px] px-3 rounded-[14px] bg-[var(--bg)] border-2 border-[var(--line)] text-[14px] text-[var(--ink)]" />
            </label>
            <label className="flex flex-col gap-1 text-[12px] font-bold text-[var(--dim)]">
              Scrap value (₦)
              <input type="number" value={salvage} onChange={(e) => setSalvage(Number(e.target.value))} className="min-h-[40px] px-3 rounded-[14px] bg-[var(--bg)] border-2 border-[var(--line)] text-[14px] text-[var(--ink)]" />
            </label>
            <label className="flex flex-col gap-1 text-[12px] font-bold text-[var(--dim)]">
              Useful life (yrs)
              <input type="number" min={1} max={10} value={years} onChange={(e) => setYears(Number(e.target.value))} className="min-h-[40px] px-3 rounded-[14px] bg-[var(--bg)] border-2 border-[var(--line)] text-[14px] text-[var(--ink)]" />
            </label>
            <label className="flex flex-col gap-1 text-[12px] font-bold text-[var(--dim)]">
              Rate (% p.a.)
              <input type="number" min={1} max={80} value={ratePct} onChange={(e) => setRatePct(Number(e.target.value))} className="min-h-[40px] px-3 rounded-[14px] bg-[var(--bg)] border-2 border-[var(--line)] text-[14px] text-[var(--ink)]" />
            </label>
          </div>

          <div className="rounded-[18px] border-2 border-[var(--line)] overflow-x-auto">
            <table className="w-full text-[13.5px]">
              <thead className="bg-[var(--acc-soft)]">
                <tr>
                  <th className="p-2.5 text-left">Year</th>
                  <th className="p-2.5 text-right">Annual charge</th>
                  <th className="p-2.5 text-right">Accumulated</th>
                  <th className="p-2.5 text-right">Net book value</th>
                </tr>
              </thead>
              <tbody>
                {depRows.map((r) => (
                  <tr key={r.year} className="border-t border-[var(--line)]">
                    <td className="p-2.5 font-bold">Year {r.year}</td>
                    <td className="p-2.5 text-right font-mono">₦{r.charge.toLocaleString()}</td>
                    <td className="p-2.5 text-right font-mono">₦{r.accumulated.toLocaleString()}</td>
                    <td className="p-2.5 text-right font-mono font-bold text-[var(--gold)]">₦{r.nbv.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    );
  }

  // Commerce, Marketing, Insurance, Store Management, Office Practice
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Mark-up vs Margin & Break-even */}
      <section className="rtc-card rounded-[26px] p-5 flex flex-col gap-3.5">
        <h2 className="h18 text-[var(--ink)]">Mark-up, margin & break-even</h2>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1 text-[12px] font-bold text-[var(--dim)]">
            Cost price (₦)
            <input type="number" value={costPrice} onChange={(e) => setCostPrice(Number(e.target.value))} className="min-h-[40px] px-3 rounded-[14px] bg-[var(--bg)] border-2 border-[var(--line)] text-[14px] text-[var(--ink)]" />
          </label>
          <label className="flex flex-col gap-1 text-[12px] font-bold text-[var(--dim)]">
            Selling price (₦)
            <input type="number" value={sellingPrice} onChange={(e) => setSellingPrice(Number(e.target.value))} className="min-h-[40px] px-3 rounded-[14px] bg-[var(--bg)] border-2 border-[var(--line)] text-[14px] text-[var(--ink)]" />
          </label>
          <label className="flex flex-col gap-1 text-[12px] font-bold text-[var(--dim)]">
            Fixed cost (₦)
            <input type="number" value={fixedCost} onChange={(e) => setFixedCost(Number(e.target.value))} className="min-h-[40px] px-3 rounded-[14px] bg-[var(--bg)] border-2 border-[var(--line)] text-[14px] text-[var(--ink)]" />
          </label>
          <label className="flex flex-col gap-1 text-[12px] font-bold text-[var(--dim)]">
            Variable cost / unit (₦)
            <input type="number" value={varCost} onChange={(e) => setVarCost(Number(e.target.value))} className="min-h-[40px] px-3 rounded-[14px] bg-[var(--bg)] border-2 border-[var(--line)] text-[14px] text-[var(--ink)]" />
          </label>
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          <div className="tile-peach rounded-[16px] p-3">
            <div className="text-[11.5px] font-bold">Mark-up</div>
            <div className="text-[20px] font-extrabold">{markup.markupPct}%</div>
          </div>
          <div className="tile-mint rounded-[16px] p-3">
            <div className="text-[11.5px] font-bold">Margin</div>
            <div className="text-[20px] font-extrabold">{markup.marginPct}%</div>
          </div>
          <div className="tile-sky rounded-[16px] p-3">
            <div className="text-[11.5px] font-bold">Break-even</div>
            <div className="text-[20px] font-extrabold">
              {breakEven.breakEvenUnits !== null ? `${breakEven.breakEvenUnits} units` : '—'}
            </div>
          </div>
        </div>
      </section>

      {/* Insurance Average Clause Calculator */}
      <section className="rtc-card rounded-[26px] p-5 flex flex-col gap-3.5">
        <h2 className="h18 text-[var(--ink)]">Insurance average clause calculator</h2>
        <p className="text-[13px] text-[var(--dim)]">
          Payable claim = (Sum insured ÷ Actual value) × Actual loss when under-insured.
        </p>
        <div className="grid grid-cols-3 gap-2.5">
          <label className="flex flex-col gap-1 text-[12px] font-bold text-[var(--dim)]">
            Sum insured (₦)
            <input type="number" value={sumInsured} onChange={(e) => setSumInsured(Number(e.target.value))} className="min-h-[40px] px-2.5 rounded-[14px] bg-[var(--bg)] border-2 border-[var(--line)] text-[13.5px] text-[var(--ink)]" />
          </label>
          <label className="flex flex-col gap-1 text-[12px] font-bold text-[var(--dim)]">
            Actual value (₦)
            <input type="number" value={actualValue} onChange={(e) => setActualValue(Number(e.target.value))} className="min-h-[40px] px-2.5 rounded-[14px] bg-[var(--bg)] border-2 border-[var(--line)] text-[13.5px] text-[var(--ink)]" />
          </label>
          <label className="flex flex-col gap-1 text-[12px] font-bold text-[var(--dim)]">
            Actual loss (₦)
            <input type="number" value={actualLoss} onChange={(e) => setActualLoss(Number(e.target.value))} className="min-h-[40px] px-2.5 rounded-[14px] bg-[var(--bg)] border-2 border-[var(--line)] text-[13.5px] text-[var(--ink)]" />
          </label>
        </div>
        <div className="rounded-[18px] bg-[var(--acc-soft)] border-2 border-[var(--acc-line)] p-4 flex items-center justify-between gap-2">
          <div>
            <div className="text-[12.5px] font-bold text-[var(--dim)]">Indemnity payable</div>
            <div className="text-[24px] font-extrabold text-[var(--gold)]">₦{claim.payableClaim.toLocaleString()}</div>
          </div>
          <span className={claim.underInsured ? 'tile-peach px-3 py-1 rounded-full text-[12px] font-bold' : 'tile-mint px-3 py-1 rounded-full text-[12px] font-bold'}>
            {claim.underInsured ? 'Under-insured' : 'Fully covered'}
          </span>
        </div>
      </section>

      {/* Store Re-order & Stock Control */}
      <section className="rtc-card rounded-[26px] p-5 flex flex-col gap-3.5 lg:col-span-2">
        <h2 className="h18 text-[var(--ink)]">Store stock control & re-order level</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          <label className="flex flex-col gap-1 text-[12px] font-bold text-[var(--dim)]">
            Max daily use
            <input type="number" value={maxUsage} onChange={(e) => setMaxUsage(Number(e.target.value))} className="min-h-[40px] px-3 rounded-[14px] bg-[var(--bg)] border-2 border-[var(--line)] text-[14px] text-[var(--ink)]" />
          </label>
          <label className="flex flex-col gap-1 text-[12px] font-bold text-[var(--dim)]">
            Max lead days
            <input type="number" value={maxLead} onChange={(e) => setMaxLead(Number(e.target.value))} className="min-h-[40px] px-3 rounded-[14px] bg-[var(--bg)] border-2 border-[var(--line)] text-[14px] text-[var(--ink)]" />
          </label>
          <label className="flex flex-col gap-1 text-[12px] font-bold text-[var(--dim)]">
            Min daily use
            <input type="number" value={minUsage} onChange={(e) => setMinUsage(Number(e.target.value))} className="min-h-[40px] px-3 rounded-[14px] bg-[var(--bg)] border-2 border-[var(--line)] text-[14px] text-[var(--ink)]" />
          </label>
          <label className="flex flex-col gap-1 text-[12px] font-bold text-[var(--dim)]">
            Min lead days
            <input type="number" value={minLead} onChange={(e) => setMinLead(Number(e.target.value))} className="min-h-[40px] px-3 rounded-[14px] bg-[var(--bg)] border-2 border-[var(--line)] text-[14px] text-[var(--ink)]" />
          </label>
          <label className="flex flex-col gap-1 text-[12px] font-bold text-[var(--dim)]">
            Re-order qty
            <input type="number" value={reorderQty} onChange={(e) => setReorderQty(Number(e.target.value))} className="min-h-[40px] px-3 rounded-[14px] bg-[var(--bg)] border-2 border-[var(--line)] text-[14px] text-[var(--ink)]" />
          </label>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="tile-peach rounded-[16px] p-3.5">
            <div className="text-[12px] font-bold">Re-order level</div>
            <div className="text-[22px] font-extrabold">{stock.reorderLevel} units</div>
          </div>
          <div className="tile-mint rounded-[16px] p-3.5">
            <div className="text-[12px] font-bold">Minimum stock</div>
            <div className="text-[22px] font-extrabold">{stock.minStock} units</div>
          </div>
          <div className="tile-sky rounded-[16px] p-3.5">
            <div className="text-[12px] font-bold">Maximum stock</div>
            <div className="text-[22px] font-extrabold">{stock.maxStock} units</div>
          </div>
        </div>
      </section>
    </div>
  );
}
