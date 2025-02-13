import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';

export default function Admin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.log('No user found');
        navigate('/');
        return;
      }

      try {
        // Get the authorized admins document
        const adminsRef = doc(db, 'adminAccess', 'authorizedEmails');
        const adminsDoc = await getDoc(adminsRef);
        
        if (!adminsDoc.exists()) {
          console.error('Admin configuration not found');
          navigate('/');
          return;
        }

        const authorizedEmails = adminsDoc.data().emails || [];
        
        if (!authorizedEmails.includes(user.email)) {
          console.error('Unauthorized access attempt');
          navigate('/');
          return;
        }

        setLoading(false);
      } catch (err) {
        console.error('Error checking admin access:', err);
        setError('Erreur lors de la vérification des droits d\'accès');
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Administration
        </Typography>
        {/* Admin content will go here */}
      </Box>
    </Container>
  );
}
