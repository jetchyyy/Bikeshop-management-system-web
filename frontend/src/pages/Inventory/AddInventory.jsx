import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { ref, push, set, onValue } from "firebase/database";
import { database } from "../../firebase/firebase";

function generateRandomKey(length) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function AddInventory({ isOpen, toggleModal }) {
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [itemNameError, setItemNameError] = useState(false);
  const [categoryError, setCategoryError] = useState(false);
  const [priceError, setPriceError] = useState(false);
  const [stockQuantityError, setStockQuantityError] = useState(false);

  const handleSubmit = async () => {
    setItemNameError(!itemName);
    setCategoryError(!category);
    setPriceError(!price);
    setStockQuantityError(!stockQuantity);

    if (!itemName || !category || !price || !stockQuantity) {
      return;
    }

    const inventoryRef = ref(database, "inventory");
    const newInventoryRef = push(inventoryRef);

    const qrKey = generateRandomKey(20);

    try {
      setLoading(true);
      const qrCodeDataUrl = await QRCode.toDataURL(qrKey, { width: 100 });

      const inventoryData = {
        itemName,
        price,
        category,
        stockQuantity,
        qrCode: qrCodeDataUrl,
      };

      await set(newInventoryRef, inventoryData);
      alert("Inventory has been added successfully!");
      setItemName("");
      setCategory("");
      setPrice("");
      setStockQuantity("");
      toggleModal();
    } catch (error) {
      alert("Error adding inventory: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  //fetch the data of category for dropdown
  useEffect(() => {
    const categoryRef = ref(database, "category");

    const unsubscribe = onValue(categoryRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedData = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setCategoryList(formattedData);
      } else {
        setCategoryList([]);
      }
    });
    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 relative max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Add Inventory</h2>

        <div>
          <label htmlFor="itemName">Item Name</label>
          <input
            type="text"
            id="itemName"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring ${
              itemNameError ? "border-red-500" : "border-gray-300"
            }`}
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            disabled={loading}
          />
          {itemNameError && <p className="text-red-500 mt-1">Required</p>}
        </div>

        <div>
          <label htmlFor="category">Category</label>
          <select
            id="category"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring ${
              categoryError ? "border-red-500" : "border-gray-300"
            }`}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={loading}
          >
            <option value="" disabled>
              Select Category
            </option>
            {categoryList.map((item) => (
              <option key={item.id} value={item.category}>
                {item.category}
              </option>
            ))}
          </select>
          {categoryError && <p className="text-red-500 mt-1">Required</p>}
        </div>

        <div>
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring ${
              priceError ? "border-red-500" : "border-gray-300"
            }`}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            disabled={loading}
          />
          {priceError && <p className="text-red-500 mt-1">Required</p>}
        </div>

        <div>
          <label htmlFor="stockQuantity">Stock Quantity</label>
          <input
            type="number"
            id="stockQuantity"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring ${
              stockQuantityError ? "border-red-500" : "border-gray-300"
            }`}
            value={stockQuantity}
            onChange={(e) => setStockQuantity(e.target.value)}
            disabled={loading}
          />
          {stockQuantityError && <p className="text-red-500 mt-1">Required</p>}
        </div>

        <div>
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Loading..." : "Submit"}
          </button>
          <button onClick={toggleModal} disabled={loading}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddInventory;
