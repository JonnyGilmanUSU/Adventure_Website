import React from 'react';
import { motion } from 'framer-motion';
import styles from './MeetInMiddleAnimation.module.scss';
import CactusTopHalf from '../Assets/cactus_halves/Cactus_Top_Half.svg';
import CactusBottomHalf from '../Assets/cactus_halves/Cactus_Bottom_Half.svg';

const MeetInMiddleAnimation = ({ triggerAnimation, reverse = false, initialState = 'hidden', onAnimationComplete }) => {
  const initialTopY = initialState === 'hidden' ? '-100%' : 0; // Start off-screen or overlayed
  const initialBottomY = initialState === 'hidden' ? '100%' : 0;

  return (
    <>
      {/* Top Section */}
      <motion.div
        className={styles.topSection}
        initial={{ y: initialTopY }}
        animate={{ y: triggerAnimation ? (reverse ? '-100%' : 0) : initialTopY }}
        transition={{
          duration: 2,
          ease: 'easeInOut',
          type: 'spring',
          stiffness: 125,
          damping: 25,
        }}
        onAnimationComplete={onAnimationComplete}
      >
        <img src={CactusTopHalf} alt="Cactus Top Half" className={styles.cactusTop} />
      </motion.div>

      {/* Bottom Section */}
      <motion.div
        className={styles.bottomSection}
        initial={{ y: initialBottomY }}
        animate={{ y: triggerAnimation ? (reverse ? '100%' : 0) : initialBottomY }}
        transition={{
          duration: 2,
          ease: 'easeInOut',
          type: 'spring',
          stiffness: 125,
          damping: 25,
        }}
      >
        <img src={CactusBottomHalf} alt="Cactus Bottom Half" className={styles.cactusBottom} />
      </motion.div>
    </>
  );
};

export default MeetInMiddleAnimation;
