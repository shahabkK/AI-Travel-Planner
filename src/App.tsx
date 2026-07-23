import React, { useState, useEffect } from "react";
import { User, TripPlan } from "./types";
import {
  getUser,
  saveUser,
  getSavedTrips,
  saveTripPlan,
  deleteTripPlan,
  toggleFavoriteTrip,
  getDarkMode,
  saveDarkMode,
  SAMPLE_TRIPS,
} from "./lib/storage";
import { Navbar } from "./components/Navbar";
import { AuthModal } from "./components/AuthModal";
import { ProfileModal } from "./components/ProfileModal";
import { AIAssistantModal } from "./components/AIAssistantModal";
import { DashboardView } from "./components/DashboardView";
import { CreateTripForm } from "./components/CreateTripForm";
import { SavedTripsView } from "./components/SavedTripsView";
import { CompareDestinationsView } from "./components/CompareDestinationsView";
import { TripDetailsView } from "./components/TripDetailsView";

export default function App() {
  const [user, setUser] = useState<User>(() => getUser());
  const [darkMode, setDarkMode] = useState<boolean>(() => getDarkMode());
  const [savedTrips, setSavedTrips] = useState<TripPlan[]>(() => {
    const list = getSavedTrips();
    if (list.length === 0) {
      return SAMPLE_TRIPS;
    }
    return list;
  });

  const [activeView, setActiveView] = useState<string>("dashboard");
  const [selectedTrip, setSelectedTrip] = useState<TripPlan | null>(null);
  const [prefilledDestination, setPrefilledDestination] = useState<string>("");

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  // Apply dark mode class on mount and change
  useEffect(() => {
    saveDarkMode(darkMode);
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Auth handlers
  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    saveUser(loggedInUser);
  };

  const handleUpdateProfile = (updatedUser: User) => {
    setUser(updatedUser);
    saveUser(updatedUser);
  };

  const handleLogout = () => {
    const guestUser: User = {
      uid: `usr_guest_${Date.now()}`,
      name: "Traveler",
      email: "guest@tripgenius.ai",
      createdAt: new Date().toISOString(),
    };
    setUser(guestUser);
    saveUser(guestUser);
  };

  // Trip operations
  const handleTripGenerated = (newTrip: TripPlan) => {
    saveTripPlan(newTrip);
    setSavedTrips(getSavedTrips());
    setSelectedTrip(newTrip);
    setActiveView("details");
  };

  const handleToggleFavorite = (tripId: string) => {
    toggleFavoriteTrip(tripId);
    setSavedTrips(getSavedTrips());
    if (selectedTrip && selectedTrip.id === tripId) {
      setSelectedTrip({ ...selectedTrip, isFavorite: !selectedTrip.isFavorite });
    }
  };

  const handleDeleteTrip = (tripId: string) => {
    deleteTripPlan(tripId);
    setSavedTrips(getSavedTrips());
    if (selectedTrip && selectedTrip.id === tripId) {
      setSelectedTrip(null);
      setActiveView("saved");
    }
  };

  const handleDuplicateTrip = (trip: TripPlan) => {
    const copy: TripPlan = {
      ...trip,
      id: `trip_copy_${Date.now()}`,
      title: `${trip.title} (Copy)`,
      createdAt: new Date().toISOString(),
    };
    saveTripPlan(copy);
    setSavedTrips(getSavedTrips());
  };

  const handleCreateNewTrip = (destination?: string) => {
    setPrefilledDestination(destination || "");
    setActiveView("create");
  };

  const handleSelectTrip = (trip: TripPlan) => {
    setSelectedTrip(trip);
    setActiveView("details");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Navigation Header */}
      <Navbar
        currentTab={activeView}
        setCurrentTab={(tab) => setActiveView(tab)}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenAIChat={() => setIsAIChatOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-16">
        {activeView === "dashboard" && (
          <DashboardView
            user={user}
            savedTrips={savedTrips}
            onSelectTrip={handleSelectTrip}
            onCreateNewTrip={handleCreateNewTrip}
            onOpenAIChat={() => setIsAIChatOpen(true)}
          />
        )}

        {activeView === "create" && (
          <CreateTripForm
            initialDestination={prefilledDestination}
            onTripGenerated={handleTripGenerated}
          />
        )}

        {activeView === "saved" && (
          <SavedTripsView
            savedTrips={savedTrips}
            onSelectTrip={handleSelectTrip}
            onToggleFavorite={handleToggleFavorite}
            onDeleteTrip={handleDeleteTrip}
            onDuplicateTrip={handleDuplicateTrip}
            onCreateNewTrip={() => handleCreateNewTrip()}
          />
        )}

        {activeView === "compare" && <CompareDestinationsView />}

        {activeView === "details" && selectedTrip && (
          <TripDetailsView
            trip={selectedTrip}
            onToggleFavorite={handleToggleFavorite}
            onOpenAIChat={() => setIsAIChatOpen(true)}
            onBackToDashboard={() => setActiveView("dashboard")}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 px-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-indigo-600 dark:text-emerald-400">TripGenius AI</span>
            <span>• Smart AI Travel Planner & Itinerary Engine</span>
          </div>
          <p>© {new Date().getFullYear()} TripGenius AI. Powered by Google Gemini AI SDK.</p>
        </div>
      </footer>

      {/* Global Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        onUpdateUser={handleUpdateProfile}
        onLogout={handleLogout}
        savedTripsCount={savedTrips.length}
      />

      <AIAssistantModal
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        activeTrip={activeView === "details" ? selectedTrip : null}
      />
    </div>
  );
}
