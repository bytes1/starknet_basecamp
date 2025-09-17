"use client";
import { ConnectedAddress } from "~~/components/ConnectedAddress";
import { ControlsPanel } from "~~/components/ControlsPanel";
import { EventsTimeline } from "~~/components/EventsTimeline";
import { useScaffoldReadContract } from "~~/hooks/scaffold-stark/useScaffoldReadContract";
import { useAccount } from "~~/hooks/useAccount";

const Home = () => {
  // 1. Call ALL hooks at the top level, in the same order, every time.
  const { address } = useAccount();

  const {
    data: counterValue,
    isLoading,
    error,
    refetch,
  } = useScaffoldReadContract({
    contractName: "CounterContract",
    functionName: "get_counter",
  });

  const { data: ownerAddress } = useScaffoldReadContract({
    contractName: "CounterContract",
    functionName: "owner",
  });

  // 2. Perform conditional rendering checks AFTER all hooks have been called.
  // This is the correct and safe pattern.
  if (!address) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden flex items-center justify-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
        </div>

        {/* Connect Wallet Prompt */}
        <div className="relative z-10 text-center p-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl max-w-md">
          <h1 className="text-4xl font-bold text-white mb-4">
            🚀 Welcome!
          </h1>
          <p className="text-white/80 mb-8">
            Please connect your wallet to interact with the dApp.
          </p>
          <div className="inline-block">
            <ConnectedAddress />
          </div>
        </div>
      </div>
    );
  }

  // The rest of the component logic for a connected user.
  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900 flex items-center justify-center">
        <div className="bg-red-100/10 backdrop-blur-lg border border-red-300/20 rounded-2xl p-8 text-center shadow-2xl">
          <div className="text-red-300 text-6xl mb-4">⚠️</div>
          <div className="text-red-100 text-xl font-semibold">Failed to load counter</div>
          <div className="text-red-200/80 text-sm mt-2">Please check your connection and try again</div>
        </div>
      </div>
    );

  if (isLoading || counterValue === undefined)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-12 text-center shadow-2xl">
          <div className="relative">
            <div className="w-16 h-16 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-blue-300/30"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-400 animate-spin"></div>
            </div>
            <div className="text-white text-xl font-semibold animate-pulse">Loading...</div>
            <div className="text-white/70 text-sm mt-2">Connecting to Starknet</div>
          </div>
        </div>
      </div>
    );

  const currentValue = Number(counterValue);

  const normalizeAddress = (addr: any): string => {
    if (!addr) return "";

    if (typeof addr === "bigint") {
      let hex = addr.toString(16).toLowerCase();
      return hex.padStart(64, "0");
    }

    const addrStr = String(addr);
    let normalized = addrStr.toLowerCase().replace(/^0x/, "");
    return normalized.padStart(64, "0");
  };

  const normalizedUserAddress = normalizeAddress(address);
  const normalizedOwnerAddress = normalizeAddress(ownerAddress);

  const isOwner =
    address && ownerAddress && normalizedUserAddress === normalizedOwnerAddress;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse delay-2000"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex items-center flex-col grow pt-10 px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="relative inline-block">
            <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
              Starknet
            </h1>
            <div className="text-2xl md:text-3xl font-light text-white/80 mt-2 tracking-widest">
              BASECAMP
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25 animate-pulse"></div>
          </div>

          {/* Connected Address Card */}
          <div className="mt-8 inline-block">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:bg-white/15">
              <ConnectedAddress />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="w-full max-w-6xl mx-auto space-y-8">
          {/* Counter Controls Section */}
          <div className="flex justify-center">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 hover:bg-gradient-to-br hover:from-white/15 hover:to-white/10">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-white mb-2">Counter Dashboard</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-auto"></div>
              </div>

              <ControlsPanel
                counterValue={currentValue}
                onUpdate={refetch}
                currentAddress={address}
                ownerAddress={ownerAddress}
              />

              {/* Owner Badge */}
              {isOwner && (
                <div className="mt-6 flex justify-center">
                  <div className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-sm border border-yellow-400/30 rounded-full px-6 py-2 flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    <span className="text-yellow-100 font-semibold text-sm">CONTRACT OWNER</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Counter Event History Section */}
          <div className="flex justify-center">
            <div className="w-full max-w-4xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-white mb-2">Event History</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-blue-400 rounded-full mx-auto"></div>
                <p className="text-white/70 text-sm mt-3">Real-time blockchain events</p>
              </div>

              <EventsTimeline />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 mb-8 text-center">
          <div className="text-white/50 text-sm">
            Powered by{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-semibold">
              Starknet
            </span>
          </div>
        </div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px] pointer-events-none"></div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>

      <style jsx>{`
        .bg-grid-white\\[0\\.02\\] {
          background-image: linear-gradient(white 0.02em, transparent 0.02em),
            linear-gradient(90deg, white 0.02em, transparent 0.02em);
        }
      `}</style>
    </div>
  );
};

export default Home;