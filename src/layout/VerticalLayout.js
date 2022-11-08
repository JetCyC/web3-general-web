import styled from '@emotion/styled'
import { Box } from '@mui/material'
import { display } from '@mui/system'
import themeConfig from 'src/configs/themeConfig'
import LayoutAppBar from './components/vertical/appBar'



const VerticalLayoutWrapper = styled('div')({
  height: '100%',
  display: 'flex',
  backgroundColor: 'yellow'
})

const MainContentWrapper = styled(Box)({
  flexGrow: 1,
  minWidth: 0,
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column'
})

const ContentWrapper = styled('main')(({ theme }) => ({
  flexGrow: 1,
  width: '100%',
  padding: theme.spacing(6),
  backgroundColor: 'blue',
  transition: 'padding .25s ease-in-out',
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4)
  }
}))

const VerticalLayout = props => {
  // ** Props
  const { settings, children, scrollToTop } = props

  // ** Vars
  const { contentWidth } = settings
  const navWidth = themeConfig.navigationSize

  // states
  const [navVisible, setNavVisible] = useState(false)

  // Toggle Functions
  const toggleNavVisibility = () => setNavVisible(!navVisible)

  return (
    <>
      <VerticalLayoutWrapper className='layout-wrapper'>
        <MainContentWrapper className='layout-content-wrapper'>
          <LayoutAppBar toggleNavVisibility={toggleNavVisibility} {...props} />
          <ContentWrapper
            className='layout-page-content'
            sx={{
              ...(contentWidth === 'boxed' && {
                mx: 'auto',
                '@media (min-width:1440px)': { maxWidth: 1440 },
                '@media (min-width:1200px)': { maxWidth: '100%' }
              })
            }}
          >
            {children}
          </ContentWrapper>

        </MainContentWrapper>
      </VerticalLayoutWrapper>
      {scrollToTop}
    </>
  )

}

export default VerticalLayout