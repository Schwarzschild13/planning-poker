import { createContext, FunctionComponent, useState } from "react";

interface AdminType {
  isAdmin: boolean;
  toggleAdmin: (val: boolean) => void;
}

const initState: AdminType = {
  isAdmin: false,
  toggleAdmin: (val: boolean) => {},
};

export const AdminContext = createContext<AdminType>(initState);

interface AdminProviderProps {
  children: React.ReactNode;
}

const AdminProvider: FunctionComponent<AdminProviderProps> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const toggleAdmin = (val: boolean) => {
    console.log("toggleAdmin from context", isAdmin);
    setIsAdmin(val);
  };

  return (
    <AdminContext.Provider value={{ isAdmin, toggleAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminProvider;
