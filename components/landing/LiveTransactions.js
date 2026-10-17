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
  const initials = transaction.user
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .replace(".", "")
    .slice(0, 2);

  return (
    <article className="transaction-row">
      <div className="transaction-user">
        <div className="transaction-avatar" aria-hidden="true">
          {initials}
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
        <span
          className={`transaction-type-dot transaction-dot-${transaction.type.toLowerCase()}`}
          aria-hidden="true"
        />

        <span>{transaction.type}</span>
      </div>

      <div className="transaction-amount">
        {formatAmount(transaction.amount)}
      </div>

      <div className="transaction-status">
        <span className="transaction-status-dot" />
        Sample
      </div>
    </article>
  );
}

export default function LiveTransactions() {
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
            TRANSACTION ACTIVITY
          </div>

          <h2 id="transaction-heading">
            Explore Transaction Activity
          </h2>

          <p className="transaction-intro">
            Browse illustrative examples of investment activity,
            including deposits, investments, withdrawals, and profits.
          </p>
        </div>

        <div className="transaction-panel">
          <div className="transaction-panel-header">
            <div className="transaction-panel-title-group">
              <div className="transaction-panel-icon" aria-hidden="true">
                ↗
              </div>

              <div>
                <h3>Transaction Overview</h3>

                <p>
                  Browse the example entries below
                </p>
              </div>
            </div>

            <span className="transaction-count">
              100 EXAMPLES
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
            role="region"
            aria-label="Sample transaction activity. Scroll inside this panel to see more entries."
            tabIndex={0}
          >
            <div className="transaction-scroll-list">
              {transactions.map((transaction) => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                />
              ))}
            </div>
          </div>

          <div className="transaction-panel-footer">
            <div className="transaction-footer-message">
              <span className="footer-indicator" />

              <span>
                Demonstration data only — not verified live customer activity.
              </span>
            </div>

            <span className="transaction-scroll-hint">
              Scroll to explore ↓
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}