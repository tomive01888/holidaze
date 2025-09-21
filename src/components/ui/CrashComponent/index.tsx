import React, { useState } from "react";

const CrashingComponent = () => {
  const [causeError, setCauseError] = useState(false);

  // This will intentionally cause an error when render is triggered
  if (causeError) {
    throw new Error("I am a simulated error! The component crashed.");
  }

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px", textAlign: "center" }}>
      <h2 className="text-3xl">Crashing Component</h2>
      <p className="text-lg">This component will crash when you click the button below.</p>
      <button
        onClick={() => setCauseError(true)}
        className="px-4 py-2 text-lg cursor-pointer bg-red-500 text-white font-bold border-none rounded"
      >
        Crash Now
      </button>
    </div>
  );
};

export default CrashingComponent;
