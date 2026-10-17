const users = [
  "Alex M.",
  "Sarah K.",
  "Michael T.",
  "David R.",
  "Jennifer L.",
  "Daniel W.",
  "Olivia B.",
  "James P.",
  "Sophia A.",
  "William C.",
  "Emma D.",
  "Benjamin H.",
  "Grace N.",
  "Samuel O.",
  "Victoria E.",
  "Joseph I.",
  "Amelia G.",
  "Daniel F.",
  "Charlotte U.",
  "Matthew Z.",
];

const transactionTypes = [
  {
    type: "Investment",
    description: "Investment example",
    amounts: [250, 500, 750, 1200, 2500, 5000, 350, 1800],
  },
  {
    type: "Deposit",
    description: "Deposit example",
    amounts: [100, 250, 500, 750, 1000, 1500, 2000, 350],
  },
  {
    type: "Withdrawal",
    description: "Withdrawal example",
    amounts: [100, 200, 350, 500, 850, 1200, 1500, 400],
  },
  {
    type: "Profit",
    description: "Illustrative profit example",
    amounts: [15, 35, 50, 75, 100, 150, 200, 45],
  },
];

const transactions = Array.from({ length: 100 }, (_, index) => {
  const transaction = transactionTypes[index % transactionTypes.length];

  return {
    id: index + 1,
    user: users[index % users.length],
    type: transaction.type,
    description: transaction.description,
    amount:
      transaction.amounts[
        Math.floor(index / transactionTypes.length) %
          transaction.amounts.length
      ],
  };
});

function formatAmount(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}

function TransactionRow({ transaction }) {
  return (
    <article className="transaction-row">
      <div className="transaction-user">
        <div className="transaction-avatar" aria-hidden="true">
          {transaction.user.charAt(0)}
        </div>

        <div className="transaction-user-details">
          <span className="transaction-name">
            {transaction.user}
          </span>

          <span className="transaction-description">
            {transaction.description}
          </span>
        </div>
      </div>

      <div className="transaction-type">
        <span className="transaction-type-dot" aria-hidden="true" />
        {transaction.type}
      </div>

      <div className="transaction-amount">
        {formatAmount(transaction.amount)}
      </div>

      <div className="transaction-status">
        Sample
      </div>
    </article>
  );
}

export default function LiveTransactions() {
  const scrollingTransactions = [...transactions, ...transactions];

  return (
    <section
      id="transaction-activity"
      className="transaction-section"
      aria-labelledby="transaction-heading"
    >
      <div className="transaction-container">
        <div className="transaction-heading-area">
          <div className="transaction-eyebrow">
            <span className="transaction-live-dot" />
            TRANSACTION ACTIVITY PREVIEW
          </div>

          <h2 id="transaction-heading">
            Explore Transaction Activity
          </h2>

          <p className="transaction-intro">
            Explore examples of deposits, investments, withdrawals,
            and other transaction activity on an investment platform.
          </p>

          <div className="transaction-summary">
            <div className="summary-card">
              <span className="summary-label">
                Transaction Examples
              </span>

              <strong>100</strong>
            </div>

            <div className="summary-card">
              <span className="summary-label">
                Transaction Categories
              </span>

              <strong>04</strong>
            </div>

            <div className="summary-card">
              <span className="summary-label">
                Background
              </span>

              <strong>White & Green</strong>
            </div>
          </div>
        </div>

        <div className="transaction-panel">
          <div className="transaction-panel-header">
            <div>
              <h3>Transaction Activity</h3>

              <p>
                Example entries for demonstration purposes
              </p>
            </div>

            <span className="transaction-count">
              100 ENTRIES
            </span>
          </div>

          <div className="transaction-table-heading">
            <span>USER</span>
            <span>TYPE</span>
            <span>AMOUNT</span>
            <span>STATUS</span>
          </div>

          <div
            className="transaction-scroll-window"
            aria-label="Scrolling sample transaction list"
          >
            <div className="transaction-scroll-track">
              {scrollingTransactions.map((transaction, index) => (
                <TransactionRow
                  key={`${transaction.id}-${index}`}
                  transaction={transaction}
                />
              ))}
            </div>
          </div>

          <div className="transaction-panel-footer">
            <span className="footer-indicator" />

            <span>
              Demonstration data only. These are not verified live
              customer transactions.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}