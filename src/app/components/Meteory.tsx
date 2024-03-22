"use client";
import Link from "next/link";

interface UTCTime {
  date: string;
  time: string;
}

interface LocalTimeOffset {
  minutes: number;
}

const utcDate: UTCTime = {
  date: "2024-03-22",
  time: "10:32",
};

const offsetInMinutes: LocalTimeOffset = {
  minutes: -5,
};
interface NEO {
  links: {
    self: string;
    next: string;
    prev: string;
  };
  element_count: number;
  near_earth_objects: {
    [date: string]: NEOsByDate;
  };
}

interface NEOsByDate {
  [id: string]: NEODetails;
}
interface CloseApproachData {
  close_approach_date: string;
  close_approach_date_full: string;
  epoch_date_close_approach: number;
  relative_velocity: {
    kilometers_per_second: number;
    kilometers_per_hour: number;
  };
  miss_distance: {
    kilometers: number;
    lunar_distances: number;
  };
  orbiting_body: string;
}
interface NEODetails {
  id: string;
  name: string;
  nasa_jpl_url: string;
  absolute_magnitude_h: number;
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: [CloseApproachData];
  is_sentry_object: boolean;
}
interface PROPS {
  getNeoData: NEO;
}

function start_date() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Se agrega 1 al mes ya que los meses van de 0 a 11
  const day = String(today.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}
function Meteory(props: PROPS) {
  const getNeoData: NEO = props.getNeoData;
  const neos = Object.values(getNeoData.near_earth_objects).flatMap(
    (dateNEOs) => Object.values(dateNEOs)
  );
  neos.sort((a: NEODetails, b: NEODetails) => {
    // Extract the dates for comparison
    const dateA = a.close_approach_data[0].close_approach_date_full;
    const dateB = b.close_approach_data[0].close_approach_date_full;

    // Use Date object for proper comparison
    return new Date(dateA).getTime() - new Date(dateB).getTime();
  });

  return (
    <div className="m-2 text-center">
      <h1 className="text-2xl font-bold text-center my-4 uppercase">
        Elementos cercanos a la tierra segun la fecha de hoy
      </h1>
      <h1>
        Los elementos contados para el dia {start_date()} son:{" "}
        {getNeoData && getNeoData.element_count}
      </h1>
      <div className="grid movil:grid-cols-1 laptop:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
        {neos &&
          neos.map((item: NEODetails) => {
            const localDate = new Date(
              new Date(
                item.close_approach_data[0].close_approach_date_full
              ).getTime() +
                offsetInMinutes.minutes * 60 * 60 * 1000
            );
            const formattedDate = localDate.toLocaleDateString("en-EN", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour12: true,
            });
            const formattedTime = localDate.toLocaleTimeString("es-ES", {
              hour12: false,
            });
            const minutesDiff = Math.floor(
              (Date.now() - localDate.getTime()) / (1000 * 60)
            );

            const color =
              minutesDiff >= 15
                ? "#ef4444"
                : minutesDiff >= 0
                ? "#10b981"
                : minutesDiff <= -15
                ? "#f59e0b"
                : "#ef4444";

            const hours = Math.floor(minutesDiff / 60);
            const minutes = minutesDiff % 60;
            const isPast = minutesDiff > 0;
            const prefix = isPast ? "HAN PASADO" : "FALTAN";
            const timeses = `${prefix} ${
              hours < 0 ? hours * -1 : hours
            } HORAS Y ${minutes < 0 ? minutes * -1 : minutes} MINUTOS`;
            return (
              <div
                key={item.id}
                className="border border-black dark:bg-gray-700 dark:border-gray-400 w-fit m-2 p-2 bg-gray-200 rounded-xl"
              >
                {/* <h1>id: {item.id}</h1> */}
                <div className="flex justify-center items-center border border-black dark:bg-gray-700 dark:border-gray-400 m-0.5 p-0.5 rounded-lg">
                  <h1 className="uppercase">name: </h1>
                  <h2 className="mx-2">{item.name}</h2>
                </div>
                <div className="flex justify-center items-center border border-black dark:bg-gray-700 dark:border-gray-400 m-0.5 p-0.5 rounded-lg">
                  <h1 className="uppercase">close approach date full: </h1>
                  <h2 className="mx-2">
                    {item.close_approach_data[0].close_approach_date_full}
                  </h2>
                </div>
                <div
                  className="flex justify-center items-center border border-black dark:bg-gray-700 dark:border-gray-400 m-0.5 p-0.5 rounded-lg"
                  style={{ backgroundColor: color }}
                >
                  <h1 className="uppercase">
                    close approach date full local:{" "}
                  </h1>
                  <h2 className="mx-2">{`${formattedDate} ${formattedTime}`}</h2>
                </div>

                <div
                  className="flex justify-center items-center border border-black dark:bg-gray-700 dark:border-gray-400 m-0.5 p-0.5 rounded-lg"
                  style={{ backgroundColor: color }}
                >
                  <h1 className="uppercase">{timeses}</h1>
                  {/* <h2 className="mx-2">{minutesDiff}</h2> */}
                </div>

                <Link
                  href={
                    "https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=2005645&view=VOP"
                  }
                >
                  <h1 className="text-emerald-500 cursor-pointer hover:text-amber-300 uppercase border border-black dark:bg-gray-700 dark:border-gray-400 m-0.5 p-0.5 rounded-lg">
                    view orbit click here
                  </h1>
                </Link>
                <div className="flex justify-center items-center border border-black dark:border-gray-400 m-0.5 p-0.5 rounded-lg">
                  <h1 className="uppercase">absolute magnitude h: </h1>
                  <h2 className="mx-2">{item.absolute_magnitude_h}</h2>
                </div>

                <div className="border border-black dark:border-gray-400 m-0.5 p-0.5 rounded-lg">
                  <h1 className="uppercase">estimated diameter</h1>
                  <div className="text-center border border-black dark:border-gray-400 m-0.5 p-0.5 rounded-md">
                    <h1 className="uppercase">kilometers</h1>
                    <section className="grid grid-cols-2">
                      <section className="border border-black dark:border-gray-400 m-0.5 p-0.5 rounded-md">
                        <h1>estimated diameter min</h1>
                        <h2 className="mx-2">
                          {
                            item.estimated_diameter.kilometers
                              .estimated_diameter_min
                          }
                        </h2>
                      </section>
                      <section className="border border-black dark:border-gray-400 m-0.5 p-0.5 rounded-md">
                        <h1>estimated diameter max</h1>
                        <h2 className="mx-2">
                          {
                            item.estimated_diameter.kilometers
                              .estimated_diameter_max
                          }
                        </h2>
                      </section>
                    </section>
                  </div>
                </div>

                <div className="flex justify-center items-center border border-black dark:border-gray-400 m-0.5 p-0.5 rounded-xl">
                  <h1 className="uppercase">
                    is potentially hazardous asteroid:{" "}
                  </h1>
                  <h2 className="mx-2">
                    {item.is_potentially_hazardous_asteroid ? "YES" : "NO"}
                  </h2>
                </div>

                <div className="text-center border border-black dark:border-gray-400 m-0.5 p-0.5 rounded-xl">
                  <h1 className="uppercase">close approach data</h1>
                  <div className="grid grid-cols-2">
                    <section className="border border-black dark:border-gray-400 m-0.5 p-0.5 rounded-md">
                      <h1>close approach date</h1>
                      <div>
                        {item.close_approach_data.map(
                          (x: CloseApproachData) => (
                            <h2 key={x.close_approach_date}>
                              {x.close_approach_date}
                            </h2>
                          )
                        )}
                      </div>
                    </section>
                    <section className="border border-black dark:border-gray-400 m-0.5 p-0.5 rounded-md">
                      <h1>close approach date full</h1>
                      <div>
                        {item.close_approach_data.map(
                          (x: CloseApproachData) => (
                            <h2 key={x.close_approach_date_full}>
                              {x.close_approach_date_full}
                            </h2>
                          )
                        )}
                      </div>
                    </section>
                  </div>
                </div>

                <div className="flex justify-center items-center border border-black dark:border-gray-400 m-0.5 p-0.5 rounded-xl">
                  <h1 className="uppercase">relative velocity:</h1>
                  {item.close_approach_data.map((x: CloseApproachData) => (
                    <h2
                      key={x.relative_velocity.kilometers_per_second}
                      className="m-1"
                    >
                      {x.relative_velocity.kilometers_per_hour} km/h
                    </h2>
                  ))}
                </div>
                <div className="flex justify-center items-center border border-black dark:border-gray-400 m-0.5 p-0.5 rounded-xl">
                  <h1 className="uppercase">orbiting body:</h1>
                  {item.close_approach_data.map((x: CloseApproachData) => (
                    <h2 key={x.orbiting_body} className="m-1">
                      {x.orbiting_body}
                    </h2>
                  ))}
                </div>

                <div className="flex justify-center items-center border border-black dark:border-gray-400 m-0.5 p-0.5 rounded-xl">
                  <h1 className="uppercase">is sentry object: </h1>
                  <h2 className="mx-2">
                    {item.is_sentry_object ? "YES" : "NO"}
                  </h2>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
export default Meteory;