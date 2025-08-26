
import AdminLayout from "../AdminLayout";
import DashboardCards from "./DashboardCards";
import SalesChart from "./SalesChart";
import RecentOrders from "./RecentOrders";

export default function AdminAnalyticsPage() {
  return (
    <AdminLayout section="analytics">
      <DashboardCards />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <div>
          <RecentOrders />
        </div>
      </div>
    </AdminLayout>
  );
}
