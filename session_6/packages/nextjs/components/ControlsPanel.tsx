"use client";

import { useState, useMemo, ChangeEvent } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-stark/useScaffoldWriteContract";
import { useScaffoldMultiWriteContract } from "~~/hooks/scaffold-stark/useScaffoldMultiWriteContract";
import { useDeployedContractInfo } from "~~/hooks/scaffold-stark/useDeployedContractInfo";

// --- Type Definitions ---
interface CounterControlsProps {
  counterValue: number;
  onUpdate: () => void;
  currentAddress?: string;
  ownerAddress?: string | bigint;
}

type ActionButtonVariant = 'green' | 'red' | 'yellow';

interface ActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  title: string;
  variant: ActionButtonVariant;
  children: React.ReactNode;
}

// --- Helper Functions ---
const normalizeAddress = (addr: string | bigint | undefined): string => {
  if (!addr) return "";
  const hex = typeof addr === 'bigint' ? addr.toString(16) : String(addr).replace(/^0x/, '');
  return hex.toLowerCase().padStart(64, "0");
};

// --- Child Components ---

const CounterDisplay = ({ value }: { value: number }) => (
  <div className="relative mb-8 text-center">
    <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-400/30 rounded-full px-6 py-2 mb-4">
      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
      <span className="text-blue-100 font-semibold text-sm tracking-wider">LIVE COUNTER</span>
    </div>
    <div className="relative">
      <div className="text-8xl md:text-9xl font-black bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent animate-pulse mb-2 filter drop-shadow-2xl">
        {String(value)}
      </div>
      <div className="absolute inset-0 text-8xl md:text-9xl font-black bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent blur-sm opacity-50 -z-10">
        {String(value)}
      </div>
    </div>
  </div>
);

const ActionButton = ({ onClick, disabled, title, variant, children }: ActionButtonProps) => {
  const variantStyles = {
    green: "from-green-500/20 to-emerald-500/20 border-green-400/30 hover:shadow-green-500/25 text-green-300 group-hover:text-green-200",
    red: "from-red-500/20 to-rose-500/20 border-red-400/30 hover:shadow-red-500/25 text-red-300 group-hover:text-red-200",
    yellow: "from-yellow-500/20 to-orange-500/20 border-yellow-400/30 hover:shadow-yellow-500/25 text-yellow-300 group-hover:text-yellow-200",
  };

  const baseClasses = "group relative w-20 h-20 backdrop-blur-sm border rounded-2xl transition-all duration-300";
  const enabledClasses = "hover:scale-110 hover:shadow-2xl";
  const disabledClasses = "bg-gray-500/10 border-gray-500/20 cursor-not-allowed opacity-50";
  const textDisabledClasses = "text-gray-500";

  return (
    <button
      className={`${baseClasses} ${disabled ? disabledClasses : `${variantStyles[variant]} ${enabledClasses}`}`}
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {!disabled && <div className={`absolute inset-0 bg-gradient-to-br ${variantStyles[variant]} rounded-2xl blur group-hover:blur-md transition-all duration-300 opacity-50`}></div>}
      <span className={`relative text-3xl font-bold transition-colors duration-300 ${disabled ? textDisabledClasses : ''}`}>
        {children}
      </span>
    </button>
  );
};



const AccessBadge = ({ isOwner }: { isOwner: boolean }) => (
  <div className={`relative overflow-hidden rounded-2xl ${isOwner ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30" : "bg-gradient-to-r from-red-500/20 to-rose-500/20 border border-red-400/30"} backdrop-blur-sm`}>
    <div className="flex items-center space-x-3 px-6 py-3">
      <div className={`relative w-3 h-3 rounded-full ${isOwner ? "bg-green-400" : "bg-red-400"}`}>
        <div className={`absolute inset-0 rounded-full ${isOwner ? "bg-green-400" : "bg-red-400"} animate-ping opacity-75`}></div>
      </div>
      <div className="text-center">
        <div className={`text-sm font-bold ${isOwner ? "text-green-200" : "text-red-200"}`}>{isOwner ? "OWNER ACCESS" : "ACCESS DENIED"}</div>
        <div className={`text-xs ${isOwner ? "text-green-300" : "text-red-300"}`}>{isOwner ? "Full Permissions" : "Owner Only"}</div>
      </div>
    </div>
  </div>
);

const OwnerControls = ({ isOwner, inputValue, onInputChange, onSetCounter, isLoading }: {
  isOwner: boolean;
  inputValue: string;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSetCounter: () => void;
  isLoading: boolean;
}) => (
  <div className="relative">
    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-3xl blur-xl"></div>
    <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-3xl p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Advanced Controls</h3>
          <div className="w-16 h-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"></div>
        </div>
        <AccessBadge isOwner={isOwner} />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder={isOwner ? "Enter new value..." : "🔒 Owner access required"}
            className={`w-full h-16 px-6 text-xl font-mono text-center rounded-2xl backdrop-blur-sm border transition-all duration-300 ${
              isOwner
                ? "bg-white/10 border-green-400/30 text-white placeholder-white/50 focus:border-green-400/60 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-green-400/20"
                : "bg-red-500/10 border-red-400/30 text-red-300 placeholder-red-400/70 cursor-not-allowed"
            }`}
            value={inputValue}
            onChange={onInputChange}
            disabled={isLoading || !isOwner}
          />
        </div>
        <button
          className={`relative h-16 px-8 rounded-2xl font-bold text-white transition-all duration-300 ${
            isOwner && inputValue && !isLoading
              ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 hover:scale-105 shadow-lg hover:shadow-2xl hover:shadow-green-500/25"
              : "bg-gray-500/20 border border-gray-500/30 cursor-not-allowed opacity-50"
          }`}
          onClick={onSetCounter}
          disabled={!inputValue || isLoading || !isOwner}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Setting...</span>
            </div>
          ) : (
            "SET VALUE"
          )}
        </button>
      </div>
    </div>
  </div>
);


// --- Main Component ---

export const ControlsPanel = ({ counterValue, onUpdate, currentAddress, ownerAddress }: CounterControlsProps) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { data: counterContract } = useDeployedContractInfo("CounterContract");

  const isOwner = useMemo(() => {
    if (!currentAddress || !ownerAddress) return false;
    return normalizeAddress(currentAddress) === normalizeAddress(ownerAddress);
  }, [currentAddress, ownerAddress]);

  // --- Contract Interactions ---
  const { sendAsync: increaseCounter } = useScaffoldWriteContract({ contractName: "CounterContract", functionName: "increment_counter" });
  const { sendAsync: decreaseCounter } = useScaffoldWriteContract({ contractName: "CounterContract", functionName: "decrease_counter" });
  const { sendAsync: setCounter } = useScaffoldWriteContract({
    contractName: "CounterContract",
    functionName: "set_counter",
    args: [inputValue ? parseInt(inputValue) : 0],
  });
  const { sendAsync: resetCounterMulticall } = useScaffoldMultiWriteContract({
    calls: counterContract ? [
      { contractName: "Strk", functionName: "approve", args: [counterContract.address, 1000000000000000000n] },
      { contractName: "CounterContract", functionName: "reset_counter" },
    ] : [],
  });

  // --- Event Handlers ---
  const handleTransaction = async (tx: () => Promise<any>, updateDelay = 1000) => {
    try {
      setIsLoading(true);
      await tx();
      setTimeout(() => {
        onUpdate();
        setIsLoading(false);
      }, updateDelay);
    } catch (error) {
      console.error("❌ Transaction failed:", error);
      setIsLoading(false);
    }
  };

  const handleSetCounter = () => {
    if (!inputValue || isNaN(parseInt(inputValue)) || parseInt(inputValue) < 0) {
      alert("Please enter a valid non-negative number.");
      return;
    }
    handleTransaction(setCounter).then(() => setInputValue(""));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setInputValue(value);
    }
  };

  return (
    <div className="w-full max-w-4xl space-y-8">
      {/* Main Counter Display and Controls */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-3xl blur-xl"></div>
        <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-3xl p-8">
          <CounterDisplay value={counterValue} />
          <div className="flex items-center justify-center gap-6">
            <ActionButton
              variant="green"
              onClick={() => handleTransaction(increaseCounter)}
              title="Increase counter"
            >
              +
            </ActionButton>
            <ActionButton
              variant="red"
              onClick={() => handleTransaction(decreaseCounter)}
              disabled={counterValue === 0}
              title={counterValue === 0 ? "Cannot decrease below zero" : "Decrease counter"}
            >
              −
            </ActionButton>
            <ActionButton
              variant="yellow"
              onClick={() => handleTransaction(resetCounterMulticall, 2000)}
              disabled={counterValue === 0}
              title={counterValue === 0 ? "Counter is already zero" : "Reset counter to zero"}
            >
              🔄
            </ActionButton>
          </div>
          
        </div>
      </div>

      {/* Owner-specific Controls */}
      <OwnerControls
        isOwner={isOwner}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        onSetCounter={handleSetCounter}
        isLoading={isLoading}
      />
    </div>
  );
};