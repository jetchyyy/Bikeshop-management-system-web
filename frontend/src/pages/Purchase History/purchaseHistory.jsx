import { useState, useEffect } from "react";
import { database } from "../../firebase/firebase";
import { ref, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";
import DateRangePicker from "../../DateRangePicker/DateRangePicker";

function PurchaseHistory() {
  const [purchaseHistoryList, setPurchaseHistoryList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const navigate = useNavigate();

  const toggleDeleteModal = () => {
    setDeleteModal(!deleteModal);
  };

  const handleDelete = async () => {
    await remove(ref(database, `purchase/${currentItem.id}`));
    toggleDeleteModal();
  };

  const confirmDelete = (item) => {
    setCurrentItem(item);
    toggleDeleteModal();
  };

  const handleViewClick = (id) => {
    navigate(`/purchase/${id}`);
  };

  useEffect(() => {
    const purchaseHistoryRef = ref(database, "purchase");

    const unsubscribe = onValue(purchaseHistoryRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedData = Object.keys(data).map((key) => {
          const item = data[key];
          return {
            id: key,
            ...item,
          };
        });
        setPurchaseHistoryList(formattedData);
      } else {
        setPurchaseHistoryList([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const filteredPurchaseHistory = purchaseHistoryList.filter((item) => {
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
      <div className="relative overflow-x-auto rounded-md shadow-sm">
        <table className="w-full text-md text-gray-900 text-center border border-slate-200">
          <thead className="text-md bg-slate-200">
            <tr>
              <th className="px-6 py-3">Customer Name</th>
              <th className="px-6 py-3">Item Purchased</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPurchaseHistory.length > 0 ? (
              filteredPurchaseHistory.map((item) => (
                <tr
                  key={item.id}
                  className="bg-white border-b hover:bg-slate-100"
                >
                  <td className="px-6 py-3">{item.customerName}</td>
                  <td className="px-6 py-3">{item.itemName}</td>
                  <td className="px-6 py-3">{item.date}</td>
                  <td className="px-6 py-3">
                    <button
                      className="ml-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-1 rounded-md"
                      onClick={() => handleViewClick(purchase.id)}
                    >
                      VIEW
                    </button>
                    <button
                      className="ml-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md"
                      onClick={() => confirmDelete(item)}
                    >
                      DELETE
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td td colSpan="4" className="px-6 py-3">
                  No Purchase History yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {deleteModal && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3">
            <h2 className="text-lg font-bold mb-4">Delete Confirmation</h2>
            <p>Are you sure you want to delete this item?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={toggleDeleteModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PurchaseHistory;
