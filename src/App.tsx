import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Sidebar from "./sidebar";
import OLMap from "./map";

// Create a QueryClient instance
const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ marginLeft: "350px", flex: 1 }}>
          <OLMap />
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default App;
