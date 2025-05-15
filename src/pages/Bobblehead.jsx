import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Bobblehead = ({ player, photo, path, duration }) => {
  const controls = useAnimation();
  const navigate = useNavigate();

  useEffect(() => {
    async function animate() {
      await controls.start({
        x: path.map(p => p.x),
        y: path.map(p => p.y),
        transition: { duration, ease: 'easeInOut' },
      });
      controls.start({
        rotate: [0, 10, -10, 10, -10, 0],
        transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' },
      });
    }
    animate();
  }, []);

  if (!photo || !path?.length) return null;

  return (
    <motion.img
      src={photo}
      alt={player}
      className="absolute w-8 h-8 rounded-full z-50"

      initial={path[0]}
      animate={controls}
      style={{ cursor: 'pointer' }}
      onClick={() => navigate(`/player/${encodeURIComponent(player)}`)}
    />
  );
};

export default Bobblehead;
