import { useState, useEffect } from "react";
import { ref, onValue, remove, update } from "firebase/database";
import { database } from "../../firebase/firebase";
import QRCode from "react-qr-code";
import AddInventory from "./AddInventory";
import EditInventoryModal from "./EditInventoryModal";
import AddCategory from "./AddCategory";
import AddSupplier from "./AddSupplier";

function Inventory() {
  const [inventoryList, setInventoryList] = useState([]);
  const [modal, setModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [categoryModal, setCategoryModal] = useState(false);
  const [supplierModal, setSupplierModal] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  };

  const toggleDeleteModal = () => {
    setDeleteModal(!deleteModal);
  };

  const toggleEditModal = () => {
    setEditModal(!editModal);
  };

  const toggleCategoryModal = () => {
    setCategoryModal(!categoryModal);
  };

  const toggleSupplierModal = () => {
    setSupplierModal(!supplierModal);
  }
  const handleEdit = (item) => {
    setCurrentItem(item);
    toggleEditModal();
  };

  //retrieve data from the db
  useEffect(() => {
    const inventoryRef = ref(database, "inventory");

    const unsubscribe = onValue(inventoryRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedData = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setInventoryList(formattedData);
      } else {
        setInventoryList([]);
      }
    });

    return () => unsubscribe();
  }, []);

  //delete data from db
  const handleDelete = async () => {
    await remove(ref(database, `inventory/${currentItem.id}`));
    toggleDeleteModal();
  };

  const confirmDelete = (item) => {
    setCurrentItem(item);
    toggleDeleteModal();
  };

  //edit data from table
  const handleUpdate = async (updatedInventory) => {
    await update(
      ref(database, `inventory/${currentItem.id}`),
      updatedInventory
    );
    toggleEditModal();
  };

  //search bar
  const filteredInventoryList = inventoryList.filter(
    (item) =>
      item.itemName &&
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="my-4">
        <input
          type="text"
          placeholder="Search by item name..."
          className="border border-slate-300 px-4 py-2 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <button onClick={toggleModal}>Add Inventory</button>
      {modal && <AddInventory isOpen={modal} toggleModal={toggleModal} />}

      <button onClick={toggleSupplierModal}>Add Supplier</button>
      {supplierModal && (
        <AddSupplier isOpen={supplierModal} toggleCategoryModal={toggleSupplierModal}/>
      )}
      <button onClick={toggleCategoryModal}> Add Category</button>
      {categoryModal && (
        <AddCategory
          isOpen={categoryModal}
          toggleCategoryModal={toggleCategoryModal}
        />
      )}
      <div className="relative overflow-x-auto rounded-md shadow-sm">
        <table className="w-full text-md text-gray-900 text-center border border-slate-200">
          <thead className="text-md bg-slate-200">
            <tr>
              <th className="px-6 py-3">Item Name</th>
              <th className="px-6 py-3">Supplier Name</th>
              <th className="px-6 py-3">QR Code</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Stock Quantity</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventoryList.length > 0 ? (
              filteredInventoryList.map((item) => (
                <tr
                  key={item.id}
                  className="bg-white border-b hover:bg-slate-100"
                >
                  <td className="px-6 py-3">{item.itemName}</td>
                  <td className="px-6 py-3">{item.supplier}</td>
                  <td className="px-6 py-3">
                    <QRCode size={50} value={item.id} />
                  </td>
                  <td className="px-6 py-3">{item.category}</td>
                  <td className="px-6 py-3">{item.price}</td>
                  <td className="px-6 py-3">{item.stockQuantity}</td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => handleEdit(item)}
                      className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md"
                    >
                      Edit
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
                <td colSpan="5" className="px-6 py-3">
                  Inventory is Empty
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

      <EditInventoryModal
        isOpen={editModal}
        toggleModal={toggleEditModal}
        currentItem={currentItem}
        handleUpdate={handleUpdate}
      />
    </div>
  );
}

export default Inventory;
