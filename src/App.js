import React, { useReducer } from 'react';
import MapLocation from './modules/Map';
import PlacesList from './modules/PlacesList';
import { exportToCsv } from './modules/utils';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Row,
  Col,
  Button,
  Input,
} from 'reactstrap';

/* global google */
function geocodeLatLng(place, geocoder, dispatch) {
  const latlng = { lat: place.lat, lng: place.lng };
  geocoder.geocode({ location: latlng}, function(results, status) {
    if (status === 'OK') {
      if (results[0]) {
        dispatch({ type: 'UPDATE_PLACE', payload: { ...place, address: results[0].formatted_address } });
      } else {
        console.error('No results found');
      }
    } else {
      
      console.error('Geocoder failed due to: ' + status);
    }
  });
}


const placesReducer = (state, action) => {
  switch(action.type) {
    case 'UPDATE_PLACE': {
      const updatedPlace = action.payload;
      return {
        ...state,
        withAddressCounter: updatedPlace.address ? state.withAddressCounter+1 : state.withAddressCounter,
        places: [...state.places.map(place => place.codi === updatedPlace.codi ? updatedPlace : place)]
      }
    }
    case 'SET_PLACES': {
      try {
        const places = JSON.parse(action.payload)
        return {
          ...state,
          places: places.map(p => ({ ...p, lat: parseFloat(p.lat), lng: parseFloat(p.lng) }))
        }
      }catch(e) {
        console.log(e)
        return state;
      }
      
    }
    default:
      return {
        ...state,
      }
  }
}

const geocoder = new google.maps.Geocoder;

function App() {
  const [state, dispatch] = useReducer(placesReducer, {
    withAddressCounter: 0,
    places: [],
  })

  
  function getDirecciones() {
    
    state.places.filter(p => !p.address).forEach((place, index) => {
      const getAddress = async () => {
        geocodeLatLng(place, geocoder, dispatch)
      };
      setTimeout(() => {
        getAddress();
      }, index*3000)
    })
  }

  function getAddress(place) {
    geocodeLatLng(place, geocoder, dispatch)
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Direcciones para todos y todas
        </p>        
      </header>
      <Row style={{ padding: 15 }}>
        <Col md="5">
          <Input type="textarea" id="places"  placeholder="inserta aqui el array con los lugares" />
        </Col>
        <Col md="1">
          <Button  onClick={() => dispatch({ type: 'SET_PLACES', payload: document.getElementById('places').value })}> Obtener lugares</Button>
        </Col>
        <Col md="6" >
          <Button onClick={() => getDirecciones()} style={{ marginRight: 15 }}>Obtener direcciones ({state.withAddressCounter}/{state.places.length})</Button>

          <Button onClick={() => exportToCsv(state.places, 'places.csv')}>Descargar</Button>
        </Col>
      </Row>
      <Row>
        <Col md="6">
          <MapLocation location={state.places} />
        </Col>
        <Col md="6">
          <PlacesList places={state.places} getAddress={getAddress}/>
        </Col>
      </Row>
    </div>
  );
}

export default App;
