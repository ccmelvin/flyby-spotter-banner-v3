import FlightBannerTop from "@/components/flightBannerTop";
import FlightBannerBottom from "@/components/flightBannerBottom";
import FlightApproachDisplay from "@/components/flightApproachDisplay";

export default function Home() {
  return (
    <>
      <main className="min-h-screen p-6 relative">
        <div className="flex flex-col gap-6 max-w-[1920px] mx-auto">
          <div className="w-full mx-[40px]">
            <FlightBannerTop />
          </div>
        </div>

        <div className="mt-[100px] max-w-[900px] mx-[40px] relative z-10">
        
       
        <FlightApproachDisplay
          flight={{
            title: "Upcoming Landing",
            number: "1076",
            airline: "DAL",
            origin: "Atlanta",
            runway: "27R",
            originCode: "KATL",
            registration: "N123DL",
          }}
          />
          <FlightBannerBottom />
          </div>
      </main>
    </>
  );
}