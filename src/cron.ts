async function loadAndUpdateAllTraffic() {
  const { default: updateAllTraffic } = await import(
    './services/updateAllTraffic'
  );
  updateAllTraffic();
}

loadAndUpdateAllTraffic();
