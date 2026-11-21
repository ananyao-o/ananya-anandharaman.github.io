# Replacing the vehicles with your own drawings

1. Draw a vehicle facing right. Export as SVG or PNG with a transparent background.
2. Drop it in this folder.
3. In `js/config.js`, find the `vehicles` array and change `imageSrc`, `width` and `height` for that entry.

Vehicles travelling left are mirrored automatically, so one drawing covers both directions.
Add new vehicle types (scooter, tractor, rocket) by adding another entry to the array.
Each vehicle also creates a spike in the seismic trace as it passes, scaled by its `width` and speed.
