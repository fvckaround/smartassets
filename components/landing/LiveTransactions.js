"use client";

import { useEffect, useRef, useState } from "react";

// Seeded random generator so addresses are the same on the server
// and in the browser (prevents Next.js hydration mismatch errors).
function seededRandom(seed) {
  let t = seed + 0x6d2b79f5;

  return () => {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    t = (t + Math.imul(t ^ (t >>> 14), t | 1)) ^ (t >>> 14);
    t = (t + 0x6d2b79f5) | 0;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Builds a 42-character wallet address: "0x" + 40 hex characters
function generateWalletAddress(seed) {
  const random = seededRandom(seed * 7919);
  const hex = "0123456789abcdef";
  let address = "0x";

  for (let i = 0; i < 40; i++) {
    let char = hex[Math.floor(random() * 16)];

    // Mixed upper/lower case, like real checksummed addresses
    if (random() > 0.5) char = char.toUpperCase();

    address += char;
  }

  return address;
}

// Shortens 0x7a3F9c...4B21 style. Change the numbers to show more/less.
function shortenAddress(address, start = 6, end = 4) {
  return `${address.slice(0, start + 2)}…${address.slice(-end)}`;
}

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
    wallet: generateWalletAddress(index + 1),
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

// Automatic scrolling speed in pixels per second. Raise for faster.
const SCROLL_SPEED = 70;

function formatAmount(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}

function TransactionRow({ transaction }) {
  const typeClass = transaction.type.toLowerCase();
  const statusClass = transaction.status.toLowerCase();

  return (
    <article className="transaction-row">
      <div className="transaction-user">
        <div className="transaction-avatar" aria-hidden="true">
          {transaction.wallet.slice(2, 4).toUpperCase()}
        </div>

        <div className="transaction-user-details">
          <span
            className="transaction-name"
            title={transaction.wallet}
            style={{ fontFamily: "monospace", letterSpacing: "0.02em" }}
          >
            {shortenAddress(transaction.wallet)}
          </span>

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
  const listRef = useRef(null);

  // Pause toggled by the button
  const [paused, setPaused] = useState(false);

  // Temporary pause while the user hovers or touches the list
  const [interacting, setInteracting] = useState(false);

  // When reduced motion is on, skip the animation and allow manual scrolling
  const [reducedMotion, setReducedMotion] = useState(false);

  const pausedRef = useRef(false);
  const resumeTimeoutRef = useRef(null);

  const isPaused = paused || interacting;

  useEffect(() => {
    pausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    const list = listRef.current;

    if (!list) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (motionQuery.matches) {
      setReducedMotion(true);
      return;
    }

    let animationFrame;
    let previousTime = 0;
    let position = 0;

    const animate = (time) => {
      if (previousTime === 0) {
        previousTime = time;
      }

      const elapsed = Math.min((time - previousTime) / 1000, 0.05);

      previousTime = time;

      if (!pausedRef.current) {
        const halfwayPoint = list.scrollHeight / 2;

        position += SCROLL_SPEED * elapsed;

        // Loop through the duplicated list seamlessly.
        if (halfwayPoint > 0 && position >= halfwayPoint) {
          position -= halfwayPoint;
        }

        // Transform allows sub-pixel, GPU-smooth movement on phones
        list.style.transform = `translate3d(0, ${-position}px, 0)`;
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

    resumeTimeoutRef.current = setTimeout(() => {
      setInteracting(false);
    }, 1000);
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
            <span>WALLET</span>
            <span>TYPE</span>
            <span>AMOUNT</span>
            <span>STATUS</span>
          </div>

          <div
            className="transaction-scroll-window"
            role="region"
            aria-label="Sample transaction entries"
            tabIndex={0}
            style={{ overflowY: reducedMotion ? "auto" : "hidden" }}
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
            <div
              ref={listRef}
              className="transaction-scroll-list"
              style={{ willChange: "transform" }}
            >
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
          </div>
        </div>
      </div>
    </section>
  );
}