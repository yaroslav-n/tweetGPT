import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { SettingsScreen } from './settings_screen';

const root = createRoot(
    document.getElementById('root')!
);

root.render(<SettingsScreen />);