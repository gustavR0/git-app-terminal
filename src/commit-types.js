export const COMMIT_TYPES = {
  feat: {
    emoji: '🆕',
    description: 'Add new Feature',
    release: true
  },
  fix: {
    emoji: '🐛',
    description: 'Submit a fix to a bug',
    release: true
  },
  perf: {
    emoji: '⚡',
    description: 'Improve performance',
    release: true
  },
  refactor: {
    emoji: '🛠️ ',
    description: 'Refactor code',
    release: true
  },
  docs: {
    emoji: '📚',
    description: 'Add or Update Documentation',
    release: false
  },
  test: {
    emoji: '🧪',
    description: 'Add or Update tests',
    release: false
  },
  build: {
    emoji: '🏗️ ',
    description: 'Add or Update build script',
    release: false
  }
}
