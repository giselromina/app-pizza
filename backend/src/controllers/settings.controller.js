import { settingsService } from '../services/settings.service.js';

export class SettingsController {
  /** GET /api/settings - Public settings */
  getPublic(req, res, next) {
    try {
      res.json(settingsService.getPublicSettings());
    } catch (err) { next(err); }
  }

  /** GET /api/admin/settings - All settings (admin) */
  getAll(req, res, next) {
    try {
      res.json(settingsService.getAllSettings());
    } catch (err) { next(err); }
  }

  /** PUT /api/admin/settings - Update settings (admin) */
  update(req, res, next) {
    try {
      const updated = settingsService.updateSettings(req.body);
      res.json(updated);
    } catch (err) { next(err); }
  }
}

export const settingsController = new SettingsController();
