import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./components/Layout.tsx";
import { CategoryPage } from "./pages/CategoryPage.tsx";
import { EnquirePage } from "./pages/EnquirePage.tsx";
import { HomePage } from "./pages/HomePage.tsx";
import { ProductPage } from "./pages/ProductPage.tsx";
import { SearchPage } from "./pages/SearchPage.tsx";
import { ThankYouPage } from "./pages/ThankYouPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "category/:name", element: <CategoryPage /> },
      { path: "search", element: <SearchPage /> },
      { path: "products/:id", element: <ProductPage /> },
      { path: "products/:id/enquire", element: <EnquirePage /> },
      { path: "thank-you", element: <ThankYouPage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
