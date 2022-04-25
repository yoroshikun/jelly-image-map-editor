# Jelly - Image Map Editor for Leaflet

<p align="center">
  <img src="https://github.com/yoroshikun/jelly-image-map-editor/raw/main/public/card.webp" />
 <p>A Simple Image Map Editor, Easily create, edit, import, export your GeoJSON for Images with Leaflet! All with a intuitive UX, built on top of Leaflet and Geoman</p> 
</p>

### Features

- **Custom Images:** Simple upload of images to use as maps
- **Beautiful UI:** Natural and Intuitive UI for editing and creating map features, thanks to [Daisy UI](https://daisyui.com/)
- **Mobile Friendly:** Fully supports mobile devices from editing to exporting
- **Local Saving:** Working on a large project? Save your work locally and easily load it back in later
- **GeoJSON Import/Export:** Easily import and export your GeoJSON for your Images
- **Options:** Easily customize your map with options like zoom, center, and even dimensions
- **Infinite Possibilities:** You can create your own map with any number of features, and any number of properties

### How to Use

#### Adding an Image

<p align="center">
  <img src="https://github.com/yoroshikun/jelly-image-map-editor/raw/main/public/promo-gifs/add-image.gif" />
</p>

Add an image to your map by clicking the "Manage Image" button under the Image button in the top right corner of the UI.

You can either upload an image from your computer or use a hosted image from the internet.

#### Adding a Feature

<p align="center">
  <img src="https://github.com/yoroshikun/jelly-image-map-editor/raw/main/public/promo-gifs/add-feature.gif" />
</p>

You can add features to the current map by using the [Geoman](https://github.com/geoman-io/leaflet-geoman) controls on the left side of the map

#### Editing a Feature

<p align="center">
  <img src="https://github.com/yoroshikun/jelly-image-map-editor/raw/main/public/promo-gifs/edit-feature-map.gif" />
</p>

You can edit any feature using the editing tools in the second section of the [Geoman](https://github.com/geoman-io/leaflet-geoman) controls.

_Hint:_ You can edit, move, cut, remove and rotate map feature using the tools (Deletion can only be performed here).

_PS:_ You can also edit the properties of a feature using the [Properties](#editing-a-features-properties) panel.

#### Editing a Feature's Properties

<p align="center">
  <img src="https://github.com/yoroshikun/jelly-image-map-editor/raw/main/public/promo-gifs/edit-feature-properties.gif" />
</p>

You can edit the properties of a feature by using the list of features on the right.

Some properties override UI elements, like name and id. Try them out!

Be sure to save!

_PS:_ If you need to persist the feature state see [Persistance](#persistance).

#### Managing Map Options

<p align="center">
  <img src="https://github.com/yoroshikun/jelly-image-map-editor/raw/main/public/promo-gifs/edit-map-options.gif" />
</p>

You can edit the maps options by clicking the manage map icon in the top right.

You can manage the maps, initialZoom, maxZoom, minZoom, height, width and center properties here.

#### Export GeoJSON

<p align="center">
  <img src="https://github.com/yoroshikun/jelly-image-map-editor/raw/main/public/promo-gifs/export-geojson.gif" />
</p>

Exporting and Downloading a generated list of features as GeoJSON is support by clicking on the export icon in the top right of the UI.

#### Import GeoJSON

<p align="center">
  <img src="https://github.com/yoroshikun/jelly-image-map-editor/raw/main/public/promo-gifs/export-geojson.gif" />
</p>

Importing geoJSON by uploading a file is supported though clicking the import icon in the top right of the UI.

#### Persistance

<p align="center">
  <img src="https://github.com/yoroshikun/jelly-image-map-editor/raw/main/public/promo-gifs/persistance.gif" />
</p>

Jelly supports persistance of your session so that you don't lose your progress on large jobs, however you must explicitly click the alerts to save the state locally.

If at any point you want to purge the local state you can click on the alerts in their success mode

### Contributing

Contributors are welcome!

If you find an issue or have a feature request, please open an issue or pull request~. I will do my best to address them as soon as possible.

#### Developers

The project is a simple react vite project. With the preferred package manager of [yarn](https://yarnpkg.com/). Get started with.

```bash
git clone https://github.com/yoroshikun/jelly-image-map-editor.git
cd jelly-image-map-editor
yarn
```

Please follow [conventional-commits](https://www.conventionalcommits.org/en/v1.0.0/) for the best practices of writing commits.

#### Troubleshooting

If you have troubles importing the geoJSON you may need to add a converter for circles and markers. (code below is in typescript)

```ts
import { geoJSON, Circle, Marker } from 'leaflet';

const addGeoJSON = (map: Map, geoJson: GeoJsonObject) => {
  const geoJSONLayer = geoJSON(geoJson, {
    pointToLayer: (feature, latlng) => {
      if (feature.properties.radius) {
        return new Circle(latlng, feature.properties.radius);
      } else {
        return new Marker(latlng);
      }
    },
  }).addTo(map);
```

### Special Thanks

- [Geoman](https://geoman.io/)
- [Daisy UI](https://daisyui.com/)
- [Leaflet](https://leafletjs.com/)
- [React](https://reactjs.org/)
- [Zustand](https://zustand-demo.pmnd.rs/)
