// Pages/Home.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import MeetInMiddleAnimation from '../../Animations/MeetInMiddleAnimation';
import styles from './HomePage.module.scss';
import Cloud1 from '../../Assets/clouds/Cloud_Top_Left.png';
import Cloud2 from '../../Assets/clouds/Cloud_Middle_Left.png';
import Cloud3 from '../../Assets/clouds/Cloud_Small_Middle.png';
import Cloud4 from '../../Assets/clouds/Cloud_Big_Middle.png';
import Cloud5 from '../../Assets/clouds/Cloud_Small_Middle_right.png';
import Cloud6 from '../../Assets/clouds/Cloud_Smallish_Middle_Right.png';
import Cloud7 from '../../Assets/clouds/Cloud_Right_Darker.png';

const Home = () => {
  const [triggerAnimation, setTriggerAnimation] = useState(false);
  const navigate = useNavigate();

  const handleViewAdventures = () => {
    setTriggerAnimation(true); // Trigger animation
    setTimeout(() => {
      navigate('/all-adventures', { state: { showAnimation: true } }); // Pass state
    }, 2000); // Match animation duration
  };
  

  // Define unique animation properties for each cloud
  const cloudVariants = [
    { duration: 15, x: ['0%', '6%', '0%', '-6%', '0%'], y: ['0%', '-3%', '2%', '-3%', '0%'] }, // Cloud 1
    { duration: 18, x: ['0%', '5%', '-3%', '-5%', '0%'], y: ['0%', '-4%', '3%', '-2%', '0%'] }, // Cloud 2
    { duration: 12, x: ['0%', '3%', '-2%', '-3%', '0%'], y: ['0%', '-2%', '1%', '-1%', '0%'] }, // Cloud 3
    { duration: 20, x: ['0%', '7%', '0%', '-7%', '0%'], y: ['0%', '-5%', '4%', '-3%', '0%'] }, // Cloud 4
    { duration: 17, x: ['0%', '4%', '0%', '-4%', '0%'], y: ['0%', '-3%', '2%', '-3%', '0%'] }, // Cloud 5
    { duration: 16, x: ['0%', '6%', '0%', '-6%', '0%'], y: ['0%', '-4%', '2%', '-2%', '0%'] }, // Cloud 6
    { duration: 19, x: ['0%', '5%', '0%', '-5%', '0%'], y: ['0%', '-3%', '3%', '-3%', '0%'] }, // Cloud 7
  ];

  return (
    <div className={styles.hero}>
      <div className={styles.clouds}>
        {/* Animate each cloud with its unique motion properties */}
        <motion.img
          src={Cloud1}
          className={styles.cloud1}
          alt="Cloud 1"
          animate={{ x: cloudVariants[0].x, y: cloudVariants[0].y }}
          transition={{
            duration: cloudVariants[0].duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.img
          src={Cloud2}
          className={styles.cloud2}
          alt="Cloud 2"
          animate={{ x: cloudVariants[1].x, y: cloudVariants[1].y }}
          transition={{
            duration: cloudVariants[1].duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.img
          src={Cloud3}
          className={styles.cloud3}
          alt="Cloud 3"
          animate={{ x: cloudVariants[2].x, y: cloudVariants[2].y }}
          transition={{
            duration: cloudVariants[2].duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.img
          src={Cloud4}
          className={styles.cloud4}
          alt="Cloud 4"
          animate={{ x: cloudVariants[3].x, y: cloudVariants[3].y }}
          transition={{
            duration: cloudVariants[3].duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.img
          src={Cloud5}
          className={styles.cloud5}
          alt="Cloud 5"
          animate={{ x: cloudVariants[4].x, y: cloudVariants[4].y }}
          transition={{
            duration: cloudVariants[4].duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.img
          src={Cloud6}
          className={styles.cloud6}
          alt="Cloud 6"
          animate={{ x: cloudVariants[5].x, y: cloudVariants[5].y }}
          transition={{
            duration: cloudVariants[5].duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.img
          src={Cloud7}
          className={styles.cloud7}
          alt="Cloud 7"
          animate={{ x: cloudVariants[6].x, y: cloudVariants[6].y }}
          transition={{
            duration: cloudVariants[6].duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Animation */}
      <MeetInMiddleAnimation triggerAnimation={triggerAnimation} initialState="hidden" />

      <div className={styles.heroContent}>
        <h1>Adventure</h1>
        <p className={styles.heroSubText}>With Jonny & Sadie</p>
        <button onClick={handleViewAdventures}>View Adventures</button>
      </div>
    </div>
  );
};

export default Home;
