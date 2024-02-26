import * as React from "react";
import * as L from "leaflet";
import { FeatureGroup, useMapEvents } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import type { FeatureCollection, Feature } from "geojson";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
import { Label } from "./components/ui/label";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";

interface Props {
  geojson: FeatureCollection;
  setGeojson: (geojson: FeatureCollection) => void;
  markerMode: boolean;
}

export default function EditControlFC({
  geojson,
  setGeojson,
  markerMode,
}: Props) {
  const [addMarkerOpen, setAddMarkerOpen] = React.useState(false);
  const [newFeature, setNewFeature] = React.useState<Feature>({
    type: "Feature",
    properties: { radius: 100 },
    geometry: {
      type: "Point",
      coordinates: [0, 0],
    },
  });
  const ref = React.useRef<L.FeatureGroup>(null);
  useMapEvents({
    click: (e) => {
      if (markerMode) {
        console.log("Hit");
        setAddMarkerOpen(true);
        handleClick(e);
      }
    },
  });

  function handleClick(e: L.LeafletMouseEvent) {
    setNewFeature({
      type: "Feature",
      properties: { radius: 100 },
      geometry: {
        type: "Point",
        coordinates: [e.latlng.lng, e.latlng.lat],
      },
    });
  }

  const handleChange = () => {
    const geo = ref.current?.toGeoJSON();
    console.log({ geo });
    if (geo?.type === "FeatureCollection") {
      setGeojson(geo);
    }
  };

  return (
    <>
      <Dialog open={addMarkerOpen} onOpenChange={setAddMarkerOpen}>
        <DialogTrigger className="sr-only">Add Marker</DialogTrigger>
        <DialogContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const tooltip = formData.get("tooltip") as string;
              console.log({ tooltip });
              const updatedNewFeature = {
                ...newFeature,
                properties: { ...newFeature.properties, tooltip },
              };
              setGeojson({
                ...geojson,
                features: [...geojson.features, updatedNewFeature],
              });
              setAddMarkerOpen(false);
            }}
          >
            <DialogHeader>
              <DialogTitle>Add Marker</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-2 my-6">
              <Label>Tooltip</Label>
              <Input name="tooltip" />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <FeatureGroup ref={ref}>
        <EditControl
          position="topright"
          onEdited={handleChange}
          onCreated={handleChange}
          onDeleted={handleChange}
          draw={{
            rectangle: false,
            circle: true,
            polyline: true,
            polygon: true,
            marker: false,
            circlemarker: false,
          }}
        />
      </FeatureGroup>
    </>
  );
}
