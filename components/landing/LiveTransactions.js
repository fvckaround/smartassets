"use client";

import { useEffect, useRef, useState } from "react";

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
    description: "",
    amounts: [250, 500, 750, 1200, 2500, 5000, 350, 1800],
  },
  {
    type: "Deposit",
    description: "",
    amounts: [100, 250, 500, 750, 1000, 1500, 2000, 350],
  },
  {
    type: "Withdrawal",
    description: "",
    amounts: [100, 200, 350, 500, 850, 1200, 1500, 400],
  },
  {
    type: "Profit",
    description: "",
    amounts: [15, 35, 50, 75, 100, 150, 200, 45],
  },
];

const statuses = ["Confirmed", "Pending", "Completed"];

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
    status: statuses[index % statuses.length],
  };
});

// Duplicated list for seamless looping (built once, not on every render)
const scrollingTransactions = [...transactions, ...transactions];

function formatAmount(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part.replace(".", "").charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function TransactionRow({ transaction }) {
  const typeClass = transaction.type.toLowerCase();
  const statusClass = transaction.status.toLowerCase();

  return (
    <article className="transaction-row">
      <div className="transaction-user">
        <div className="transaction-avatar" aria-hidden="true">
          {getInitials(transaction.user)}
        </div>

        <div className="transaction-user-details">
          <span className="transaction-name">{transaction.user}</span>

          <span className="transaction-description">
            {transaction.description}
          </span>
        </div>
      </div>

      <div className="transaction-type">
        <span
          className={`transaction-type-dot transaction-dot-${typeClass}`}
          aria-hidden="true"
        />

        {transaction.type}
      </div>

      <div className="transaction-amount">
        {formatAmount(transaction.amount)}
      </div>

      <div className={`transaction-status transaction-status-${statusClass}`}>
        <span className="transaction-status-dot" aria-hidden="true" />
        {transaction.status}
      </div>
    </article>
  );
}

export default function LiveTransactions() {
  const scrollRef = useRef(null);

  // Pause toggled by the button
  const [paused, setPaused] = useState(false);

  // Temporary pause while the user hovers or touches the list
  const [interacting, setInteracting] = useState(false);

  // Lets the animation loop read the latest pause state without restarting
  const pausedRef = useRef(false);
  const resumeTimeoutRef = useRef(null);

  const isPaused = paused || interacting;

  useEffect(() => {
    pausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    const container = scrollRef.current;

    if (!container) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    if (reducedMotion.matches) return;

    let animationFrame;
    let previousTime = 0;

    // Track the exact (fractional) position ourselves. Mobile browsers
    // round scrollTop to whole pixels, so small per-frame increments
    // would otherwise be lost and the list would never move.
    let position = container.scrollTop;

    // Automatic scrolling speed in pixels per second.
    const scrollSpeed = 22;

    const animate = (time) => {
      if (previousTime === 0) {
        previousTime = time;
      }

      const elapsed = Math.min((time - previousTime) / 1000, 0.05);

      previousTime = time;

      if (pausedRef.current) {
        // Stay in sync with any manual scrolling done while paused
        position = container.scrollTop;
      } else {
        const halfwayPoint = container.scrollHeight / 2;

        position += scrollSpeed * elapsed;

        // Loop through the duplicated list seamlessly.
        if (halfwayPoint > 0 && position >= halfwayPoint) {
          position -= halfwayPoint;
        }

        container.scrollTop = position;
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  useEffect(() => {
    return () => clearTimeout(resumeTimeoutRef.current);
  }, []);

  const handleTouchStart = () => {
    clearTimeout(resumeTimeoutRef.current);
    setInteracting(true);
  };

  const handleTouchEnd = () => {
    clearTimeout(resumeTimeoutRef.current);

    // Give momentum scrolling time to settle before resuming
    resumeTimeoutRef.current = setTimeout(() => {
      setInteracting(false);
    }, 1500);
  };

  return (
    <section
      id="transaction-activity"
      className="transaction-section"
      aria-labelledby="transaction-heading"
    >
      <div className="transaction-container">
        <div className="transaction-heading-area">
          <div className="transaction-eyebrow">
            <span className="transaction-live-dot" aria-hidden="true" />
            TRANSACTION ACTIVITY PREVIEW
          </div>

          <h2 id="transaction-heading">
            Explore Transaction <span className="gold-text">Activity</span>
          </h2>

          <p className="transaction-intro">
            Investments, deposits, withdrawals, and other transaction activity.
          </p>
        </div>

        <div className="transaction-panel">
          <div className="transaction-panel-header">
            <div className="transaction-panel-title-group">
              <div className="transaction-panel-icon" aria-hidden="true">
                ↕
              </div>

              <div>
                <h3>Transaction Activity</h3>
                <p>Transaction entries</p>
              </div>
            </div>

            <button
              type="button"
              className="transaction-count transaction-pause-button"
              onClick={() => setPaused((current) => !current)}
              aria-pressed={paused}
              aria-label={
                paused
                  ? "Resume automatic transaction scrolling"
                  : "Pause automatic transaction scrolling"
              }
            >
              {paused ? "▶ Resume" : "Ⅱ Pause"}
            </button>
          </div>

          <div className="transaction-table-heading">
            <span>USER</span>
            <span>TYPE</span>
            <span>AMOUNT</span>
            <span>STATUS</span>
          </div>

          <div
            ref={scrollRef}
            className="transaction-scroll-window"
            role="region"
            aria-label="Sample transaction entries"
            tabIndex={0}
            onPointerEnter={(e) => {
              if (e.pointerType === "mouse") setInteracting(true);
            }}
            onPointerLeave={(e) => {
              if (e.pointerType === "mouse") setInteracting(false);
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
          >
            <div className="transaction-scroll-list">
              {scrollingTransactions.map((transaction, index) => (
                <TransactionRow
                  key={`${transaction.id}-${index}`}
                  transaction={transaction}
                />
              ))}
            </div>
          </div>

          <div className="transaction-panel-footer">
            <div className="transaction-footer-message">
              <span className="footer-indicator" aria-hidden="true" />
            </div>

            <span className="transaction-scroll-hint">
              {isPaused ? "Scrolling paused" : "Auto-scroll enabled"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}