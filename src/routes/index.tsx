import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: App });

const SpinButton = () => (
	<button
		type="button"
		className="px-8 py-3 bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% hover:bg-purple-600 text-white font-semibold rounded-full transition-colors shadow-lg shadow-purple-500/50"
	>
		Spin Case
	</button>
);

const items = [
	{ id: 1, name: "glove", img: "/images/1.jpeg" },
	{ id: 2, name: "knife", img: "/images/2.jpeg" },
	{ id: 3, name: "gun1", img: "/images/3.jpeg" },
	{ id: 4, name: "gun2", img: "/images/4.jpeg" },
	{ id: 5, name: "gun3", img: "/images/5.jpeg" },
	{ id: 6, name: "gun4", img: "/images/6.jpeg" },
];

const CarouselItems = () => (
  <div className="flex space-x-4 overflow-x-auto py-4">
    {items.map((item) => (
      <div key={item.id} className="flex-shrink-0 w-48 h-48 bg-white rounded-lg shadow-md">
        <img src={item.img} alt={item.name} className="w-full h-full object-fit rounded-lg" />
      </div>
    ))}
  </div>
);

function App() {
	return (
		<div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900">
      <CarouselItems />
      <SpinButton />
		</div>
	);
}
