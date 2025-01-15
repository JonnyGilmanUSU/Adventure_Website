// Import Libraries
import React from 'react';

// Import Styles
import styles from './MapPage.module.scss';
import Map from '../../Components/Map/Map/Map';

// Import Components

const MapPage = () => {
  return (
    <div className={styles.background}>

      <div className={styles.container}>
      <h1>Map</h1>
        <Map />
      </div>
    </div>
  )
}

export default MapPage