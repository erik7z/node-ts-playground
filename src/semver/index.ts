import semver from 'semver'

// [semver docs](https://github.com/npm/node-semver)

console.log('// comparing versions', semver.lt('1.1.1', '1.1.2'))

console.log('// version less than', semver.satisfies('1.1.1', '<1.1.7'))

console.log('// range between', semver.satisfies('1.1.1', '>=1.1.0 <1.2.0'))

console.log(semver.intersects('1.1.1', '>=1.1.0 <1.2.0'))

console.log('// sorting', semver.sort(['1.1.1', '1.4.5', '1.2.3']))

console.log('// reverse sorting', semver.rsort(['1.1.1', '1.4.5', '1.2.3']))
