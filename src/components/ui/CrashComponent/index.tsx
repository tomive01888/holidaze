import React, { useState } from "react";

const CrashingComponent = () => {
  const [causeError, setCauseError] = useState(false);

  // This will intentionally cause an error when render is triggered
  if (causeError) {
    throw new Error("I am a simulated error! The component crashed.");
  }

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px", textAlign: "center" }}>
      <h2>Crashing Component</h2>
      <p>This component will crash when you click the button below.</p>
      <button
        onClick={() => setCauseError(true)}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
        backgroundColor: "#ef4444",
          color: "white",
          border: "none",
          borderRadius: "4px",
        }}
      >
        Crash Now
      </button>
    </div>
  );
};

export default CrashingComponent;
