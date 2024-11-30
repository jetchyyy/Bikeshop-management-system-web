import { useState, useEffect } from "react";
import { database } from "../../firebase/firebase";
import { ref, onValue } from "firebase/database";
import DateRangePicker from "../../DateRangePicker/DateRangePicker";

function SalesHistory() {
  const [salesHistoryList, setSalesHistoryList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const salesHistoryRef = ref(database, "sales");

    const unsubscribe = onValue(salesHistoryRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedData = Object.keys(data).map((key) => {
          const item = data[key];
          const price = item.price || 0;
          const quantity = item.quantity || 0;
          return {
            id: key,
            ...item,
            total: price * quantity,
          };
        });
        setSalesHistoryList(formattedData);
      } else {
        setSalesHistoryList([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const filteredSalesHistory = salesHistoryList.filter((item) => {
    const usageTimestamp = new Date(item.timestamp);

    // If only startDate is selected (single-day selection)
    if (startDate && !endDate) {
      const startOfDay = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate(),
        0,
        0,
        0
      );
      const endOfDay = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate(),
        23,
        59,
        59
      );
      const withinSingleDay =
        itemTimestamp >= startOfDay && itemTimestamp <= endOfDay;

      const matchesSearchTerm =
        item.itemName &&
        item.itemName?.toLowerCase().includes(searchTerm.toLowerCase());

      return withinSingleDay && matchesSearchTerm;
    }

    // If both startDate and endDate are selected (range selection)
    const withinDateRange =
      (!startDate || usageTimestamp >= startDate) &&
      (!endDate || usageTimestamp <= endDate);

    const matchesSearchTerm =
      item.itemName &&
      item.itemName?.toLowerCase().includes(searchTerm.toLowerCase());

    return withinDateRange && matchesSearchTerm;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Item Name, First Name, or Last Name"
          className="border rounded-md px-4 py-2"
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Item Sold</th>
            <th>Quantity</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {filteredSalesHistory.length > 0 ? (
            filteredSalesHistory.map((item) => (
              <tr key={item.id}>
                <td>{item.date}</td>
                <td>{item.itemName}</td>
                <td>{item.quantity}</td>
                <td>{item.total}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td td colSpan="5" className="px-6 py-3">
                No Sales History yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default SalesHistory;
