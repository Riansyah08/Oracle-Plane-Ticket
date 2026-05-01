import React, { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { purchasePlane } from '../utils/fetch.js';
import {discount} from '../utils/helpers.js';
import { ticket_select } from '../utils/fetch.js';
import { loginUser } from '../utils/fetch.js';

function BookFlightPage({ user, setCurrentUser }) {
  const [allFlights, setAllFlights] = useState([]);
  const [allTickets, setAllTickets] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);

  const [fromCities, setFromCities] = useState([]);
  const [toCities, setToCities] = useState([]);

  const [selectedFrom, setSelectedFrom] = useState('');
  const [selectedTo, setSelectedTo] = useState('');

  const [loading, setLoading] = useState(false);

  const [showSeatPicker, setShowSeatPicker] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [departureDate, setDepartureDate] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");


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
  useEffect(() => {
    const loadFlights = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/planes");
      
        if (!res.ok) throw new Error("Failed");
      
        const data = await res.json();
      
        console.log("ALL FLIGHTS:", data);
      
        setAllFlights(data);
      
      } catch (err) {
        console.error("❌ ERROR:", err);
      }
    };
  
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
  const handleSearchFlights = () => {
    if (!selectedFrom || !selectedTo) {
      alert('Please select both cities');
      return;
    }

    const results = allFlights.filter(
      f =>
        normalize(f.planeAddressFrom) === normalize(selectedFrom) &&
        normalize(f.planeAddressTo) === normalize(selectedTo)
    );

    setFilteredFlights(results);
  };

  /* ---------------- Seat Checker ---------------- */
  useEffect(() => {
    const loadTickets = async () => {
      try {
        setLoading(true);
        const tickets = await ticket_select();
        console.log('Ticket Data:', tickets);
        setAllTickets(tickets);
      } catch (err) {
        console.error('Failed to load Ticket Data', err);
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, []);

  /* ---------------- Purchase ---------------- */
  const handlePurchaseFlight = async (tx) => {
  try {
    setLoading(true);

    const payload = {
      email: user.email,
      password: user.password,
      planeAddressFrom: tx.planeAddressFrom,
      planeAddressTo: tx.planeAddressTo,
      planeId: tx.planeId,
      planeSeat: tx.seat,
      DepartureDate: tx.departureDate,
      ArrivalDate: tx.arrivalDate
    };

    console.log("FINAL payload to SOAP:", payload);
    
    await purchasePlane(payload);
    const freshUser = await loginUser({
        email: user.email,
        password: user.password,
      });
    // 🔥 replace global state
    setCurrentUser(freshUser);
    alert(`✈️ Flight purchased successfully! Seat ${tx.seat} with a total price of ${tx.price * (1 - discount(user.tier_name))}`);
  } catch (err) {
    console.error(err);
    alert('❌ Failed to purchase flight.');
  } finally {
    setLoading(false);
  }
};

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
              value={selectedFrom}
              onChange={(e) => {
                setSelectedFrom(e.target.value);
                setSelectedTo('');
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
              value={selectedTo}
              onChange={(e) => setSelectedTo(e.target.value)}
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
              value={departureDate || ""}
              onChange={(e) => {
                const values = e.target.value;
                setDepartureDate(values);

                if (arrivalDate && values > arrivalDate) {
                  setArrivalDate("");
                }
              }}
              className="border rounded-lg px-4 py-2 w-48"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          {/* Arrival grid */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">
              Arrival Date
            </label>
            <input
              type="date"
              value={arrivalDate || ""}
              onChange={(e) => setArrivalDate(e.target.value)}
              className="border rounded-lg px-4 py-2 w-48"
              min={departureDate || new Date().toISOString().split("T")[0]}
              disabled={!departureDate}
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
                      Flight: {flight.flightNumber} | Aircraft: {flight.planeName}
                    </p>

                    <p className="text-gray-600">
                      Total Seat: {flight.total_seat}
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
                    {flight.availability === "Y" ? (
                      <button
                        onClick={() => {
                          if (!user || !user.id) {
                            alert("Please Login first!");
                            window.location.reload();
                            return;
                          }
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

        {showSeatPicker && selectedFlight && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg">

              <h3 className="text-xl font-bold mb-4">
                Select Seat
              </h3>

              <p className="text-gray-600 mb-4">
                {selectedFlight.planeAddressFrom} → {selectedFlight.planeAddressTo}
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
                    console.log("Sending:", departureDate, arrivalDate);

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
                                      
                      // OPTIONAL: re-fetch tickets so seats become taken
                      const tickets = await ticket_select();
                      setAllTickets(tickets);
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
