import React from 'react';
import { Link } from 'react-router-dom';
import styles from './CategoriesPage.module.scss';

import Bike from '../../Assets/ChooseAdventureIcons/BikeIcon.svg';
import Tent from '../../Assets/ChooseAdventureIcons/TentIcon.svg';
import WaterBottle from '../../Assets/ChooseAdventureIcons/WaterBottle.svg';
import Canyoneering from '../../Assets/ChooseAdventureIcons/CanyoneeringIcon.svg';
import Climbing from '../../Assets/ChooseAdventureIcons/ClimbingIcon.svg';

const ChooseAdventure = () => {
  const categories = [
    { name: 'Climbing', slug: 'climbing' },
    { name: 'Mountain Biking', slug: 'mountain-biking' },
    { name: 'Canyoneering', slug: 'canyoneering' },
    { name: 'Backpacking', slug: 'backpacking' },
    { name: 'Hiking', slug: 'hiking' },
  ];

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <h1 className={styles.mainHeader}>Choose By Activity</h1>
        <section className={styles.activities}>
          {categories.map((category) => (
            <Link
              key={category.slug}
              to={`/adventure-categories/${category.slug}`}
              className={styles.activityLink}
            >
              <h1 className={styles.activityHeader}>{category.name}</h1>
            </Link>
          ))}
        </section>
        {/* Decorative Background SVG Icons */}
        <img src={Bike} alt="Mountain Biking Icon" className={styles.iconBiking} />
        <img src={Tent} alt="Backpacking Icon" className={styles.iconBackpacking} />
        <img src={WaterBottle} alt="Hiking Icon" className={styles.iconHiking} />
        <img src={Climbing} alt="Climbing Icon" className={styles.iconClimbing} />
        <img src={Canyoneering} alt="Canyoneering Icon" className={styles.iconCanyoneering} />
      </div>
    </div>
  );
};

export default ChooseAdventure;
