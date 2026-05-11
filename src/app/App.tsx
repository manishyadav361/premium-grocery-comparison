import React from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AppProvider } from "./context/AppContext";
import { Layout } from "./components/Layout";

function AppWrapper() {
  return (
    <AppProvider>
      <Layout>
        <RouterProvider router={router} />
      </Layout>
    </AppProvider>
  );
}

export default AppWrapper;