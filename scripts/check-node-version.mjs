const [major = '0'] = process.versions.node.split('.');
const majorVersion = Number.parseInt(major, 10);

if (Number.isNaN(majorVersion)) {
  console.error(`Unable to determine Node.js version from "${process.versions.node}".`);
  process.exit(1);
}

if (majorVersion < 20 || majorVersion >= 24) {
  console.error(
    [
      `Unsupported Node.js version: ${process.versions.node}`,
      'This project supports Node.js >=20 and <24.',
      'On Windows, Node.js 24 can crash during `vite build` with exit code -1073740791.',
      'Please switch to Node.js 20 LTS and run the command again.',
    ].join('\n'),
  );
  process.exit(1);
}