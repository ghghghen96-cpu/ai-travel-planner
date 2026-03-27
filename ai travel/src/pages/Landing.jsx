import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Play, ArrowRight, MapPin, Wind, Sun, LogOut, User } from 'lucide-react';
import LoginModal from '../components/LoginModal';
import { auth, logout } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const Landing = () => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const slides = [
        {
            image: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2070&auto=format&fit=crop", // Grand Canyon / Nature
            title: "Discover Your Wild",
            subtitle: "The world is vast. Don't keep it waiting.",
            location: "Grand Canyon, Arizona"
        },
        {
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop", // Mountains
            title: "Breathe In The Altitude",
            subtitle: "Find peace above the clouds.",
            location: "Swiss Alps, Switzerland"
        },
        {
            image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop", // Beach
            title: "Ocean Breeze & Serenity",
            subtitle: "Let the waves wash away your worries.",
            location: "Maldives"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen font-serif text-white selection:bg-white/30">
            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

            {/* Navigation - Enhanced Visibility */}
            <nav className="fixed top-0 w-full z-50 px-10 py-8 flex justify-between items-center transition-all duration-300">
                <div className="flex items-center gap-4">
                    <Compass size={32} className="text-white drop-shadow-md" />
                    <span className="text-2xl font-medium tracking-widest uppercase drop-shadow-md">WanderLust</span>
                </div>
                <div className="flex gap-8 items-center">
                    {user ? (
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                                {user.photoURL ? (
                                    <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border border-white/40" />
                                ) : (
                                    <User size={20} className="text-white" />
                                )}
                                <span className="text-sm font-bold tracking-wider uppercase">{user.displayName || 'Traveler'}</span>
                            </div>
                            <button
                                onClick={() => logout()}
                                className="p-2 text-white/60 hover:text-white transition-colors"
                                title="Logout"
                            >
                                <LogOut size={22} />
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => setIsLoginOpen(true)} className="text-base font-medium tracking-widest uppercase hover:underline underline-offset-8 decoration-2 drop-shadow-md">
                            Sign In
                        </button>
                    )}
                    <Link to="/survey">
                        <button className="px-8 py-3 bg-white/20 backdrop-blur-md border border-white/40 text-base font-medium tracking-widest uppercase rounded-full hover:bg-white hover:text-black transition-all duration-500">
                            Start Journey
                        </button>
                    </Link>
                </div>
            </nav>

            {/* Cinematic Hero Slider - Larger Typography */}
            <section className="relative h-screen w-full overflow-hidden">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                    >
                        {/* Image with Ken Burns Effect */}
                        <div className="absolute inset-0 bg-black/20 z-10" />
                        <img
                            src={slide.image}
                            alt={slide.title}
                            className={`w-full h-full object-cover transform transition-transform duration-[8000ms] ease-out ${index === currentSlide ? 'scale-110' : 'scale-100'}`}
                        />

                        {/* Hero Content */}
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
                            <span className="text-base md:text-lg font-heading font-bold tracking-[0.4em] uppercase mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
                                <MapPin size={16} className="inline mr-3 mb-1" /> {slide.location}
                            </span>
                            <h1 className="text-7xl md:text-[140px] font-serif italic mb-8 leading-tight drop-shadow-2xl opacity-0 animate-fade-in-up" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
                                {slide.title}
                            </h1>
                            <p className="text-xl md:text-3xl font-sans font-light max-w-2xl mb-16 opacity-90 drop-shadow-lg opacity-0 animate-fade-in-up" style={{ animationDelay: '1.2s', animationFillMode: 'forwards' }}>
                                {slide.subtitle}
                            </p>

                            <div className="opacity-0 animate-fade-in-up text-lg" style={{ animationDelay: '1.5s', animationFillMode: 'forwards' }}>
                                <Link to="/survey">
                                    <button className="group relative px-10 py-5 bg-white text-black font-sans text-sm md:text-base font-bold tracking-widest uppercase overflow-hidden rounded-sm transition-all hover:pr-14 shadow-2xl">
                                        <span className="relative z-10">Curate My Trip</span>
                                        <ArrowRight className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Slider Indicators - Larger click area */}
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 flex gap-6">
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            className={`h-[3px] transition-all duration-500 rounded-full cursor-pointer hover:bg-white/80 ${idx === currentSlide ? 'w-16 bg-white' : 'w-8 bg-white/40'}`}
                        />
                    ))}
                </div>
            </section>

            {/* Emotional Storytelling Section - Light & Airy & Legible */}
            <section className="bg-stone-50 text-stone-900 py-40 px-8 md:px-16">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
                    <div>
                        <span className="text-sm font-bold tracking-[0.3em] uppercase text-stone-400 mb-6 block font-heading">Our Philosophy</span>
                        <h2 className="text-5xl md:text-7xl font-serif italic mb-10 leading-tight">
                            "Not just a plan, <br /> but a <span className="text-stone-500">feeling.</span>"
                        </h2>
                        <p className="text-xl md:text-2xl text-stone-600 leading-relaxed font-light mb-10">
                            We believe travel shouldn't be about ticking boxes. It's about the morning mist in a mountain valley, the smell of street food in a bustling market, and the silence of a vast desert.
                        </p>
                        <p className="text-xl md:text-2xl text-stone-600 leading-relaxed font-light">
                            Our AI is designed to understand not just where you want to go, but <em>how you want to feel</em>. Let us handle the logistics so you can focus on the memories.
                        </p>
                    </div>
                    <div className="relative">
                        <div className="aspect-[3/4] rounded-sm overflow-hidden shadow-2xl">
                            <img src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1000" alt="Serene Lake" className="w-full h-full object-cover hover:scale-105 transition-transform duration-[1500ms]" />
                        </div>
                        <div className="absolute -bottom-12 -left-12 bg-white p-10 shadow-2xl max-w-sm hidden md:block border border-gray-50">
                            <p className="font-serif italic text-2xl mb-4 text-gray-800">"The journey is the destination."</p>
                            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-stone-400">
                                <Sun size={16} /> Recommended by WanderLust
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Experiences Grid - Clean & Minimal */}
            <section className="bg-white py-40 px-8 md:px-16">
                <div className="max-w-8xl mx-auto">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl md:text-6xl font-serif mb-6 text-gray-900">Curated Experiences</h2>
                        <div className="w-16 h-[1px] bg-stone-300 mx-auto" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { title: "Hidden Sanctuaries", image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&q=80&w=800", desc: "Secret spots untouched by crowds." },
                            { title: "Culinary Journeys", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800", desc: "Tastes that define a culture." },
                            { title: "Urban Adventures", image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=800", desc: "The pulse of the world's greatest cities." }
                        ].map((item, idx) => (
                            <div key={idx} className="group cursor-pointer">
                                <div className="aspect-[4/5] overflow-hidden mb-8 relative shadow-lg rounded-sm">
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000" />
                                    <div className="absolute bottom-8 left-8 text-white opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 z-20">
                                        <div className="border border-white/50 rounded-full px-5 py-2 text-xs uppercase tracking-widest backdrop-blur-sm">Explore</div>
                                    </div>
                                </div>
                                <h3 className="text-3xl font-serif italic mb-3 group-hover:text-primary transition-colors text-gray-900">{item.title}</h3>
                                <p className="text-lg font-sans text-stone-500 tracking-wide font-light">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer - Minimal */}
            <footer className="bg-stone-900 text-stone-400 py-16 border-t border-stone-800">
                <div className="max-w-7xl mx-auto px-8 md:px-16 flex flex-col md:flex-row justify-between items-center">
                    <div className="font-serif italic text-3xl text-stone-200 mb-6 md:mb-0">WanderLust.</div>
                    <div className="text-sm tracking-widest uppercase opacity-60">
                        &copy; 2026 Crafted with Soul.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
