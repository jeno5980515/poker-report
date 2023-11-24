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
	if (a.action_code === 'X') {
		return 1;
	}
	if (b.action_code === 'X') {
		return -1;
	}
	if (a.action_code === 'RAI') {
		return -1
	}
	if (b.action_code === 'RAI') {
		return 1
	}
	return parseFloat(b.action_code.slice(1)) - parseFloat(a.action_code.slice(1))
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
	'R3': "rgb(240, 60, 60)",
	'R2.75': "rgb(202, 50, 50)",
	'R4.1': "rgb(163, 41, 41)",
	'R6': "rgb(163, 41, 41)",
	'R3.65': "rgb(163, 41, 41)",
	'R11.5': "rgb(240, 60, 60)",
	'R23.05': "rgb(163, 41, 41)",
	"R6.9": "rgb(125, 31, 31)",
	"R11.85": "rgb(125, 31, 31)",
	"R7.15": "rgb(125, 31, 31)",
	"R45.35": "rgb(125, 31, 31)",
	"RAI": "rgb(106, 26, 26)",
	"X": "rgb(90, 185, 102)"
}

const Wrapper = styled.div`
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	margin-top: 100px;
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



const Block = styled.div`
	@media (max-width: 767px) {
		font-size: 0.5rem;
		width: 85px;
		height: 100px;
		display: flex;
		margin: 1px;
		position: relative;
	}

	@media (min-width: 768px) {
		width: 150px;
		height: 150px;
		display: flex;
		margin: 1px;
		position: relative;
	}
`


const Left = styled.div`

`

const Right = styled.div`
	text-align: right;
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

const Hand = ({ data }) => {
	return <Wrapper>
		{
			data.map((d) => {
				const sortedData = [...d.solutions].sort(sortBySize);
				return <Block width={'24%'}>
					<SuitText>
						<SuitCharacter color={getColor(d.name[1])}>{d.name[0]}</SuitCharacter>
						<SuitCharacter color={getColor(d.name[1])}>{getSVG(d.name[1])}</SuitCharacter>
					</SuitText>
					{
						sortedData
							.map(d => {
								return <ColorBlock color={COLOR_MAP[d.action_code]} width={d.frequency * 100}></ColorBlock>
							})

					}
					<TextWrapper size={'100%'}>
						<Left>
							{
								sortedData.map(a => <Text>{a.action_code}</Text>)
							}
						</Left>
						<Right>
							{
								sortedData.map(a => <Text>{`${(a.frequency * 100).toFixed(1)}%`}</Text>)
							}
						</Right>
					</TextWrapper>
				</Block>
			})
		}
	</Wrapper>
}

export default Hand;