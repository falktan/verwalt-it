# Jest mit ES6-Modulen

## Konfiguration

### package.json
```json
{
  "type": "module",
  "scripts": {
    "test": "node --experimental-vm-modules node_modules/jest/bin/jest.js"
  }
}
```

### jest.config.js
```javascript
export default {
  testEnvironment: 'node',
  transform: {}
};
```

## ES6-Module Mocking

**Wichtig**: Bei ES6-Modulen muss der Import **nach** dem Mock erfolgen und mit `await import`:

```javascript
import { jest } from '@jest/globals';

// 1. Mock definieren
jest.unstable_mockModule('../api/utils/token.js', () => ({
  createAccessToken: jest.fn(() => 'test-access-token')
}));

// 2. Import nach Mock (erforderlich!)
const { renderEmailsNewSubmission } = await import('../api/emailRenderService.js');
```

## Snapshot-Tests

- Nicht-deterministische Werte (z.B. zufällige Tokens) müssen gemockt werden
- Test zweimal ausführen um Snapshot-Stabilität zu prüfen
- Snapshot aktualisieren mit: `npm test -- -u`

## Häufige Probleme

1. **Mock funktioniert nicht**: Import vor Mock → Import nach Mock verschieben
2. **Snapshot ändert sich**: Nicht-deterministische Werte mocken

## Links

- [Jest ES6-Module Dokumentation](https://jestjs.io/docs/ecmascript-modules)
- [Snapshot Testing](https://jestjs.io/docs/snapshot-testing)
