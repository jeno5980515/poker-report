import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { ReactComponent as HeartSVG } from '../../assets/heart.svg';
import { ReactComponent as DiamondSVG } from '../../assets/diamond.svg';
import { ReactComponent as ClubSVG } from '../../assets/club.svg';
import { ReactComponent as SpadeSVG } from '../../assets/spade.svg';
import { ReactComponent as ArrowSVG } from '../../assets/arrow.svg';



const getSVG = (text) => {
	switch (text) {
    case 'h':
      return <HeartSVG fill="#EF5350"/>;
    case 'd':
      return <DiamondSVG fill="#448AFF" />;
    case 'c':
      return <ClubSVG fill="#66BB6A"/>;
		case 's':
			return <SpadeSVG fill="rgb(80, 79, 79)"/>;
    default:
      return <HeartSVG fill="#EF5350" />;
  }
}


const sortBySize = (a, b) => {
	if (a.action.code === 'X') {
		return 1;
	}
	if (b.action.code === 'X') {
		return -1;
	}
	if (a.action.code === 'RAI') {
		return -1
	}
	if (b.action.code === 'RAI') {
		return 1
	}
	return parseFloat(b.action.code.slice(1)) - parseFloat(a.action.code.slice(1))
}

const ColorBlock = styled.div`
	background: ${({ color }) => color};
	height: 100%;
	width: ${({ width }) => width}%;
	color: black;
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	align-items: center;
`
const COLOR_MAP = {
	'R1.8': "rgb(240, 60, 60)",
	'R2': "rgb(240, 60, 60)",
	'R6.95': "rgb(240, 60, 60)",
	'R2.75': "rgb(202, 50, 50)",
	"R3.65": "rgb(202, 50, 50)",
	"R13.85": "rgb(202, 50, 50)",
	"R3.95": "rgb(202, 50, 50)",
	'R4.1': "rgb(163, 41, 41)",
	"R6.9": "rgb(125, 31, 31)",
	"R7.15": "rgb(125, 31, 31)",
	"R7.8": "rgb(125, 31, 31)",
	"R27.3": "rgb(125, 31, 31)",
	"RAI": "rgb(106, 26, 26)",
	"X": "rgb(90, 185, 102)"
}

const Wrapper = styled.div`
	width: 100%;
	height: 400px;
	display: flex;
	flex-wrap: wrap;
`

const SuitText = styled.div`
	position: absolute;
	background: white;
	display: flex;
	margin: 5px;
	> * {
		width: 13px;
		font-size: 15px;
	}
`

const SuitCharacter = styled.div`
	color: ${({ color }) => color};
`

const BlockerText = styled.div`
	position: absolute;
	right: 0;
	background: white;
	display: flex;
	margin: 5px;
	> * {
		width: 13px;
		font-size: 15px;
	}
`



const SuitBlock = styled.div`
	width: ${({ width }) => width};
	display: flex;
	margin: 1px;
	position: relative;
`


const Left = styled.div`

`

const Right = styled.div`

`

const Text = styled.div`

`

const FONT_SIZE_MAP = {
	4: '1em',
	6: '0.8em',
	12: '0.5em'
}

const TextWrapper = styled.div`
	position: absolute;
	display: flex;
	width: 80%;
	justify-content: space-between;
	margin-top: 20px;
	padding: 10%;
	font-size: ${({ size }) => FONT_SIZE_MAP[size]};
`


const getColor = (text) => {
  switch (text) {
    case 'h':
      return '#EF5350';
    case 'd':
      return '#448AFF';
    case 'c':
      return '#66BB6A';
    default:
      return 'black';
  }
}

const getSuitList = (length) => {
	switch (length) {
		case 6:
			return ['sh', 'sd', 'hd', 'sc', 'hc', 'dc'];
		case 4:
			return ['ss', 'hh', 'dd', 'cc'];
		case 12:
			return ['sh', 'sd', 'sc', 'hs', 'hd', 'hc', 'ds', 'dh', 'dc', 'cs', 'ch', 'cd'];
	}
}
/*
	pocket: sh, sd, hd, sc, hc, dc,
	suit: s, h, d, c
	off: sh, sd, sc, hs, hd, hc, ds, dh, dc, cs, ch, cd
*/

const Hand = ({ data, indexList, hand, mode = 'complex' }) => {
	const { solutions, blocker_rate, unblocker_rate } = data;
	const suitList = getSuitList(indexList.length)
	const sortedData = [...solutions].sort(sortBySize)
	const checkData = sortedData.find(d => d.action.code === 'X')
	return <Wrapper>
		{
			indexList.map((v, index) => {
				const suit = suitList[index]
				return <SuitBlock width={suitList.length === 4 ? '49%' : '32%'}>
					<SuitText>
						<SuitCharacter color={getColor(suit[0])}>{hand[0]}</SuitCharacter>
						<SuitCharacter color={getColor(suit[0])}>{getSVG(suit[0])}</SuitCharacter>
						<SuitCharacter color={getColor(suit[1])}>{hand[1]}</SuitCharacter>
						<SuitCharacter color={getColor(suit[1])}>{getSVG(suit[1])}</SuitCharacter>
					</SuitText>
					{
						blocker_rate[v] === -1 ? null : <BlockerText>
							<ArrowSVG />
							<div>{blocker_rate[v]}</div>
							<ArrowSVG style={{ transform: 'rotate(180deg)' }} />
							<div>{unblocker_rate[v]}</div>
						</BlockerText>
					}
					{
						mode === 'complex'
							? sortedData
									.map(d => {
										return <ColorBlock color={COLOR_MAP[d.action.code]} width={d.strategy[v] * 100}></ColorBlock>
									})
							: <>
								<ColorBlock color={'rgb(240, 60, 60)'} width={(1 - checkData.strategy[v]) * 100}></ColorBlock>
								<ColorBlock color={'rgb(90, 185, 102)'} width={checkData.strategy[v] * 100}></ColorBlock>
							</>

					}
					<TextWrapper size={indexList.length}>
						{
							mode === 'complex' 
								? <>
										<Left>
											{
												sortedData.map(a => <Text>{a.action.code}</Text>)
											}
										</Left>
										<Right>
											{
												sortedData.map(a => <Text>{`${(a.strategy[v] * 100).toFixed(1)}%`}</Text>)
											}
										</Right>
									</>
								:	<>
									<Left>
										<Text>Bet</Text>
										<Text>Check</Text>
									</Left>
									<Right>
										<Text>{`${((1 - checkData.strategy[v]) * 100).toFixed(1)}%`}</Text>
										<Text>{`${(checkData.strategy[v] * 100).toFixed(1)}%`}</Text>
									</Right>
								</>
						}
					</TextWrapper>
				</SuitBlock>
			})
		}
	</Wrapper>
}

export default Hand;