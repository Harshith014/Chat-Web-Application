import DescriptionIcon from '@mui/icons-material/Description';
import DownloadIcon from '@mui/icons-material/Download';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { saveAs } from 'file-saver';
import React, { useEffect, useState } from 'react';

const DocumentPreview = ({ docUrl, docName }) => {
    const theme = useTheme();
    const [fileExists, setFileExists] = useState(false);

    useEffect(() => {
        // Check if the file exists locally
        const checkFileExists = async () => {
            try {
                const filePath = `./downloads/${docName}`;
                const response = await fetch(filePath, { method: 'HEAD' });
                setFileExists(response.ok);
            } catch (error) {
                setFileExists(false);
            }
        };
        checkFileExists();
    }, [docName]);

    const handleDownload = () => {
        saveAs(`${process.env.REACT_APP_URI}${docUrl}`, docName);
    };

    const handleOpen = () => {
        const filePath = `./downloads/${docName}`;
        window.open(filePath, '_blank');
    };

    return (
        <Box
            display="flex"
            alignItems="center"
            bgcolor={theme.palette.background.paper}
            p={2}
            borderRadius={2}
            boxShadow={1}
            width="fit-content"
        >
            <DescriptionIcon style={{ marginRight: 8 }} />
            <Box>
                <Typography variant="body2" noWrap>
                    {docName}
                </Typography>
                <Box display="flex" alignItems="center" mt={1}>
                    {fileExists ? (
                        <IconButton size="small" onClick={handleOpen}>
                            <OpenInNewIcon />
                        </IconButton>
                    ) : (
                        <IconButton size="small" onClick={handleDownload}>
                            <DownloadIcon />
                        </IconButton>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default DocumentPreview;
