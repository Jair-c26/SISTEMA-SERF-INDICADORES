// En DeleteUser.jsx
import React, { useState, useEffect } from 'react';
import userListService from '../../../services/api/user-list/userListService';
import OptionalAlert from '../../../components/alert/OptionalAlert';

export default function DeleteUser({ userId, onUserDeleted }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAlert, setShowAlert] = useState(true);

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await userListService.deleteUser(userId);
      if (result.status === 200) {
        onUserDeleted(userId);
      }
    } catch (err) {
      setError("Hubo un error al eliminar el usuario.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    await handleDelete();
  };

  useEffect(() => {
    setShowAlert(true); // Reinicia la alerta cuando cambia userId
  }, [userId]);

  useEffect(() => {
    if (showAlert) {
      OptionalAlert({
        title: "¿Estás seguro de que deseas eliminar este usuario?",
        text: "¡Esta acción no se puede deshacer!",
        onConfirm: handleConfirmDelete,
      }).then(() => setShowAlert(false));
    }
  }, [showAlert, userId]);

  return (
    <div>
      {loading && <p>Eliminando usuario...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
