import { useState, useEffect } from 'react';
import { ref, get, set, remove } from 'firebase/database';
import { database } from '../../../firebase/firebase';
import AddRoleModal from './AddRoleModal';
import EditRoleModal from './EditRoleModal';

const RolesTable = () => {
  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [showEditRoleModal, setShowEditRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRoles = async () => {
      const rolesRef = ref(database, 'roles');
      const snapshot = await get(rolesRef);
      if (snapshot.exists()) {
        const rolesList = [];
        snapshot.forEach((childSnapshot) => {
          rolesList.push({ id: childSnapshot.key, ...childSnapshot.val() });
        });
        
        setRoles(rolesList);
        setFilteredRoles(rolesList); 
      }
    };

    fetchRoles();
  }, []);

  useEffect(() => {
    setFilteredRoles(
      roles.filter(role =>
        role.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, roles]);

  const handleAddRole = async (newRole) => {
    const roleName = Object.keys(newRole)[0]; 
    const roleData = newRole[roleName]; 

    setRoles((prevRoles) => [
        ...prevRoles,
        { id: roleName, ...roleData } 
    ]);

    const roleRef = ref(database, `roles/${roleName}`); 
    try {
        await set(roleRef, roleData); 
    } catch (error) {
        console.error('Error adding role to database:', error);
    }
};

  const handleEditRole = (roleId, updatedRole) => {
    const roleRef = ref(database, `roles/${roleId}`);
  
    const roleData = {
      name: updatedRole.name,
      permissions: {
        accessInventory: updatedRole.permissions.accessInventory,
        accessHistory: updatedRole.permissions.accessHistory,
        accessAttendance: updatedRole.permissions.accessAttendance,
        accessAnalytics: updatedRole.permissions.accessAnalytics,
        accessNewCustomer: updatedRole.permissions.accessNewCustomer,
        accessSettings: updatedRole.permissions.accessSettings,
      }
    };
  
    set(roleRef, roleData)
      .then(() => {
        setRoles((prevRoles) =>
          prevRoles.map((role) => (role.id === roleId ? { id: roleId, ...roleData } : role))
        );
        setFilteredRoles((prevFiltered) =>
          prevFiltered.map((role) => (role.id === roleId ? { id: roleId, ...roleData } : role))
        );
        setShowEditRoleModal(false); 
      })
      .catch((error) => {
        console.error('Error updating role:', error);
      });
  };

  const handleDeleteRole = async () => {
    if (roleToDelete) {
      try {
        const roleRef = ref(database, `roles/${roleToDelete.id}`);
        await remove(roleRef);
        setRoles((prevRoles) => prevRoles.filter(role => role.id !== roleToDelete.id));
        setFilteredRoles((prevFiltered) => prevFiltered.filter(role => role.id !== roleToDelete.id));
        setRoleToDelete(null);
        setShowDeleteConfirm(false);
      } catch (error) {
        console.error('Error deleting role:', error.message);
      }
    }
  };

  const confirmDeleteRole = (role) => {
    setRoleToDelete(role);
    setShowDeleteConfirm(true);
  };

  return (
    <div className="w-full">
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-neutral-300 px-4 py-2 rounded-lg"
        />
        <button
          className="ml-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md"
          onClick={() => setShowAddRoleModal(true)}
        >
          Add Role
        </button>
      </div>
      <div className="relative overflow-x-auto rounded-md shadow-sm">
        <table className="w-full text-md text-gray-900 text-center border border-neutral-200">
          <thead className="text-md bg-neutral-200">
            <tr>
                <th scope="col" className="px-6 py-3">Role</th>
                <th scope="col" className="px-6 py-3">Access Inventory</th>
                <th scope="col" className="px-6 py-3">Access History</th>
                <th scope="col" className="px-6 py-3">Access Attendance</th>
                <th scope="col" className="px-6 py-3">Access Analytics</th>
                <th scope="col" className="px-6 py-3">Access New Customer</th>
                <th scope="col" className="px-6 py-3">Access Settings</th>
                <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRoles.map((role) => (
              <tr key={role.id} className="bg-white border-b hover:bg-neutral-100">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {role.name}
                </th>
                <td className="px-6 py-4">  
                <span className={role.permissions?.accessInventory ? 'text-green-600' : 'text-red-600'}>
                    {role.permissions?.accessInventory ? 'Yes' : 'No'}
                </span>
                </td>
                <td className="px-6 py-4">  
                <span className={role.permissions?.accessHistory ? 'text-green-600' : 'text-red-600'}>
                    {role.permissions?.accessHistory ? 'Yes' : 'No'}
                </span>
                </td>
                <td className="px-6 py-4">  
                <span className={role.permissions?.accessAttendance ? 'text-green-600' : 'text-red-600'}>
                    {role.permissions?.accessAttendance ? 'Yes' : 'No'}
                </span>
                </td>
                <td className="px-6 py-4">  
                <span className={role.permissions?.accessAnalytics ? 'text-green-600' : 'text-red-600'}>
                    {role.permissions?.accessAnalytics ? 'Yes' : 'No'}
                </span>
                </td>
                <td className="px-6 py-4">  
                <span className={role.permissions?.accessNewCustomer ? 'text-green-600' : 'text-red-600'}>
                    {role.permissions?.accessNewCustomer ? 'Yes' : 'No'}
                </span>
                </td>
                <td className="px-6 py-4">  
                <span className={role.permissions?.accessSettings ? 'text-green-600' : 'text-red-600'}>
                    {role.permissions?.accessSettings ? 'Yes' : 'No'}
                </span>
                </td>
                <td className="px-6 py-4 flex justify-center space-x-4">
                  <button
                    className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
                    disabled={role.id === 'admin' || role.id === 'super admin'}
                    onClick={() => {
                      setSelectedRole(role);
                      setShowEditRoleModal(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="ml-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md"
                    disabled={role.id === 'admin' || role.id === 'super admin'}
                    onClick={() => confirmDeleteRole(role)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <AddRoleModal
          showModal={showAddRoleModal}
          setShowModal={setShowAddRoleModal}
          onAddRole={handleAddRole}
        />
        
        <EditRoleModal
          showModal={showEditRoleModal}
          setShowModal={setShowEditRoleModal}
          role={selectedRole}
          onEditRole={handleEditRole}
        />

        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-md p-6 w-full max-w-md shadow-lg text-center">
              <h2 className="text-xl font-bold mb-4">Delete Role</h2>
              <p>Are you sure you want to delete the role <b>{roleToDelete?.name}</b>?</p>
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  onClick={handleDeleteRole}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RolesTable;