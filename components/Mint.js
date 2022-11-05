import { useState, useEffect } from "react";
import styled from "styled-components";
import { ethers } from "ethers";

import { get, subscribe } from "../widget/store";
import ConnectWallet, { connectWallet } from "./ConnectWallet";
import showMessage from "./showMessage";
import BigNumber from "bignumber.js";
import {
  CONTRACT_PERWALLET_MAX_MINT_AMOUNT,
  CONTRACT_NFT_TOTAL_AMOUNT,
  CONTRACT_NFT_PER_PRICE,
  CONTRACT_STATUS,
  FREE_MINT_AMOUNT,
  MAX_FREE_MINT_PER_ADDR
} from "../widget/projectParam";
import { padWidth } from "../widget/utils";



const ETHERSCAN_DOMAIN =
  process.env.NEXT_PUBLIC_CHAIN_ID === "1"
    ? "etherscan.io"
    : "rinkeby.etherscan.io";

const StyledMintButton = styled.div`
  display: inline-block;
  text-align: center;
  padding: 0.62rem 1rem;
  min-width: 10rem;
  font-family: Montserrat-Italic;
  font-size: 2.1rem;
  color: #0b4f16;
  border-width: 2px;
  border-style: solid;
  border-radius: 0.8rem;
  //border-image: url(/images/mintbutton.png)   0 170 0 170 fill / 0px 170px stretch;
  @media only screen and (max-width: ${padWidth}) {
  font-size: 1.4rem;
  }
  cursor: ${(props) => {
    return props.minting || props.disabled ? "not-allowed" : "pointer";
  }};
  opacity: ${(props) => {
    return props.minting || props.disabled ? 0.6 : 1;
  }};
`;

function MintButton(props) {
  const [minting, setMinting] = useState(false);

  return (
    <StyledMintButton
      disabled={!!props.disabled}
      minting={minting}
      onClick={async () => {
        if (minting || props.disabled) {
          return;
        }
        setMinting(true);
        const fullAddressInStore = get("fullAddress") || 'null';//从持久化存储中获取
        gtag('event', 'click_mint_start', { 'click_mint_start': 'click_mint_start', 'address': fullAddressInStore });
        try {
          const { signer, contract } = await connectWallet();
          const contractWithSigner = contract.connect(signer);
          const progress = parseInt(await contract.totalSupply());//minted
          const numberMinted = await contract.numberMinted(fullAddressInStore);
          const freeMintedProgress = parseInt(await contract.INSTANT_FREE_MINTED());//已经freemint的总量 

          let value = ethers.utils.parseEther(/////
            new BigNumber(props.wantMintAmount).multipliedBy(new BigNumber(CONTRACT_NFT_PER_PRICE)).toString()
          );
          console.log('FREE_MINT-1', props.wantMintAmount + progress, freeMintedProgress, fullAddressInStore)
          if (freeMintedProgress < FREE_MINT_AMOUNT) {//还有freemint名额
            let canFreeMintAmount = (numberMinted < MAX_FREE_MINT_PER_ADDR) ? (MAX_FREE_MINT_PER_ADDR - numberMinted) : 0;
            value = ethers.utils.parseEther(/////
              new BigNumber((props.wantMintAmount <= canFreeMintAmount) ? 0 : (props.wantMintAmount - canFreeMintAmount))
                .multipliedBy(new BigNumber(CONTRACT_NFT_PER_PRICE)).toString());
            console.log('FREE_MINT-2', canFreeMintAmount, value.toString())
          }
          //call contract to mint
          const tx = await contractWithSigner.mint(props.wantMintAmount, {
            value,
          });
          const response = await tx.wait();
          console.log('FREE_MINT-3', response)
          showMessage({
            type: "success",
            title: "NFTs were minted successfully",
            body: (
              <div>
                <a
                  href={`https://${ETHERSCAN_DOMAIN}/tx/${response.transactionHash}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Click to view transaction details
                </a>{" "}
                or go to{" "}
                <a
                  href="https://opensea.io/account"
                  target="_blank"
                  rel="noreferrer"
                >
                  OpenSea
                </a>
              </div>
            ),
          });
          gtag('event', 'click_mint_end', {
            'click_mint_end': 'click_mint_end',
            'address': fullAddressInStore,
            'tx': tx,
            'wantMintAmount': props.wantMintAmount,
            'value': value,
          });
        } catch (err) {
          console.log('FREE_MINT-error', err)
          showMessage({
            type: "error",
            title: "NFTs were minted failed",
            body: err.message,
          });
        }
        props.onMinted && props.onMinted();
        setMinting(false);
      }}
      style={{
        background: "#28e35d",
        ...props.style,
      }}
    >
      {" "}Mint{minting ? "ing... " : " "}
    </StyledMintButton>
  );
}

function MintSection() {
  const [status, setStatus] = useState(CONTRACT_STATUS.OFF);//contract.status
  const [progress, setProgress] = useState(null);//已经mint的数量
  const [fullAddress, setFullAddress] = useState(null);
  const [numberMinted, setNumberMinted] = useState(0);//某地址已经minted的数量
  const [wantMintAmount, setWantMintAmount] = useState((CONTRACT_PERWALLET_MAX_MINT_AMOUNT - numberMinted)<= 0 ? 0 :(CONTRACT_PERWALLET_MAX_MINT_AMOUNT - numberMinted));//点击选择mint的数量

  async function updateStatus() {//更新status和已经mint的数量  这是mint逻辑的第一个控制条件
    const { contract } = await connectWallet();
    const status = await contract.status();//
    const progress = parseInt(await contract.totalSupply());
    setStatus(status.toString());
    setProgress(progress);
    // 在 mint 事件的时候更新数据
    contract.on("Minted", async (event) => {
      const status = await contract.status();
      const progress = parseInt(await contract.totalSupply());//已经mint的数量
      setStatus(status.toString());
      setProgress(progress);
    });
  }

  useEffect(() => {
    (async () => {
      const fullAddressInStore = get("fullAddress") || null;//从持久化存储中获取
      if (fullAddressInStore) {
        const { contract } = await connectWallet();
        const numberMinted = await contract.numberMinted(fullAddressInStore);
        setNumberMinted(parseInt(numberMinted));
        setWantMintAmount((CONTRACT_PERWALLET_MAX_MINT_AMOUNT - numberMinted)<= 0 ? 0 :(CONTRACT_PERWALLET_MAX_MINT_AMOUNT - numberMinted));
        setFullAddress(fullAddressInStore);
      }
      subscribe("fullAddress", async () => {
        const fullAddressInStore = get("fullAddress") || null;
        setFullAddress(fullAddressInStore);
        if (fullAddressInStore) {
          const { contract } = await connectWallet();
          const numberMinted = await contract.numberMinted(fullAddressInStore);
          setNumberMinted(parseInt(numberMinted));
          setWantMintAmount((CONTRACT_PERWALLET_MAX_MINT_AMOUNT - numberMinted)<= 0 ? 0 :(CONTRACT_PERWALLET_MAX_MINT_AMOUNT - numberMinted));
          updateStatus();
        }
      });
    })();
  }, []);

  useEffect(() => {//
    try {
      const fullAddressInStore = get("fullAddress") || null;
      if (fullAddressInStore) {
        updateStatus();
      }
    } catch (err) {
      showMessage({
        type: "error",
        title: "Failed to get contract status",
        body: err.message,
      });
    }
  }, []);

  async function refreshStatus() {
    const { contract } = await connectWallet();
    const numberMinted = await contract.numberMinted(fullAddress);
    setNumberMinted(parseInt(numberMinted));
    setWantMintAmount((CONTRACT_PERWALLET_MAX_MINT_AMOUNT - numberMinted)<= 0 ? 0 :(CONTRACT_PERWALLET_MAX_MINT_AMOUNT - numberMinted))
  }

  let mintButton = (
    <StyledMintButton
      style={{
        background: "#eee",
        color: "#999",
        cursor: "not-allowed",
      }}
    >
    {/* {status === CONTRACT_STATUS.ON ? 'Mint Is Alive' : 'Mint Is Coming'} */}
    {status === CONTRACT_STATUS.ON ? 'Mint Is Alive' : 'Mint Is Coming'}
    </StyledMintButton>
  );

  if (status === CONTRACT_STATUS.ON) {
    mintButton = (
      <div
        style={{
          display: "flex",
        }}
      >
        <MintButton
          onMinted={refreshStatus}
          wantMintAmount={wantMintAmount}
          style={{ marginRight: "20px" }}
        />
      </div>
    );
  }

  if (progress >= CONTRACT_NFT_TOTAL_AMOUNT || status === CONTRACT_STATUS.SOLD_OUT) {
    mintButton = (
      <StyledMintButton
        style={{
          background: "#eee",
          color: "#999",
          cursor: "not-allowed",
        }}
      >
        Sold Out
      </StyledMintButton>
    );
  }

  if (numberMinted >= CONTRACT_PERWALLET_MAX_MINT_AMOUNT) {
    mintButton = (
      <StyledMintButton
        style={{
          background: "#eee",
          color: "#999",
          cursor: "not-allowed",
        }}
      >
        The max is {CONTRACT_PERWALLET_MAX_MINT_AMOUNT}
      </StyledMintButton>
    );
  }
  console.log('mint---fullAddress', fullAddress)
  if (!fullAddress) {//没有连接钱包时卡住mint按钮
    mintButton = (
      <StyledMintButton
        style={{
          background: "#eee",
          color: "#999",
          cursor: "not-allowed",
        }}
      >
        Mint Is Coming
      </StyledMintButton>
    );
  }

  const MintboxContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 5rem 3rem 2.4rem;
    border-radius: 60px;
    //background: #29b641;
    overflow: hidden;
    @media only screen and (max-width: ${padWidth}) {
    padding: 4rem 2.2rem 1.6rem;
    width: 90%;
  }`;

  const MintedProgressDiv = styled.div`
    font-family: Montserrat-Italic;
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
    color: #EDCD58;
    font-size: 1.8rem;
    @media only screen and (max-width: ${padWidth}) {
    font-size: 1.2rem;
   }`;

  const GetMaxSpan = styled.span`
    cursor: pointer;
    text-align: center;
    padding: 9px;
    font-size: 1.4rem;
    color: #f0f0f0;
    text-decoration: underline;
    font-family: Montserrat-Italic;
    :hover {
      color: #ffff23;
   }
   @media only screen and (max-width: ${padWidth}) {
    font-size: 0.8rem;
   }
   `;

  const PlusImg = styled.img`
  cursor: pointer;
  width: 5.3rem;
  height: 5.3rem;
  padding: 0.9rem;
  will-change: transform;
  transition: all 0.2s ease;
  :hover {
    transform: scale(1.15);
  }
  @media only screen and (max-width: ${padWidth}) {
  width: 3.7rem;
  height: 3.7rem;
  padding: 0.4rem;
  :hover {
    transform: scale(1);
  }
  }
  `;

  const MintedNum = styled.div`
  font-family: Montserrat;
  font-weight: 1000;
  text-align: center;
  font-size: 7rem;
  min-width: 11rem;
  color: #28e35d;
  @media only screen and (max-width: ${padWidth}) {
  font-size: 4.3rem;
  min-width: 7.2rem;
   }
   `;

  const MintedTipsDiv = styled.div`
  font-family: Montserrat-Italic;
  text-align: center;
  font-size: 1.8rem;
  color: white;
  @media only screen and (max-width: ${padWidth}) {
  font-size: 1.2rem;
   }
   `;

  const MintedTopTipsDiv = styled.div`
  font-family: pxiky;
  text-align: center;
  font-size: 4rem;
  color: white;
  margin-bottom: 1rem;
  @media only screen and (max-width: ${padWidth}) {
  font-size: 1.8rem;
  margin-top: 0;
   }
   `;

  return (
    <MintboxContainer>
      {/* <MintedTopTipsDiv>
      {status === CONTRACT_STATUS.ON ? 'Mint Is Alive' : 'Mint Is Alive'}
      </MintedTopTipsDiv> */}
      <MintedProgressDiv>
        {progress === null ? " ? " : progress} / {CONTRACT_NFT_TOTAL_AMOUNT}
      </MintedProgressDiv>
      <div style={{
        display: "flex",
        alignItems: "center",
        marginBottom: '20px'
      }}>
        <GetMaxSpan style={{ color: "transparent" }}>
          {"Get Max"}
        </GetMaxSpan>
        <PlusImg
          src="/images/minus.png"
          onClick={() => {
            if (wantMintAmount <= 1) {
              setWantMintAmount(1)
              return;
            }
            setWantMintAmount(wantMintAmount - 1)
            gtag('event', 'click_minus', { 'click_minus': 'click_minus' });
          }}
        />
        <MintedNum>
          {wantMintAmount}
        </MintedNum>

        <PlusImg
          src="/images/plus.png"
          onClick={() => {
            if (wantMintAmount >= CONTRACT_PERWALLET_MAX_MINT_AMOUNT - numberMinted) {
              setWantMintAmount((CONTRACT_PERWALLET_MAX_MINT_AMOUNT - numberMinted)<= 0 ? 0 :(CONTRACT_PERWALLET_MAX_MINT_AMOUNT - numberMinted))
              return;
            }
            setWantMintAmount(wantMintAmount + 1)
            gtag('event', 'click_minus', { 'click_minus': 'click_minus' });
          }}
        />
        <GetMaxSpan
          onClick={() => {
            setWantMintAmount((CONTRACT_PERWALLET_MAX_MINT_AMOUNT - numberMinted)<= 0 ? 0 :(CONTRACT_PERWALLET_MAX_MINT_AMOUNT - numberMinted))
            gtag('event', 'click_getmax', { 'click_getmax': 'click_getmax' });
          }}>
          {"Get Max"}
        </GetMaxSpan>
      </div>
      {mintButton}
      {/* {CONTRACT_NFT_PER_PRICE} ETH each. */}
    </MintboxContainer >
  );
}

const MintContainer = styled.div`
    display: flex;
    width: 100%;
    margin-top: 4%;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex-direction: column;
    //background-color: blue;
    @media only screen and (max-width: ${padWidth}) {
    height: auto;
    padding: 0;
    margin-top: 2%;
  }`;

function Mint() {
  return (
    <MintContainer
      id="mint">
      <MintSection />
    </MintContainer>
  );
}

export default Mint;
