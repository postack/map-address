import React from 'react';
import {
  ListGroup,
  ListGroupItem,
  Button,
} from 'reactstrap';
import styled from 'styled-components';

const Title = styled.h5`
  text-align: left;
  font-size: 14px;
`;

const Data = styled.div`
  text-align: left;

`;

function Item({ place, getAddress }) {

  return (
    <ListGroupItem key={place.codi}>
      <Title>{place.title}</Title>
      <Data>
        {place.address ? (
          <p>Dirección: {place.address}</p>
        ) : (
          <Button onClick={() => getAddress(place)}>Obtener Dirección</Button>
        )}
      </Data>
    </ListGroupItem>
  )
}

export default function PlacesList(props) {
  const { places, getAddress } = props;

  return (
    <ListGroup style={{ maxHeight: 500, overflow: 'auto' }}>
      {places.map((s, index) => <Item place={s} index={index} getAddress={getAddress} />)}
    </ListGroup>
  )
}