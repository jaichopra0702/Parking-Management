import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Bookings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [parkingDetails, setParkingDetails] = useState(null);

  useEffect(() => {
    // Check if parking details are passed via route state
    const routeParkingDetails = location.state?.parkingDetails;

    if (routeParkingDetails) {
      // If details are passed via route, save to localStorage
      localStorage.setItem('parkingDetails', JSON.stringify(routeParkingDetails));
      setParkingDetails(routeParkingDetails);
    } else {
      // Try to retrieve parking details from localStorage
      const storedParkingDetails = localStorage.getItem('parkingDetails');
      
      if (storedParkingDetails) {
        setParkingDetails(JSON.parse(storedParkingDetails));
      }
    }
  }, [location.state]);

  // Clear localStorage when navigating away (optional)
  const handleClearBooking = () => {
    localStorage.removeItem('parkingDetails');
    navigate('/');
  };

  // Handle case when no parking details are found
  if (!parkingDetails) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center'
      }}>
        <h1>No Parking Details Found</h1>
        <p>Please book a parking space first.</p>
        <button
          onClick={() => navigate('/parking')}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: 'black',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Go to Parking Space
        </button>
      </div>
    );
  }

  return (
    <div className="bookings-container" style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f0f0f0',
      borderRadius: '10px',
      marginTop: '90px',
      marginBottom: '25px'
    }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '20px'
      }}>
        <h1>Parking Booking Confirmation</h1>
        <p>Thank you for your booking!</p>
      </div>

      <div style={{
        backgroundColor: 'white',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '15px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h2>Booked Parking Slots</h2>
        {Object.entries(parkingDetails.selectedSlots).map(([type, slots]) => (
          slots.length > 0 && (
            <div key={type} style={{
              marginBottom: '10px',
              padding: '10px',
              backgroundColor: '#f9f9f9',
              borderRadius: '5px'
            }}>
              <strong>{type} Slots:</strong> {slots.join(', ')}
              <div>
                Price per slot: Rs {parkingDetails.parkingPrices[type]}
                {' '}| Subtotal: Rs {slots.length * parkingDetails.parkingPrices[type]}
              </div>
            </div>
          )
        ))}
      </div>

      <div style={{
        backgroundColor: 'white',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h2>Booking Summary</h2>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '10px'
        }}>
          <strong>Total Cost:</strong>
          <span>Rs {parkingDetails.totalCost}</span>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <strong>Booking Time:</strong>
          <span>{new Date(parkingDetails.timestamp).toLocaleString()}</span>
        </div>
      </div>

      <div style={{
        marginTop: '20px',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        gap: '15px'
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '10px 20px',
            backgroundColor: 'black',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Book Another Parking
        </button>
    
      </div>
    </div>
  );
};

export default Bookings;