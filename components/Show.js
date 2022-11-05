import styled from "styled-components";
import { padWidth } from "../widget/utils";
import { CONTRACT_NFT_OFFICIAL_NAME } from "../widget/projectParam";

const GalleryList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  //justify-content: space-between;
  overflow: hidden;
`;

const ShowItem = styled.div`
  width: 230px;
  margin: 4px;
  will-change: transform;
  transition: all 0.2s ease;
  img {
    width: 100%;
    height: 100%;
    border-radius: 8px;
  }
  :hover {
    transform: scale(1.15);
  }
  @media only screen and (max-width: ${padWidth}) {
  width: 28%;
  margin: 4px;
  :hover {
    transform: scale(1);
  }

  }
`;

function Show() {
    return (
      <GalleryList id="gallery">
        <ShowItem>
            <img src={"/images/demo02.png"} alt={CONTRACT_NFT_OFFICIAL_NAME} />
        </ShowItem>
        <ShowItem
            id="gallery">
            <img src={"/images/demo01.gif"} alt={CONTRACT_NFT_OFFICIAL_NAME} />
        </ShowItem>
      </GalleryList>
    );
}

export default Show;