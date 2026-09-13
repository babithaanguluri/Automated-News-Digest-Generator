const fs = require('node:fs');
const path = require('node:path');

const constructorToken = Symbol('ConfigService');

class ConfigService {
  static instance;

  constructor(configPath = path.resolve(__dirname, '..', 'config.json'), token) {
    if (token !== constructorToken) {
      throw new Error('ConfigService must be accessed through ConfigService.getInstance()');
    }

    this.configPath = configPath;
    this.baseDirectory = path.dirname(configPath);
    this.config = ConfigService.load(configPath);
  }

  static getInstance() {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService(undefined, constructorToken);
    }
    return ConfigService.instance;
  }

  static load(configPath) {
    let parsed;

    try {
      parsed = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch (error) {
      throw new Error(`Unable to read ${configPath}: ${error.message}`);
    }

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('config.json must contain a JSON object');
    }
    if (typeof parsed.apiKey !== 'string') {
      throw new Error('config.json must contain an apiKey string');
    }
    if (!Array.isArray(parsed.categories) || parsed.categories.length !== 5 || parsed.categories.some((category) => typeof category !== 'string' || !category.trim())) {
      throw new Error('config.json categories must contain exactly five non-empty strings');
    }
    if (typeof parsed.outputFile !== 'string' || !parsed.outputFile.trim()) {
      throw new Error('config.json must contain an outputFile string');
    }

    return parsed;
  }

  getApiKey() {
    return this.config.apiKey;
  }

  getCategories() {
    return [...this.config.categories];
  }

  getOutputFile() {
    return this.config.outputFile;
  }

  getOutputPath() {
    return path.resolve(this.baseDirectory, this.getOutputFile());
  }
}

module.exports = ConfigService;
