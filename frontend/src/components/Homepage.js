// src/Rain.js
import { animated, config, useSprings } from '@react-spring/web';
import React from 'react';

const Rain = () => {
    const raindrops = Array.from({ length: 1000 }); // Increased the number of raindrops for even better coverage

    const springs = useSprings(
        raindrops.length,
        raindrops.map((_, index) => ({
            from: { transform: 'translateY(-10vh)' },
            to: { transform: 'translateY(110vh)' },
            config: { ...config.slow, duration: 6000 }, // Slower config for a more natural look
            loop: true,
            delay: index * 50, // Adjusted delay for a more continuous and slower rain effect
        }))
    );

    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
            {springs.map((style, index) => (
                <animated.div
                    key={index}
                    style={{
                        ...style,
                        position: 'absolute',
                        top: 0,
                        left: `${Math.random() * 100}%`,
                        width: '2px',
                        height: '10px',
                        backgroundColor: 'lightblue',
                        borderRadius: '50%',
                    }}
                />
            ))}
        </div>
    );
};

export default Rain;
