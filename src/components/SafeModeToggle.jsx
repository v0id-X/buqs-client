import * as Switch from '@radix-ui/react-switch';
import { useSettings } from '../context/SettingsContext';

export const SafeModeToggle = () => {
    const { isSafeMode, toggleSafeMode } = useSettings();

    const isNsfw = !isSafeMode;

    return (
        <div className="flex items-center justify-between w-full">
            <label
                htmlFor="nsfw-mode-switch"
                className="text-sm font-medium text-foreground/70 cursor-pointer select-none"
            >
                NSFW
            </label>

            <Switch.Root
                id="nsfw-mode-switch"
                checked={isNsfw}
                onCheckedChange={toggleSafeMode}
                className={`relative flex items-center w-14 h-7 p-1 rounded-full transition-colors duration-300 focus:outline-none cursor-pointer shrink-0 ${
                    isNsfw
                        ? 'bg-primary'
                        : 'bg-secondary dark:bg-slate-700'
                }`}
            >
                <Switch.Thumb
                    className={`block w-5 h-5 bg-gray-300 rounded-full shadow-md transform transition-transform duration-300 will-change-transform ${
                        isNsfw
                            ? 'translate-x-7'
                            : 'translate-x-0'
                    }`}
                />
            </Switch.Root>
        </div>
    );
};