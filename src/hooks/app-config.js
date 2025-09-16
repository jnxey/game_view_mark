import { systemState } from '@/store/system';

export function useAppConfig(options) {
  return {
    install_name: systemState.config.web_name,
    root_url: location.origin,
    app_name: systemState.config.web_name,
    app_favicon: systemState.config.web_favicon,
    table_id: null,
    table_name: null,
    ...options
  };
}
