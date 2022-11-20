import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import VerticalLayout from '../@core/layouts/VerticalLayout'
import VerticalNavItems from '../navigation/index'

const UserLayout = ({ children }) => {
    const { settings, saveSettings } = useSettings()

    /**
       *  The below variable will hide the current layout menu at given screen size.
       *  The menu will be accessible from the Hamburger icon only (Vertical Overlay Menu).
       *  You can change the screen size from which you want to hide the current layout menu.
       *  Please refer useMediaQuery() hook: https://mui.com/components/use-media-query/,
       *  to know more about what values can be passed to this hook.
       *  ! Do not change this value unless you know what you are doing. It can break the template.
       */
    const hidden = useMediaQuery(theme => theme.breakpoints.down('lg'))

    
    return (
        <VerticalLayout
         hidden={hidden}
         settings={settings}
         saveSettings={saveSettings}
         verticalNavItems={VerticalNavItems()}
         afterVerticalNavMenuContent={}
         verticalAppBarContent={}
        >
         {children}
        </VerticalLayout>
    )

}

export default UserLayout

