import IconButton from '@mui/material/IconButton'

// ** Icons Imports
import WeatherNight from 'mdi-material-ui/WeatherNight'
import WeatherSunny from 'mdi-material-ui/WeatherSunny'
import { THEME_MODE } from '../../../../widget/projectParam'

const ModeToggler = props => {
    // ** Props
    const { settings, saveSettings } = props
    const handleModeChange = mode => {
        saveSettings({ ...settings, mode })
    }

    const handleModeToggle = () => {
        if (settings.mode === THEME_MODE.LIGHT) {
            handleModeChange(THEME_MODE.DARK)
        } else {
            handleModeChange(THEME_MODE.LIGHT)
        }
    }

    return (
        <IconButton color='inherit' aria-haspopup='true' onClick={handleModeToggle}>
            {settings.mode === 'dark' ? <WeatherSunny /> : <WeatherNight />}
        </IconButton>
    )

}