import Link from "next/link";

export default function Home() {
  return (
    <div
      className="h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/demarrage.jpg')" }}
    >
      <div className="h-full flex flex-col justify-between items-center bg-black/50 text-white px-4">
        
        {/* 🎾 Titre - Responsive */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-8 text-orange-300 text-center">
          Mitch Tennis Club
        </h1>

        {/* 📱 Bouton centré et adaptatif */}
        <div className="mb-16">
          <Link href="/login">
            <button className="bg-orange-300 text-white px-6 py-3 text-lg md:text-xl rounded-lg shadow-lg hover:bg-orange-400 transition-transform transform hover:scale-105">
              Connect
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
