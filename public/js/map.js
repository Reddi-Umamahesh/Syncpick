mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map",
  // style: "mapbox://styles/mapbox/satellite-streets-v12",
  style: "mapbox://styles/mapbox/streets-v12",
  center: post.geometry.coordinates,
  zoom: 13,
});
console.log(post.geometry.coordinates);
const marker = new mapboxgl.Marker({ color: "red", rotation: 45 })
  .setLngLat(post.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({}).setHTML(
      `<h4>${post.title}</h4><p>Contact the number to get the exact location</p>`
    )
  )
  .addTo(map);

// marker.addTo(map);
