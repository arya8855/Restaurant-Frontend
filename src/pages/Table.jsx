import React, { useState, useEffect } from 'react';
import TableUnit from './TableUnit';
import './Table.css';

const Table = () => {
    const [tables, setTables] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newTable, setNewTable] = useState({
        tableName: '',
        chairCount: 2,
        number: 0, 
    });
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState('');

    const fetchTables = async () => {
        try {
            console.log('Fetching tables from:', `${import.meta.env.VITE_BASE_URL}/api/tables`);
            
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/tables`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Tables response:', data);
            
            if (data.success) {
                const tablesWithFakeName = data.data.map((table, index) => ({
                    ...table,
                    fakeName: index + 1,
                }));
                setTables(tablesWithFakeName);
                
            
                const nextTableNumber = tablesWithFakeName.length > 0 
                    ? Math.max(...tablesWithFakeName.map(t => t.number || 0)) + 1
                    : 1;
                
                setNewTable(prev => ({
                    ...prev,
                    number: nextTableNumber,
                    tableName: `Table ${nextTableNumber}`
                }));
            } else {
                console.error('API returned success: false', data);
                setError('Failed to load tables: ' + (data.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error fetching tables:', error);
            setError('Failed to load tables: ' + error.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/tables/${id}`, {
                method: 'DELETE',
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            if (data.success) {
                fetchTables();
            }
        } catch (error) {
            console.error('Error deleting table:', error);
            setError('Failed to delete table: ' + error.message);
        }
    };

    const handleCreate = async () => {
        if (isCreating) return;
        
        if (!newTable.tableName.trim()) {
            setError('Please enter a table name');
            return;
        }

        setIsCreating(true);
        setError('');

        try {
            const tableData = {
                tableName: newTable.tableName.trim(),
                chairCount: parseInt(newTable.chairCount),
                number: parseInt(newTable.number) 
            };

            console.log('Creating table with data:', tableData);

            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/tables`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tableData),
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    errorMessage = response.statusText || errorMessage;
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log('Create response:', data);

            if (data.success) {
                setShowModal(false);
                setNewTable({
                    tableName: '',
                    chairCount: 2,
                    number: 0,
                });
                await fetchTables();
            } else {
                throw new Error(data.message || 'Failed to create table');
            }
        } catch (error) {
            console.error('Error creating table:', error);
            setError('Error creating table: ' + error.message);
        } finally {
            setIsCreating(false);
        }
    };

    useEffect(() => {
        fetchTables();
    }, []);

    const openModal = () => {
        
        const nextTableNumber = tables.length > 0 
            ? Math.max(...tables.map(t => t.number || 0)) + 1
            : 1;
            
        setNewTable({
            tableName: `Table ${nextTableNumber}`,
            chairCount: 2,
            number: nextTableNumber, 
        });
        setError('');
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setIsCreating(false);
        setError('');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTable((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (error) setError('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !isCreating) {
            handleCreate();
        }
    };

    const renderTableRows = () => {
        const rows = [];
        for (let i = 0; i < tables.length; i += 7) {
            const rowTables = tables.slice(i, i + 7);
            rows.push(
                <div className="table-row" key={i}>
                    {rowTables.map((table) => (
                        <TableUnit key={table._id} table={table} onDelete={handleDelete} />
                    ))}
                </div>
            );
        }
        return rows;
    };

    return (
        <div className="table-container">
          <h2>Tables</h2>
            {error && (
                <div className="error-banner">
                    {error}
                    <button onClick={() => setError('')} className="error-close">×</button>
                </div>
            )}
            
            {renderTableRows()}
            <button className="add-table-btn" onClick={openModal}>
                +
            </button>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Create New Table</h2>
                        
                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}
                        
                        <div className="form-group">
                            <label>Table Number *</label>
                            <input
                                type="number"
                                name="number"
                                value={newTable.number}
                                onChange={handleInputChange}
                                placeholder="Table number"
                                disabled={isCreating}
                                min="1"
                            />
                        </div>
                        <div className="form-group">
                            <label>Table Name *</label>
                            <input
                                type="text"
                                name="tableName"
                                value={newTable.tableName}
                                onChange={handleInputChange}
                                onKeyPress={handleKeyPress}
                                placeholder="Enter table name"
                                disabled={isCreating}
                            />
                        </div>
                        <div className="form-group">
                            <label>Chair Count</label>
                            <select
                                name="chairCount"
                                value={newTable.chairCount}
                                onChange={handleInputChange}
                                disabled={isCreating}
                            >
                                <option value={2}>2</option>
                                <option value={4}>4</option>
                                <option value={6}>6</option>
                                <option value={8}>8</option>
                            </select>
                        </div>
                        <div className="modal-actions">
                            <button 
                                className="create-btn" 
                                onClick={handleCreate}
                                disabled={isCreating || !newTable.tableName.trim() || !newTable.number}
                            >
                                {isCreating ? 'Creating...' : 'Create'}
                            </button>
                            <button 
                                className="cancel-btn" 
                                onClick={closeModal}
                                disabled={isCreating}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Table;