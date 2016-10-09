function getSlashTerminatedPath(path) {
  return path.endsWith('/') ? path : `${path}/`;
}

module.exports = {
  getSlashTerminatedPath,
};
