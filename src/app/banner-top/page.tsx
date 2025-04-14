"use client";
import FlightBannerTop from "../../components/FlightBannerTop";

export default function BannerTop() {
 

  return (
    <div className="min-h-screen ">
      <div className="mt-[30px] p-6">
        <FlightBannerTop />
      </div>

      <div className="fixed bottom-20 left-10 flex gap-2">
        <button
          onClick={() => {
            localStorage.removeItem("auth0_access_token");
            localStorage.removeItem("auth0_refresh_token");
            window.location.href = "/auth/signin";
          }}
          className="px-6 py-3 bg-blue-800 text-white rounded-[5px] hover:bg-red-700"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
