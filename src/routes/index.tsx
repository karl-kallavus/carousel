import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";

export const Route = createFileRoute("/")({ component: App });

const CAROUSEL_WIDTH = 800;
const ITEM_WIDTH = 192;
const ITEM_GAP = 16;
const TOTAL_ITEM_WIDTH = ITEM_WIDTH + ITEM_GAP;
const SPIN_DURATION = 5000;

const baseItems = [
	{ id: 1, name: "glove", img: "/images/1.jpeg" },
	{ id: 2, name: "knife", img: "/images/2.jpeg" },
	{ id: 3, name: "gun1", img: "/images/3.jpeg" },
	{ id: 4, name: "gun2", img: "/images/4.jpeg" },
	{ id: 5, name: "gun3", img: "/images/5.jpeg" },
	{ id: 6, name: "gun4", img: "/images/6.jpeg" },
];

const items = Array.from({ length: 65 }, (_, i) => ({
	...baseItems[i % baseItems.length],
	id: i + 1,
	name: `${baseItems[i % baseItems.length].name}-${i + 1}`,
}));

const CarouselItems = ({
	carouselRef,
	translateX,
}: {
	carouselRef: React.RefObject<HTMLDivElement | null>;
	translateX: number;
}) => {
	return (
		<div
			className="relative overflow-x-hidden overflow-y-visible py-16 px-4 w-full mx-auto"
			style={{ maxWidth: `${CAROUSEL_WIDTH}px` }}
		>
			{/* Left fade */}
			<div className="absolute left-0 top-0 bottom-0 w-24 bg-linear-to-r from-slate-900 to-transparent z-10 pointer-events-none" />
			{/* Right fade */}
			<div className="absolute right-0 top-0 bottom-0 w-24 bg-linear-to-l from-slate-900 to-transparent z-10 pointer-events-none" />

			<div
				ref={carouselRef}
				className="flex gap-4"
				style={{
					transform: `translate3d(-${translateX}px, 0, 0)`,
					willChange: "transform",
				}}
			>
				{items.map((item) => (
					<div key={item.id} className="shrink-0 w-48 h-48">
						<img
							src={item.img}
							alt={item.name}
							className="w-full h-full object-cover rounded-lg border border-gray-200"
							loading="lazy"
						/>
					</div>
				))}
			</div>
		</div>
	);
};

const SpinButton = ({
	onSpin,
	isSpinning,
}: {
	onSpin: () => void;
	isSpinning: boolean;
}) => (
	<button
		type="button"
		onClick={onSpin}
		disabled={isSpinning}
		className="px-8 py-3 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-full transition-colors shadow-lg shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
	>
		{isSpinning ? "Spinning..." : "Spin Case"}
	</button>
);

const WinnerCard = ({
	wonItem,
	onClose,
}: {
	wonItem: (typeof baseItems)[0];
	onClose: () => void;
}) => {
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
				<p className="text-2xl font-bold text-purple-600 capitalize">
					{wonItem.name}
				</p>
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
	const [wonItem, setWonItem] = useState<(typeof baseItems)[0] | null>(null);

	const handleSpin = () => {
		if (isSpinning) return;

		setIsSpinning(true);
		setShowWinner(false);

		const winningIndex = 24 + Math.floor(Math.random() * baseItems.length);
		const targetScroll =
			winningIndex * TOTAL_ITEM_WIDTH - CAROUSEL_WIDTH / 2 + ITEM_WIDTH / 2;
		const startTime = Date.now();

		const animate = () => {
			const progress = Math.min((Date.now() - startTime) / SPIN_DURATION, 1);
			const easeOut = 1 - (1 - progress) ** 3;

			setTranslateX(targetScroll * easeOut);

			if (progress < 1) {
				requestAnimationFrame(animate);
			} else {
				setIsSpinning(false);
				setWonItem(items[winningIndex]);
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
					onKeyDown={(e) => e.key === "Escape" && setShowWinner(false)}
				>
					<div className="animate-[scaleIn_0.5s_ease-out]">
						<WinnerCard
							wonItem={wonItem}
							onClose={() => setShowWinner(false)}
						/>
					</div>
				</div>
			)}
		</div>
	);
}
