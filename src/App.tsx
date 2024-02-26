import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import EditControlFC from "./EditControlFC";
import type { FeatureCollection } from "geojson";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "./components/ui/dialog";
import { useLocalStorage } from "usehooks-ts";
import { Button } from "./components/ui/button";
import { useState } from "react";
// import { Label } from "./components/ui/label";
// import { Input } from "./components/ui/input";

// const defaultGeojson: FeatureCollection = {
//   type: "FeatureCollection",
//   features: [
//     {
//       type: "Feature",
//       properties: {},
//       geometry: {
//         type: "Polygon",
//         coordinates: [
//           [
//             [-0.107288, 51.512909],
//             [-0.095272, 51.507995],
//             [-0.111923, 51.502973],
//             [-0.107288, 51.512909],
//           ],
//         ],
//       },
//     },
//   ],
// };

function App() {
  const [geojson, setGeojson] = useLocalStorage<FeatureCollection>("geojson", {
    type: "FeatureCollection",
    features: [],
  });

  const [markerMode, setMarkerMode] = useState(false);

  return (
    <>
      <div className="h-screen w-screen relative flex flex-col">
        <div className="bg-white h-16 flex items-center gap-4 px-8">
          <Button onClick={() => setMarkerMode((prev) => !prev)}>
            {markerMode ? "Deactivate Marker Mode" : "Activate Marker Mode"}
          </Button>
        </div>
        <MapContainer
          center={[51.505, -0.09]}
          zoom={13}
          scrollWheelZoom={false}
          style={{ width: "100vw", height: "100vh" }}
        >
          <EditControlFC
            markerMode={markerMode}
            geojson={geojson}
            setGeojson={setGeojson}
          />
          <GeoJSON key={geojson.features.length} data={geojson} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
      </div>
    </>
  );
}

export default App;
