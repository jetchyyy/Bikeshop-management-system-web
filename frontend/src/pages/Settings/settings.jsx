import { useState } from 'react';
import UsersTable from './Users/UsersTable';
import RolesTable from './Roles/RolesTable';
const Settings = () => {
  const [tableView, setTableView] = useState('User Management');

  const handleClick = (view) => {
    setTableView(view);
  };

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="mb-4 flex justify-start items-center">
      <button
          onClick={() => handleClick("User Management")}
          className={`space-x-4 px-6 py-2 rounded-md transition duration-200 ${
            tableView === "User Management"
              ? "bg-neutral-900 text-white text-bold"
              : "bg-neutral-200 text-neutral-900"
          }`}
        >
          User Management
        </button>
        <button
          onClick={() => handleClick("Role Management")}
          className={`space-x-4 px-6 py-2 rounded-md transition duration-200 ${
            tableView === "Role Management"
              ? "bg-neutral-900 text-white text-bold"
              : "bg-neutral-200 text-neutral-900"
          }`}
        >
          Role Management
        </button>
      </div>
      
      {tableView === 'User Management' && <UsersTable />}
      {tableView === 'Role Management' && <RolesTable />}
    </div>
  );
};

export default Settings;
