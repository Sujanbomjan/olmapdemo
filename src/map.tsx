import React, { useRef, useEffect } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat, toLonLat } from "ol/proj";
import Overlay from "ol/Overlay";
import { toStringHDMS } from "ol/coordinate";

// CSS styling for the popup
const popupStyles = `
  .ol-popup {
    position: absolute;
    background-color: white;
    box-shadow: 0 1px 4px rgba(0,0,0,0.2);
    padding: 15px;
    border-radius: 10px;
    border: 1px solid #cccccc;
    bottom: 12px;
    left: -50px;
    min-width: 180px;
    max-width: 280px;
    display: none; /* Ensure it is hidden by default */
  }

  .ol-popup:after, .ol-popup:before {
    top: 100%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
  }

  .ol-popup:after {
    border-top-color: white;
    border-width: 10px;
    left: 50%;
    margin-left: -10px;
  }

  .ol-popup:before {
    border-top-color: #cccccc;
    border-width: 11px;
    left: 50%;
    margin-left: -11px;
  }

  .ol-popup-closer {
    text-decoration: none;
    position: absolute;
    top: 2px;
    right: 8px;
    color: #000;
    font-weight: bold;
    font-size: 18px;
  }
`;

// Append the styles to the head
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = popupStyles;
document.head.appendChild(styleSheet);

const olMap = new Map({
  target: null as any,
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
  ],
  view: new View({
    center: fromLonLat([126.978, 37.5665]),
    zoom: 12,
  }),
});

const OLMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const closerRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    if (mapRef.current) {
      olMap.setTarget(mapRef.current);

      const popup = new Overlay({
        element: popupRef.current!,
        autoPan: {
          animation: {
            duration: 250,
          },
        },
      });
      olMap.addOverlay(popup);

      closerRef.current!.onclick = function () {
        popup.setPosition(undefined);
        popupRef.current!.style.display = "none";
        closerRef.current!.blur();
        return false;
      };

      olMap.on("click", function (evt) {
        const coordinate = evt.coordinate;
        const hdms = toStringHDMS(toLonLat(coordinate));
        contentRef.current!.innerHTML = `<p>You clicked here:</p><code>${hdms}</code>`;
        popup.setPosition(coordinate);
        popupRef.current!.style.display = "block"; 
      });
    }

    return () => {
      olMap.setTarget(null as any);
    };
  }, []);

  return (
    <div>
      <div ref={mapRef} style={{ width: "100%", height: "100vh" }} />
      <div ref={popupRef} id="popup" className="ol-popup">
        <a
          ref={closerRef}
          href="#"
          id="popup-closer"
          className="ol-popup-closer"
        ></a>
        <div ref={contentRef} id="popup-content"></div>
      </div>
    </div>
  );
};

export default OLMap;

export const zoomToLocation = (lon: number, lat: number) => {
  const view = olMap.getView();
  const coordinate = fromLonLat([lon, lat]);
  
  // popup is shown when the map is zoomed to the location
  const popup = olMap.getOverlays().getArray().find((overlay) => {
    return overlay.getElement() === document.getElementById("popup");
  }) as Overlay;
  
  if (popup) {
    popup.setPosition(coordinate);
    const contentRef = document.getElementById("popup-content");
    if (contentRef) {
      const hdms = toStringHDMS([lon, lat]);
      contentRef.innerHTML = `<p>Mapped to:</p><code>${hdms}</code>`;
    }
    const popupRef = document.getElementById("popup");
    if (popupRef) {
      popupRef.style.display = "block";
    }
  }

  view.animate({
    center: coordinate,
    zoom: 17,
    duration: 1000,
  });
};
