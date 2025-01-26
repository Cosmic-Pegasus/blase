import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './CSS/SwitcherBar.css';

const SwitcherBar = () => {
    const [isWomen, setIsWomen] = useState(window.location.pathname === '/blase-women');
    const navigate = useNavigate();

    const handleToggle = () => {
        setIsWomen(!isWomen);
        navigate(isWomen ? '/' : '/blase-women');
    };

    return (
        <motion.div 
            className="switcher-bar"
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="switcher-content">
                <div className="toggle-container">
                    <motion.div 
                        className={`toggle-option ${!isWomen ? 'active' : ''}`}
                        animate={{ opacity: !isWomen ? 1 : 0.5 }}
                    >
                        BLASE
                    </motion.div>

                    <div className="toggle-button-container" onClick={handleToggle}>
                        <div className="toggle-button">
                            <div className="toggle-indicators">
                                <div className={`indicator ${!isWomen ? 'active' : ''}`} />
                                <div className={`indicator ${isWomen ? 'active' : ''}`} />
                            </div>
                            <motion.div 
                                className="toggle-circle"
                                data-active={isWomen ? 'women' : 'men'}
                                animate={{ 
                                    x: isWomen ? 28 : 0,
                                }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                            <AnimatePresence mode='wait'>
                                <motion.div 
                                    key={isWomen ? 'women' : 'men'}
                                    className="toggle-icon"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {isWomen ? '♀' : '♂'}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    <motion.div 
                        className={`toggle-option ${isWomen ? 'active' : ''}`}
                        animate={{ opacity: isWomen ? 1 : 0.5 }}
                    >
                        BLASE WOMEN
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default SwitcherBar;
