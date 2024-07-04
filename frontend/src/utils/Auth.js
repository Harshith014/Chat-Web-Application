// src/utils/auth.js
import { jwtDecode } from 'jwt-decode';

export const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const decodedToken = jwtDecode(token);
        return decodedToken.id; // Adjust according to the actual key in your token payload
    } catch (e) {
        console.error('Invalid token', e);
        return null;
    }
};

// src/utils/auth.js
// import jwtDecode from 'jwt-decode';

// export const getUserIdFromToken = (token) => {
//   try {
//     const decodedToken = jwtDecode(token);
//     return decodedToken.userId; // Adjust according to the actual key in your token payload
//   } catch (error) {
//     console.error('Invalid token:', error);
//     return null;
//   }
// };

