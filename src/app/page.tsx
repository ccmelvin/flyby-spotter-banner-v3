import FlightBanner from "@/components/flight-banner"
import FlightBanner1 from "@/components/flight-banner-1"
import FlightBanner3 from "@/components/flight-banner-3";
import FlightBanner4 from "@/components/flight-banner-4";
// import FlightBanner2 from "@/components/flight-banner-2";

export default function Home() {
  return (
    <>
    <main className="min-h-screen p-8">
       <div className="flex flex-col gap-6 max-w-[1920px] mx-auto">
        <div className="w-full ">
          <FlightBanner />
        </div>
        <div className="w-full ">
          <FlightBanner1 />
        </div>
        {/* <div className="w-min" >
          <FlightBanner2 />
        </div> */}
        {/* <div className="w-full">
          <FlightBanner3 
          airportCode="RDU / KRDU"
          airportName="Raleigh-Durham International Airport"
          location="North Carolina, USA"
          conditions="Clear"
          temperature={30}
          windDirection={250}
          windSpeed={12}
          />
        </div> */}
        <div className="w-full">
          <FlightBanner4 
         
          />

      </div>
      </div>
    </main>
    </>
  );
}
