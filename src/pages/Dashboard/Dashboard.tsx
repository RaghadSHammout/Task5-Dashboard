import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Button, Offcanvas } from "react-bootstrap";
import Sidebar from "../../components/Sidebar/Sidebar";
import SearchBar from "../../components/SearchBar/SearchBar";
import Loader from "../../components/loader/loader"; 
import "./Dashboard.css";

export default function Dashboard() {
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(false);
  const [loading, setLoading] = useState(false);

  const isDetailsPage = location.pathname.includes("/dashboard/products/");
  const isAddPage = location.pathname.endsWith("/add");

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 2000); 
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {loading && <Loader />}

      <Button
        variant="light"
        className="sidebar-toggle d-md-none"
        onClick={() => setShowSidebar(true)}
      >
        ☰
      </Button>

      <Offcanvas
        show={showSidebar}
        onHide={() => setShowSidebar(false)}
        className="d-md-none Offcanvas"
      >
        <Offcanvas.Header closeButton>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Sidebar />
        </Offcanvas.Body>
      </Offcanvas>

      <div className="dashboard-container">
        <div className="sidebar d-none d-md-block">
          <Sidebar />
        </div>

        <div className="main-content">
          {!isDetailsPage && !isAddPage && <SearchBar />}
          <Outlet />
        </div>
      </div>
    </>
  );
}
