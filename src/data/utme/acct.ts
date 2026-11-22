import { buildUtmeSubjectCurriculum, type UtmeTopicSpec } from './builder';

const ACCT_SPECS: UtmeTopicSpec[] = [
  {
    id: 'acct-nature-ethics-principles',
    name: 'Nature, history, ethics and principles of accounting',
    sec: 'Foundations of accounting',
    goals: [
      'Explain the purpose of accounting, its history (Luca Pacioli, ICAN, ANAN), professional ethics and main users of financial statements',
      'Apply core accounting concepts and conventions (business entity, going concern, accruals, prudence, consistency, historical cost)',
    ],
    trap: 'Do not confuse BOOKKEEPING with ACCOUNTING: bookkeeping is the routine recording of daily transactions, whereas accounting goes further to classify, summarise, interpret and communicate financial reports for decision-making.',
    parts: [
      {
        title: 'Nature, history, users and ethics of accounting',
        idea: 'Accounting is the systematic process of recording, classifying, summarising and interpreting financial information so owners, investors, lenders, employees and tax authorities can make informed decisions. Modern double-entry bookkeeping was codified by Italian friar Luca Pacioli in 1494. In Nigeria, professional standards are upheld by ICAN (Institute of Chartered Accountants of Nigeria) and ANAN (Association of National Accountants of Nigeria), guided by integrity, objectivity, confidentiality and competence.',
        terms: [
          ['Double-entry system', 'Recording every financial transaction with equal debit and credit entries so the books always balance'],
          ['Accounting equation', 'Assets = Capital + Liabilities (or Capital = Assets − Liabilities)'],
          ['Internal vs External users', 'Internal users include owners and managers; external users include banks, investors, suppliers, customers and FIRS (tax authorities)'],
        ],
        rules: [
          'Every transaction affects at least two accounts, keeping Assets = Capital + Liabilities intact.',
          'Accounting ethics require honesty, independence (objectivity), confidentiality of client records and refusal to falsify figures ("window dressing").',
          'Capital expenditure buys or improves long-term non-current assets (e.g., buying a delivery van); revenue expenditure pays routine running costs (e.g., petrol and repairs).',
        ],
        table: {
          headers: ['User group', 'Type', 'Main question they ask'],
          rows: [
            ['Owners / shareholders', 'Internal / External', 'Is the business profitable and growing our equity?'],
            ['Managers', 'Internal', 'Which products or branches need better cost control?'],
            ['Banks & lenders', 'External', 'Can the firm repay loan principal and interest on time?'],
            ['FIRS / State IRS', 'External', 'How much tax is lawfully due?'],
          ],
          trapNote: 'Buying a new van engine that extends the van’s life is CAPITAL expenditure; replacing worn brake pads or buying diesel is REVENUE expenditure.',
        },
        example: {
          q: 'A sole trader starts business with ₦1,500,000 cash, buys equipment worth ₦600,000 on credit from Ade Ltd, and borrows ₦400,000 from a bank. Verify the accounting equation.',
          steps: [
            ['Total Assets', 'Cash (₦1,500,000 + ₦400,000) + Equipment (₦600,000) = ₦2,500,000'],
            ['Capital + Liabilities', 'Capital ₦1,500,000 + Creditor ₦600,000 + Loan ₦400,000 = ₦2,500,000'],
            ['Check', 'Assets (₦2,500,000) = Capital + Liabilities (₦2,500,000)'],
          ],
        },
        yourTurn: {
          q: 'Which Italian mathematician published the first printed treatise codifying the double-entry bookkeeping system in 1494?',
          o: ['Luca Pacioli', 'Adam Smith', 'John Maynard Keynes', 'David Ricardo'],
          a: 0,
          h: [
            'He is widely called the "father of modern accounting".',
            'He published his treatise in Venice in 1494.',
          ],
          e: 'Luca Pacioli documented the Venetian double-entry system in 1494 and is celebrated as the father of accounting.',
        },
      },
      {
        title: 'Accounting concepts and conventions',
        idea: 'Accounting concepts are universally agreed rules that keep financial reports fair, comparable and trustworthy across companies. Key concepts include Business Entity (owner and business are separate), Going Concern (the firm will keep operating), Accruals/Matching (match revenues and expenses to the period earned/incurred, not when cash moves), Prudence/Conservatism (never overstate profit or assets; anticipate probable losses), Consistency and Historical Cost.',
        terms: [
          ['Business Entity concept', 'The business is treated as separate from its owner — personal groceries bought with business cash are recorded as Drawings'],
          ['Accruals (Matching) concept', 'Income and expenses are recognised in the accounting period they belong to, whether cash has been paid yet or not'],
          ['Prudence (Conservatism)', 'Do not anticipate unrealised profits, but provide promptly for known or probable losses (e.g., doubtful debts)'],
          ['Going Concern', 'Assumption that the business will continue operating for the foreseeable future rather than liquidating immediately'],
        ],
        rules: [
          'Money Measurement means accounting records only items expressible in monetary terms (so staff morale or loyal reputation does not appear in the Balance Sheet).',
          'Consistency requires using the same depreciation or stock valuation method year after year unless a justified change is disclosed.',
          'Materiality permits expensing tiny low-cost items (like a ₦1,500 office stapler) immediately instead of depreciating them over five years.',
        ],
        table: {
          headers: ['Concept', 'Practical accounting effect'],
          rows: [
            ['Business Entity', 'Owner’s private school fees paid from shop till are debited to Drawings, not Business Expenses'],
            ['Prudence', 'Closing inventory is valued at the LOWER of cost and net realisable value'],
            ['Accruals / Matching', 'December electricity bill paid in January is still charged to December’s Profit & Loss'],
            ['Materiality', 'A ₦2,000 wastebasket is written off immediately instead of treated as a fixed asset'],
          ],
          trapNote: 'Valuing closing stock at the LOWER of cost and net realisable value is the classic exam illustration of the PRUDENCE concept.',
        },
        example: {
          q: 'A trader buys a ₦4,000,000 generator for shop use and also pays ₦150,000 for her daughter’s school uniform out of the business bank account. Which concept keeps the ₦150,000 out of shop expenses?',
          steps: [
            ['Separate owner from business', 'School uniform is a personal expense of the owner, not the shop'],
            ['Name the concept', 'Business Entity concept — recorded as Drawings'],
          ],
        },
        yourTurn: {
          q: 'Valuing closing inventory at the lower of cost and net realisable value directly applies which accounting concept?',
          o: ['Prudence (Conservatism)', 'Going Concern', 'Dual Aspect', 'Business Entity'],
          a: 0,
          h: [
            'This convention prevents businesses from exaggerating profits or asset values.',
            'It requires anticipating probable losses while waiting until gains are actually realised.',
          ],
          e: 'The prudence (conservatism) convention requires valuing inventory at the lower of cost and net realisable value so profits and assets are not overstated.',
        },
      },
    ],
    qs: [
      {
        q: 'If a business has total assets of ₦850,000 and total liabilities of ₦320,000, what is its owner’s capital?',
        o: ['₦530,000', '₦1,170,000', '₦320,000', '₦425,000'],
        a: 0,
        e: 'Capital = Assets − Liabilities = ₦850,000 − ₦320,000 = ₦530,000.',
      },
      {
        q: 'Which of the following is an example of CAPITAL expenditure?',
        o: [
          'Cost of installing a new delivery van and painting the firm’s logo on it before first use',
          'Weekly fuel bought for the delivery van',
          'Annual motor insurance premium',
          'Replacing a punctured tyre after six months',
        ],
        a: 0,
        e: 'All initial costs to acquire and bring a non-current asset into working condition are capital expenditure.',
      },
      {
        q: 'Recording December rent that remains unpaid at 31 December as an expense of that year obeys the',
        o: ['accruals (matching) concept', 'money measurement concept', 'historical cost concept', 'realisation concept'],
        a: 0,
        e: 'The accruals concept matches expenses to the period in which the benefit was consumed, regardless of payment date.',
      },
      {
        q: 'Which professional accounting bodies are statutorily recognised in Nigeria?',
        o: ['ICAN and ANAN', 'NAFDAC and SON', 'CBN and NDIC', 'SEC and NGX'],
        a: 0,
        e: 'ICAN and ANAN are Nigeria’s two statutory professional accountancy bodies.',
      },
      {
        q: 'Why does the honesty and loyalty of a company’s workforce NOT appear as an asset figure on the Balance Sheet?',
        o: [
          'Money measurement concept — accounting records only items measurable reliably in money',
          'Prudence concept forbids listing staff',
          'Consistency concept ignores employees',
          'Business entity concept removes salaries',
        ],
        a: 0,
        e: 'Under the money measurement concept, qualitative attributes that cannot be quantified objectively in Naira are excluded.',
      },
      {
        q: 'Recording the owner’s private house rent paid from the business till as "Drawings" illustrates the',
        o: ['business entity concept', 'going concern concept', 'periodicity concept', 'materiality concept'],
        a: 0,
        e: 'The business entity concept separates the owner’s private transactions from business expenses.',
      },
    ],
  },
  {
    id: 'acct-source-books-ledger',
    name: 'Source documents, subsidiary books and the ledger',
    sec: 'Recording transactions',
    goals: [
      'Match commercial source documents (invoice, receipt, credit note, debit note, voucher) to their exact books of original entry',
      'Apply the double-entry debit and credit rules across Personal, Real and Nominal ledger accounts',
    ],
    trap: 'Do not confuse a CREDIT NOTE with a DEBIT NOTE: a seller sends a CREDIT NOTE when a customer returns goods (reducing what the customer owes), whereas a DEBIT NOTE is sent to increase an undercharged invoice.',
    parts: [
      {
        title: 'Source documents and books of original entry',
        idea: 'Every entry in accounting starts with verifiable written evidence called a source document. Transactions are first recorded chronologically in specialised Books of Original Entry (Subsidiary Books / Day Books) before posting to the Ledger: Sales Day Book (credit sales only), Purchases Day Book (credit purchases only), Returns Inwards Journal, Returns Outwards Journal, Cash Book (cash & bank) and the General Journal (opening entries, asset purchases on credit, error corrections).',
        terms: [
          ['Invoice', 'Bill issued by a seller to a buyer showing details and price of goods sold on credit'],
          ['Credit Note', 'Document issued by a seller reducing a buyer’s debt (e.g., for returned damaged goods or overcharge)'],
          ['Trade discount vs Cash discount', 'Trade discount is deducted on the invoice and NEVER enters the ledger; cash discount encourages prompt payment and IS recorded in the Cash Book and Profit & Loss'],
        ],
        rules: [
          'Cash sales and cash purchases go straight into the CASH BOOK — NEVER into the Sales Day Book or Purchases Day Book.',
          'Buying a delivery van on credit goes into the GENERAL JOURNAL (not the Purchases Day Book, which is strictly for goods meant for resale).',
          'Trade discount reduces the invoice price upfront; cash discount is calculated on the net amount after trade discount.',
        ],
        table: {
          headers: ['Source document', 'Book of original entry'],
          rows: [
            ['Duplicate (outgoing) sales invoice', 'Sales Day Book (credit sales of resale goods)'],
            ['Original (incoming) purchase invoice', 'Purchases Day Book (credit purchases of resale goods)'],
            ['Credit note issued to customer', 'Returns Inwards (Sales Returns) Journal'],
            ['Credit note received from supplier', 'Returns Outwards (Purchases Returns) Journal'],
            ['Receipts & cheque counterfoils', 'Cash Book'],
          ],
          trapNote: 'Remember: the Purchases Day Book records ONLY credit purchases of GOODS FOR RESALE — buying an office printer on credit goes in the General Journal.',
        },
        example: {
          q: 'A wholesaler sells goods with a catalogue price of ₦200,000 to a retailer at 10% trade discount and 5% cash discount if paid within 7 days. What amount is entered in the Sales Day Book?',
          steps: [
            ['Deduct trade discount first', '10% of ₦200,000 = ₦20,000 → Net invoice = ₦180,000'],
            ['Ignore cash discount at sale date', 'Cash discount applies only if the buyer pays within 7 days'],
            ['Sales Day Book entry', '₦180,000'],
          ],
        },
        yourTurn: {
          q: 'Which book of original entry is used to record the purchase of office furniture on credit from Zenith Furnishings?',
          o: ['General Journal (Journal Proper)', 'Purchases Day Book', 'Cash Book', 'Sales Day Book'],
          a: 0,
          h: [
            'Is office furniture bought for resale, or is it a non-current asset?',
            'Credit purchases of fixed assets cannot go into the Purchases Day Book.',
          ],
          e: 'Credit purchases of non-current assets (not goods for resale) are recorded in the General Journal.',
        },
      },
      {
        title: 'The ledger and double-entry rules',
        idea: 'The Ledger is the principal book of accounts where transactions from subsidiary books are posted into T-accounts. Every entry follows the golden rule: for every Debit (left side), there is an equal Credit (right side). Accounts are grouped into Personal accounts (debtors, creditors, capital), Real accounts (tangible assets like buildings, vehicles, cash) and Nominal accounts (expenses, losses, incomes, gains).',
        terms: [
          ['Personal accounts', 'Debit the receiver; Credit the giver (debtors, creditors, banks)'],
          ['Real accounts', 'Debit what comes in; Credit what goes out (buildings, equipment, cash)'],
          ['Nominal accounts', 'Debit all expenses and losses; Credit all incomes and gains (rent, sales, wages)'],
        ],
        rules: [
          'Quick memory rule — DEAD CLIC: Debit Expenses, Assets & Drawings; Credit Liabilities, Income & Capital.',
          'Normal balances: Assets and Expenses carry DEBIT balances; Liabilities, Capital and Revenues carry CREDIT balances.',
          'A folio column cross-references the exact page number between the subsidiary book and the ledger.',
        ],
        table: {
          headers: ['Account type', 'To INCREASE it', 'To DECREASE it'],
          rows: [
            ['Assets & Expenses', 'Debit (Dr)', 'Credit (Cr)'],
            ['Liabilities, Capital & Income', 'Credit (Cr)', 'Debit (Dr)'],
          ],
          trapNote: 'Returns Inwards (Sales Returns) is a DEBIT balance (reduces sales); Returns Outwards (Purchases Returns) is a CREDIT balance (reduces purchases).',
        },
        example: {
          q: 'Give the exact double entry when a business pays ₦80,000 rent by cheque.',
          steps: [
            ['Identify accounts affected', 'Rent Expense (Nominal) and Bank (Asset)'],
            ['Apply DEAD CLIC', 'Expense increases → Debit Rent Account ₦80,000; Asset decreases → Credit Bank Account ₦80,000'],
          ],
        },
        yourTurn: {
          q: 'A shop receives ₦120,000 cash from a credit customer, Musa, settling his account. What is the correct double entry?',
          o: [
            'Debit Cash Account ₦120,000; Credit Musa’s Account ₦120,000',
            'Debit Musa’s Account ₦120,000; Credit Cash Account ₦120,000',
            'Debit Sales Account ₦120,000; Credit Cash Account ₦120,000',
            'Debit Cash Account ₦120,000; Credit Capital Account ₦120,000',
          ],
          a: 0,
          h: [
            'Cash is coming IN to the business (Real account: debit what comes in).',
            'Musa is the giver settling his debt (Personal account: credit the giver).',
          ],
          e: 'Cash (asset) increases so Debit Cash ₦120,000; Musa (debtor/giver) reduces so Credit Musa ₦120,000.',
        },
      },
    ],
    qs: [
      {
        q: 'Which document is sent by a seller to a buyer to reduce the buyer’s indebtedness when faulty goods are returned?',
        o: ['Credit Note', 'Debit Note', 'Sales Invoice', 'Bank Statement'],
        a: 0,
        e: 'A Credit Note notifies the buyer that their account has been credited (reduced).',
      },
      {
        q: 'Which discount is deducted directly on the invoice and NEVER recorded in the double-entry ledger?',
        o: ['Trade discount', 'Cash discount allowed', 'Cash discount received', 'Settlement discount'],
        a: 0,
        e: 'Trade discount reduces the catalogue price upfront; only net invoice figures enter the books.',
      },
      {
        q: 'Which of the following is classified as a NOMINAL account?',
        o: ['Electricity Expense Account', 'Delivery Van Account', 'Kemi’s Personal Account', 'Cash Account'],
        a: 0,
        e: 'Expenses, losses, revenues and gains are nominal accounts.',
      },
      {
        q: 'Where are cash sales recorded first?',
        o: ['Cash Book', 'Sales Day Book', 'General Journal', 'Returns Inwards Journal'],
        a: 0,
        e: 'All cash receipts and payments enter the Cash Book; the Sales Day Book is strictly for credit sales.',
      },
      {
        q: 'Returns Outwards (Purchases Returns) normally carries which ledger balance?',
        o: ['Credit balance', 'Debit balance', 'Zero balance always', 'Asset balance'],
        a: 0,
        e: 'Purchases carry a debit balance, so Returns Outwards (which reduces purchases) carries a credit balance.',
      },
      {
        q: 'When the owner withdraws ₦50,000 worth of goods from the shop for personal family use, the double entry is',
        o: [
          'Debit Drawings ₦50,000; Credit Purchases ₦50,000',
          'Debit Purchases ₦50,000; Credit Drawings ₦50,000',
          'Debit Drawings ₦50,000; Credit Sales ₦50,000',
          'Debit Cash ₦50,000; Credit Capital ₦50,000',
        ],
        a: 0,
        e: 'Goods taken by the owner at cost reduce Purchases (Credit) and increase Drawings (Debit).',
      },
    ],
  },
  {
    id: 'acct-cashbook-bank-recon',
    name: 'Cash book, petty cash and bank reconciliation',
    sec: 'Cash and banking records',
    goals: [
      'Prepare two-column and three-column cash books (including contra entries and cash discounts) and an imprest petty cash book',
      'Prepare an adjusted cash book and a Bank Reconciliation Statement explaining unpresented cheques, uncredited lodgements and bank charges',
    ],
    trap: 'In a three-column Cash Book, NEVER balance off the Discount Allowed and Discount Received columns — simply total them and post Discount Allowed total to the DEBIT of Discount Allowed Account and Discount Received total to the CREDIT of Discount Received Account.',
    parts: [
      {
        title: 'Cash book, contra entries and imprest petty cash',
        idea: 'The Cash Book is unique: it acts as BOTH a book of original entry AND a ledger account for Cash and Bank. A three-column Cash Book holds Discount, Cash and Bank columns on each side. When cash is banked or withdrawn from the bank for office use, both entries sit inside the Cash Book on opposite sides — called a Contra Entry (marked "C"). Small daily expenses (stamps, bus fare, tea) are managed in an Analytical Petty Cash Book under the Imprest System, where the petty cashier is reimbursed the exact amount spent at period-end to restore the fixed float.',
        terms: [
          ['Contra entry (C)', 'Transfer of cash between office till and business bank account — debited in one column and credited in the other of the same Cash Book'],
          ['Imprest system', 'Petty cash system where a fixed float (imprest) is topped up each period by the exact sum spent'],
          ['Cash overdraft', 'Credit balance brought down in the Bank column showing the firm withdrew more than it held in bank'],
        ],
        rules: [
          'Cash banked into the business bank account: Debit Bank, Credit Cash (C).',
          'Cash withdrawn from bank for office use: Debit Cash, Credit Bank (C).',
          'Cash column can NEVER have a credit closing balance (you cannot spend cash you do not physically have), whereas the Bank column CAN have a credit balance (overdraft).',
        ],
        table: {
          headers: ['Transaction', 'Cash Book Debit', 'Cash Book Credit'],
          rows: [
            ['Cash paid into bank', 'Bank column (C)', 'Cash column (C)'],
            ['Cash drawn from bank for office', 'Cash column (C)', 'Bank column (C)'],
            ['Cash drawn from bank for owner’s private use', 'Not a contra entry! (Dr Drawings)', 'Bank column only'],
          ],
          trapNote: 'Withdrawing cash from the bank for the owner’s PRIVATE use is NOT a contra entry — it is credited to Bank and debited to Drawings.',
        },
        example: {
          q: 'A petty cashier starts the month with an imprest float of ₦30,000 and spends ₦8,500 on transport, ₦6,200 on stationery and ₦4,300 on cleaning. How much cash is left, and how much reimbursement restores the imprest?',
          steps: [
            ['Total spent', '₦8,500 + ₦6,200 + ₦4,300 = ₦19,000'],
            ['Balance remaining', '₦30,000 − ₦19,000 = ₦11,000'],
            ['Reimbursement required', 'Exact amount spent = ₦19,000 (bringing cash back to ₦30,000)'],
          ],
        },
        yourTurn: {
          q: 'Which transaction is recorded as a contra entry ("C") in a two-column or three-column Cash Book?',
          o: [
            'Depositing ₦150,000 cash from the shop till into the business bank account',
            'Paying electricity bill by bank transfer',
            'Owner withdrawing ₦40,000 from bank for personal family vacation',
            'Selling goods on credit to a wholesaler',
          ],
          a: 0,
          h: [
            'A contra entry must affect BOTH the Cash column and the Bank column of the business at the same time.',
            'Owner’s personal drawings affect Bank and Drawings, not the office till.',
          ],
          e: 'Depositing office cash into the business bank account debits Bank and credits Cash inside the same Cash Book (contra entry).',
        },
      },
      {
        title: 'Bank Reconciliation Statement',
        idea: 'The balance in the business’s Cash Book (Bank column) rarely matches the monthly Bank Statement immediately because of timing differences and bank-initiated entries. First, update the Adjusted Cash Book for items on the Bank Statement not yet recorded by the business (bank charges, standing orders, credit transfers, dividends received, dishonoured cheques). Then prepare the Bank Reconciliation Statement to reconcile the Adjusted Cash Book balance with the Bank Statement balance using Unpresented Cheques and Uncredited Lodgements.',
        terms: [
          ['Unpresented cheques', 'Cheques written and credited by the business to suppliers that suppliers have not yet presented to the bank for payment'],
          ['Uncredited lodgements (deposits in transit)', 'Cash or cheques paid in and debited in the Cash Book that the bank has not yet cleared onto the statement'],
          ['Standing order', 'Customer’s instruction to the bank to pay a fixed amount regularly (e.g., monthly rent or insurance)'],
        ],
        rules: [
          'Items entered in the ADJUSTED CASH BOOK: bank charges (Cr), standing orders (Cr), dishonoured cheques (Cr), direct credit transfers/dividends (Dr), Cash Book casting errors.',
          'Starting from a positive Adjusted Cash Book balance: ADD Unpresented Cheques, DEDUCT Uncredited Lodgements = Balance per Bank Statement.',
          'Note opposite perspectives: a positive balance in your Cash Book is a DEBIT, while the same positive balance on the Bank Statement is a CREDIT (you are a creditor to the bank).',
        ],
        table: {
          headers: ['Discrepancy item', 'Where handled?', 'Effect when starting from +ve Cash Book'],
          rows: [
            ['Bank charges / standing order', 'Adjusted Cash Book (Credit)', 'Reduces Cash Book balance'],
            ['Direct credit transfer / dividend', 'Adjusted Cash Book (Debit)', 'Increases Cash Book balance'],
            ['Unpresented cheques', 'Bank Reconciliation Statement', 'Add to Adjusted Cash Book'],
            ['Uncredited lodgements', 'Bank Reconciliation Statement', 'Deduct from Adjusted Cash Book'],
          ],
          trapNote: 'If starting from a BANK OVERDRAFT (negative Adjusted Cash Book), reverse the signs — or keep signed numbers (e.g., −₦20,000 + unpresented − uncredited) so you never get confused!',
        },
        example: {
          q: 'Adjusted Cash Book shows a debit balance of ₦250,000. Unpresented cheques total ₦65,000 and uncredited lodgements total ₦40,000. Find the Bank Statement balance.',
          steps: [
            ['Start with Adjusted Cash Book', '₦250,000'],
            ['Add unpresented cheques', '₦250,000 + ₦65,000 = ₦315,000'],
            ['Less uncredited lodgements', '₦315,000 − ₦40,000 = ₦275,000 (Credit balance per Bank Statement)'],
          ],
        },
        yourTurn: {
          q: 'Before updating the Cash Book, a business has a Cash Book bank balance of ₦180,000. The Bank Statement reveals ₦5,000 bank charges and a ₦25,000 dividend paid directly into the bank. What is the Adjusted Cash Book balance?',
          o: ['₦200,000', '₦150,000', '₦210,000', '₦160,000'],
          a: 0,
          h: [
            'A dividend received directly increases your bank money (+₦25,000), while bank charges reduce it (−₦5,000).',
            'Compute ₦180,000 + ₦25,000 − ₦5,000.',
          ],
          e: 'Adjusted Cash Book balance = ₦180,000 + ₦25,000 (dividend) − ₦5,000 (bank charges) = ₦200,000.',
        },
      },
    ],
    qs: [
      {
        q: 'Under the imprest system of petty cash, the reimbursement made at the end of the month equals',
        o: [
          'the exact total amount spent during the month',
          'twice the original imprest float',
          'the remaining cash in hand',
          'the total sales of the business',
        ],
        a: 0,
        e: 'Reimbursing the exact amount spent restores the petty cash float back to the fixed imprest figure.',
      },
      {
        q: 'Why can the Cash column of a Cash Book NEVER carry a closing credit balance?',
        o: [
          'A business cannot physically pay out more physical cash than it holds',
          'Cash transactions are always exempt from double entry',
          'Banks prohibit cash balances',
          'Cash is a liability account',
        ],
        a: 0,
        e: 'Unlike a bank account (which permits overdrafts), physical cash in a till cannot drop below zero.',
      },
      {
        q: 'Which item appears on the Bank Statement BEFORE the business enters it in the Adjusted Cash Book?',
        o: ['Bank commission and standing orders', 'Unpresented cheques', 'Uncredited deposits', 'Trade discounts'],
        a: 0,
        e: 'Bank charges, standing orders and credit transfers are initiated by the bank and entered into the Adjusted Cash Book once spotted.',
      },
      {
        q: 'Cheques issued to suppliers and credited in the Cash Book but not yet presented to the bank for payment are called',
        o: ['unpresented cheques', 'dishonoured cheques', 'uncredited lodgements', 'stale drafts'],
        a: 0,
        e: 'Unpresented cheques have left the firm’s books but have not yet been deducted by the bank.',
      },
      {
        q: 'In a three-column Cash Book, the total of the Discount Allowed column on the debit side is posted to the',
        o: [
          'debit side of the Discount Allowed Account',
          'credit side of the Discount Allowed Account',
          'credit side of the Bank Account',
          'debit side of the Capital Account',
        ],
        a: 0,
        e: 'Discount Allowed is an expense (debit), so its column total is posted to the debit of Discount Allowed Account.',
      },
      {
        q: 'A favourable (positive) cash balance in a business’s Bank column appears on the Bank Statement as a',
        o: ['credit balance', 'debit balance', 'suspense balance', 'overdraft'],
        a: 0,
        e: 'From the bank’s point of view, customer deposits are a liability owed to the customer, hence shown as a credit balance.',
      },
    ],
  },
  {
    id: 'acct-trial-balance-errors',
    name: 'Trial balance, errors and suspense account',
    sec: 'Checking accuracy',
    goals: [
      'Prepare a Trial Balance and distinguish errors that do NOT affect Trial Balance agreement from those that DO',
      'Use a Suspense Account and Journal entries to correct accounting errors and adjust net profit',
    ],
    trap: 'Do not confuse Error of COMMISSION with Error of PRINCIPLE: Commission posts to the WRONG PERSON’s account (e.g., Ade instead of Ada — same class), whereas Principle posts to the WRONG CLASS of account (e.g., Motor Repairs expense instead of Motor Vehicles asset).',
    parts: [
      {
        title: 'Trial Balance and errors NOT disclosed by it',
        idea: 'A Trial Balance is a list of all ledger closing balances separated into Debit and Credit columns to test arithmetical double-entry accuracy. However, an agreeing Trial Balance does NOT guarantee zero mistakes — six classic errors leave totals equal: Omission, Commission, Principle, Original Entry, Complete Reversal of Entries and Compensating Errors.',
        terms: [
          ['Error of Omission', 'A transaction is completely left out of the books altogether'],
          ['Error of Principle', 'Violates accounting class rules — e.g., debiting Motor Expenses instead of Motor Vehicles for buying a van'],
          ['Error of Commission', 'Correct amount and side, right class, but posted to the wrong personal account (e.g., Musa instead of Musbau)'],
          ['Compensating errors', 'Two unrelated errors on opposite sides accidentally cancel each other out by the same Naira figure'],
        ],
        rules: [
          'Error of Original Entry: wrong figure written right from the source book (e.g., ₦4,500 entered as ₦5,400 on both Dr and Cr).',
          'Complete Reversal of Entries: debit and credit swapped completely (e.g., cash sales of ₦10,000 debited to Sales and credited to Cash — requires correcting by DOUBLE the amount!).',
          'Transposition error in BOTH entries is an Error of Original Entry (TB still agrees); transposition in only ONE side causes TB disagreement.',
        ],
        table: {
          headers: ['Error NOT shown by Trial Balance', 'Classic example'],
          rows: [
            ['Omission', 'Forgot to record a ₦20,000 credit sale completely'],
            ['Commission', 'Debited Tunde’s account instead of Tobi’s account for ₦15,000'],
            ['Principle', 'Debited Building Repairs instead of Buildings for a new wing'],
            ['Original entry', 'Invoice for ₦7,800 entered as ₦8,700 in both Sales and Debtor'],
            ['Complete reversal', 'Cash paid to creditor debited to Cash and credited to Creditor'],
            ['Compensating', 'Sales overcast by ₦5,000 AND Purchases overcast by ₦5,000'],
          ],
          trapNote: 'To fix a COMPLETE REVERSAL of ₦10,000, you must journalise ₦20,000 (double!) — ₦10,000 cancels the wrong side and the next ₦10,000 puts it on the right side.',
        },
        example: {
          q: 'A bookkeeper paid ₦500,000 to buy an office computer and debited Stationery Expenses instead of Office Equipment. Name the error and give the correcting journal entry.',
          steps: [
            ['Identify class mistake', 'Asset (Equipment) wrongly put into an Expense (Stationery) → Error of Principle'],
            ['Correcting Journal', 'Debit Office Equipment ₦500,000; Credit Stationery Expenses ₦500,000'],
          ],
        },
        yourTurn: {
          q: 'Credit sales of ₦45,000 to Bello were properly credited to Sales but debited to Bola’s account by mistake. Which type of error occurred?',
          o: [
            'Error of commission',
            'Error of principle',
            'Error of omission',
            'Complete reversal of entries',
          ],
          a: 0,
          h: [
            'Both Bello and Bola are personal debtor accounts (the same class of account).',
            'Posting to the wrong person’s account within the same class has a specific name.',
          ],
          e: 'Posting to the wrong personal account within the correct class of accounts is an error of commission.',
        },
      },
      {
        title: 'Suspense Account and correcting profit',
        idea: 'When a Trial Balance fails to agree (due to single-sided errors like casting errors, posting only one leg, or entering different figures on debit and credit), the temporary difference is placed into a Suspense Account so draft accounts can proceed. As each one-sided error is discovered, the correcting journal entry uses the Suspense Account as the opposite leg until Suspense clears to zero. Only errors touching Nominal accounts (revenues/expenses) change Net Profit.',
        terms: [
          ['Suspense Account', 'A temporary holding account created to force a disagreeing Trial Balance to balance until one-sided errors are located'],
          ['Overcast / Undercast', 'Overcast = added up too high; Undercast = added up too low'],
          ['Profit adjustment', 'Errors affecting sales, purchases or expenses change draft net profit; errors affecting ONLY Balance Sheet items (e.g., debtors/assets) do NOT change net profit'],
        ],
        rules: [
          'If Trial Balance debit total is LESS than credit total by ₦12,000, open Suspense with a DEBIT balance of ₦12,000.',
          'Sales Account undercast by ₦10,000 → Credit Sales ₦10,000, Debit Suspense ₦10,000 (and ADD ₦10,000 to draft Net Profit).',
          'Purchases Account overcast by ₦8,000 → Credit Purchases ₦8,000, Debit Suspense ₦8,000 (and ADD ₦8,000 to draft Net Profit because cost was too high).',
        ],
        table: {
          headers: ['One-sided error', 'Correcting journal', 'Effect on Net Profit'],
          rows: [
            ['Sales undercast by ₦5,000', 'Dr Suspense ₦5,000; Cr Sales ₦5,000', 'Increases profit by ₦5,000'],
            ['Rent expense overcast by ₦3,000', 'Dr Suspense ₦3,000; Cr Rent ₦3,000', 'Increases profit by ₦3,000'],
            ['Purchases undercast by ₦4,000', 'Dr Purchases ₦4,000; Cr Suspense ₦4,000', 'Reduces profit by ₦4,000'],
            ['Debtor Adebayo omitted on Dr side', 'Dr Adebayo; Cr Suspense', 'No effect on Net Profit'],
          ],
          trapNote: 'Errors involving TWO-SIDED mistakes (like Error of Commission or Principle) NEVER touch the Suspense Account — only single-sided errors pass through Suspense!',
        },
        example: {
          q: 'Draft Net Profit is ₦340,000. Investigation reveals Sales were undercast by ₦20,000 and Wages were overcast by ₦15,000. Calculate the corrected Net Profit.',
          steps: [
            ['Sales undercast by ₦20,000', 'Income was too low → Add ₦20,000'],
            ['Wages overcast by ₦15,000', 'Expense was too high → Add ₦15,000'],
            ['Corrected Net Profit', '₦340,000 + ₦20,000 + ₦15,000 = ₦375,000'],
          ],
        },
        yourTurn: {
          q: 'A Trial Balance shows total debits of ₦610,000 and total credits of ₦625,000. On which side is the Suspense Account opened, and for what amount?',
          o: [
            'Debit side, ₦15,000',
            'Credit side, ₦15,000',
            'Debit side, ₦30,000',
            'Credit side, ₦625,000',
          ],
          a: 0,
          h: [
            'Place the temporary balance on whichever side is currently smaller so both columns equal ₦625,000.',
            'Subtract ₦610,000 from ₦625,000.',
          ],
          e: 'Since debits are ₦15,000 short of credits, the Suspense Account is opened with a debit balance of ₦15,000.',
        },
      },
    ],
    qs: [
      {
        q: 'Which of the following errors WILL cause a Trial Balance to disagree?',
        o: [
          'Posting a cash receipt to the Cash Book but forgetting to credit the customer’s account',
          'Omitting a credit invoice completely from the books',
          'Debiting Motor Expenses instead of Motor Vehicles',
          'Crediting Ojo instead of Okon for a credit purchase',
        ],
        a: 0,
        e: 'Recording only one leg of a transaction creates unequal debits and credits, causing Trial Balance disagreement.',
      },
      {
        q: 'Charging the cost of constructing a new warehouse extension to "Repairs and Maintenance" is an',
        o: ['error of principle', 'error of commission', 'compensating error', 'error of omission'],
        a: 0,
        e: 'Treating capital expenditure as a revenue expense violates fundamental accounting class rules (error of principle).',
      },
      {
        q: 'A cash payment of ₦12,000 for rent was wrongly debited to Cash and credited to Rent. What correcting entry fixes this complete reversal?',
        o: [
          'Debit Rent ₦24,000; Credit Cash ₦24,000',
          'Debit Rent ₦12,000; Credit Cash ₦12,000',
          'Debit Suspense ₦12,000; Credit Rent ₦12,000',
          'Debit Cash ₦24,000; Credit Rent ₦24,000',
        ],
        a: 0,
        e: 'Fixing a complete reversal requires posting DOUBLE the original amount (₦24,000) to the proper sides.',
      },
      {
        q: 'When all one-sided errors have been located and corrected properly, the balance remaining on the Suspense Account should be',
        o: ['zero', 'equal to net profit', 'equal to capital', 'carried forward as an asset'],
        a: 0,
        e: 'Once every single-sided mistake is resolved, the temporary Suspense Account clears completely to zero.',
      },
      {
        q: 'Draft net profit is ₦200,000. It is found that Purchases were undercast by ₦18,000. What is the corrected net profit?',
        o: ['₦182,000', '₦218,000', '₦200,000', '₦164,000'],
        a: 0,
        e: 'Undercasting purchases understated cost of goods sold, so correcting it reduces profit: ₦200,000 − ₦18,000 = ₦182,000.',
      },
      {
        q: 'Which of the following errors requires NO entry in the Suspense Account when corrected?',
        o: [
          'An error of original entry where both debit and credit were entered as ₦9,000 instead of ₦6,000',
          'Sales Day Book overcast by ₦3,000',
          'Discount allowed of ₦1,500 posted only to the customer’s account',
          'Cash Book bank column undercast by ₦4,000',
        ],
        a: 0,
        e: 'Because an error of original entry affects debit and credit equally, the Trial Balance still agrees and Suspense is not used.',
      },
    ],
  },
  {
    id: 'acct-adjustments-depreciation',
    name: 'Adjustments, depreciation and provisions',
    sec: 'Year-end adjustments',
    goals: [
      'Adjust accounts for accrued expenses, prepaid expenses, accrued income and unearned income',
      'Compute depreciation (straight-line and reducing balance), asset disposal gain/loss, bad debts and provision for doubtful debts',
    ],
    trap: 'Never charge the FULL closing Provision for Doubtful Debts to Profit & Loss when an opening provision already exists — charge ONLY the INCREASE (expense) or credit ONLY the DECREASE (income)!',
    parts: [
      {
        title: 'Accruals, prepayments and bad/doubtful debts',
        idea: 'Under the Accruals concept, year-end final accounts must reflect exact expenses and revenues belonging to that year. Accrued (owing) expenses are ADDED to the expense in Profit & Loss and shown as Current Liabilities; Prepaid expenses (paid ahead for next year) are DEDUCTED from the expense and shown as Current Assets. Irrecoverable Bad Debts are written off as expenses, while a Provision for Doubtful Debts estimates likely future defaults on remaining debtors.',
        terms: [
          ['Accrued expense', 'Expense incurred during the year but not yet paid at year-end (Add to P&L expense; Current Liability)'],
          ['Prepaid expense', 'Expense paid in advance for next accounting year (Deduct from P&L expense; Current Asset)'],
          ['Provision for doubtful debts', 'Prudent percentage estimate of debtors who may fail to pay; deducted from Debtors on the Balance Sheet'],
        ],
        rules: [
          'For expenses: Expense for the year = Cash paid + Closing accrual − Opening accrual + Opening prepayment − Closing prepayment.',
          'Always deduct confirmed BAD DEBTS from Debtors FIRST before calculating the percentage Provision for Doubtful Debts.',
          'Bad Debts Recovered (a previously written-off debtor unexpectedly pays later) is treated as other income (credited to Profit & Loss).',
        ],
        table: {
          headers: ['Year-end adjustment', 'Effect on Profit & Loss', 'Balance Sheet classification'],
          rows: [
            ['Accrued expense (owing)', 'Add to expense', 'Current Liability'],
            ['Prepaid expense (in advance)', 'Deduct from expense', 'Current Asset'],
            ['Accrued income (earned, not received)', 'Add to income', 'Current Asset'],
            ['Unearned income (received in advance)', 'Deduct from income', 'Current Liability'],
          ],
          trapNote: 'Do not mix up Prepaid Expense (Current ASSET) with Income Received in Advance (Current LIABILITY) — check whether YOU paid ahead or a CUSTOMER paid YOU ahead.',
        },
        example: {
          q: 'Debtors stand at ₦420,000. Additional bad debts of ₦20,000 must be written off, and a 5% provision for doubtful debts is required. Opening provision was ₦14,000. Find the charge to Profit & Loss for provision.',
          steps: [
            ['Net debtors after bad debts', '₦420,000 − ₦20,000 = ₦400,000'],
            ['Required closing provision', '5% × ₦400,000 = ₦20,000'],
            ['Increase charged to P&L', '₦20,000 − ₦14,000 = ₦6,000 expense'],
          ],
        },
        yourTurn: {
          q: 'A shop paid ₦240,000 rent during the year, which includes ₦40,000 paid in advance for the first two months of next year. How is rent reported in this year’s final accounts?',
          o: [
            '₦200,000 expense in Profit & Loss and ₦40,000 Current Asset on the Balance Sheet',
            '₦280,000 expense in Profit & Loss and ₦40,000 Current Liability',
            '₦240,000 expense in Profit & Loss and ₦0 on the Balance Sheet',
            '₦40,000 expense in Profit & Loss and ₦200,000 Current Asset',
          ],
          a: 0,
          h: [
            'Deduct the prepaid portion (₦40,000) to find the true expense belonging to this year.',
            'Money paid in advance for future benefit is a Current Asset.',
          ],
          e: 'This year’s rent expense is ₦240,000 − ₦40,000 = ₦200,000, and the ₦40,000 prepayment is a Current Asset.',
        },
      },
      {
        title: 'Depreciation and disposal of non-current assets',
        idea: 'Depreciation is the systematic allocation of the depreciable cost of a tangible non-current asset (vehicles, machines, buildings — never freehold land) over its useful life due to wear and tear, obsolescence or passage of time. Two main methods are tested: Straight-Line (equal annual charge based on Cost − Scrap Value ÷ Useful Life) and Reducing Balance (fixed percentage applied each year to Net Book Value = Cost − Accumulated Depreciation).',
        terms: [
          ['Straight-line method', 'Annual Depreciation = (Cost − Residual/Scrap Value) ÷ Useful Life (or fixed % of original cost)'],
          ['Reducing (Diminishing) balance', 'Annual Depreciation = Rate % × Net Book Value (Cost − Accumulated Depreciation to date)'],
          ['Net Book Value (NBV)', 'Original Cost minus Accumulated Depreciation to date'],
        ],
        rules: [
          'Depreciation is a NON-CASH expense: it reduces Net Profit and Asset Book Value, without cash leaving the bank account.',
          'On disposal: Profit/Loss on Disposal = Sale Proceeds − Net Book Value at disposal date.',
          'Freehold land normally appreciates and is NOT depreciated, unlike buildings, plant and motor vehicles.',
        ],
        table: {
          headers: ['Method', 'Annual charge pattern', 'Best suited for'],
          rows: [
            ['Straight-line', 'Constant every year', 'Assets giving steady benefit (buildings, office furniture, leases)'],
            ['Reducing balance', 'Higher in early years, lower later', 'Assets losing efficiency/value rapidly early on (vehicles, computers, machines)'],
          ],
          trapNote: 'In Reducing Balance, ALWAYS subtract previous years’ depreciation first before multiplying by the percentage for Year 2 or Year 3!',
        },
        example: {
          q: 'A machine costs ₦500,000 and is depreciated at 20% per annum using the Reducing Balance method. Find its Net Book Value at the end of Year 2.',
          steps: [
            ['Year 1 depreciation', '20% of ₦500,000 = ₦100,000 → NBV = ₦400,000'],
            ['Year 2 depreciation', '20% of ₦400,000 = ₦80,000'],
            ['End of Year 2 NBV', '₦400,000 − ₦80,000 = ₦320,000'],
          ],
        },
        yourTurn: {
          q: 'A delivery van bought for ₦2,000,000 has an estimated scrap value of ₦200,000 after 6 years. Using the straight-line method, what is the annual depreciation charge?',
          o: ['₦300,000', '₦333,333', '₦366,667', '₦200,000'],
          a: 0,
          h: [
            'First subtract the scrap value from the original cost to get the depreciable amount.',
            'Divide ₦1,800,000 evenly by 6 years.',
          ],
          e: 'Annual depreciation = (₦2,000,000 − ₦200,000) ÷ 6 = ₦1,800,000 ÷ 6 = ₦300,000.',
        },
      },
    ],
    qs: [
      {
        q: 'An electricity bill of ₦35,000 owing at 31 December appears on the Balance Sheet as a',
        o: ['current liability', 'current asset', 'non-current asset', 'capital reserve'],
        a: 0,
        e: 'Unpaid (accrued) expenses owed at year-end are current liabilities.',
      },
      {
        q: 'Which of the following is a valid cause of depreciation on factory machinery?',
        o: ['Wear and tear and technological obsolescence', 'Rise in raw material prices', 'Increase in sales staff', 'Bank charges'],
        a: 0,
        e: 'Physical wear, effluxion of time and obsolescence reduce an asset’s useful economic value.',
      },
      {
        q: 'A machine with original cost ₦600,000 and accumulated depreciation ₦380,000 is sold for ₦250,000 cash. What is the result on disposal?',
        o: ['Profit of ₦30,000', 'Loss of ₦30,000', 'Profit of ₦130,000', 'Loss of ₦350,000'],
        a: 0,
        e: 'NBV = ₦600,000 − ₦380,000 = ₦220,000. Proceeds (₦250,000) − NBV (₦220,000) = ₦30,000 profit.',
      },
      {
        q: 'If opening Provision for Doubtful Debts is ₦18,000 and required closing provision is ₦13,000, the ₦5,000 decrease is',
        o: [
          'credited to Profit & Loss as income',
          'debited to Profit & Loss as an expense',
          'added to Debtors on the Balance Sheet',
          'ignored completely',
        ],
        a: 0,
        e: 'A reduction in required provision releases prior charges back to Profit & Loss as a credit (gain).',
      },
      {
        q: 'Rent received in advance from a sub-tenant at year-end is classified on the Balance Sheet as a',
        o: ['current liability', 'current asset', 'fixed asset', 'gross profit'],
        a: 0,
        e: 'Unearned income represents an obligation to provide future occupancy, hence a current liability.',
      },
      {
        q: 'Which non-current asset is normally NOT depreciated?',
        o: ['Freehold land', 'Motor vehicles', 'Office computers', 'Factory plant'],
        a: 0,
        e: 'Freehold land has an indefinite useful life and normally does not wear out, so it is not depreciated.',
      },
    ],
  },
  {
    id: 'acct-sole-trader-manufacturing',
    name: 'Final accounts of a sole trader and manufacturing accounts',
    sec: 'Final accounts',
    goals: [
      'Prepare Trading Account, Profit & Loss Account and Balance Sheet for a sole trader with adjustments',
      'Prepare a Manufacturing Account distinguishing Prime Cost, Factory Overheads, Work-in-Progress and Production Cost',
    ],
    trap: 'Do not mix up CARRIAGE INWARDS and CARRIAGE OUTWARDS: Carriage Inwards (bringing purchased goods IN) belongs in the TRADING Account (added to Purchases), whereas Carriage Outwards (delivering sold goods OUT) is a selling expense in the PROFIT & LOSS Account.',
    parts: [
      {
        title: 'Sole trader Trading, Profit & Loss and Balance Sheet',
        idea: 'At year-end, a sole trader prepares Final Accounts to find Gross Profit (Trading Account), Net Profit (Profit & Loss Account) and Financial Position (Balance Sheet). Cost of Goods Sold = Opening Stock + Net Purchases + Carriage Inwards − Closing Stock. Gross Profit = Net Sales − Cost of Goods Sold. Net Profit = Gross Profit + Other Incomes − Operating Expenses. On the Balance Sheet, Closing Capital = Opening Capital + Net Profit − Drawings.',
        terms: [
          ['Cost of Goods Sold (COGS)', 'Opening Inventory + (Purchases − Returns Outwards + Carriage Inwards) − Closing Inventory'],
          ['Gross Profit vs Net Profit', 'Gross Profit is trading surplus before overheads; Net Profit is final surplus after all operating expenses'],
          ['Working Capital', 'Current Assets minus Current Liabilities — measures short-term liquidity'],
        ],
        rules: [
          'Net Sales = Sales − Returns Inwards; Net Purchases = Purchases − Returns Outwards.',
          'Balance Sheet assets are listed in order of permanence (Non-Current Assets then Current Assets) or liquidity.',
          'Mark-up is profit as a fraction of COST; Margin is profit as a fraction of SELLING PRICE (if Mark-up = 1/4, Margin = 1/5).',
        ],
        table: {
          headers: ['Item', 'Exact location in Final Accounts'],
          rows: [
            ['Carriage Inwards', 'Trading Account (added to Purchases)'],
            ['Carriage Outwards', 'Profit & Loss Account (Operating Expense)'],
            ['Closing Stock (outside TB)', 'Deducted in Trading Account AND Current Asset on Balance Sheet'],
            ['Drawings', 'Deducted from Capital on Balance Sheet (never an expense in P&L)'],
          ],
          trapNote: 'Closing stock given as a year-end note appears TWICE (Trading Account credit/deduction AND Balance Sheet Current Asset), keeping double entry intact!',
        },
        example: {
          q: 'Sales ₦900,000, Returns Inwards ₦20,000, Opening Stock ₦80,000, Purchases ₦550,000, Carriage Inwards ₦10,000, Closing Stock ₦100,000. Calculate Gross Profit.',
          steps: [
            ['Net Sales', '₦900,000 − ₦20,000 = ₦880,000'],
            ['Cost of Goods Sold', '₦80,000 + ₦550,000 + ₦10,000 − ₦100,000 = ₦540,000'],
            ['Gross Profit', '₦880,000 − ₦540,000 = ₦340,000'],
          ],
        },
        yourTurn: {
          q: 'If a trader’s mark-up on cost is 25% (1/4), what is the equivalent gross profit margin on sales?',
          o: ['20% (1/5)', '25% (1/4)', '33.3% (1/3)', '15%'],
          a: 0,
          h: [
            'Let Cost = ₦100. A 25% mark-up means Profit = ₦25, so Selling Price = ₦125.',
            'Margin = Profit ÷ Selling Price = 25 ÷ 125.',
          ],
          e: 'With Cost = 100 and Profit = 25, Selling Price = 125; Margin = 25/125 = 1/5 = 20%.',
        },
      },
      {
        title: 'Manufacturing Account',
        idea: 'A business that manufactures its own goods prepares a Manufacturing Account BEFORE the Trading Account to compute the Production Cost of Goods Completed. Direct costs (Direct Raw Materials Consumed + Direct Labour + Direct Expenses like royalties) sum to PRIME COST. Adding Factory Overheads (indirect factory wages, factory power, factory rent, plant depreciation) and adjusting for Opening and Closing Work-in-Progress (WIP) yields Production Cost, which transfers into the Trading Account in place of Purchases.',
        terms: [
          ['Raw Materials Consumed', 'Opening Raw Materials + Purchases of Raw Materials + Carriage Inwards − Returns Outwards − Closing Raw Materials'],
          ['Prime Cost', 'Direct Raw Materials Consumed + Direct Manufacturing Wages + Direct Expenses (e.g., royalties)'],
          ['Factory Overheads', 'Indirect factory costs needed to run production (factory supervisor salary, plant depreciation, factory rent and power)'],
        ],
        rules: [
          'Production Cost = Prime Cost + Factory Overheads + Opening Work-in-Progress − Closing Work-in-Progress.',
          'Office/administrative and selling expenses (salesmen’s commission, office rent, delivery van depreciation) NEVER enter the Manufacturing Account — they go to Profit & Loss.',
          'If manufactured goods are transferred to the Trading Account at market value (cost + manufacturing profit), Unrealised Profit on unsold closing finished goods must be removed via a Provision for Unrealised Profit.',
        ],
        table: {
          headers: ['Cost element', 'Direct or Indirect?', 'Account'],
          rows: [
            ['Raw materials & machine operators’ wages', 'Direct (Prime Cost)', 'Manufacturing Account'],
            ['Factory supervisor salary & plant depreciation', 'Indirect (Factory Overhead)', 'Manufacturing Account'],
            ['Office salaries & showroom rent', 'Admin / Selling overhead', 'Profit & Loss Account'],
          ],
          trapNote: 'Remember: a factory has THREE distinct stocks — Raw Materials (in Manufacturing), Work-in-Progress (in Manufacturing) and Finished Goods (in Trading Account)! All three closing stocks appear as Current Assets on the Balance Sheet.',
        },
        example: {
          q: 'Raw materials consumed ₦400,000, direct factory wages ₦250,000, royalties ₦30,000, factory overheads ₦170,000, opening WIP ₦45,000, closing WIP ₦35,000. Find Prime Cost and Production Cost.',
          steps: [
            ['Prime Cost', '₦400,000 + ₦250,000 + ₦30,000 = ₦680,000'],
            ['Add Factory Overheads', '₦680,000 + ₦170,000 = ₦850,000'],
            ['Adjust WIP (+Opening −Closing)', '₦850,000 + ₦45,000 − ₦35,000 = ₦860,000 Production Cost'],
          ],
        },
        yourTurn: {
          q: 'Which of the following expenses belongs inside a Manufacturing Account as a Factory Overhead rather than in the Profit & Loss Account?',
          o: [
            'Depreciation of factory production machinery',
            'Commission paid to retail sales representatives',
            'Carriage outwards on finished goods delivered to customers',
            'Advertising billboards in town',
          ],
          a: 0,
          h: [
            'Separate costs incurred inside the factory making the goods from costs of selling or administering the office.',
            'Factory machine depreciation is directly tied to production.',
          ],
          e: 'Depreciation of factory machinery is an indirect manufacturing cost (factory overhead) charged in the Manufacturing Account.',
        },
      },
    ],
    qs: [
      {
        q: 'Which formula gives Working Capital on a sole trader’s Balance Sheet?',
        o: [
          'Current Assets minus Current Liabilities',
          'Non-Current Assets minus Capital',
          'Gross Profit minus Drawings',
          'Total Assets plus Total Liabilities',
        ],
        a: 0,
        e: 'Working Capital = Current Assets − Current Liabilities.',
      },
      {
        q: 'Carriage Outwards is entered in the',
        o: [
          'Profit & Loss Account as a selling expense',
          'Trading Account added to purchases',
          'Manufacturing Account as prime cost',
          'Balance Sheet as a current asset',
        ],
        a: 0,
        e: 'Carriage outwards is the delivery cost of goods sold and belongs in the Profit & Loss Account.',
      },
      {
        q: 'In a Manufacturing Account, Prime Cost equals',
        o: [
          'Direct Materials Consumed + Direct Labour + Direct Expenses',
          'Factory Overheads + Office Salaries',
          'Opening WIP + Closing Finished Goods',
          'Sales minus Gross Profit',
        ],
        a: 0,
        e: 'Prime Cost aggregates all direct production costs.',
      },
      {
        q: 'If Opening Capital is ₦500,000, Net Profit is ₦180,000 and Drawings are ₦70,000, what is Closing Capital?',
        o: ['₦610,000', '₦750,000', '₦390,000', '₦680,000'],
        a: 0,
        e: 'Closing Capital = ₦500,000 + ₦180,000 − ₦70,000 = ₦610,000.',
      },
      {
        q: 'How are Opening Work-in-Progress and Closing Work-in-Progress treated in a Manufacturing Account?',
        o: [
          'Add Opening WIP and deduct Closing WIP',
          'Deduct Opening WIP and add Closing WIP',
          'Both are ignored in Manufacturing',
          'Both are entered in Profit & Loss',
        ],
        a: 0,
        e: 'Opening partly-finished units were completed this year (add), while closing WIP remains unfinished at year-end (deduct).',
      },
      {
        q: 'Royalties paid per unit manufactured on a patented formula are classified in a Manufacturing Account as',
        o: ['direct expenses (part of Prime Cost)', 'selling expenses', 'administrative overheads', 'current assets'],
        a: 0,
        e: 'Production royalties vary directly with each unit produced and form part of Prime Cost.',
      },
    ],
  },
  {
    id: 'acct-non-profit',
    name: 'Accounts of non-profit-making organisations',
    sec: 'Specialised accounts',
    goals: [
      'Distinguish between a Receipts and Payments Account and an Income and Expenditure Account',
      'Compute annual subscriptions income (with arrears and prepayments), Bar Trading profit and Accumulated Fund',
    ],
    trap: 'Do not confuse Receipts & Payments with Income & Expenditure: Receipts & Payments is simply a cash summary (includes capital items and any year’s cash), whereas Income & Expenditure follows the ACCRUALS concept for revenue items of THIS year only (just like Profit & Loss).',
    parts: [
      {
        title: 'Receipts & Payments vs Income & Expenditure',
        idea: 'Clubs, charities, churches, mosques and professional societies exist to serve members rather than distribute profit. Their cash summary is the Receipts and Payments Account. Their true annual performance report is the Income and Expenditure Account, yielding a Surplus (excess of income over expenditure) or Deficit (excess of expenditure over income). Instead of Owner’s Capital, non-profit bodies have an Accumulated Fund (= Opening Assets − Opening Liabilities).',
        terms: [
          ['Accumulated Fund', 'The net worth of a club or society (equivalent to Capital in a business): Opening Assets − Opening Liabilities'],
          ['Surplus / Deficit', 'Non-profit equivalents of Net Profit (Surplus) and Net Loss (Deficit)'],
          ['Receipts & Payments Account', 'Summary of actual cash/bank received and paid during the year regardless of period or capital/revenue nature'],
        ],
        rules: [
          'Receipts & Payments includes opening/closing cash balances and capital transactions (like buying club equipment); Income & Expenditure EXCLUDES capital purchases and INCLUDES depreciation, accruals and prepayments.',
          'If a club runs a refreshment bar or cafeteria, prepare a separate Bar Trading Account first and transfer the Bar Profit into Income & Expenditure.',
          'Life membership fees and special donations for building projects are normally capitalised (spread or added to funds) rather than dumped into one year’s revenue.',
        ],
        table: {
          headers: ['Trading business term', 'Non-profit club equivalent'],
          rows: [
            ['Cash Book summary', 'Receipts and Payments Account'],
            ['Profit and Loss Account', 'Income and Expenditure Account'],
            ['Net Profit / Net Loss', 'Surplus / Deficit'],
            ['Capital', 'Accumulated Fund'],
          ],
          trapNote: 'Buying new sports equipment for ₦300,000 appears in Receipts & Payments, NOT in Income & Expenditure — only its annual DEPRECIATION enters Income & Expenditure!',
        },
        example: {
          q: 'On 1 January, Unity Youth Club held cash ₦80,000, clubhouse furniture ₦450,000, subscriptions owing by members ₦30,000 and unpaid electricity bill ₦25,000. Calculate its Opening Accumulated Fund.',
          steps: [
            ['Sum Opening Assets', 'Cash ₦80,000 + Furniture ₦450,000 + Subscriptions in arrears ₦30,000 = ₦560,000'],
            ['Subtract Opening Liabilities', '₦560,000 − ₦25,000 = ₦535,000 Accumulated Fund'],
          ],
        },
        yourTurn: {
          q: 'Which item appears in a club’s Receipts and Payments Account but is EXCLUDED from its Income and Expenditure Account?',
          o: [
            'Cash paid to buy a new club pavilion building',
            'Annual electricity expense for the current year',
            'Current-year membership subscriptions earned',
            'Annual depreciation of club chairs',
          ],
          a: 0,
          h: [
            'Income and Expenditure records revenue items only — never capital expenditure.',
            'Depreciation is non-cash (excluded from Receipts & Payments, included in Income & Expenditure).',
          ],
          e: 'Purchasing a pavilion is capital expenditure: it shows as cash outflow in Receipts & Payments, but goes onto the Balance Sheet (not Income & Expenditure).',
        },
      },
      {
        title: 'Subscriptions Account adjustments',
        idea: 'Members’ subscriptions are usually a club’s main revenue, yet members often pay late (arrears) or pay early for next year (in advance). To find the exact subscription income earned for the current year, adjust cash received: Cash received + Closing arrears − Opening arrears + Opening advance − Closing advance.',
        terms: [
          ['Subscriptions in arrears (owing)', 'Amounts owed by members to the club — treated as a Current Asset'],
          ['Subscriptions in advance', 'Amounts prepaid by members for next year — treated as a Current Liability'],
          ['Subscriptions Account', 'Ledger T-account reconciling cash received with opening/closing arrears and advances'],
        ],
        rules: [
          'Opening arrears (Dr) and closing advance (Cr) belong to OTHER years → subtract them from cash received.',
          'Closing arrears (Cr) and opening advance (Dr) belong to THIS year → add them to cash received.',
          'On the closing Balance Sheet: Closing subscriptions in arrears = Current Asset; Closing subscriptions in advance = Current Liability.',
        ],
        table: {
          headers: ['Subscription balance', 'Asset or Liability?', 'Effect on current-year income'],
          rows: [
            ['Opening arrears (Jan 1)', 'Opening Asset', 'Deduct (belongs to last year)'],
            ['Closing arrears (Dec 31)', 'Closing Current Asset', 'Add (earned this year)'],
            ['Opening advance (Jan 1)', 'Opening Liability', 'Add (prepaid last year for this year)'],
            ['Closing advance (Dec 31)', 'Closing Current Liability', 'Deduct (belongs to next year)'],
          ],
          trapNote: 'Check the direction carefully: arrears = asset (members owe US); advance = liability (we owe THEM next year’s membership).',
        },
        example: {
          q: 'Cash subscriptions received during 2026 = ₦500,000. Subscriptions in arrears: 1 Jan = ₦30,000; 31 Dec = ₦45,000. Subscriptions in advance: 1 Jan = ₦20,000; 31 Dec = ₦15,000. Find 2026 subscription income.',
          steps: [
            ['Start with cash received', '₦500,000'],
            ['Adjust arrears (+Closing −Opening)', '₦500,000 + ₦45,000 − ₦30,000 = ₦515,000'],
            ['Adjust advance (+Opening −Closing)', '₦515,000 + ₦20,000 − ₦15,000 = ₦520,000'],
          ],
        },
        yourTurn: {
          q: 'A club collects ₦320,000 cash in subscriptions during the year. At year-end, members still owe ₦25,000 for this year and have prepaid ₦15,000 for next year (no opening balances). What subscription income goes to Income & Expenditure?',
          o: ['₦330,000', '₦310,000', '₦360,000', '₦280,000'],
          a: 0,
          h: [
            'Add amounts owed for THIS year (+₦25,000) and subtract amounts paid ahead for NEXT year (−₦15,000).',
            'Compute ₦320,000 + ₦25,000 − ₦15,000.',
          ],
          e: 'Subscription income = ₦320,000 + ₦25,000 (closing arrears) − ₦15,000 (closing advance) = ₦330,000.',
        },
      },
    ],
    qs: [
      {
        q: 'In non-profit accounting, the excess of income over expenditure for the year is termed a',
        o: ['surplus', 'gross profit', 'dividend', 'drawing'],
        a: 0,
        e: 'Non-profit organisations call an excess of revenue income over expenditure a surplus.',
      },
      {
        q: 'What is the non-profit equivalent of Owner’s Capital in a sole trader’s Balance Sheet?',
        o: ['Accumulated Fund', 'Share Premium', 'Working Capital', 'Cash Float'],
        a: 0,
        e: 'Accumulated Fund equals a club’s opening net assets plus accumulated annual surpluses.',
      },
      {
        q: 'Subscriptions paid in advance by members at 31 December appear on the club’s Balance Sheet as a',
        o: ['current liability', 'current asset', 'fixed asset', 'surplus'],
        a: 0,
        e: 'Advance subscriptions represent membership services owed in the coming year (current liability).',
      },
      {
        q: 'Which of the following is recorded in Income & Expenditure Account even though no cash changed hands?',
        o: ['Depreciation of clubhouse furniture', 'Purchase of new chairs for cash', 'Cash balance brought forward', 'Sale of old club van'],
        a: 0,
        e: 'Income & Expenditure follows accrual accounting and includes non-cash revenue expenses like depreciation.',
      },
      {
        q: 'A club has 200 members paying ₦5,000 each per year. Regardless of cash delays, what total subscription income belongs in this year’s Income & Expenditure Account?',
        o: ['₦1,000,000', '₦200,000', '₦500,000', 'Depends purely on cash collected'],
        a: 0,
        e: 'Under accruals, earned annual subscription revenue = 200 × ₦5,000 = ₦1,000,000.',
      },
      {
        q: 'Where is the profit from a sports club’s refreshment bar transferred after completing the Bar Trading Account?',
        o: [
          'Credit (income) side of the Income and Expenditure Account',
          'Debit (expenditure) side of Income and Expenditure',
          'Receipts and Payments closing cash',
          'Current liabilities on the Balance Sheet',
        ],
        a: 0,
        e: 'Net bar profit is a secondary revenue stream credited to the Income and Expenditure Account.',
      },
    ],
  },
  {
    id: 'acct-control-incomplete',
    name: 'Control accounts, single entry and incomplete records',
    sec: 'Specialised accounts',
    goals: [
      'Prepare Sales Ledger (Total Debtors) and Purchases Ledger (Total Creditors) Control Accounts including contra set-offs',
      'Compute profit from incomplete records using Statements of Affairs and reconstruct missing credit sales, credit purchases and cash figures',
    ],
    trap: 'NEVER put Cash Sales or Cash Purchases into Control Accounts — Control Accounts track CREDIT Debtors and CREDIT Creditors only! Also, Provision for Doubtful Debts NEVER enters the Sales Ledger Control Account (only confirmed Bad Debts do).',
    parts: [
      {
        title: 'Sales Ledger and Purchases Ledger Control Accounts',
        idea: 'Control Accounts (Total Accounts) summarise all individual debtors (Sales Ledger Control Account) and creditors (Purchases Ledger Control Account) in one total T-account using totals from subsidiary books. They quickly isolate ledger errors, prevent fraud through segregation of duties and supply instant total Debtors and Creditors figures for final accounts.',
        terms: [
          ['Sales Ledger Control Account', 'Total Debtors Account — Debits increase debt (credit sales, dishonoured cheques, interest); Credits reduce debt (receipts, discount allowed, returns inwards, bad debts, set-off)'],
          ['Purchases Ledger Control Account', 'Total Creditors Account — Credits increase debt (credit purchases); Debits reduce debt (payments, discount received, returns outwards, set-off)'],
          ['Set-off (Contra)', 'When a customer is also a supplier, offsetting the smaller balance reduces BOTH Sales Ledger Control (Credit) and Purchases Ledger Control (Debit)'],
        ],
        rules: [
          'Items EXCLUDED from Sales Ledger Control Account: Cash sales, Trade discounts and Provision for Doubtful Debts.',
          'Dishonoured cheques from customers are DEBITED back into Sales Ledger Control Account (the customer owes us again!).',
          'Interest charged on overdue customer accounts is DEBITED to Sales Ledger Control Account.',
        ],
        table: {
          headers: ['Sales Ledger Control (Total Debtors)', 'Side'],
          rows: [
            ['Opening debit balance, Credit sales, Dishonoured cheques, Interest on overdue debt', 'Debit (increases debtors)'],
            ['Cash/cheques received, Discount allowed, Returns inwards, Bad debts, Contra set-off', 'Credit (reduces debtors)'],
          ],
          trapNote: 'Contra set-off ALWAYS reduces BOTH totals: Credit Total Debtors and Debit Total Creditors.',
        },
        example: {
          q: 'Opening debtors ₦120,000, credit sales ₦480,000, cash received from debtors ₦410,000, returns inwards ₦15,000, discount allowed ₦10,000, bad debts ₦5,000. Find closing debtors.',
          steps: [
            ['Total debits', '₦120,000 + ₦480,000 = ₦600,000'],
            ['Total credits', '₦410,000 + ₦15,000 + ₦10,000 + ₦5,000 = ₦440,000'],
            ['Closing debtors', '₦600,000 − ₦440,000 = ₦160,000'],
          ],
        },
        yourTurn: {
          q: 'Which of the following items is NEVER entered in a Sales Ledger (Total Debtors) Control Account?',
          o: [
            'Cash sales and Provision for Doubtful Debts',
            'Credit sales and Returns Inwards',
            'Dishonoured customer cheques',
            'Discount allowed to credit customers',
          ],
          a: 0,
          h: [
            'Debtors Control tracks only amounts actually owed by credit customers.',
            'Cash sales never create a debtor, and a provision is only an estimate rather than a written-off personal balance.',
          ],
          e: 'Cash sales never involve debtors, and Provision for Doubtful Debts sits in its own separate account rather than inside Total Debtors.',
        },
      },
      {
        title: 'Single entry and incomplete records',
        idea: 'Many small traders keep only rough notebooks, bank statements and unpaid bills instead of full double entry. Accountants calculate profit from incomplete records in two ways: (1) Statement of Affairs (comparing Opening Capital and Closing Capital: Profit = Closing Capital + Drawings − Additional Capital − Opening Capital), or (2) Conversion to full final accounts by reconstructing Credit Sales via Total Debtors, Credit Purchases via Total Creditors, and missing cash/drawings via a Cash Summary.',
        terms: [
          ['Statement of Affairs', 'Balance-sheet-style listing of Assets minus Liabilities used to find Opening or Closing Capital when double-entry records are missing'],
          ['Capital Comparison Formula', 'Net Profit = Closing Capital − Opening Capital + Drawings − Additional Capital Introduced'],
          ['Cash stolen / missing drawings', 'Found as the balancing figure in a reconstructed Cash Account'],
        ],
        rules: [
          'Remember why Drawings are ADDED back in the Capital Comparison formula: Drawings reduced Closing Capital, so without them Capital would have grown higher by profit.',
          'Additional capital injected by the owner is SUBTRACTED because that increase in capital came from the owner’s pocket, not business trading profit.',
          'Total Sales = Cash Sales + Reconstructed Credit Sales (from Total Debtors Account).',
        ],
        table: {
          headers: ['Missing figure needed', 'Tool used to find it'],
          rows: [
            ['Opening or Closing Capital', 'Statement of Affairs (Assets − Liabilities)'],
            ['Credit Sales', 'Total Debtors Account (Sales Ledger Control)'],
            ['Credit Purchases', 'Total Creditors Account (Purchases Ledger Control)'],
            ['Gross Profit / missing stock', 'Mark-up or Margin ratio'],
          ],
          trapNote: 'Don’t forget CASH SALES when computing Total Sales — Total Debtors only gives you CREDIT sales!',
        },
        example: {
          q: 'A trader’s Opening Capital was ₦400,000 and Closing Capital is ₦560,000. During the year he withdrew ₦90,000 for private use and introduced ₦50,000 extra capital. Calculate Net Profit.',
          steps: [
            ['Apply formula', 'Net Profit = Closing Capital + Drawings − Additional Capital − Opening Capital'],
            ['Substitute values', '₦560,000 + ₦90,000 − ₦50,000 − ₦400,000 = ₦200,000'],
          ],
        },
        yourTurn: {
          q: 'A small trader had Opening Capital of ₦300,000, Closing Capital of ₦390,000 and Drawings of ₦60,000, with no new capital added. What was the Net Profit for the year?',
          o: ['₦150,000', '₦30,000', '₦90,000', '₦210,000'],
          a: 0,
          h: [
            'Capital rose by ₦90,000 even AFTER the owner took out ₦60,000 in drawings.',
            'Compute Closing Capital + Drawings − Opening Capital.',
          ],
          e: 'Net Profit = ₦390,000 + ₦60,000 − ₦300,000 = ₦150,000.',
        },
      },
    ],
    qs: [
      {
        q: 'In a Sales Ledger Control Account, a cheque received from a debtor that is subsequently dishonoured by the bank is entered on the',
        o: ['debit side', 'credit side', 'purchases ledger', 'trading account'],
        a: 0,
        e: 'A dishonoured cheque reinstates the customer’s debt, so it is debited back to Total Debtors.',
      },
      {
        q: 'When a person is both a debtor and a creditor and ₦25,000 is set off between the two ledgers, how is the contra recorded?',
        o: [
          'Credit Sales Ledger Control ₦25,000; Debit Purchases Ledger Control ₦25,000',
          'Debit Sales Ledger Control ₦25,000; Credit Purchases Ledger Control ₦25,000',
          'Debit Cash ₦25,000; Credit Sales ₦25,000',
          'Credit both Control Accounts',
        ],
        a: 0,
        e: 'A contra reduces both debtors (Credit) and creditors (Debit).',
      },
      {
        q: 'Which statement is prepared from incomplete records to ascertain Opening or Closing Capital?',
        o: ['Statement of Affairs', 'Trial Balance', 'Bank Reconciliation', 'Manufacturing Account'],
        a: 0,
        e: 'A Statement of Affairs lists Assets minus Liabilities to determine Capital when double entry is absent.',
      },
      {
        q: 'Opening Creditors ₦90,000, Closing Creditors ₦115,000, cash paid to suppliers ₦350,000 and discount received ₦10,000. What were Credit Purchases?',
        o: ['₦385,000', '₦335,000', '₦360,000', '₦315,000'],
        a: 0,
        e: 'Credit Purchases = Closing Creditors (₦115k) + Payments (₦350k) + Discount Received (₦10k) − Opening Creditors (₦90k) = ₦385,000.',
      },
      {
        q: 'Which of the following is a major benefit of maintaining Control Accounts?',
        o: [
          'Fast localisation of errors and strong fraud deterrent through division of ledger duties',
          'Eliminating the need for bank statements',
          'Replacing the Profit & Loss Account',
          'Avoiding tax filings',
        ],
        a: 0,
        e: 'Control accounts verify subsidiary ledger totals independently and help pinpoint mistakes quickly.',
      },
      {
        q: 'If a trader’s Capital dropped from ₦450,000 to ₦420,000, Drawings were ₦50,000 and no new capital was added, the business made a',
        o: ['Net Profit of ₦20,000', 'Net Loss of ₦30,000', 'Net Loss of ₦80,000', 'Net Profit of ₦80,000'],
        a: 0,
        e: 'Profit = ₦420,000 + ₦50,000 − ₦450,000 = +₦20,000 Net Profit (drawings exceeded profit by ₦30,000).',
      },
    ],
  },
  {
    id: 'acct-partnership',
    name: 'Partnership accounts',
    sec: 'Business entity accounts',
    goals: [
      'Prepare Partnership Appropriation Account, Fixed Capital Accounts and Current Accounts',
      'Account for admission/retirement of partners, Goodwill valuation, Revaluation Account and Dissolution',
    ],
    trap: 'Interest on a PARTNER’S LOAN to the firm is a business expense charged in the PROFIT & LOSS Account (before Net Profit), whereas Interest on Capital, Partner’s Salary and Interest on Drawings belong in the APPROPRIATION Account (after Net Profit)!',
    parts: [
      {
        title: 'Appropriation Account, Capital and Current Accounts',
        idea: 'Partnerships prepare an extra section right after Profit & Loss called the Profit & Loss Appropriation Account to divide Net Profit according to the Partnership Deed: add Interest on Drawings, deduct Interest on Capital and Partner Salaries, then split the residual profit in the agreed profit-sharing ratio. Most partnerships maintain Fixed Capital Accounts (unchanged except for new capital/goodwill) alongside Current Accounts (recording annual shares of profit, interest, salary and drawings).',
        terms: [
          ['Appropriation Account', 'Shows how Net Profit is allocated among partners via salaries, interest on capital, interest on drawings and profit-sharing ratio'],
          ['Fixed Capital vs Current Account', 'Fixed Capital holds permanent investment; Current Account tracks fluctuating yearly earnings minus drawings'],
          ['Partnership Act default (no Deed)', 'Equal profit/loss sharing, NO salaries, NO interest on capital/drawings, and 5% interest on partner loans'],
        ],
        rules: [
          'In the Appropriation Account: Start with Net Profit → ADD Interest on Drawings → DEDUCT Interest on Capital & Partner Salaries → Share remaining profit.',
          'In a Partner’s Current Account: Credit Opening Cr balance, Interest on Capital, Salary and Share of Profit; Debit Drawings and Interest on Drawings.',
          'Interest on a partner’s loan (5% if no deed) is charged in Profit & Loss BEFORE Net Profit, NOT in Appropriation.',
        ],
        table: {
          headers: ['Item', 'Appropriation Account', 'Partner’s Current Account'],
          rows: [
            ['Interest on Capital', 'Deducted from Net Profit', 'Credited (increases partner’s balance)'],
            ['Partner’s Salary', 'Deducted from Net Profit', 'Credited (increases partner’s balance)'],
            ['Interest on Drawings', 'Added to Net Profit', 'Debited (reduces partner’s balance)'],
            ['Drawings', 'NOT in Appropriation!', 'Debited (reduces partner’s balance)'],
          ],
          trapNote: 'Drawings themselves NEVER appear in the Appropriation Account — ONLY Interest on Drawings does!',
        },
        example: {
          q: 'Net Profit is ₦600,000. Partner A gets ₦80,000 salary; Interest on Capital is A ₦40,000 and B ₦30,000; Interest on Drawings is A ₦6,000 and B ₦4,000. Profits are shared 3:2. Find B’s share of residual profit.',
          steps: [
            ['Add Interest on Drawings', '₦600,000 + ₦6,000 + ₦4,000 = ₦610,000'],
            ['Deduct Salary & Interest on Capital', '₦610,000 − ₦80,000 − ₦40,000 − ₦30,000 = ₦460,000 residual profit'],
            ['B’s share (2/5)', '(2/5) × ₦460,000 = ₦184,000'],
          ],
        },
        yourTurn: {
          q: 'Which of the following items is debited in the Profit & Loss Account BEFORE arriving at Net Profit rather than in the Partnership Appropriation Account?',
          o: [
            'Interest on a loan granted by a partner to the partnership',
            'Interest on partners’ fixed capital',
            'Partner’s annual salary',
            'Interest on partners’ drawings',
          ],
          a: 0,
          h: [
            'A partner lending extra money acts like a lender/creditor to the firm.',
            'Loan interest is a business financing expense charged before Net Profit is struck.',
          ],
          e: 'Interest on a partner’s loan is a business expense charged in the Profit & Loss Account before Appropriation.',
        },
      },
      {
        title: 'Goodwill, Revaluation and Dissolution',
        idea: 'When a new partner joins, an old partner retires or the profit-sharing ratio changes, existing assets are revalued through a Revaluation Account (profit/loss shared among OLD partners in the OLD ratio) and Goodwill (the intangible value of reputation and loyal customers) is shared among old partners in the old ratio (and written off in the new ratio if not kept on the books). When a partnership closes permanently (Dissolution), a Realisation Account collects asset book values on the debit, sale proceeds on the credit, and distributes final profit/loss on realisation to partners before settling bank cash.',
        terms: [
          ['Goodwill', 'Intangible asset representing the extra value of an established business’s reputation, location and loyal clientele'],
          ['Revaluation Account', 'Records increases (Credit) and decreases (Debit) in asset values upon admission/retirement; balance goes to old partners in old ratio'],
          ['Realisation Account', 'Prepared on partnership dissolution to compute net gain or loss from selling off assets and paying dissolution expenses'],
        ],
        rules: [
          'Revaluation profit: Asset value UP → Credit Revaluation; Asset value DOWN → Debit Revaluation.',
          'Goodwill created (kept in books): Debit Goodwill, Credit Old Partners’ Capital in OLD ratio.',
          'On Dissolution, Cash/Bank is NOT transferred to Realisation — Realisation receives non-cash assets (Dr), dissolution costs (Dr) and asset sale proceeds / assets taken over by partners (Cr).',
        ],
        table: {
          headers: ['Partnership event', 'Special account prepared', 'Ratio used for gain/loss'],
          rows: [
            ['Admission or retirement', 'Revaluation Account', 'Old partners in OLD profit-sharing ratio'],
            ['Dissolution (winding up)', 'Realisation Account', 'All partners in agreed profit-sharing ratio'],
          ],
          trapNote: 'Remember the Garner v Murray rule: if one partner becomes insolvent on dissolution and cannot pay their capital deficit, the solvent partners share that deficit in the ratio of their last agreed CAPITALS (not profit-sharing ratio).',
        },
        example: {
          q: 'Before admitting Partner C, partners A and B (sharing 2:1) revalue Premises up by ₦300,000 and Inventory down by ₦60,000. How much Revaluation Profit is credited to Partner A?',
          steps: [
            ['Net Revaluation Profit', '₦300,000 − ₦60,000 = ₦240,000'],
            ['Share in OLD ratio (2:1)', 'A gets (2/3) × ₦240,000 = ₦160,000'],
          ],
        },
        yourTurn: {
          q: 'When a partnership is dissolved, which account is opened to ascertain the profit or loss made from selling off the firm’s assets?',
          o: ['Realisation Account', 'Appropriation Account', 'Trading Account', 'Suspense Account'],
          a: 0,
          h: [
            'Revaluation Account is used when a firm continues with changed partners; dissolution sells off assets for cash.',
            'Look for the account whose name means converting assets into cash.',
          ],
          e: 'A Realisation Account calculates the gain or loss on selling assets and settling dissolution expenses when a partnership winds up.',
        },
      },
    ],
    qs: [
      {
        q: 'In the absence of a Partnership Deed, what rate of interest applies to a loan made by a partner to the firm?',
        o: ['5% per annum', '0%', '10% per annum', '15% per annum'],
        a: 0,
        e: 'Under the Partnership Act default, a partner’s loan earns 5% interest per annum.',
      },
      {
        q: 'Where is a partner’s Interest on Drawings entered in partnership accounts?',
        o: [
          'Added to Net Profit in Appropriation and Debited to the partner’s Current Account',
          'Deducted from Net Profit in Appropriation and Credited to Current Account',
          'Debited to Trading Account',
          'Credited to Fixed Capital Account',
        ],
        a: 0,
        e: 'Interest on Drawings is an income to the partnership (added in Appropriation) and a charge to the partner (debited to Current Account).',
      },
      {
        q: 'When a new partner is admitted, any profit arising from revaluing premises upward is shared among',
        o: [
          'the old partners in their old profit-sharing ratio',
          'all partners including the incoming partner in the new ratio',
          'the incoming partner alone',
          'creditors of the business',
        ],
        a: 0,
        e: 'Past asset appreciation belongs strictly to the old partners in their old profit-sharing ratio.',
      },
      {
        q: 'Under the Garner v Murray rule in partnership dissolution, an insolvent partner’s deficiency is borne by solvent partners in the ratio of their',
        o: ['last agreed capitals', 'drawings', 'ages', 'equal headcount'],
        a: 0,
        e: 'Garner v Murray allocates an insolvent partner’s capital deficit among solvent partners according to their last agreed capital balances.',
      },
      {
        q: 'Why do most partnerships keep separate Fixed Capital Accounts and Current Accounts?',
        o: [
          'To keep permanent capital intact while tracking yearly profit shares and drawings clearly',
          'Because Nigerian banks forbid a single capital account',
          'To hide partner drawings from tax authorities',
          'To avoid preparing a Balance Sheet',
        ],
        a: 0,
        e: 'Separating Fixed Capital from Current Accounts prevents routine profits and drawings from obscuring partners’ agreed capital stakes.',
      },
      {
        q: 'Goodwill is best classified on a Balance Sheet as',
        o: ['an intangible non-current asset', 'a current liability', 'a revenue expense', 'working capital'],
        a: 0,
        e: 'Goodwill has long-term value without physical form, making it an intangible non-current asset.',
      },
    ],
  },
  {
    id: 'acct-company-ratios',
    name: 'Company accounts and interpretation of financial statements',
    sec: 'Business entity accounts',
    goals: [
      'Explain share capital types (authorised, issued, called-up, paid-up), share issue at par/premium, reserves and company final accounts',
      'Compute and interpret key accounting ratios: Gross Profit Margin, Net Profit Margin, ROCE, Current Ratio, Acid-Test Ratio and Stock Turnover',
    ],
    trap: 'Do not confuse CURRENT RATIO with ACID-TEST (QUICK) RATIO: Acid-Test EXCLUDES Closing Inventory (and prepayments) from Current Assets because stock cannot always be turned into cash overnight.',
    parts: [
      {
        title: 'Company share capital, reserves and final accounts',
        idea: 'Limited companies raise capital by issuing Ordinary Shares, Preference Shares and Debentures. Share capital passes through stages: Authorised (maximum permitted in the Memorandum), Issued (offered and allotted to investors), Called-up and Paid-up. Shares issued above nominal (par) value create a capital reserve called Share Premium (which CANNOT be used to pay cash dividends). Company Appropriation Account allocates Profit After Tax to dividends and General Reserve, leaving Retained Earnings carried forward.',
        terms: [
          ['Authorised vs Issued capital', 'Authorised is the legal ceiling in the Memorandum; Issued is the portion actually allotted to shareholders'],
          ['Share Premium', 'Excess of issue price over nominal (par) value — a statutory capital reserve'],
          ['Bonus (Scrip) issue vs Rights issue', 'Bonus issue gives free extra shares to existing shareholders from reserves; Rights issue invites existing shareholders to buy extra shares for cash below market price'],
        ],
        rules: [
          'Only ISSUED/PAID-UP share capital (not Authorised capital) is added into the Balance Sheet totals.',
          'Debenture interest is an expense in Profit & Loss; Preference and Ordinary dividends are appropriations of profit.',
          'Share Premium may be used to issue fully paid bonus shares or write off preliminary share-issue expenses, NEVER to pay cash dividends.',
        ],
        table: {
          headers: ['Reserve type', 'Example', 'Can pay cash dividends?'],
          rows: [
            ['Revenue reserve', 'General Reserve, Retained Earnings', 'Yes'],
            ['Capital reserve', 'Share Premium, Revaluation Reserve', 'No (restricted by law)'],
          ],
          trapNote: 'If 100,000 ordinary shares of ₦1 nominal value are issued at ₦1.40 each, Share Capital = ₦100,000 and Share Premium = ₦40,000.',
        },
        example: {
          q: 'Kano Mills Plc issues 500,000 ordinary shares of ₦1 each at ₦1.50 per share, fully paid. Give the double entry.',
          steps: [
            ['Cash received', '500,000 × ₦1.50 = ₦750,000 → Debit Bank ₦750,000'],
            ['Nominal share capital', '500,000 × ₦1.00 = ₦500,000 → Credit Ordinary Share Capital ₦500,000'],
            ['Premium above par', '500,000 × ₦0.50 = ₦250,000 → Credit Share Premium ₦250,000'],
          ],
        },
        yourTurn: {
          q: 'Which of the following reserves is a CAPITAL reserve that CANNOT legally be distributed to shareholders as cash dividends?',
          o: ['Share Premium', 'General Reserve', 'Retained Earnings', 'Revenue Reserve'],
          a: 0,
          h: [
            'Revenue reserves come from trading profits and can fund dividends; capital reserves arise from share issues or asset revaluations.',
            'Which option arises when shares are issued above nominal value?',
          ],
          e: 'Share Premium is a statutory capital reserve restricted by company law and cannot be paid out as cash dividends.',
        },
      },
      {
        title: 'Interpretation of financial statements (Accounting Ratios)',
        idea: 'Accounting ratios turn raw financial figures into sharp diagnostics across three areas: Profitability (Gross Profit Margin, Net Profit Margin, Return on Capital Employed — ROCE), Liquidity (Current Ratio and Acid-Test/Quick Ratio) and Efficiency (Rate of Stock Turnover).',
        terms: [
          ['Current Ratio', 'Current Assets ÷ Current Liabilities (healthy benchmark is around 2 : 1)'],
          ['Acid-Test (Quick) Ratio', '(Current Assets − Inventory) ÷ Current Liabilities (healthy benchmark is around 1 : 1)'],
          ['ROCE', '(Net Profit before Interest & Tax ÷ Capital Employed) × 100% — measures overall return on long-term funds'],
          ['Rate of Stock Turnover', 'Cost of Goods Sold ÷ Average Inventory (expressed in "times")'],
        ],
        rules: [
          'Average Inventory = (Opening Inventory + Closing Inventory) ÷ 2.',
          'Gross Profit Margin = (Gross Profit ÷ Sales) × 100%; Net Profit Margin = (Net Profit ÷ Sales) × 100%.',
          'Capital Employed = Non-Current Assets + Working Capital (= Owners’ Equity + Long-term Liabilities).',
        ],
        table: {
          headers: ['Ratio', 'Formula', 'What it measures'],
          rows: [
            ['Gross Profit Margin', '(Gross Profit ÷ Sales) × 100', 'Trading profitability per ₦100 of sales'],
            ['Current Ratio', 'Current Assets ÷ Current Liabilities', 'Short-term ability to pay debts as they fall due'],
            ['Acid-Test Ratio', '(Current Assets − Stock) ÷ Current Liabilities', 'Immediate cash-like liquidity without selling stock'],
            ['Stock Turnover', 'Cost of Goods Sold ÷ Average Stock', 'How many times inventory is sold and replaced per year'],
          ],
          trapNote: 'Remember Stock Turnover uses COST OF GOODS SOLD in the numerator — NOT Sales revenue!',
        },
        example: {
          q: 'Current Assets = ₦300,000 (including Inventory ₦120,000) and Current Liabilities = ₦150,000. Compute both Current Ratio and Acid-Test Ratio.',
          steps: [
            ['Current Ratio', '₦300,000 ÷ ₦150,000 = 2 : 1'],
            ['Quick Assets', '₦300,000 − ₦120,000 = ₦180,000'],
            ['Acid-Test Ratio', '₦180,000 ÷ ₦150,000 = 1.2 : 1'],
          ],
        },
        yourTurn: {
          q: 'A retail company has Cost of Goods Sold of ₦900,000, Opening Stock of ₦80,000 and Closing Stock of ₦100,000. What is its Rate of Stock Turnover?',
          o: ['10 times', '9 times', '11.25 times', '5 times'],
          a: 0,
          h: [
            'First compute Average Stock = (Opening Stock + Closing Stock) ÷ 2.',
            'Then divide Cost of Goods Sold (₦900,000) by Average Stock (₦90,000).',
          ],
          e: 'Average Stock = (₦80,000 + ₦100,000) ÷ 2 = ₦90,000; Stock Turnover = ₦900,000 ÷ ₦90,000 = 10 times.',
        },
      },
    ],
    qs: [
      {
        q: 'The maximum share capital a limited company is legally permitted to issue according to its Memorandum of Association is its',
        o: ['authorised (nominal) capital', 'paid-up capital', 'working capital', 'loan capital'],
        a: 0,
        e: 'Authorised (registered/nominal) capital sets the legal ceiling on shares a company may issue.',
      },
      {
        q: 'Issuing free additional shares to existing shareholders by capitalising General Reserve or Share Premium is called a',
        o: ['bonus (scrip) issue', 'rights issue', 'debenture issue', 'forfeiture'],
        a: 0,
        e: 'A bonus issue converts reserves into fully paid shares distributed free to existing shareholders.',
      },
      {
        q: 'Which current asset is EXCLUDED when calculating the Acid-Test (Quick) Ratio?',
        o: ['Closing Inventory (Stock)', 'Cash at Bank', 'Trade Debtors', 'Short-term cash deposits'],
        a: 0,
        e: 'Inventory is the least liquid current asset and is excluded from the Acid-Test Ratio.',
      },
      {
        q: 'If Sales are ₦800,000 and Gross Profit is ₦200,000, what is the Gross Profit Margin?',
        o: ['25%', '20%', '33.3%', '40%'],
        a: 0,
        e: 'Gross Profit Margin = (₦200,000 ÷ ₦800,000) × 100% = 25%.',
      },
      {
        q: 'Which accounting ratio best measures how efficiently management generates profit from all long-term funds invested in a business?',
        o: [
          'Return on Capital Employed (ROCE)',
          'Acid-Test Ratio',
          'Current Ratio',
          'Debtors Collection Period',
        ],
        a: 0,
        e: 'ROCE compares operating profit against total long-term Capital Employed.',
      },
      {
        q: 'Where is debenture interest charged in a limited company’s financial statements?',
        o: [
          'Profit and Loss Account as a finance expense',
          'Appropriation Account alongside ordinary dividends',
          'Share Premium Account',
          'Trading Account',
        ],
        a: 0,
        e: 'Debenture interest is an obligatory financing cost charged in Profit & Loss before Net Profit.',
      },
    ],
  },
  {
    id: 'acct-dept-branch-jv',
    name: 'Departmental, branch and joint venture accounts',
    sec: 'Specialised accounts',
    goals: [
      'Allocate shared expenses fairly in Departmental Accounts (floor area, turnover, staff headcount)',
      'Explain Head Office & Branch accounting (cost price vs cost-plus) and Joint Venture Memorandum Accounts',
    ],
    trap: 'In Departmental Accounts, NEVER split expenses randomly — match each overhead to its logical driver (Rent → Floor area; Advertising/Commission → Sales turnover; Canteen/Supervision → Number of employees; Power → Kilowatts/machine hours).',
    parts: [
      {
        title: 'Departmental and Branch Accounts',
        idea: 'Businesses with multiple departments (e.g., Electronics and Clothing inside one store) prepare columnar Departmental Trading and Profit & Loss Accounts to spot which departments are thriving or losing money. Shared overheads are apportioned fairly using logical bases. Businesses with distant retail branches (Head Office + Branches) track each branch’s stock and profit using Branch Stock, Branch Mark-up/Adjustment and Branch Debtors Accounts.',
        terms: [
          ['Apportionment of expenses', 'Dividing shared overheads across departments using equitable bases (floor space, sales turnover, staff count)'],
          ['Inter-departmental transfers', 'Goods transferred from Department A to Department B — credited to A and debited to B'],
          ['Goods-in-transit / Cash-in-transit', 'Goods sent by Head Office or cash remitted by Branch still on the way at year-end'],
        ],
        rules: [
          'Common apportionment bases: Rent & Rates → Floor area; Discount Allowed & Advertising → Sales turnover; Discount Received → Purchases; Canteen/Welfare → Number of staff; Depreciation → Asset value.',
          'When Head Office invoices goods to a Branch at Cost-Plus (selling price), the profit margin ("loading") is separated in a Branch Adjustment Account so closing branch stock is reduced back to true cost on the Balance Sheet.',
          'Branch Accounts help Head Office prevent pilferage and evaluate branch managers fairly.',
        ],
        table: {
          headers: ['Shared overhead', 'Standard apportionment basis'],
          rows: [
            ['Rent, rates, lighting & heating', 'Floor area occupied'],
            ['Advertising, bad debts, carriage outwards', 'Departmental sales turnover'],
            ['Discount received & carriage inwards', 'Departmental purchases'],
            ['Canteen & staff welfare', 'Number of employees'],
          ],
          trapNote: 'When goods are invoiced to a branch at Cost + 25% (selling price), the loading fraction inside the selling price is 25/125 = 1/5!',
        },
        example: {
          q: 'Total store rent is ₦600,000. Department X occupies 300 m² and Department Y occupies 200 m². How much rent is charged to each department?',
          steps: [
            ['Total floor area', '300 + 200 = 500 m²'],
            ['Dept X share', '(300/500) × ₦600,000 = ₦360,000'],
            ['Dept Y share', '(200/500) × ₦600,000 = ₦240,000'],
          ],
        },
        yourTurn: {
          q: 'Which basis is most appropriate for apportioning shared advertising and sales promotion expenses across three store departments?',
          o: [
            'Departmental sales turnover',
            'Floor area occupied',
            'Number of delivery trucks',
            'Value of office chairs',
          ],
          a: 0,
          h: [
            'Advertising directly drives revenue from customer sales.',
            'Pick the basis directly linked to sales volume.',
          ],
          e: 'Advertising and selling overheads are logically apportioned in proportion to each department’s sales turnover.',
        },
      },
      {
        title: 'Joint Venture Accounts',
        idea: 'A Joint Venture is a temporary business partnership between two or more co-venturers for ONE specific project (such as importing a single shipment of rice or building a temporary exhibition) that ends automatically once the venture finishes. Unlike a permanent partnership, a joint venture normally uses no separate firm name and keeps no permanent joint set of books; instead, each venturer records their own transactions in a "Joint Venture with [Partner]" account, and both combine all figures in a Memorandum Joint Venture Account to determine and share net profit or loss.',
        terms: [
          ['Joint Venture', 'A short-term collaborative undertaking by two or more venturers for a single specific commercial project'],
          ['Memorandum Joint Venture Account', 'Combined summary outside the double-entry books collecting all venture purchases, expenses and sales to calculate profit/loss'],
          ['Co-venturer', 'Each participant contributing cash, goods or selling effort to the temporary venture'],
        ],
        rules: [
          'In the Memorandum Joint Venture Account: Debit ALL costs/purchases/expenses paid by ANY venturer; Credit ALL sales proceeds and goods taken over by venturers.',
          'Net Profit = Total Credits − Total Debits, shared in the agreed ratio (equally if unstated).',
          'Cash transfers directly between co-venturers do NOT appear in the Memorandum Joint Venture Account — they only settle balances in each venturer’s personal account.',
        ],
        table: {
          headers: ['Feature', 'Ordinary Partnership', 'Joint Venture'],
          rows: [
            ['Duration', 'Ongoing / continuous business', 'Temporary — ends once one project completes'],
            ['Separate firm name & books', 'Usually yes', 'Usually no separate firm name or separate full books'],
            ['Profit calculation', 'Trading, P&L and Appropriation Accounts', 'Memorandum Joint Venture Account'],
          ],
          trapNote: 'Never put a cash remittance sent from Venturer A to Venturer B inside the Memorandum Joint Venture Account — it is an internal settlement, not a venture expense or revenue!',
        },
        example: {
          q: 'Ada and Bello enter an equal joint venture to sell laptops. Ada buys stock for ₦1,200,000 and pays freight ₦80,000. Bello pays storage ₦40,000 and sells all laptops for ₦1,620,000. Find each venturer’s profit share.',
          steps: [
            ['Total Memorandum Debits (costs)', '₦1,200,000 + ₦80,000 + ₦40,000 = ₦1,320,000'],
            ['Total Memorandum Credits (sales)', '₦1,620,000'],
            ['Venture Profit (50/50)', '₦1,620,000 − ₦1,320,000 = ₦300,000 → ₦150,000 each'],
          ],
        },
        yourTurn: {
          q: 'Which item is EXCLUDED from the Memorandum Joint Venture Account when computing a joint venture’s profit?',
          o: [
            'Cash remitted by one co-venturer directly to the other co-venturer',
            'Purchases of venture goods paid by Co-venturer A',
            'Selling expenses paid by Co-venturer B',
            'Sales revenue collected by Co-venturer B',
          ],
          a: 0,
          h: [
            'The Memorandum Account calculates venture PROFIT (total external sales minus total external costs).',
            'Internal cash transfers between the two partners neither earn revenue nor create an expense.',
          ],
          e: 'Cash transferred between co-venturers is an internal settlement recorded in their personal accounts, not in the Memorandum Joint Venture Account.',
        },
      },
    ],
    qs: [
      {
        q: 'Which basis is best suited for apportioning canteen and staff welfare costs among departments?',
        o: ['Number of employees in each department', 'Floor area', 'Purchases value', 'Closing stock'],
        a: 0,
        e: 'Staff welfare costs vary directly with the headcount of employees in each department.',
      },
      {
        q: 'In Branch Accounting, when Head Office invoices goods to a branch at Cost + 20%, what fraction of the invoice (selling) price is profit loading?',
        o: ['1/6', '1/5', '1/4', '1/3'],
        a: 0,
        e: 'Mark-up 20% = 1/5 on cost corresponds to 20/120 = 1/6 margin on invoice price.',
      },
      {
        q: 'Why does a Head Office open a Branch Adjustment Account when invoicing goods at selling price?',
        o: [
          'To track profit loading and remove unrealised profit from closing branch inventory',
          'To hide sales from the branch manager',
          'To record staff salaries only',
          'To replace the Bank Account',
        ],
        a: 0,
        e: 'Branch Adjustment separates profit loading so gross profit and closing stock cost are reported accurately.',
      },
      {
        q: 'Which feature clearly distinguishes a Joint Venture from an ordinary partnership?',
        o: [
          'It is formed for a single temporary commercial venture and ends upon completion',
          'It must register on the stock exchange',
          'It never shares profits or losses',
          'It always lasts for at least fifty years',
        ],
        a: 0,
        e: 'A joint venture is a temporary partnership limited to a specific project or consignment.',
      },
      {
        q: 'In Departmental Accounts, discount received from suppliers is most fairly apportioned on the basis of',
        o: ['departmental purchases', 'departmental floor area', 'number of managers', 'departmental sales'],
        a: 0,
        e: 'Discount received arises from prompt payment to suppliers and relates directly to purchases.',
      },
      {
        q: 'At the end of a Joint Venture, unsold goods taken over by one co-venturer for personal stock are',
        o: [
          'credited to the Memorandum Joint Venture Account and debited to that venturer’s account',
          'ignored completely',
          'debited to the Memorandum Joint Venture Account',
          'treated as a bad debt',
        ],
        a: 0,
        e: 'Goods taken over by a venturer act like a sale to that venturer: credit Memorandum Joint Venture, debit the venturer.',
      },
    ],
  },
  {
    id: 'acct-public-sector-it',
    name: 'Public sector accounting and information technology in accounting',
    sec: 'Public finance and modern accounting',
    goals: [
      'Explain public sector accounting terms (Consolidated Revenue Fund, Development Fund, Virement, Warrant, Votes, IPSAS) and the roles of Accountant-General and Auditor-General',
      'Explain computerised accounting systems, spreadsheets, cloud accounting and internal data controls',
    ],
    trap: 'Do not confuse the ACCOUNTANT-GENERAL with the AUDITOR-GENERAL: the Accountant-General PREPARES and manages government accounts and treasury payments, whereas the Auditor-General INDEPENDENTLY AUDITS those accounts and reports directly to the National Assembly.',
    parts: [
      {
        title: 'Public sector (government) accounting in Nigeria',
        idea: 'Public sector accounting records and reports financial stewardship for federal, state and local governments — focusing on legal budget compliance, accountability and public service rather than private profit. Government money flows into statutory funds (Consolidated Revenue Fund for recurrent revenue/expenditure, Development Fund for capital projects and Contingencies Fund for emergencies), released only by legal Warrants under the Appropriation Act. Nigeria has adopted IPSAS (International Public Sector Accounting Standards) to improve transparency.',
        terms: [
          ['Consolidated Revenue Fund (CRF)', 'Main government treasury account receiving taxes and oil/non-oil revenues to fund recurrent expenditure'],
          ['Virement', 'Lawful transfer of unused budgeted funds from one sub-head to another within the same ministry/head with Finance approval'],
          ['Warrant', 'Official written authority signed by the Minister/Commissioner of Finance authorising the Accountant-General to release public funds'],
          ['Accountant-General vs Auditor-General', 'Accountant-General keeps and compiles government accounts; Auditor-General independently inspects them and reports to the legislature'],
        ],
        rules: [
          'No money may legally be withdrawn from the Consolidated Revenue Fund without an Appropriation Act (Budget) and a valid Finance Warrant.',
          'Recurrent expenditure covers ongoing salaries and overheads; capital expenditure funds long-term roads, hospitals and schools (Development Fund).',
          'The Public Accounts Committee (PAC) of the National Assembly reviews the Auditor-General’s report to hold ministries accountable.',
        ],
        table: {
          headers: ['Public fund / concept', 'Purpose'],
          rows: [
            ['Consolidated Revenue Fund', 'Primary pool for federal revenue and recurrent spending'],
            ['Development Fund', 'Capital projects such as highways, bridges and power plants'],
            ['Contingencies Fund', 'Urgent unforeseen emergencies (e.g., flood relief) pending ratification'],
            ['IPSAS', 'Global public-sector reporting standards promoting accrual transparency'],
          ],
          trapNote: 'Remember: VIREMENT moves funds between sub-heads within the SAME ministry — it does NOT increase the government’s total approved budget.',
        },
        example: {
          q: 'Why does the Nigerian Constitution protect the tenure and independence of the Auditor-General of the Federation?',
          steps: [
            ['Identify the role', 'The Auditor-General audits every federal ministry and agency'],
            ['Explain independence', 'Reporting directly to the National Assembly rather than ministers ensures fearless, objective scrutiny of public money'],
          ],
        },
        yourTurn: {
          q: 'Which official authority must the Minister of Finance sign before the Accountant-General can release approved budget funds from the Consolidated Revenue Fund?',
          o: ['A Warrant', 'A Credit Note', 'A Bill of Lading', 'A Prospectus'],
          a: 0,
          h: [
            'Passing the Appropriation Act approves spending legally, then a specific treasury release document unlocks disbursement.',
            'Examples include the General Warrant and Provisional General Warrant.',
          ],
          e: 'A Finance Warrant formally authorises the Accountant-General to disburse appropriated public funds.',
        },
      },
      {
        title: 'Information technology in accounting',
        idea: 'Modern accounting runs on software (such as Sage, QuickBooks, Tally, Peachtree, ERP systems and spreadsheets like Excel) rather than paper ledgers alone. Entering one invoice automatically updates the Sales Ledger, General Ledger, Inventory and Trial Balance in seconds — slashing arithmetic errors and producing instant management reports. However, computerised accounting requires strict controls: strong passwords, user-access roles, audit trails, regular offline/cloud backups and antivirus protection.',
        terms: [
          ['Accounting package', 'Dedicated software (e.g., Sage, QuickBooks, Tally) that automates posting, payroll, VAT and financial statements'],
          ['Audit trail', 'Digital chronological log recording who entered, edited or deleted every transaction and when'],
          ['Data backup & access control', 'Copying encrypted accounting data regularly and restricting ledger edits by user permissions'],
        ],
        rules: [
          'Advantages of computerised accounting: high speed, automatic Trial Balance accuracy, instant ratio/cashflow reports and lower paper storage.',
          'Limitations/risks: power outages, hardware failure, cyberattacks/ransomware, staff training costs and "GIGO" (Garbage In, Garbage Out — software cannot fix wrong conceptual input!).',
          'Spreadsheets handle budgets, depreciation schedules and "what-if" forecasts flexibly, while dedicated accounting packages enforce double-entry integrity.',
        ],
        table: {
          headers: ['Manual accounting', 'Computerised accounting'],
          rows: [
            ['Slow hand posting and manual casting', 'Instant automatic posting to all ledgers and Trial Balance'],
            ['High risk of casting & transposition errors', 'Eliminates arithmetic mistakes (though GIGO still applies)'],
            ['Physical paper filing cabinets', 'Compact digital/cloud storage requiring backups & passwords'],
          ],
          trapNote: 'Software eliminates ARITHMETIC errors, NOT errors of PRINCIPLE — if a clerk wrongly codes a new delivery van to Fuel Expenses ("GIGO"), the software will still misclassify it!',
        },
        example: {
          q: 'Why is an automated "audit trail" essential in a company’s computerised accounting software?',
          steps: [
            ['Accountability', 'Records exact user ID, timestamp and before/after figures for every entry'],
            ['Fraud prevention', 'Prevents dishonest staff from silently altering or deleting sales invoices without leaving a trace'],
          ],
        },
        yourTurn: {
          q: 'What does the computing principle "GIGO" (Garbage In, Garbage Out) warn accounting clerks about when using accounting software?',
          o: [
            'If inaccurate or wrongly classified data is entered, the software will output inaccurate financial reports',
            'Accounting software automatically repairs every conceptual mistake',
            'Old invoices should be thrown away daily',
            'Computers can never run spreadsheets',
          ],
          a: 0,
          h: [
            'Computers follow instructions rapidly without understanding whether an expense belongs to Capital or Revenue.',
            'Output quality depends directly on accurate human input.',
          ],
          e: 'GIGO reminds accountants that software processes whatever data is entered — wrong inputs inevitably produce wrong reports.',
        },
      },
    ],
    qs: [
      {
        q: 'In Nigerian public sector accounting, which fund receives the bulk of federal revenues to finance recurrent government expenditure?',
        o: ['Consolidated Revenue Fund', 'Contingencies Fund', 'Sinking Fund', 'Petty Cash Float'],
        a: 0,
        e: 'The Consolidated Revenue Fund (CRF) is the primary constitutional pool for public revenues and recurrent spending.',
      },
      {
        q: 'Reallocating surplus budgeted funds from one sub-head to cover a shortfall in another sub-head within the same ministry is called',
        o: ['virement', 'depreciation', 'subrogation', 'imprest'],
        a: 0,
        e: 'Virement transfers funds lawfully between sub-heads within an approved head of expenditure.',
      },
      {
        q: 'To which arm of government does the Auditor-General of the Federation submit annual audit reports on federal public accounts?',
        o: ['The National Assembly', 'The commercial banks', 'Private shareholders', 'The Nigeria Customs Service'],
        a: 0,
        e: 'The Auditor-General reports directly to the National Assembly (reviewed by the Public Accounts Committee).',
      },
      {
        q: 'Which international framework is designed specifically to standardise transparent financial reporting by governments and public agencies?',
        o: ['IPSAS', 'OPEC', 'NAFDAC', 'ECOWAS'],
        a: 0,
        e: 'IPSAS stands for International Public Sector Accounting Standards.',
      },
      {
        q: 'Which internal control best protects a computerised accounting system against permanent data loss from fire or ransomware?',
        o: [
          'Regular encrypted backups stored safely off-site or in secure cloud storage',
          'Sharing one single password among all clerks',
          'Turning off the audit trail',
          'Writing balances only on chalkboards',
        ],
        a: 0,
        e: 'Routine off-site/cloud backups ensure accounting records can be restored intact after hardware failure or attack.',
      },
      {
        q: 'Which of the following errors can STILL occur in a computerised accounting system?',
        o: [
          'Error of principle (coding an asset purchase to a routine expense account)',
          'Incorrect manual addition of a ledger column',
          'Mismatch between Trial Balance debit and credit totals from posting one side only',
          'Forgetting to carry down a column sum',
        ],
        a: 0,
        e: 'Software enforces balanced debits/credits and exact sums, but still relies on human judgement for correct account classification.',
      },
    ],
  },
];

export function buildAcctCurriculum() {
  return buildUtmeSubjectCurriculum(ACCT_SPECS);
}
