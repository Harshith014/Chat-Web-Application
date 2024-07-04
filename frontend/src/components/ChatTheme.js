import { Box, Button, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React from 'react';

const ChatTheme = ({ themes, onSelectTheme }) => {
    const theme = useTheme();

    return (
        <Box
            className="chat-theme-selector p-4"
            style={{
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: '8px'
            }}
        >
            <Typography variant="h6" gutterBottom>
                Select Theme
            </Typography>
            <Box
                className="theme-buttons"
                style={{
                    display: 'flex',
                    overflowX: 'auto',
                    gap: '8px',
                    padding: '8px 0'
                }}
            >
                {themes.map((themeOption, index) => (
                    <Button
                        key={index}
                        variant="contained"
                        onClick={() => onSelectTheme(themeOption)}
                        style={{
                            backgroundColor: themeOption.backgroundColor,
                            color: themeOption.textColor,
                            minWidth: '120px',
                            flexShrink: 0
                        }}
                    >
                        {themeOption.name}
                    </Button>
                ))}
            </Box>
        </Box>
    );
};

export default ChatTheme;
