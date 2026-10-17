const users = [
  "Alex M.", "Sarah K.", "Michael T.", "David R.",
  "Jennifer L.", "Daniel W.", "Olivia B.", "James P.",
  "Sophia A.", "William C.", "Emma D.", "Benjamin H.",
  "Grace N.", "Samuel O.", "Victoria E.", "Joseph I.",
  "Amelia G.", "Daniel F.", "Charlotte U.", "Matthew Z.",
];

const transactionTypes = [
  {
    type: "Investment",
    description: "Investment initiated",
    amounts: [250, 500, 750, 1200, 2500, 5000, 350, 1800],
  },
  {
    type: "Deposit",
    description: "Deposit received",
    amounts: [100, 250, 500, 750, 1000, 1500, 2000, 350],
  },
  {
    type: "Withdrawal",
    description: "Withdrawal requested",
    amounts: [100, 200, 350, 500, 850, 1200, 1500, 400],
  },
  {
    type: "Profit",
    description: "Illustrative profit entry",
    amounts: [15, 35, 50, 75, 100, 150, 200, 45],
  },
];

const transactionStatuses = [
  "Sample",
  "Sample",
  "Sample",
  "Sample",
];

const transactions = Array.from({ length: 100 }, (_, index) => {
  const user = users[index % users.length];
  const transaction = transactionTypes[index % transactionTypes.length];

  const amount =
    transaction.amounts[
      Math.floor(index / 4) % transaction.amounts.length
    ];

  return {
    id: index + 1,
    user,
    type: transaction.type,
    description: transaction.description,
    amount,
    status: transactionStatuses[index % transactionStatuses.length],
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
        <span className="transaction-type-dot" />
        {transaction.type}
      </div>

      <div className="transaction-amount">
        {formatAmount(transaction.amount)}
      </div>

      <div className="transaction-status">
        {transaction.status}
      </div>
    </article>
  );
}

export default function LiveTransactions() {
  // Duplicate the entries to create a seamless scrolling loop.
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
            PLATFORM ACTIVITY PREVIEW
          </div>

          <h2 id="transaction-heading">
            Explore Transaction Activity
          </h2>

          <p className="transaction-intro">
            Explore examples of deposits, investments, withdrawals,
            and other transaction activity.
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
                Display
              </span>

              <strong>Sample Data</strong>
            </div>
          </div>
        </div>

        <div className="transaction-panel">
          <div className="transaction-panel-header">
            <div>
              <h3>Recent Transaction Examples</h3>
              <p>Illustrative entries for demonstration purposes</p>
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
            aria-label="Scrolling list of sample transactions"
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
              Sample transactions only — not live customer activity.
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .transaction-section {
          --green: #16834a;
          --green-dark: #086b38;
          --green-light: #eaf7ef;
          --green-border: #d5ecdd;

          width: 100%;
          padding: 90px 24px;
          background: #ffffff;
          color: var(--green-dark);
          overflow: hidden;
        }

        .transaction-container {
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
        }

        .transaction-heading-area {
          max-width: 760px;
          margin: 0 auto 44px;
          text-align: center;
        }

        .transaction-eyebrow {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 10px 16px;
          border: 1px solid var(--green-border);
          border-radius: 999px;
          background: #f5fbf7;
          color: var(--green);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.5px;
        }

        .transaction-live-dot,
        .transaction-type-dot,
        .footer-indicator {
          flex: 0 0 auto;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #22a65c;
        }

        .transaction-live-dot {
          animation: pulse 1.8s ease-in-out infinite;
        }

        .transaction-heading-area h2 {
          margin: 22px 0 14px;
          color: var(--green-dark);
          font-size: clamp(30px, 4.2vw, 48px);
          font-weight: 800;
          letter-spacing: -1.7px;
          line-height: 1.15;
        }

        .transaction-intro {
          max-width: 650px;
          margin: 0 auto;
          color: var(--green);
          font-size: 16px;
          line-height: 1.8;
        }

        .transaction-summary {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
          margin-top: 34px;
        }

        .summary-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          min-height: 108px;
          padding: 18px 12px;
          border: 1px solid var(--green-border);
          border-radius: 16px;
          background: #ffffff;
          transition:
            transform 220ms ease,
            border-color 220ms ease,
            box-shadow 220ms ease;
        }

        .summary-card:hover {
          transform: translateY(-4px);
          border-color: #81c99d;
          box-shadow: 0 10px 28px rgba(22, 131, 74, 0.08);
        }

        .summary-label {
          color: var(--green);
          font-size: 12px;
          font-weight: 600;
        }

        .summary-card strong {
          color: var(--green-dark);
          font-size: 23px;
          font-weight: 800;
        }

        .summary-card:last-child strong {
          font-size: 17px;
        }

        .transaction-panel {
          overflow: hidden;
          border: 1px solid var(--green-border);
          border-radius: 22px;
          background: #ffffff;
          box-shadow: 0 18px 55px rgba(22, 131, 74, 0.07);
        }

        .transaction-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 26px 28px;
          border-bottom: 1px solid var(--green-border);
        }

        .transaction-panel-header h3 {
          margin: 0 0 7px;
          color: var(--green-dark);
          font-size: 20px;
          font-weight: 800;
        }

        .transaction-panel-header p {
          margin: 0;
          color: var(--green);
          font-size: 13px;
          line-height: 1.6;
        }

        .transaction-count {
          flex-shrink: 0;
          padding: 9px 12px;
          border: 1px solid var(--green-border);
          border-radius: 8px;
          background: #f5fbf7;
          color: var(--green-dark);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .transaction-table-heading {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 0.8fr;
          align-items: center;
          gap: 14px;
          padding: 16px 28px;
          border-bottom: 1px solid var(--green-border);
          background: #f7fcf8;
          color: var(--green);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .transaction-scroll-window {
          position: relative;
          height: 410px;
          overflow: hidden;
          background: #ffffff;
          -webkit-mask-image: linear-gradient(
            to bottom,
            transparent,
            #000 5%,
            #000 95%,
            transparent
          );
          mask-image: linear-gradient(
            to bottom,
            transparent,
            #000 5%,
            #000 95%,
            transparent
          );
        }

        .transaction-scroll-track {
          display: flex;
          flex-direction: column;
          animation: scrollTransactions 55s linear infinite;
          will-change: transform;
        }

        .transaction-scroll-window:hover .transaction-scroll-track {
          animation-play-state: paused;
        }

        .transaction-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 0.8fr;
          align-items: center;
          gap: 14px;
          min-height: 78px;
          padding: 12px 28px;
          border-bottom: 1px solid #edf6f0;
          color: var(--green-dark);
          transition: background 180ms ease;
        }

        .transaction-row:hover {
          background: #f6fcf8;
        }

        .transaction-user {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .transaction-avatar {
          display: flex;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border: 1px solid var(--green-border);
          border-radius: 50%;
          background: var(--green-light);
          color: var(--green-dark);
          font-size: 14px;
          font-weight: 800;
        }

        .transaction-user-details {
          display: flex;
          flex-direction: column;
          gap: 5px;
          min-width: 0;
        }

        .transaction-name {
          overflow: hidden;
          color: var(--green-dark);
          font-size: 13px;
          font-weight: 800;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .transaction-description {
          overflow: hidden;
          color: var(--green);
          font-size: 11px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .transaction-type {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--green-dark);
          font-size: 12px;
          font-weight: 600;
        }

        .transaction-type-dot {
          width: 7px;
          height: 7px;
        }

        .transaction-amount {
          color: var(--green-dark);
          font-size: 13px;
          font-weight: 800;
          white-space: nowrap;
        }

        .transaction-status {
          justify-self: start;
          padding: 7px 10px;
          border: 1px solid var(--green-border);
          border-radius: 7px;
          background: #f1faf4;
          color: var(--green-dark);
          font-size: 10px;
          font-weight: 800;
        }

        .transaction-panel-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 17px 20px;
          border-top: 1px solid var(--green-border);
          background: #f7fcf8;
          color: var(--green);
          font-size: 12px;
          line-height: 1.6;
          text-align: center;
        }

        .footer-indicator {
          width: 7px;
          height: 7px;
        }

        @keyframes scrollTransactions {
          from {
            transform: translateY(0);
          }

          to {
            transform: translateY(-50%);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
            box-shadow: 0 0 0 0 rgba(34, 166, 92, 0.25);
          }

          50% {
            opacity: 0.75;
            box-shadow: 0 0 0 7px rgba(34, 166, 92, 0);
          }
        }

        @media (max-width: 760px) {
          .transaction-section {
            padding: 65px 16px;
          }

          .transaction-heading-area {
            margin-bottom: 32px;
          }

          .transaction-heading-area h2 {
            letter-spacing: -1px;
          }

          .transaction-intro {
            font-size: 14px;
          }

          .transaction-summary {
            gap: 8px;
          }

          .summary-card {
            min-height: 94px;
            padding: 12px 6px;
          }

          .summary-label {
            font-size: 10px;
            line-height: 1.5;
            text-align: center;
          }

          .summary-card strong {
            font-size: 19px;
          }

          .summary-card:last-child strong {
            font-size: 14px;
          }

          .transaction-panel {
            border-radius: 15px;
          }

          .transaction-panel-header {
            align-items: flex-start;
            padding: 20px 16px;
          }

          .transaction-panel-header h3 {
            font-size: 17px;
          }

          .transaction-panel-header p {
            font-size: 11px;
          }

          .transaction-count {
            padding: 7px 8px;
            font-size: 8px;
          }

          .transaction-table-heading,
          .transaction-row {
            grid-template-columns: 1.6fr 1fr 1fr;
            gap: 8px;
            padding-right: 12px;
            padding-left: 12px;
          }

          .transaction-table-heading {
            font-size: 9px;
          }

          .transaction-table-heading span:last-child {
            display: none;
          }

          .transaction-row {
            min-height: 76px;
          }

          .transaction-user {
            gap: 8px;
          }

          .transaction-avatar {
            width: 31px;
            height: 31px;
            font-size: 12px;
          }

          .transaction-name {
            font-size: 11px;
          }

          .transaction-description {
            font-size: 9px;
          }

          .transaction-type {
            gap: 5px;
            font-size: 10px;
          }

          .transaction-type-dot {
            width: 5px;
            height: 5px;
          }

          .transaction-amount {
            font-size: 11px;
          }

          .transaction-status {
            display: none;
          }

          .transaction-panel-footer {
            padding: 14px 12px;
            font-size: 10px;
          }
        }

        @media (max-width: 380px) {
          .transaction-section {
            padding-right: 10px;
            padding-left: 10px;
          }

          .transaction-table-heading,
          .transaction-row {
            gap: 5px;
            padding-right: 8px;
            padding-left: 8px;
          }

          .transaction-avatar {
            display: none;
          }

          .transaction-name {
            font-size: 10px;
          }

          .transaction-amount {
            font-size: 10px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .transaction-live-dot {
            animation: none;
          }

          .transaction-scroll-track {
            animation: none;
          }

          .summary-card {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}