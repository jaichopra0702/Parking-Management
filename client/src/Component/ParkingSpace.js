import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Styles/ParkingSpace.css';

const ParkingSpace = () => {
  const [parkingSpaces, setParkingSpaces] = useState({
    Bike: Array(7).fill('Available'),
    Car: Array(7).fill('Available'),
    Truck: Array(7).fill('Available'),
  });
  const [wallet, setWallet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // New state for selected slots and total cost
  const [selectedSlots, setSelectedSlots] = useState({
    Bike: [],
    Car: [],
    Truck: [],
  });
  const [totalCost, setTotalCost] = useState(0);

  // Parking prices
  const PARKING_PRICES = {
    'Bike': 50,
    'Car': 100,
    'Truck': 150,
  };

  // Fetch parking spaces with detailed logging
  const fetchParkingSpaces = async (token) => {
    try {
      const response = await axios.get('http://localhost:5000/api/route/parking-spaces', {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Fetched Parking Spaces:', response.data);

      // Ensure each vehicle type has an array of 7 spaces
      const updatedSpaces = {
        Bike: response.data.Bike || Array(7).fill('Available'),
        Car: response.data.Car || Array(7).fill('Available'),
        Truck: response.data.Truck || Array(7).fill('Available'),
      };

      setParkingSpaces(updatedSpaces);
    } catch (err) {
      console.error('Error fetching parking spaces:', err);
      alert('Failed to load parking spaces');
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        
        if (token) {
          const [walletResponse] = await Promise.all([
            axios.get('http://localhost:5000/api/route/wallet', {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

          setWallet(walletResponse.data.data);
          
          // Fetch parking spaces
          await fetchParkingSpaces(token);
        }
      } catch (err) {
        console.error('Error initializing data:', err);
        alert('Failed to initialize data');
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  // Update total cost whenever selected slots change
  useEffect(() => {
    const calculateTotalCost = () => {
      let total = 0;
      Object.keys(selectedSlots).forEach(type => {
        total += selectedSlots[type].length * PARKING_PRICES[type];
      });
      setTotalCost(total);
    };

    calculateTotalCost();
  }, [selectedSlots]);

  const handleParkingSpaceClick = (type, index) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first');
      return;
    }

    // If space is not available, do nothing
    if (parkingSpaces[type][index] !== 'Available') return;

    // Create a copy of selected slots
    const updatedSelectedSlots = {...selectedSlots};
    
    // Check if slot is already selected, if so remove it
    const slotIndex = updatedSelectedSlots[type].indexOf(index);
    if (slotIndex > -1) {
      updatedSelectedSlots[type].splice(slotIndex, 1);
    } else {
      // Add the slot
      updatedSelectedSlots[type].push(index);
    }

    // Update selected slots
    setSelectedSlots(updatedSelectedSlots);
  };

  const confirmParking = async () => {
    const token = localStorage.getItem('token');
    
    // Validate wallet balance
    if (!wallet || wallet.balance < totalCost) {
      alert('Insufficient balance in wallet to park the vehicles.');
      return;
    }

    try {
      // Park each selected vehicle
      for (const type of Object.keys(selectedSlots)) {
        for (const slotIndex of selectedSlots[type]) {
          await axios.post(
            'http://localhost:5000/api/route/park-vehicle',
            {
              vehicleType: type,
              slotNumber: slotIndex,
              price: PARKING_PRICES[type],
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );
        }
      }

      // Refetch parking spaces and wallet
      await fetchParkingSpaces(token);
      const walletResponse = await axios.get('http://localhost:5000/api/route/wallet', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWallet(walletResponse.data.data);

      // Reset selected slots
      setSelectedSlots({
        Bike: [],
        Car: [],
        Truck: [],
      });

      alert('Vehicles parked successfully!');
    } catch (err) {
      console.error('Error parking vehicles:', err);
      alert('Failed to park vehicles');
    }
  };

  if (isLoading) {
    return <div className='mainContainerparkingspace'>Loading parking spaces...</div>;
  }

  return (
    <div className='mainContainerparkingspace'>
      <div>
        <h1>Parking Space</h1>
      </div>
      
      {/* Price display */}
      <div style={{
        marginBottom: '20px', 
        textAlign: 'center', 
        backgroundColor: '#f0f0f0', 
        padding: '10px', 
        borderRadius: '8px',
        width: '20%'
      }}>
        <h3>Parking Prices</h3>
        {Object.entries(PARKING_PRICES).map(([type, price]) => (
          <div key={type}>
            {type}: Rs {price} per slot
          </div>
        ))}
      </div>

      <div className='ParkingSpaceContainer'>
        <div className='twowheeler'>
          <h2>Bike</h2>
          <div>
            {parkingSpaces.Bike.map((status, index) => (
              <span
                key={index}
                onClick={() => handleParkingSpaceClick('Bike', index)}
                style={{
                  border: selectedSlots.Bike.includes(index) 
                    ? '2px solid green' 
                    : 'none',
                  transform: selectedSlots.Bike.includes(index) 
                    ? 'scale(1.1)' 
                    : 'none'
                }}
                className={status === 'Available' ? 'available' : 'occupied'}
              >
                {status}
              </span>
            ))}
          </div>
        </div>
        <div className='threewheeler'>
          <h2>Car</h2>
          <div>
            {parkingSpaces.Car.map((status, index) => (
              <span
                key={index}
                onClick={() => handleParkingSpaceClick('Car', index)}
                style={{
                  border: selectedSlots.Car.includes(index) 
                    ? '2px solid green' 
                    : 'none',
                  transform: selectedSlots.Car.includes(index) 
                    ? 'scale(1.1)' 
                    : 'none'
                }}
                className={status === 'Available' ? 'available' : 'occupied'}
              >
                {status}
              </span>
            ))}
          </div>
        </div>
        <div className='fourwheeler'>
          <h2>Truck</h2>
          <div>
            {parkingSpaces.Truck.map((status, index) => (
              <span
                key={index}
                onClick={() => handleParkingSpaceClick('Truck', index)}
                style={{
                  border: selectedSlots.Truck.includes(index) 
                    ? '2px solid green' 
                    : 'none',
                  transform: selectedSlots.Truck.includes(index) 
                    ? 'scale(1.1)' 
                    : 'none'
                }}
                className={status === 'Available' ? 'available' : 'occupied'}
              >
                {status}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Slots Summary */}
      <div style={{
        marginTop: '20px', 
        textAlign: 'center', 
        backgroundColor: '#f0f0f0', 
        padding: '10px', 
        borderRadius: '8px',
        
      }}>
        <h3>Selected Slots:</h3>
        {Object.entries(selectedSlots).map(([type, slots]) => (
          slots.length > 0 && (
            <div key={type}>
              {type}: {slots.join(', ')} 
              (Total: Rs {slots.length * PARKING_PRICES[type]})
            </div>
          )
        ))}
        <div><strong>Total Cost: Rs {totalCost}</strong></div>
      </div>

      {/* Confirm Parking Button */}
      {totalCost > 0 && (
        <button 
          onClick={confirmParking} 
          style={{
            display: 'block',
            width: '20%',
            padding: '10px',
            backgroundColor: 'black',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '15px'
          }}
        >
          Confirm Parking (Rs {totalCost})
        </button>
      )}

      {wallet && (
        <div className="wallet-balance">
          <p>Current Balance: Rs {wallet.balance.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

export default ParkingSpace;