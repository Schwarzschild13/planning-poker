import { createContext, FunctionComponent, useState } from "react";

interface AdminType {
  isAdmin: boolean;
  toggleAdmin: () => void;
}

const initState: AdminType = {
  isAdmin: false,
  toggleAdmin: () => {},
};

export const AdminContext = createContext<AdminType>(initState);

interface AdminProviderProps {
  children: React.ReactNode;
}

const AdminProvider: FunctionComponent<AdminProviderProps> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const toggleAdmin = () => {
    console.log("toggleAdmin from context", isAdmin);
    setIsAdmin((prev) => !prev);
  };

  return (
    <AdminContext.Provider value={{ isAdmin, toggleAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminProvider;
