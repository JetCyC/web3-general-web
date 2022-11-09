import { Box, styled, useTheme } from "@mui/material"
import { useRef } from "react"

import Drawer from './Drawer'


const StyledBoxForShadow = styled(Box)({
  top: 50,
  left: -8,
  zIndex: 2,
  height: 75,
  display: 'none',
  position: 'absolute',
  pointerEvents: 'none',
  width: 'calc(100% + 15px)',
  '&.d-block': {
    display: 'block'
  }
})

const Navigation = props => {
  const {
    hidden,
    afterVerticalNavMenuContent,
    beforeVerticalNavMenuContent,
    verticalNavMenuContent: userVerticalNavMenuContent
  } = props

  // ** States
  const [groupActive, setGroupActive] = useState([])
  const [currentActiveGroup, setCurrentActiveGroup] = useState([])

  // ref
  const shadowRef = useRef(null)

  // hooks
  const theme = useTheme()

  // ** Fixes Navigation InfiniteScroll
  const handleInfiniteScroll = ref => {
    if (ref) {
      // @ts-ignore
      ref._getBoundingClientRect = ref.getBoundingClientRect
      ref.getBoundingClientRect = () => {
        // @ts-ignore
        const original = ref._getBoundingClientRect()

        return { ...original, height: Math.floor(original.height) }
      }
    }
  }

  const scrollMenu = container => {
    container = hidden ? container.target : container
    if (shadowRef && container.scrollTop > 0) {
      // @ts-ignore
      if (!shadowRef.current.classList.contains('d-block')) {
        // @ts-ignore
        shadowRef.current.classList.add('d-block')
      }
    } else {
      // @ts-ignore
      shadowRef.current.classList.remove('d-block')
    }
  }
  const ScrollWrapper = hidden ? Box : PerfectScrollbar

  return (
    <Drawer {...props}>
      <VerticalNavHeader {...props} />
      <StyledBoxForShadow
        ref={shadowRef}
        sx={{
          background: `linear-gradient(${theme.palette.background.default} 40%,${hexToRGBA(
            theme.palette.background.default,
            0.1
          )} 95%,${hexToRGBA(theme.palette.background.default, 0.05)})`,
        }}
      />

      <Box sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
      <ScrollWrapper
      containerRef={ref => handleInfiniteScroll(ref)}
      {...(hidden
        ? {
            onScroll: container => scrollMenu(container),
            sx: { height: '100%', overflowY: 'auto', overflowX: 'hidden' }
          }
        : {
            options: { wheelPropagation: false },
            onScrollY: container => scrollMenu(container)
          })}
      >
       {beforeVerticalNavMenuContent ? beforeVerticalNavMenuContent(props) : null}


      </ScrollWrapper>
      </Box>
      {afterVerticalNavMenuContent ? afterVerticalNavMenuContent(props) : null}
    </Drawer>
  )



}

export default Navigation