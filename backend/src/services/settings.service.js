import { settingsRepository } from '../repositories/settings.repository.js';

export class SettingsService {
  getPublicSettings() {
    const all = settingsRepository.getAll();
    return {
      whatsappNumber: all.whatsapp_number || '',
      restaurantName: all.restaurant_name || '',
      restaurantAddress: all.restaurant_address || '',
      restaurantHours: all.restaurant_hours || '',
      welcomeMessage: all.welcome_message || '',
    };
  }

  getAllSettings() {
    return settingsRepository.getAll();
  }

  updateSettings(entries) {
    settingsRepository.setMultiple(entries);
    return this.getAllSettings();
  }
}

export const settingsService = new SettingsService();
