import L from "leaflet";
import "leaflet/dist/leaflet.css";
if ("_getIconUrl" in L.Icon.Default.prototype) {
  delete (L.Icon.Default.prototype as unknown as { _getIconUrl: unknown })
    ._getIconUrl;
}
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL(
    "leaflet/dist/images/marker-icon-2x.png",
    import.meta.url
  ).toString(),
  iconUrl: new URL(
    "leaflet/dist/images/marker-icon.png",
    import.meta.url
  ).toString(),
  shadowUrl: new URL(
    "leaflet/dist/images/marker-shadow.png",
    import.meta.url
  ).toString(),
});
