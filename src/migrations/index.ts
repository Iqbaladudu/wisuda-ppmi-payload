import * as migration_20250906_105232_migration from './20250906_105232_migration';

export const migrations = [
  {
    up: migration_20250906_105232_migration.up,
    down: migration_20250906_105232_migration.down,
    name: '20250906_105232_migration'
  },
];
