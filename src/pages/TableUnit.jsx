import React from 'react';
import { RiDeleteBin6Line } from "react-icons/ri";
import './TableUnit.css';

const TableUnit = ({ table, onDelete }) => {
    return (
        <div className="table-unit">
            <h3>Table {table.fakeName}</h3>
            <button className="delete-btn" onClick={() => onDelete(table._id)}>
                <RiDeleteBin6Line />
            </button>
            <span className="chair-count">{table.chairCount} chairs</span>
        </div>
    );
};

export default TableUnit;