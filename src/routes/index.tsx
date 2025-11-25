import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";

export const Route = createFileRoute("/")({ component: App });

const CAROUSEL_WIDTH = 800;

const baseItems = [
	{ id: 1, name: "glove", img: "/images/1.jpeg" },
	{ id: 2, name: "knife", img: "/images/2.jpeg" },
	{ id: 3, name: "gun1", img: "/images/3.jpeg" },
	{ id: 4, name: "gun2", img: "/images/4.jpeg" },
	{ id: 5, name: "gun3", img: "/images/5.jpeg" },
	{ id: 6, name: "gun4", img: "/images/6.jpeg" },
];

const items = Array.from({ length: 65 }, (_, i) => {
	const baseItem = baseItems[i % baseItems.length];
	return {
		...baseItem,
		id: i + 1,
		name: `${baseItem.name}-${i + 1}`,
	};
});

interface CarouselItemsProps {
	carouselRef: React.RefObject<HTMLDivElement | null>;
	translateX: number;
}

const CarouselItems = ({ carouselRef, translateX }: CarouselItemsProps) => {
  return (
    <div className="relative overflow-x-hidden overflow-y-visible py-16 px-4 w-full mx-auto" style={{ maxWidth: `${CAROUSEL_WIDTH}px` }}>
      {/* Left fade */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-linear-to-r from-slate-900 to-transparent z-10 pointer-events-none" />
      {/* Right fade */}
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-linear-to-l from-slate-900 to-transparent z-10 pointer-events-none" />

      <div
        ref={carouselRef}
        className="flex gap-4"
        style={{
          transform: `translate3d(-${translateX}px, 0, 0)`,
          transition: 'none',
          willChange: 'transform'
        }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="shrink-0 w-48 h-48"
          >
            <div className="w-full h-full bg-white rounded-lg overflow-hidden border border-gray-200">
              <img
                src={item.img}
                alt={item.name}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface SpinButtonProps {
	onSpin: () => void;
	isSpinning: boolean;
}

const SpinButton = ({ onSpin, isSpinning }: SpinButtonProps) => (
	<button
		type="button"
		onClick={onSpin}
		disabled={isSpinning}
		className="px-8 py-3 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-full transition-colors shadow-lg shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
	>
		{isSpinning ? "Spinning..." : "Spin Case"}
	</button>
);

const ConfettiEffect = () => {
	return (
		<div className="absolute inset-0 pointer-events-none">
			{[...Array(50)].map((_, i) => {
				const uniqueId = `confetti-${Date.now()}-${Math.random()}-${i}`;
				const colors = ['#a855f7', '#6366f1', '#ec4899', '#f59e0b', '#10b981'];
				return (
					<div
						key={uniqueId}
						className="absolute w-2 h-2 rounded-full animate-[confetti_2s_ease-out_forwards]"
						style={{
							left: '50%',
							top: '50%',
							backgroundColor: colors[i % colors.length],
							animationDelay: `${i * 0.02}s`,
							transform: `rotate(${i * 7.2}deg) translateY(-${50 + Math.random() * 100}px) translateX(${Math.random() * 400 - 200}px)`,
							opacity: 0
						}}
					/>
				);
			})}
		</div>
	);
};

interface WinnerCardProps {
	wonItem: typeof baseItems[0];
	onClose: () => void;
}

const WinnerCard = ({ wonItem, onClose }: WinnerCardProps) => {
	return (
		<div className="bg-linear-to-br from-purple-600 to-indigo-600 p-8 rounded-2xl shadow-2xl text-center space-y-6 min-w-[400px]">
			<div className="text-6xl animate-bounce">🎉</div>
			<h2 className="text-4xl font-bold text-white">Congratulations!</h2>
			<p className="text-xl text-purple-100">You won:</p>
			<div className="bg-white p-6 rounded-xl shadow-lg">
				<img
					src={wonItem.img}
					alt={wonItem.name}
					className="w-48 h-48 mx-auto object-cover rounded-lg mb-4"
				/>
				<p className="text-2xl font-bold text-purple-600 capitalize">{wonItem.name}</p>
			</div>
			<button
				type="button"
				onClick={onClose}
				className="px-8 py-3 bg-white text-purple-600 font-semibold rounded-full hover:bg-purple-50 transition-colors"
			>
				Close
			</button>
		</div>
	);
};

function App() {
	const carouselRef = useRef<HTMLDivElement>(null);
	const [isSpinning, setIsSpinning] = useState(false);
	const [translateX, setTranslateX] = useState(0);
	const [showWinner, setShowWinner] = useState(false);
	const [wonItem, setWonItem] = useState<typeof baseItems[0] | null>(null);

	// TODO: This should be handled on the server side for fairness and security
	// Server should return the winning item index to prevent client-side manipulation
	const getWinningItemIndex = () => {
		const winningBaseItemIndex = Math.floor(Math.random() * baseItems.length);
		const offsetFromStart = 24;
		return offsetFromStart + winningBaseItemIndex;
	};

	const handleSpin = () => {
		if (!carouselRef.current || isSpinning) return;

		setIsSpinning(true);
		setShowWinner(false);
		const startTime = Date.now();
		const duration = 5000; // 5 seconds

		const targetWinningIndex = getWinningItemIndex();
		const itemWidth = 208; // 192px + 16px spacing

		// Calculate scroll position to land on the winning item centered in viewport
		const viewportOffset = CAROUSEL_WIDTH / 2 - 96; // Center item in carousel viewport (96 = half of 192px)
		const targetScroll = targetWinningIndex * itemWidth - viewportOffset;
		const maxTranslate = targetScroll;

		const animate = () => {
			const elapsed = Date.now() - startTime;
			const currentProgress = Math.min(elapsed / duration, 1);

			// Easing function for smooth deceleration
			const easeOut = 1 - Math.pow(1 - currentProgress, 3);

			setTranslateX(maxTranslate * easeOut);

			if (currentProgress < 1) {
				requestAnimationFrame(animate);
			} else {
				setIsSpinning(false);
				// Get the won item after animation completes based on final scroll position
				const wonItemData = items[targetWinningIndex];
				setWonItem(wonItemData);
				setTimeout(() => setShowWinner(true), 300);
			}
		};

		requestAnimationFrame(animate);
	};

	return (
		<div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center gap-8 p-8 overflow-x-hidden">
      <CarouselItems carouselRef={carouselRef} translateX={translateX} />
      <SpinButton onSpin={handleSpin} isSpinning={isSpinning} />

      {showWinner && wonItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-[fadeIn_0.3s_ease-in-out]"
          role="dialog"
          aria-modal="true"
          onKeyDown={(e) => e.key === 'Escape' && setShowWinner(false)}
        >
          <div className="relative animate-[scaleIn_0.5s_ease-out]">
            <ConfettiEffect />
            <WinnerCard wonItem={wonItem} onClose={() => setShowWinner(false)} />
          </div>
        </div>
      )}
		</div>
	);
}
