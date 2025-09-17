"use client";

import { useScaffoldEventHistory } from "~~/hooks/scaffold-stark/useScaffoldEventHistory";
import { useDeployedContractInfo } from "~~/hooks/scaffold-stark/useDeployedContractInfo";

export const EventsTimeline = () => {
  const { data: contractInfo } = useDeployedContractInfo("CounterContract");

  const {
    data: events,
    isLoading,
    error,
  } = useScaffoldEventHistory({
    contractName: "CounterContract",
    eventName: "CounterChanged",
    fromBlock: 0n,
    watch: true,
    enabled: true,
  });

  const {
    data: ownableEvents,
    isLoading: ownableLoading,
    error: ownableError,
  } = useScaffoldEventHistory({
    contractName: "CounterContract",
    eventName: "OwnershipTransferred",
    fromBlock: 0n,
    watch: true,
    enabled: true,
  });
  if (events?.length !== undefined && events.length > 0) {
  }
  if (ownableEvents?.length !== undefined && ownableEvents.length > 0) {
  }
  if (error) {
    console.error("CounterChanged event loading error:", error);
  }
  if (ownableError) {
    console.error("OwnershipTransferred event loading error:", ownableError);
  }

  const formatReason = (reason: any): string => {
    if (typeof reason === "object" && reason !== null) {
      if (reason.variant && typeof reason.variant === "object") {
        const variantKeys = Object.keys(reason.variant);
        for (const key of variantKeys) {
          if (reason.variant[key] !== undefined) {
            return key.toUpperCase();
          }
        }

        if (variantKeys.length > 0) {
          return variantKeys[0].toUpperCase();
        }
      }
      const keys = Object.keys(reason);
      if (keys.length > 0) {
        const key = keys[0];

        if (key === "Increased") return "INCREASED";
        if (key === "Decreased") return "DECREASED";
        if (key === "Reset") return "RESET";
        if (key === "Set") return "SET";

        // check case-insensitivity
        const lowerKey = key.toLowerCase();
        if (lowerKey === "increased") return "INCREASED";
        if (lowerKey === "decreased") return "DECREASED";
        if (lowerKey === "reset") return "RESET";
        if (lowerKey === "set") return "SET";

        return String(key).toUpperCase();
      }

      if (reason.toString && typeof reason.toString === "function") {
        const str = reason.toString();
        if (str !== "[object Object]") {
          return str.toUpperCase();
        }
      }
    }

    if (typeof reason === "string") {
      return reason.toUpperCase();
    }

    return "UNKNOWN";
  };

  const formatAddress = (address: any): string => {
    if (!address) return "Unknown";

    if (typeof address === "bigint") {
      return "0x" + address.toString(16);
    }

    let addr = String(address);

    if (addr.startsWith("0x")) {
      return addr;
    }

    try {
      const num = BigInt(addr);
      return "0x" + num.toString(16);
    } catch {
      return addr;
    }
  };

  const safeStringify = (value: any): string => {
    try {
      if (typeof value === "bigint") {
        return `BigInt(${value.toString()})`;
      }
      if (typeof value === "object" && value !== null) {
        const obj: any = {};
        for (const [key, val] of Object.entries(value)) {
          if (typeof val === "bigint") {
            obj[key] = `BigInt(${val.toString()})`;
          } else {
            obj[key] = val;
          }
        }
        return JSON.stringify(obj);
      }
      return JSON.stringify(value);
    } catch (e) {
      return `Error: ${e}`;
    }
  };

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return "N/A";

    if (typeof value === "bigint") {
      return value.toString();
    }

    if (typeof value === "string" || typeof value === "number") {
      return String(value);
    }

    if (typeof value === "object") {
      if (value.value !== undefined) {
        return typeof value.value === "bigint"
          ? value.value.toString()
          : String(value.value);
      }
      if (value.low !== undefined) {
        return typeof value.low === "bigint"
          ? value.low.toString()
          : String(value.low);
      }
      if (value.high !== undefined && value.low !== undefined) {
        const low =
          typeof value.low === "bigint"
            ? value.low.toString()
            : String(value.low);
        return low;
      }
      if (value.words !== undefined && Array.isArray(value.words)) {
        return String(value.words[0] || 0);
      }

      if (value.inner !== undefined) {
        return typeof value.inner === "bigint"
          ? value.inner.toString()
          : String(value.inner);
      }
      if (value.val !== undefined) {
        return typeof value.val === "bigint"
          ? value.val.toString()
          : String(value.val);
      }
      if (value._value !== undefined) {
        return typeof value._value === "bigint"
          ? value._value.toString()
          : String(value._value);
      }

      if (value._isBigNumber) {
        return value.toString();
      }

      if (value.toString && typeof value.toString === "function") {
        const str = value.toString();
        if (str !== "[object Object]") return str;
      }

      if (value.valueOf && typeof value.valueOf === "function") {
        const val = value.valueOf();
        if (
          val !== value &&
          (typeof val === "string" ||
            typeof val === "number" ||
            typeof val === "bigint")
        ) {
          return typeof val === "bigint" ? val.toString() : String(val);
        }
      }

      const keys = Object.keys(value);
      if (keys.length > 0) {
        return `{${keys.join(", ")}}`;
      }
      return "Empty Object";
    }

    return String(value);
  };

  // Get reason styling
  const getReasonStyling = (reason: string) => {
    const reasonStr = String(reason).toLowerCase();
    switch (reasonStr) {
      case "increased":
        return {
          color: "from-emerald-400/25 to-green-500/25",
          border: "border-emerald-300/40",
          text: "text-emerald-300",
          icon: "📈",
          badge: "bg-emerald-500/20 text-emerald-200 border-emerald-400/30"
        };
      case "decreased":
        return {
          color: "from-rose-400/25 to-red-500/25",
          border: "border-rose-300/40",
          text: "text-rose-300",
          icon: "📉",
          badge: "bg-rose-500/20 text-rose-200 border-rose-400/30"
        };
      case "reset":
        return {
          color: "from-amber-400/25 to-orange-500/25",
          border: "border-amber-300/40",
          text: "text-amber-300",
          icon: "🔄",
          badge: "bg-amber-500/20 text-amber-200 border-amber-400/30"
        };
      case "set":
        return {
          color: "from-blue-400/25 to-indigo-500/25",
          border: "border-blue-300/40",
          text: "text-blue-300",
          icon: "🎯",
          badge: "bg-blue-500/20 text-blue-200 border-blue-400/30"
        };
      default:
        return {
          color: "from-slate-400/25 to-gray-500/25",
          border: "border-slate-300/40",
          text: "text-slate-300",
          icon: "📊",
          badge: "bg-slate-500/20 text-slate-200 border-slate-400/30"
        };
    }
  };

  const truncateAddress = (addr: string): string => {
    if (!addr || addr.length < 10) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-rose-500/10 rounded-3xl blur-xl"></div>
          <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-red-400/30 rounded-3xl p-8 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-red-300 font-bold text-xl mb-2">Event Loading Failed</h3>
            <p className="text-red-200/80">Unable to retrieve blockchain events at this time</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-xl"></div>
          <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-3xl p-12 text-center">
            <div className="relative mb-6">
              <div className="w-16 h-16 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-blue-300/30"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-400 animate-spin"></div>
              </div>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2 animate-pulse">Loading Event History</h3>
            <p className="text-white/60">Scanning blockchain for counter events...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-3xl blur-xl"></div>
        <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-3xl p-8">
          
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-sm border border-indigo-400/30 rounded-2xl px-8 py-4 mb-4">
              <div className="text-3xl">📜</div>
              <h2 className="text-2xl font-bold text-white">Event Timeline</h2>
            </div>
            
            {/* Stats Bar */}
            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-blue-200 font-medium">
                  {events?.length || 0} Counter Events
                </span>
              </div>
              <div className="w-px h-4 bg-white/20"></div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-purple-200 font-medium">
                  {ownableEvents?.length || 0} Ownership Events
                </span>
              </div>
            </div>
          </div>

          {/* Empty State */}
          {(!events || events.length === 0) && (!ownableEvents || ownableEvents.length === 0) ? (
            <div className="text-center py-16">
              <div className="text-8xl mb-6 opacity-50">
                {isLoading ? '⏳' : '🔍'}
              </div>
              <h3 className="text-white font-semibold text-xl mb-3">
                {isLoading ? 'Loading Events...' : 'No Events Detected'}
              </h3>
              <p className="text-white/60 max-w-md mx-auto leading-relaxed">
                {isLoading 
                  ? 'Scanning blockchain for events...' 
                  : 'Events should appear here if they exist on the blockchain. Check the debug info below.'}
              </p>
              
              {!isLoading && (
                <>
                  <div className="mt-8 inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                    <span className="text-white/80 text-sm">No events found - Check configuration</span>
                  </div>
                  
                  <div className="mt-6 text-sm text-white/50">
                    <p>Possible issues:</p>
                    <ul className="mt-2 space-y-1">
                      <li>• Event name mismatch ("CounterChanged" vs actual event name)</li>
                      <li>• Contract deployment issues</li>
                      <li>• Network connection problems</li>
                      <li>• Event signature differences</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              
              {/* Counter Change Events */}
              {events && events.length > 0 && (
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 backdrop-blur-sm border border-blue-400/30 rounded-xl px-4 py-2">
                      <div className="text-xl">🎯</div>
                      <span className="text-blue-200 font-semibold">Counter Changes</span>
                      <div className="bg-blue-400/30 text-blue-100 text-xs font-bold px-2 py-1 rounded-full">
                        {events.length}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                    {events.slice(0, 25).map((event, index) => {
                      const args = event.args;
                      const reason = formatReason(args?.reason);
                      const styling = getReasonStyling(reason);
                      
                      return (
                        <div
                          key={`counter-${index}`}
                          className={`relative group hover:scale-[1.02] transition-all duration-300`}
                        >
                          <div className={`absolute inset-0 bg-gradient-to-r ${styling.color} rounded-2xl blur opacity-50 group-hover:opacity-75 transition-all duration-300`}></div>
                          <div className={`relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border ${styling.border} rounded-2xl p-6`}>
                            
                            {/* Event Header */}
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <div className="text-2xl">{styling.icon}</div>
                                <div>
                                  <div className={`font-bold text-lg ${styling.text}`}>
                                    {String(reason).toUpperCase()}
                                  </div>
                                  <div className="text-white/50 text-xs">
                                    Block #{event.blockNumber?.toString()}
                                  </div>
                                </div>
                              </div>
                              <div className={`${styling.badge} border backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium`}>
                                CONFIRMED
                              </div>
                            </div>

                            {/* Value Change Display */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-600/30 rounded-xl p-4">
                                <div className="text-slate-400 text-xs font-semibold mb-2 uppercase tracking-wider">
                                  Previous Value
                                </div>
                                <div className="font-mono font-bold text-2xl text-slate-200">
                                  {(() => {
                                    const val = args?.old_value;
                                    if (typeof val === "bigint") return val.toString();
                                    if (val && typeof val === "object" && val.toString) return val.toString();
                                    if (val !== undefined && val !== null) return String(val);
                                    return "N/A";
                                  })()}
                                </div>
                              </div>
                              <div className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 backdrop-blur-sm border border-emerald-400/30 rounded-xl p-4">
                                <div className="text-emerald-200 text-xs font-semibold mb-2 uppercase tracking-wider">
                                  Current Value
                                </div>
                                <div className="font-mono font-bold text-3xl text-emerald-100">
                                  {(() => {
                                    const val = args?.new_value;
                                    if (typeof val === "bigint") return val.toString();
                                    if (val && typeof val === "object" && val.toString) return val.toString();
                                    if (val !== undefined && val !== null) return String(val);
                                    return "N/A";
                                  })()}
                                </div>
                              </div>
                            </div>

                            {/* Transaction Details */}
                            <div className="space-y-3">
                              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                                <div className="text-white/60 text-xs font-semibold mb-2 uppercase tracking-wider">
                                  Initiated By
                                </div>
                                <div className="font-mono text-sm text-white/90">
                                  {truncateAddress(formatAddress(args?.caller))}
                                </div>
                              </div>
                              
                              {event.transactionHash && (
                                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                                  <div className="text-white/60 text-xs font-semibold mb-2 uppercase tracking-wider">
                                    Transaction Hash
                                  </div>
                                  <div className="font-mono text-sm text-white/90">
                                    {truncateAddress(formatAddress(event.transactionHash))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Ownership Transfer Events */}
              {ownableEvents && ownableEvents.length > 0 && (
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-400/30 rounded-xl px-4 py-2">
                      <div className="text-xl">👑</div>
                      <span className="text-purple-200 font-semibold">Ownership Changes</span>
                      <div className="bg-purple-400/30 text-purple-100 text-xs font-bold px-2 py-1 rounded-full">
                        {ownableEvents.length}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {ownableEvents.slice(0, 10).map((event, index) => (
                      <div
                        key={`ownable-${index}`}
                        className="relative group hover:scale-[1.02] transition-all duration-300"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl blur opacity-50 group-hover:opacity-75 transition-all duration-300"></div>
                        <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-purple-400/30 rounded-2xl p-6">
                          
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="text-2xl">👑</div>
                              <div>
                                <div className="font-bold text-lg text-purple-300">
                                  OWNERSHIP TRANSFERRED
                                </div>
                                <div className="text-white/50 text-xs">
                                  Block #{event.blockNumber?.toString()}
                                </div>
                              </div>
                            </div>
                            <div className="bg-purple-500/20 text-purple-200 border border-purple-400/30 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium">
                              AUTHORITY CHANGE
                            </div>
                          </div>

                          <div className="space-y-3">
                            {event.args?.previous_owner && (
                              <div className="bg-red-500/10 backdrop-blur-sm border border-red-400/20 rounded-xl p-4">
                                <div className="text-red-300 text-xs font-semibold mb-2 uppercase tracking-wider">
                                  Previous Owner
                                </div>
                                <div className="font-mono text-sm text-red-200">
                                  {truncateAddress(formatAddress(event.args.previous_owner))}
                                </div>
                              </div>
                            )}
                            {event.args?.new_owner && (
                              <div className="bg-green-500/10 backdrop-blur-sm border border-green-400/20 rounded-xl p-4">
                                <div className="text-green-300 text-xs font-semibold mb-2 uppercase tracking-wider">
                                  New Owner
                                </div>
                                <div className="font-mono text-sm text-green-200">
                                  {truncateAddress(formatAddress(event.args.new_owner))}
                                </div>
                              </div>
                            )}
                            {event.transactionHash && (
                              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                                <div className="text-white/60 text-xs font-semibold mb-2 uppercase tracking-wider">
                                  Transaction Hash
                                </div>
                                <div className="font-mono text-sm text-white/90">
                                  {truncateAddress(formatAddress(event.transactionHash))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
};