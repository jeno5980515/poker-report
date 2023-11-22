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

const sortBySize2 = (a, b) => {
	if (a[0] === 'X') {
		return 1;
	}
	if (b[0] === 'X') {
		return -1;
	}
	if (a[0] === 'RAI') {
		return -1
	}
	if (b[0] === 'RAI') {
		return 1
	}
	return parseFloat(b[0].slice(1)) - parseFloat(a[0].slice(1))
}




const COLOR_MAP = {
	'R1.8': "rgb(240, 60, 60)",
	'R2.75': "rgb(202, 50, 50)",
	"R3.65": "rgb(202, 50, 50)",
	'R4.1': "rgb(163, 41, 41)",
	"R6.9": "rgb(125, 31, 31)",
	"R7.15": "rgb(125, 31, 31)",
	"RAI": "rgb(106, 26, 26)",
	"X": "rgb(90, 185, 102)"
}

const Wrapper = styled.div`
	width: 100%;
	height: 400px;
	display: flex;
	flex-wrap: wrap;
	@media (max-width: 767px) {
		margin: 5px;
		width: 100%;
		> * {
			width: 40%;
			margin: 5px;
		}
	}
	@media (min-width: 769px) {
	}
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


const Text = styled.div`

`

const HandWrapper = styled.div`
	display: flex;
	flex-direction: column;
	color: white;
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

const ItemWrapper = styled.div`
	display: flex;
	justify-content: space-between;
`

const Title = styled.div`
	color: grey;
`

const ColorBlock = styled.div`
	background: ${({ color }) => color};
	height: 100%;
	width: ${({ width }) => width}%;
	color: black;
	display: flex;
	flex-direction: column;
	align-items: center;
`

const ColorBar = styled.div`
	width: 100px;
	height: 10px;
	display: flex;
`

const Right = styled.div`
	width: 150px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	@media (max-width: 767px) {
		width: 60%;
		font-size: 0.8rem;
	}
	@media (min-width: 769px) {
		width: 150px;
	}
`

const Left = styled.div`
	width: 90px;
	padding-right: 10px;
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	width: 150px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	@media (max-width: 767px) {
		font-size: 0.8rem;
		width: 30px;
		text-overflow: ellipsis;
	}
	@media (min-width: 769px) {
	}
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

const Hand = ({ data, onSelectFilter, onClickFilter }) => {
	return <HandWrapper>
		<Title>Hands</Title>
		{
			data
				.filter(d => d.total_combos !== 0)
				.map(d => {
					return <ItemWrapper
						key={d.name}
						onMouseEnter={() => onSelectFilter({ key: d.name, type: 'hands' })}
						onMouseLeave={() => onSelectFilter({ type: 'none' })}
						onClick={() => onClickFilter({ key: d.name, type: 'hands' })}
					>
						<Left>{d.name}</Left>
						<Right>
							<div>{`${(d.total_frequency * 100).toFixed(1)}%`}</div>
							{
								<ColorBar>
									{
										[...Object.entries(d.actions_total_frequencies)]
											.sort(sortBySize2)
											.map(([key, value]) => {
												return <ColorBlock color={COLOR_MAP[key]} width={value*100}></ColorBlock>
											})
									}
								</ColorBar>
							}
						</Right>
					</ItemWrapper>
				})
		}
	</HandWrapper>
}

const EQSimple = ({ data, onSelectFilter, onClickFilter }) => {
	return <HandWrapper>
		<Title>EQ Simple</Title>
		{
			data
				.filter(d => d.total_combos !== 0)
				.map(d => {
					return <ItemWrapper
						key={d.name}
						onMouseEnter={() => onSelectFilter({ key: d.name, type: 'eqs' })}
						onMouseLeave={() => onSelectFilter({ type: 'none' })}
						onClick={() => onClickFilter({ key: d.name, type: 'eqs' })}
					>
						<Left>{d.name}</Left>
						<Right>
							<div>{`${(d.total_frequency * 100).toFixed(1)}%`}</div>
							{
								<ColorBar>
									{
										[...Object.entries(d.actions_total_frequencies)]
											.sort(sortBySize2)
											.map(([key, value]) => {
												return <ColorBlock color={COLOR_MAP[key]} width={value*100}></ColorBlock>
											})
									}
								</ColorBar>
							}
						</Right>
					</ItemWrapper>
				})
		}
	</HandWrapper>
}

const Draw = ({ data, onSelectFilter, onClickFilter }) => {
	return <HandWrapper>
		<Title>Draw</Title>
		{
			data
				.filter(d => d.total_combos !== 0)
				.map(d => {
					return <ItemWrapper
						key={d.name}
						onMouseEnter={() => onSelectFilter({ key: d.name, type: 'draw' })}
						onMouseLeave={() => onSelectFilter({ type: 'none' })}
						onClick={() => onClickFilter({ key: d.name, type: 'draw' })}
					>
						<Left>{d.name}</Left>
						<Right>
							<div>{`${(d.total_frequency * 100).toFixed(1)}%`}</div>
							{
								<ColorBar>
									{
										[...Object.entries(d.actions_total_frequencies)]
											.sort(sortBySize2)
											.map(([key, value]) => {
												return <ColorBlock color={COLOR_MAP[key]} width={value*100}></ColorBlock>
											})
									}
								</ColorBar>
							}
						</Right>
					</ItemWrapper>
				})
		}
	</HandWrapper>
}

const EQAdv = ({ data, onSelectFilter, onClickFilter }) => {
	return <HandWrapper>
		<Title>EQ Advanced</Title>
		{
			data
				.filter(d => d.total_combos !== 0)
				.map(d => {
					return <ItemWrapper
						key={d.name}
						onMouseEnter={() => onSelectFilter({ key: d.name, type: 'eqa' })}
						onMouseLeave={() => onSelectFilter({ type: 'none' })}
						onClick={() => onClickFilter({ key: d.name, type: 'eqa' })}
					>
						<Left>{d.name}</Left>
						<Right>
							<div>{`${(d.total_frequency * 100).toFixed(1)}%`}</div>
							{
								<ColorBar>
									{
										[...Object.entries(d.actions_total_frequencies)]
											.sort(sortBySize2)
											.map(([key, value]) => {
												return <ColorBlock color={COLOR_MAP[key]} width={value*100}></ColorBlock>
											})
									}
								</ColorBar>
							}
						</Right>
					</ItemWrapper>
				})
		}
	</HandWrapper>
}

const Filter = ({ data, onSelectFilter, hand, onClickFilter }) => {
	const { solutions, blocker_rate, unblocker_rate } = data

	return <Wrapper>
		{
			<>
				<Hand data={data.players_info[1].hand_categories} onSelectFilter={onSelectFilter} onClickFilter={onClickFilter} />
				<EQSimple data={data.players_info[1].equity_buckets} onSelectFilter={onSelectFilter} onClickFilter={onClickFilter}/>
				<Draw data={data.players_info[1].draw_categories} onSelectFilter={onSelectFilter} onClickFilter={onClickFilter}/>
				<EQAdv data={data.players_info[1].equity_buckets_advanced} onSelectFilter={onSelectFilter} onClickFilter={onClickFilter}/>
			</>
		}
	</Wrapper>
}

export default Filter;