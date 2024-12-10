import { useState } from "react";
import { ref, push, set } from "firebase/database";
import { database } from "../../firebase/firebase";

function AddSupplier({ isOpen, toggleSupplierModal }) {
  const [supplier, setSupplier] = useState("");
  const [loading, setLoading] = useState(false);

  //add another category to the category db
  const addSupplier = async () => {
    if (!supplier.trim()) {
      alert("Supplier name cannot be empty.");
      return;
    }

    const supplierRef = ref(database, "supplier");
    const newSupplierRef = push(supplierRef);

    const supplierData = {
      supplier: supplier.trim(), // Use a consistent property name like categoryName
    };

    try {
      setLoading(true); // Optional: Add loading state
      await set(newSupplierRef, supplierData);

      alert("Supplier has been added successfully!");
      setSupplier(""); // Clear the input field
    } catch (error) {
      console.error("Error adding supplier:", error);
      alert("Error adding supplier: " + error.message);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 relative max-h-[90vh] overflow-y-auto">
        <input
          type="text"
          placeholder="Enter new supplier"
          value={supplier}
          onChange={(e) => setSupplier(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring border-gray-300"
          disabled={loading}
        />
        <div className="flex justify-start mt-4">
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 mr-2"
          onClick={addSupplier} disabled={loading || !supplier.trim()}>
            {loading ? "Adding..." : "Add Supplier"}
          </button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          onClick={toggleSupplierModal} disabled={loading}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddSupplier;
