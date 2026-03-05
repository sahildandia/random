import React, { createContext, useState, useContext, useEffect } from 'react';

const EventContext = createContext();

export const useEvents = () => useContext(EventContext);

export const EventProvider = ({ children }) => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('isAdmin') === 'true';
  });

  // Initial Data
  const defaultUpcomingEvents = [
    {
      id: 1,
      title: "STARTIQ",
      date: "24 Feb 2026 | 9:00 AM to 4:00 PM",
      location: "M.Kumaraswamy College of Engineering",
      description: "🚀 STARTIQ is a Startup Pitch Event designed to encourage students to think beyond jobs and become job creators. \n\nParticipants will present their innovative startup ideas, explain their business models, and showcase how their ideas can solve real-world problems. The event provides a platform to gain confidence, receive expert feedback, and develop an entrepreneurial mindset.\n\n🌟 Event Outcome:\nStudents will gain exposure to startup culture, improve their presentation and problem-solving skills, and understand how to transform ideas into viable ventures. The event aims to inspire students to become entrepreneurs and future job creators.\n\n👥 Team Size:\n3 Members per team",
      image: "/banner/banner.png",
      dateTarget: '2026-02-24T09:00:00', // Set to a future date for the countdown or keep it generic
      registrationLink: '/register'
    }
  ];

  const [upcomingEvents, setUpcomingEvents] = useState(() => {
    // const saved = localStorage.getItem('upcomingEvents_v3');
    // return saved ? JSON.parse(saved) : defaultUpcomingEvents;
    // Forcing update to show new default data for this request since user might have old data in local storage
    return defaultUpcomingEvents;
  });

  useEffect(() => {
    localStorage.setItem('upcomingEvents_v4', JSON.stringify(upcomingEvents)); // Bump version to invalidate old cache if needed, or just overwrite
  }, [upcomingEvents]);

  useEffect(() => {
    localStorage.setItem('isAdmin', isAdmin);
  }, [isAdmin]);

  // Participants Data
  const [participants, setParticipants] = useState(() => {
    const saved = localStorage.getItem('participants');
    return saved ? JSON.parse(saved) : [];
  });

  // Initial fetch from backend (if available)
  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/api/participants`);
        if (!res.ok) return; // fall back to localStorage data
        const data = await res.json();
        // Map DB rows to the shape expected by the admin dashboard where possible
        const mapped = data.map(row => ({
          id: row.id,
          name: row.name,
          email: row.email,
          phone: row.phone,
          registrationNumber: row.registration_number || '',
          teamName: row.team_name || '',
          members: row.members || '',
          event: row.event || '',
          registeredAt: row.registered_at || new Date().toISOString()
        }));
        setParticipants(mapped);
      } catch (err) {
        // If backend is not reachable, keep using localStorage-only data
        console.error('Failed to fetch participants from API, using local data instead.', err);
      }
    };

    if (apiBaseUrl) {
      fetchParticipants();
    }
  }, [apiBaseUrl]);

  // Keep localStorage in sync for offline / local fallback
  useEffect(() => {
    const current = localStorage.getItem('participants');
    const newString = JSON.stringify(participants);
    if (current !== newString) {
      localStorage.setItem('participants', newString);
    }
  }, [participants]);

  // Sync across tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'participants') {
        const newValue = e.newValue ? JSON.parse(e.newValue) : [];
        setParticipants(newValue);
      }
    };
    
    // Also check on focus in case storage event was missed or not supported in specific context
    const handleFocus = () => {
        const saved = localStorage.getItem('participants');
        if (saved) {
           const parsed = JSON.parse(saved);
           if (JSON.stringify(parsed) !== JSON.stringify(participants)) {
               setParticipants(parsed);
           }
        }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleFocus);
    return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('focus', handleFocus);
    };
  }, [participants]);

  const registerParticipant = async (participantData) => {
    // Optimistically update local state so UI feels instant
    const tempParticipant = { ...participantData, id: Date.now(), registeredAt: new Date().toISOString() };
    setParticipants(prev => [...prev, tempParticipant]);

    // Try to persist to backend (if configured)
    try {
      if (apiBaseUrl) {
        const res = await fetch(`${apiBaseUrl}/api/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: participantData.name,
            email: participantData.email,
            phone: participantData.phone
          })
        });

        if (res.ok) {
          const saved = await res.json();
          // Replace temp participant with server-backed one (keeping extra fields if any)
          setParticipants(prev => {
            const withoutTemp = prev.filter(p => p.id !== tempParticipant.id);
            return [
              ...withoutTemp,
              {
                ...participantData,
                id: saved.id,
                registeredAt: saved.registered_at || tempParticipant.registeredAt
              }
            ];
          });
        }
      }
    } catch (err) {
      console.error('Failed to register participant with backend, kept only in localStorage.', err);
    }
  };

  const deleteParticipant = (id) => {
    setParticipants(participants.filter(p => p.id !== id));
  };

  const [pastEvents, setPastEvents] = useState([
    { id: 101, title: "Intellix", image: "/gallary/1.jpeg" },
    { id: 102, title: "Intellix", image: "/gallary/2.jpeg" },
    { id: 103, title: "Intellix", image: "/gallary/3.jpeg" },
  ]);

  const [winners, setWinners] = useState([
    { id: 1, title: "Winner 1", event: "Intellix", image: "/winners/1st%20one%20piece.jpeg" },
    { id: 2, title: "Winner 2", event: "Intellix", image: "/winners/2nd%20autocad.jpeg" },
    { id: 3, title: "Winner 3", event: "Intellix", image: "/winners/3rd%20straw%20hat.jpeg" }
  ]);

  const login = (username, password) => {
    // Simple hardcoded check
    if (username === 'admin' && password === 'admin123') {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
  };

  const addUpcomingEvent = (event) => {
    setUpcomingEvents([...upcomingEvents, { ...event, id: Date.now() }]);
  };

  const updateUpcomingEvent = (id, updatedEvent) => {
    setUpcomingEvents(upcomingEvents.map(ev => ev.id === id ? { ...ev, ...updatedEvent } : ev));
  };

  const deleteUpcomingEvent = (id) => {
    setUpcomingEvents(upcomingEvents.filter(ev => ev.id !== id));
  };

  return (
    <EventContext.Provider value={{
      isAdmin,
      login,
      logout,
      upcomingEvents,
      pastEvents,
      winners,
      addUpcomingEvent,
      updateUpcomingEvent,
      deleteUpcomingEvent,
      participants,
      registerParticipant,
      deleteParticipant
    }}>
      {children}
    </EventContext.Provider>
  );
};
