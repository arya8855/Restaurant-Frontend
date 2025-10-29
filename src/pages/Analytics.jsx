import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import './Analytics.css';
import { useFilter } from '../context/filterContext';
import { MdPeopleAlt } from "react-icons/md";
import { PiClipboardTextBold, PiChefHat } from "react-icons/pi";

const Analytics = () => {
  const [orders, setOrders] = useState([]);
  const [chefs, setChefs] = useState([]);
  const [tables, setTables] = useState([]);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('Daily'); 

  const { activeFilter } = useFilter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/api/orders`);
        const chefsResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/api/chefs`);
        const tablesResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/api/tables`);

        if (!ordersResponse.ok || !chefsResponse.ok || !tablesResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const ordersData = await ordersResponse.json();
        const chefsData = await chefsResponse.json();
        const tablesData = await tablesResponse.json();

       
        const tablesWithFakeNumber = tablesData.data.map((table, index) => ({
          ...table,
          fakeNumber: index + 1,
          bookingStatus: 'N',
        }));

        setOrders(ordersData);
        setChefs(chefsData);
        setTables(tablesWithFakeNumber);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, []);

  // ====== FILTER LOGIC ======
  const getFilteredOrders = () => {
    const now = new Date();
    return orders.filter(order => {
      const orderDate = new Date(order.orderedTime);
      const diffDays = (now - orderDate) / (1000 * 60 * 60 * 24);

      if (filter === 'Daily') return diffDays < 1;
      if (filter === 'Weekly') return diffDays < 7;
      if (filter === 'Yearly') return diffDays < 365;
      return true;
    });
  };

  const filteredOrders = getFilteredOrders();

  // ====== METRICS ======
  const totalChefs = chefs.length;
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.orderPrice, 0);
  const totalOrders = filteredOrders.length;
  const uniqueClients = new Set(filteredOrders.map(o => o.customerMobileNumber)).size;

  const dineInOrders = filteredOrders.filter(o => o.orderType === 'Dine In').length;
  const takeAwayOrders = filteredOrders.filter(o => o.orderType === 'Take Away').length;
  const doneOrders = filteredOrders.filter(o => o.orderType === 'Served').length;

  const matchFilter = (keyword) =>
    !activeFilter || keyword.toLowerCase().includes(activeFilter);

  const totalPieOrders = dineInOrders + takeAwayOrders + doneOrders;
  const pieData = [
    { name: 'Dine In', value: dineInOrders },
    { name: 'Take Away', value: takeAwayOrders },
    { name: 'Served', value: doneOrders },
  ];
  // ====== PERCENTAGE CALCULATIONS ======
  const servedPercent = totalOrders > 0 ? ((doneOrders / totalOrders) * 100).toFixed(0) : 0;
  const takeAwayPercent = totalOrders > 0 ? ((takeAwayOrders / totalOrders) * 100).toFixed(0) : 0;
  const dineInPercent = doneOrders > 0 ? ((dineInOrders / doneOrders) * 100).toFixed(0) : 0;

  const percentageData = [
    { label: 'Take Away', percent: takeAwayPercent },
    { label: 'Served', percent: servedPercent },
    { label: 'Dine In', percent: dineInPercent },
  ];

  const COLORS = ['#9e9b9bff', '#655f5fff', '#C4C4C4'];

  // ====== REVENUE BY DAY ======
  const today = new Date();
  const daysCount = filter === 'Daily' ? 1 : filter === 'Weekly' ? 7 : 30;
  const pastDays = Array.from({ length: daysCount }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    return d;
  }).reverse();

  const revenueByDay = pastDays.map(date => {
    const dayLabel =
      filter === 'Yearly'
        ? date.toLocaleString('en-US', { month: 'short', day: 'numeric' })
        : date.toLocaleString('en-US', { weekday: 'short' });

    const revenue = filteredOrders
      .filter(o => {
        const orderDate = new Date(o.orderedTime);
        return (
          orderDate.getDate() === date.getDate() &&
          orderDate.getMonth() === date.getMonth() &&
          orderDate.getFullYear() === date.getFullYear()
        );
      })
      .reduce((sum, o) => sum + o.orderPrice, 0);

    return { day: dayLabel, revenue };
  });

  // ====== TABLES GRID ======
  const renderTableRows = () => {
    const rows = [];
    for (let i = 0; i < tables.length; i += 7) {
      const rowTables = tables.slice(i, i + 7);
      rows.push(
        <div className="table-row" key={i}>
          {rowTables.map((table) => (
            <div
              key={table._id}
              className="table-square"
              style={{
                backgroundColor: table.bookingStatus === 'B' ? '#28a745' : '#d3d3d3',
              }}
            >
              <span>Table {table.fakeNumber}</span>
            </div>
          ))}
        </div>
      );
    }
    return rows;
  };

  return (
    <div className="analytics-container">
      <h1>Analytics</h1>
      
      <div className="top-section">
        <div
          className={`box ${matchFilter('Total Chef') ? '' : 'blurred'}`}>
          <div className="box-content">
            <div className="icon"><PiChefHat /></div>
            <p>{totalChefs}</p>
          </div>
          <h3>TOTAL CHEF</h3>
        </div>

        <div
          className={`box ${matchFilter('Total Revenue') ? '' : 'blurred'}`}>
          <div className="box-content">
            <div className="icon">₹</div> 
            <p>₹{totalRevenue}</p>
          </div>
          <h3>TOTAL REVENUE</h3>
        </div>

        <div
          className={`box ${matchFilter('Total Orders') ? '' : 'blurred'}`}>
          <div className="box-content">
            <div className="icon"><PiClipboardTextBold /></div>   
            <p>{totalOrders}</p>
          </div>
          <h3>TOTAL ORDERS</h3>
        </div>

        <div
          className={`box ${matchFilter('Total Clients') ? '' : 'blurred'}`}>
          <div className="box-content">
            <div className="icon"><MdPeopleAlt /></div> 
            <p>{uniqueClients}</p>
          </div>
          <h3>TOTAL CLIENTS</h3>
        </div>
      </div>
      <div className="middle-section">
        <div className="chart-box">
          <div className="chart-header">
            <h3>Order Summary</h3>
            <select
              className="filter-dropdown"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option>Daily</option>
              <option>Weekly</option>
              <option>Yearly</option>
            </select>
          </div>

          <div className="order-summary-boxes">
            <div className="summary-box">
              <h4>Served</h4>
              <p>{doneOrders}</p>
            </div>
            <div className="summary-box">
              <h4>Dine In</h4>
              <p>{dineInOrders}</p>
            </div>
            <div className="summary-box">
              <h4>Take Away</h4>
              <p>{takeAwayOrders}</p>
            </div>
          </div>

          <div className="order-summary-content">
            <div className="chart-progress-container">
              <div className="donut-chart">
                <PieChart width={250} height={200}>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </div>

              
              <div className="progress-bars">
                {percentageData.map((item, index) => (
                  <div key={index} className="progress-bar-container">
                    <div className="progress-label">
                      {item.label} <span>({item.percent}%)</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${item.percent}%`,
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        
        <div className="chart-box">
          <div className="chart-header">
            <h3>Revenue</h3>
            <select className="filter-dropdown" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option>Daily</option>
              <option>Weekly</option>
              <option>Yearly</option>
            </select>
          </div>

          <BarChart width={300} height={200} data={revenueByDay}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#8884d8" />
          </BarChart>
        </div>
        <div className="chart-box">
          <div className="tables-box">
            <h3>Tables</h3>

            <div className="table-legend">
              <span><span className="dot available"></span>Available</span>
              <span><span className="dot booked"></span>Booked</span>
            </div>

            <div className="table-grid">
              {tables.map((t) => (
                <div
                  key={t._id}
                  className={`table-square ${t.tableStatus === 'A' ? 'available' : 'booked'}`}
                >
                  <div>Table</div>
                  <span>{t.tableName}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
      <div className="bottom-section">
        <table className="chefs-table">
          <thead>
            <tr>
              <th>Chef Name</th>
              <th>Orders Taken</th>
            </tr>
          </thead>
          <tbody>
            {chefs.map((chef) => (
              <tr key={chef._id}>
                <td>{chef.name}</td>
                <td>{chef.currentOrders}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Analytics;