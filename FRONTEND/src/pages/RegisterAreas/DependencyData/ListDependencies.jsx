// hooks/useFetchDependencies.js
import { useState, useEffect } from 'react';
import dependencyService from '../../../services/api/dependency-list/dependencyService';

const ListDependencies = () => {
    const [dependencies, setDependencies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDependencies = async () => {
            try {
                const response = await dependencyService.getAllDependencies();
                setDependencies(response.data || []);
            } catch (error) {
                console.error('Error al obtener las dependencias:', error);
                setDependencies([]);
            } finally {
                setLoading(false);
            }
        };

        fetchDependencies();
    }, []);

    return { dependencies, loading };
};

export default ListDependencies;
