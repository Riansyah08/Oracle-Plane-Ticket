import React, { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { purchasePlane } from '../utils/fetch.js';
import {discount} from '../utils/helpers.js';
import { loginUser } from '../utils/fetch.js';
import spinner from "../assets/icons8-spinner-50.gif";

function BookFlightPage({ onNavigate, user, setCurrentUser, flightSearchState, setFlightSearchState }) {
  const [allFlights, setAllFlights] = useState([]);
  const [allTickets, setAllTickets] = useState([]);

  const [fromCities, setFromCities] = useState([]);
  const [toCities, setToCities] = useState([]);

  const [loading, setLoading] = useState(false);
  const [hasAutoPurchased, setHasAutoPurchased] = useState(false);

  const [showSeatPicker, setShowSeatPicker] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [arrivalDate, setArrivalDate] = useState("");
  const [isRefreshingUser, setIsRefreshingUser] = useState(false);
  const [NotificationMsg, setNotificationMsg] = useState(false);
  const [NotificationLogin, setNotificationLogin] = useState(false);
  const {
    selectedFrom,
    selectedTo,
    departureDate,
    filteredFlights,
    hasSearched
  } = flightSearchState;
  const HOST = "10.143.191.86";
  const PORT = "3001";
  const BASE_URL = `http://${HOST}:${PORT}`;

  /* ---------------- Helpers ---------------- */
  const normalize = v => v?.trim().toLowerCase();

  const formatDateTime = iso =>
    iso
      ? new Date(iso).toLocaleString('en-GB', {
          dateStyle: 'medium',
          timeStyle: 'short'
        })
      : '-';

  /* ---------------- Load ALL flights (once) ---------------- */
  const loadFlights = async () => {
    try {
      const res = await fetch(BASE_URL + "/api/planes");

      if (!res.ok) throw new Error("Failed");
      
      const data = await res.json();

      setAllFlights(data);
    } catch (err) {
      console.error("❌ ERROR:", err);
    }
  };

  useEffect(() => {
    loadFlights();
  }, [refreshKey]);

  /* ---------------- Build city dropdowns from DB data ---------------- */
  useEffect(() => {
    if (allFlights.length === 0) return;

    const fromMap = new Map();
    const toMap = new Map();

    allFlights.forEach(f => {
      if (f.planeAddressFrom) {
        fromMap.set(
          normalize(f.planeAddressFrom),
          f.planeAddressFrom
        );
      }
      if (f.planeAddressTo) {
        toMap.set(
          normalize(f.planeAddressTo),
          f.planeAddressTo
        );
      }
    });

    setFromCities([...fromMap.values()]);
    setToCities([...toMap.values()]);
  }, [allFlights]);

  /* ---------------- Search (frontend filter) ---------------- */
  useEffect(() => {
    if (!hasSearched) return;
    if (allFlights.length === 0) return;
  
    const results = allFlights.filter(
      f =>
        normalize(f.planeAddressFrom) === normalize(selectedFrom) &&
        normalize(f.planeAddressTo) === normalize(selectedTo)
    );
  
    setFlightSearchState(prev => ({
      ...prev,
      filteredFlights: results
    }));
  }, [
    allFlights,
    selectedFrom,
    selectedTo,
    hasSearched
  ]);
  
  const handleSearchFlights = () => {
    if (!selectedFrom || !selectedTo) {
        setNotificationMsg('Please select both cities');
        return;
      }

      if (!departureDate) {
        setNotificationMsg("Choose The Date First!!");
        return;
      }

      setFlightSearchState(prev => ({
        ...prev,
        hasSearched: true
      }));
  };

  /* ---------------- Seat Checker ---------------- */
  const loadTickets = async () => {
    try {
      const res = await fetch(BASE_URL + "/api/ticketinfo");

      console.log("Status:", res.status);

      if (!res.ok) throw new Error("Failed");

      const data = await res.json();

      setAllTickets(data);
    } catch (err) {
      console.error("Failed to load Ticket Data:", err);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [refreshKey]);

const refreshLatestUser = async (
  email,
  password,
  oldPoints,
  oldKmHit
) => {
  // prevent overlapping refresh loops
  if (isRefreshingUser) return null;

  setIsRefreshingUser(true);

  try {
    for (let i = 0; i < 10; i++) {
      try {
        const updated = await loginUser({
          email,
          password
        });

        const newPoints = Number(updated?.points_balance || 0);
        const newKmHit = Number(updated?.km_hit || 0);

        const changed =
          newPoints !== Number(oldPoints) ||
          newKmHit !== Number(oldKmHit);

        if (changed) {
          return updated;
        }

      } catch (err) {
        console.log("Polling retry...");
      }

      await new Promise(res => setTimeout(res, 1000));
    }

    return null;

  } finally {
    setIsRefreshingUser(false);
  }
};

useEffect(() => {
}, [user]);

  /* ---------------- Purchase ---------------- */
  const handlePurchaseFlight = async (tx) => { 
    try {
      const latestUser = await loginUser({
        email: user.email,
        password: user.password,
      });

      const oldPoints = Number(latestUser.points_balance || 0);
      const oldKmHit = Number(latestUser.km_hit || 0);

      setLoading(true);
      await purchasePlane({
        email: user.email,
        password: user.password,
        planeAddressFrom: tx.planeAddressFrom,
        planeAddressTo: tx.planeAddressTo,
        planeId: tx.planeId,
        planeSeat: tx.seat,
        DepartureDate: tx.departureDate,
        ArrivalDate: "2014-09-19T06:18:33"
      });

      const updatedUser = await refreshLatestUser(
        latestUser.email,
        latestUser.password,
        oldPoints,
        oldKmHit
      );
      // 🔥 replace global state
      if (updatedUser) {
        setCurrentUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
      setNotificationMsg(`✈️ Flight purchased successfully! Seat ${tx.seat} with a total price of ${tx.price * (1 - discount(user.tier_name))}`);
    } catch (err) {
      console.error(err);
      setNotificationMsg('❌ Failed to purchase flight.');
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  const autoPurchase = async () => {

    if (hasAutoPurchased) return;

    if (!user?.user_id) return;

    const pending = localStorage.getItem("pendingPurchase");

    if (!pending) return;

    setHasAutoPurchased(true);

    try {
      const parsed = JSON.parse(pending);

      localStorage.removeItem("pendingPurchase");

      await handlePurchaseFlight({
        ...parsed.selectedFlight,
        seat: parsed.selectedSeat,
        planeId: parsed.selectedFlight.plane_id,
        departureDate: parsed.departureDate,
        arrivalDate: parsed.arrivalDate
      });

      setRefreshKey(prev => prev + 1);

      setSelectedSeat(null);
      setShowSeatPicker(false);

    } catch (err) {
      console.error("Auto purchase failed:", err);
    }
  };

  autoPurchase();

}, [user]);

  if (allFlights.length === 0) {
    return <img src={spinner} alt="Loading..." />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <ShoppingCart className="w-7 h-7 mr-2 text-blue-600" />
          Book a Flight
        </h2>

        {/* ---------------- City selectors ---------------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label
              htmlFor="fromCity"
              className="block text-gray-700 mb-2 font-semibold"
            >
              From
            </label>
            <select
              id="fromCity"
              name="fromCity"
              className="w-full px-4 py-3 border rounded-lg"
              value={flightSearchState.selectedFrom}
              onChange={(e) => {
                setFlightSearchState(prev => ({
                  ...prev,
                  selectedFrom: e.target.value,
                  selectedTo: ""
                }));
              }}
            >
              <option value="">Select departure city</option>
              {fromCities.map(city => (
                <option key={`from-${city}`} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="toCity"
              className="block text-gray-700 mb-2 font-semibold"
            >
              To
            </label>
            <select
              id="toCity"
              name="toCity"
              className="w-full px-4 py-3 border rounded-lg"
              value={flightSearchState.selectedTo}
              onChange={(e) => 
                setFlightSearchState(prev => ({
                  ...prev,
                  selectedTo: e.target.value
                }))
              }
              disabled={!selectedFrom}
            >
              <option value="">Select destination city</option>
              {toCities
                .filter(city => city !== selectedFrom)
                .map(city => (
                  <option key={`to-${city}`} value={city}>
                    {city}
                  </option>
                ))}
            </select>
          </div>
        </div>
          
        {/* Date Picker */}
        <div className="flex gap-6 mb-6">
        
          {/* Departure grid */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Departure Date
            </label>

            <input
              type="date"
              value={flightSearchState.departureDate || ""}
              onChange={(e) => {
                setFlightSearchState(prev => ({
                  ...prev,
                  departureDate: e.target.value
                }));
              }}
              className="border rounded-lg px-4 py-2 w-48"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>

        {/* ---------------- Search button ---------------- */}
        <button
          onClick={handleSearchFlights}
          disabled={loading}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition mb-6 font-semibold disabled:opacity-50"
        >
          Search Flights
        </button>

        {/* ---------------- Results ---------------- */}
        {filteredFlights.length > 0 && (
          <div>
            <h3 className="text-xl font-bold mb-4">Available Flights</h3>

            <div className="space-y-4 max-h-133 overflow-y-auto pr-2">
              {filteredFlights.map(flight => (
                <div
                  key={flight.plane_id}
                  className="border rounded-lg p-5 flex flex-col md:flex-row justify-between gap-4 hover:shadow-md transition"
                >
                  <div className="flex-1">
                    <p className="font-bold text-xl">
                      {flight.planeAddressFrom} → {flight.planeAddressTo}
                    </p>

                    <p className="text-gray-600">
                      Flight: {flight.flightNumber} | Aircraft: {flight.planeName} ({flight.plane_id})
                    </p>

                    <p className="text-gray-600">
                      Total Seat Available: {flight.total_seat}
                    </p>

                    <p className="text-gray-600">
                      Departure Time: {flight.planeschedule_departs}
                    </p>

                    <p className="text-gray-600">
                      Arrival Time: {flight.planeschedule_arrive}
                    </p>

                    <p className="text-gray-600">KM: {flight.km}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-gray-700 font-semibold mt-7 mb-3 mr-2">
                      Rp {flight.price.toLocaleString()}
                    </p>
                    {flight.availability === "Y" && flight.total_seat > 0 ? (
                      <button
                        onClick={() => {
                          setSelectedFlight(flight);
                          setSelectedSeat(null);
                          setShowSeatPicker(true);
                        }}
                        disabled={loading}
                        className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition font-semibold disabled:opacity-50"
                      >
                        Purchase
                      </button>
                    ) : (
                      <button
                        className="bg-red-500 text-white px-6 py-2 rounded cursor-not-allowed opacity-50"
                      >
                        Flight Not Available
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {filteredFlights.length === 0 && selectedFrom && selectedTo && !loading && (
          <p className="text-gray-500 text-center">
            No flights found for this route.
          </p>
        )}

        {NotificationMsg && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white border-1 rounded-xl shadow-2xl p-6 w-80 text-center ">
              <p className="text-gray-800 mb-4">{NotificationMsg}</p>
            <button
            onClick={() => setNotificationMsg("")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              OK
          </button>
              </div>
            </div>
            )}
        
        {NotificationLogin && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white border-1 rounded-xl shadow-2xl p-6 w-80 text-center ">
              <p className="text-gray-800 mb-4">{NotificationMsg}</p>
            <button
            onClick={() => {onNavigate("Login");setNotificationLogin("")}}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              OK;
          </button>
              </div>
            </div>
            )}

        {showSeatPicker && selectedFlight && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg">

              <h3 className="text-xl font-bold mb-4">
                Select Seat
              </h3>

              <p className="text-gray-600 mb-4">
                {selectedFlight.planeAddressFrom} → {selectedFlight.planeAddressTo} | {selectedFlight.planeName} ({selectedFlight.plane_id})
              </p>

              {/* Seat grid */}
              <div className="grid grid-cols-6 gap-2 max-h-130 overflow-y-auto mb-6">
                {Array.from({ length: 150 }, (_, i) => i + 1).map(seat => {
                  const isTaken = allTickets.some(
                    t =>
                      Number(t.planeSeat) === seat &&
                      Number(t.planeId) === Number(selectedFlight.plane_id)
                  );
                
                  return (
                    <button
                      key={seat}
                      disabled={isTaken}
                      onClick={() => setSelectedSeat(seat)}
                      className={`py-2 rounded border text-sm font-semibold transition
                        ${
                          selectedSeat === seat
                            ? "bg-blue-600 text-white"
                            : isTaken
                              ? "bg-red-500 text-white cursor-not-allowed opacity-70"
                              : "bg-gray-100 hover:bg-gray-200"
                        }
                      `}
                    >
                      {seat}
                    </button>
                  );
                })}
              </div>  

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowSeatPicker(false)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
              
                <button
                  disabled={!selectedSeat || loading || !departureDate}
                  onClick={async () => {
                    if (!user?.user_id) {
                      localStorage.setItem("redirectAfterLogin", "purchase");
                      localStorage.setItem(
                        "pendingPurchase",
                        JSON.stringify({
                          selectedFlight,
                          selectedSeat,
                          departureDate,
                          arrivalDate
                        })
                      );

                      setNotificationMsg("Please Login first!");
                      onNavigate("login");
                      return;
                    }

                    await handlePurchaseFlight({
                      ...selectedFlight,
                      seat: selectedSeat,
                      planeId: selectedFlight.plane_id,
                      departureDate,
                      arrivalDate
                    });
                                    
                    // force seat grid to remount
                    setRefreshKey(prev => prev + 1);
                                    
                    // reset UI
                    setSelectedSeat(null);
                    setShowSeatPicker(false);
                  }}
                  className="px-6 py-2 rounded bg-green-600 text-white font-semibold disabled:opacity-50"
                >
                  Confirm Purchase
                </button>
              </div>
                
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookFlightPage;
