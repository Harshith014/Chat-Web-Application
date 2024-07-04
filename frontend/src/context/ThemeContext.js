import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import React, { createContext, useMemo, useState } from 'react';

export const ColorModeContext = createContext({ toggleColorMode: () => { }, mode: 'light' });

export const ThemeContextProvider = ({ children }) => {
    const [mode, setMode] = useState('light');

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
            },
            mode,
        }),
        [mode]
    );

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    ...(mode === 'dark' && {
                        background: {
                            default: '#121212',
                            paper: '#1d1d1d',
                        },
                        text: {
                            primary: '#ffffff',
                            secondary: '#bbbbbb',
                        },
                    }),
                    ...(mode === 'light' && {
                        background: {
                            default: '#ffffff',
                            paper: '#f5f5f5',
                        },
                        text: {
                            primary: '#000000',
                            secondary: '#333333',
                        },
                    }),
                },
            }),
        [mode]
    );

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};
