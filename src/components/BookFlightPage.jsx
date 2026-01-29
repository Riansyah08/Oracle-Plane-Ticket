import React, { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { purchasePlane, PlaneSearch } from '../utils/fetch.js';

function BookFlightPage({ user }) {
  const [allFlights, setAllFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);

  const [fromCities, setFromCities] = useState([]);
  const [toCities, setToCities] = useState([]);

  const [selectedFrom, setSelectedFrom] = useState('');
  const [selectedTo, setSelectedTo] = useState('');

  const [loading, setLoading] = useState(false);

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
    if (allFlights.length === 0) return;

    const fromMap = new Map();
    const toMap = new Map();

    allFlights.forEach(f => {
      if (f.planeAddressFrom) {
        fromMap.set(f.planeAddressFrom, f.planeAddressFrom);
      }
      if (f.planeAddressTo) {
        toMap.set(f.planeAddressTo, f.planeAddressTo);
      }
    });

    setFromCities([...fromMap.values()]);
    setToCities([...toMap.values()]);
    console.log('fromCities (computed):', [...fromMap.values()]);
    console.log('toCities (computed):', [...toMap.values()]);
    console.log('fromCities (state):', fromCities);
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

  /* ---------------- Purchase ---------------- */
  const handlePurchaseFlight = async (flight) => {
    try {
      setLoading(true);

      const payload = {
        user_id: user.user_id,
        email: user.email,
        planeaddress_from: flight.planeAddressFrom,
        planeaddress_to: flight.planeAddressTo,
        planeschedule_departs: flight.planeschedule_departs,
        planeschedule_arrive: flight.planeschedule_arrive
      };

      await purchasePlane(payload);

      alert('✈️ Flight purchased successfully!');
    } catch (err) {
      console.error(err);
      alert('❌ Failed to purchase flight.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <ShoppingCart className="w-7 h-7 mr-2 text-blue-600" />
          Book a Flight
        </h2>

        {/* ---------------- City selectors ---------------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">
              From
            </label>
            <select
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
            <label className="block text-gray-700 mb-2 font-semibold">
              To
            </label>
            <select
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

            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
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
                      Departure: {formatDateTime(flight.planeschedule_departs)}
                    </p>

                    <p className="text-gray-600">
                      Arrival: {formatDateTime(flight.planeschedule_arrive)}
                    </p>

                    <p className="text-gray-600">KM: {flight.km}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-gray-700 font-semibold mb-2">
                      Rp {flight.price.toLocaleString()}
                    </p>
                    <button
                      onClick={() => handlePurchaseFlight(flight)}
                      disabled={loading}
                      className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition font-semibold disabled:opacity-50"
                    >
                      Purchase
                    </button>
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
      </div>
    </div>
  );
}

export default BookFlightPage;
