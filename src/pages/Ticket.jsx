import { React, useState} from 'react';
import { PiForkKnifeFill } from "react-icons/pi";
import { BsPatchCheckFill } from "react-icons/bs";
import './Ticket.css';
import { useEffect } from "react";

const Ticket = ({ order }) => {
    const orderedTime = new Date(order.orderedTime);
    const estimatedTime = new Date(orderedTime.getTime() + order.orderPrepTime * 60 * 1000);
    const currentTime = new Date();
    const isOrderDone = currentTime >= estimatedTime;
    const statusText = isOrderDone ? 'Done' : 'Processing';

    const totalItems = order.dishOrdered.reduce((sum, dish) => 
        sum + dish.dishQuantity, 0);

    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const diffMs = now - orderedTime;
            const diffMin = Math.floor(diffMs / 60000);
            const hours = Math.floor(diffMin / 60);
            const minutes = diffMin % 60;

            if (hours > 0) {
                setElapsed(`${hours} hr ${minutes} min`);
            } else {
                setElapsed(`${minutes} min`);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [orderedTime]);


    const cardType =
        order.orderType?.toLowerCase().includes('dine')
          ? 'dinein'
          : order.orderType?.toLowerCase().includes('take')
          ? 'takeaway'
          : 'done';

    return (
        <div
            className={`ticket-card ${cardType}`}>
            <div className="ticket-info-box">
                <div className="ticket-top">
                    <h3><PiForkKnifeFill color="#007AFF" /> #{order.orderNumber}</h3>
                    <div className="status-badge">
                        <span className="main">
                            {order.orderType}
                        </span>
                        {/* <span className="sub">
                            {order.orderType?.toLowerCase().includes('dine')
                              ? `Ongoing: ${elapsed}`
                              : order.orderType?.toLowerCase().includes('take')
                              ? 'Not Picked up'
                              : 'Served'}
                        </span> */}
                    </div>
                    <p>Table: {order.tableName}</p>
                    <p>Order Time: {orderedTime.toLocaleString()}</p>
                    <p>Items: {totalItems}</p>
                </div>
            </div>
            <div className="ticket-middle">
                <h4>Dishes</h4>
                <div className="dish-list">
                    {order.dishOrdered.map((dish) => (
                        <div key={dish._id} className="dish-item">
                            <span>{dish.dishName}</span>
                            <span>Qty: {dish.dishQuantity}</span>
                        </div>
                    ))}
                    {order.orderCookingInstructions && (
                        <p className="cooking-instructions">
                            Instructions: {order.orderCookingInstructions}
                        </p>
                    )}
                </div>
            </div>

            <div className="ticket-bottom">
                <button
                    className={`status-button ${order.orderType?.toLowerCase().includes('dine') ||
                        order.orderType?.toLowerCase().includes('take')
                        ? 'processing'
                        : 'done'
                        }`}
                >
                    {order.orderType?.toLowerCase().includes('dine') ||
                        order.orderType?.toLowerCase().includes('take')
                        ? 'Processing ⏳'
                        : (
                            <>
                                Order Done <BsPatchCheckFill color="#0E912F" />
                            </>
                          )
                    }  
                </button>
            </div>

        </div>
    );
};

export default Ticket;