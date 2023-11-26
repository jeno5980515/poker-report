import styled from 'styled-components';
import { useEffect, useRef, useState, memo } from 'react';

import INDEX_MAP from '../../indexMap.json';
import Action from './Action';
import Filter from './Filter';
import Hand from './Hand';

const DetailControlWrapper = styled.div`
	display: flex;
	@media (max-width: 767px) {
		margin: 5px;
	}

	@media (min-width: 768px) {
		margin-top: 70px;
	}
`

const SolutionPageWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;

	@media (max-width: 767px) {
		flex-wrap: wrap;
		flex-direction: column;
	}

	@media (min-width: 768px) {

	}
`

const Board = styled.div`
	display: flex;
  flex-wrap: wrap;
	width: 100%;
	padding: 2.5%;

	@media (max-width: 767px) {
		padding: 4.8%;
		width: 90%;
	}

	@media (min-width: 768px) {
		width: 60vw;
	}
`

const HandDivWrapper = styled.div`
	@media (max-width: 767px) {
		flex-basis: 7%;
	}

	@media (min-width: 768px) {
		flex-basis: 7%;
	}

	background: rgb(30, 30, 30);
	color: rgb(245, 245, 245);
	width: 10%;
  aspect-ratio: 1/1;
	display: flex;
	align-items: center;
	justify-content: ${({ isFreq }) => isFreq ? 'center' : 'start'};;
	border: black 1px solid;
	font-size: 0.7em;
	user-select: none;
	filter: ${({ highlight }) => highlight ? 'brightness(100%)' : 'brightness(30%)'};
`

const ColorBlock = styled.div`
	width: ${({ width }) => width}%;
	background: ${({ color }) => color };
	height: 100%;
`

const TextBlock = styled.div`
	position: absolute;
`

const StrategyDetail = styled.div`
	width: 450px;
	display: flex;
	flex-direction: column;
	height: 550px;
	@media (max-width: 767px) {
		height: 200px;
		overflow: scroll;
		width: 100%;
	}

	@media (min-width: 768px) {
		justify-content: space-between;
	}
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


const sortBySize = (a, b) => {
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

export const HandDiv = ({
	data,
	hand,
	onMouseEnter,
	onMouseDown,
	onMouseUp,
	indexX,
	indexY,
	highlight,
	isFreq = true
}) => {
	return <HandDivWrapper
		onMouseEnter={onMouseEnter}
		onMouseDown={onMouseDown}
		onMouseUp={onMouseUp}
		data-x={indexX}
		data-y={indexY}
		highlight={highlight}
		isFreq={isFreq}
	>
		{
			isFreq
				? [...Object.entries(data.actions_total_frequencies)]
					.sort(sortBySize)
					.map(([key, value]) => {
						return <ColorBlock color={COLOR_MAP[key]} width={value*100}></ColorBlock>
					})
				: <ColorBlock color={'rgb(255, 143, 0)'} width={data.total_frequency * 100}></ColorBlock>
		}
		<TextBlock>{hand}</TextBlock>
	</HandDivWrapper>
}

const SolutionStrategyDesktopPage = ({
	playerRangeData,
	currentPlayer,
	data,
	onHandEnter,
	setDetailState,
	DetailComp,
	setClickedFilter,
	selectedKey,
	setFilterState,
	handleClickFilter,
	currentHand,
	detailState,
}) => {
	return <SolutionPageWrapper>
		<Board>
			{
				playerRangeData.map((row, x) => {
					return row.map((v, y) => {
						return <HandDiv
							onMouseEnter={() => onHandEnter({ key: v.key })}
							// onMouseDown={() => onHandDown({ x, y })}
							// onMouseUp={onHandUp}
							data={data.players_info[currentPlayer === 2 ? 1 : 0].simple_hand_counters[v.key]}
							hand={v.key}
							highlight={v.highlight}
						/>
					})
				})
			}
		</Board>
		<StrategyDetail>
			<Action data={data.solutions}></Action>
			<DetailControlWrapper>
				<button onClick={() => setDetailState('hands')}>Hands</button>
				<button onClick={() => setDetailState('filters')}>Filters</button>
			<button onClick={() => handleClickFilter({ type: 'none' })}>Clear</button>
			</DetailControlWrapper>
			{
				detailState === 'hands'
					? <Hand data={data} indexList={INDEX_MAP[currentHand.name]} hand={selectedKey}></Hand>
					: <Filter
							data={data}
							onSelectFilter={({ type, key }) => setFilterState({ type, key })}
							onClickFilter={({ type, key }) => handleClickFilter({ type, key })}
							hand={selectedKey}>
						></Filter>
			}
		</StrategyDetail>
	</SolutionPageWrapper>
}

const SolutionStrategyMobilePage = ({
	playerRangeData,
	currentPlayer,
	data,
	onHandEnter,
	setDetailState,
	selectedKey,
	setClickedFilter,
	setFilterState,
	handleClickFilter,
	currentHand,
	detailState,
}) => {
	return <SolutionPageWrapper>
		<Action data={data.solutions}></Action>
		<Board>
			{
				playerRangeData.map((row, x) => {
					return row.map((v, y) => {
						return <HandDiv
							onMouseEnter={() => onHandEnter({ key: v.key })}
							// onMouseDown={() => onHandDown({ x, y })}
							// onMouseUp={onHandUp}
							data={data.players_info[currentPlayer === 2 ? 1 : 0].simple_hand_counters[v.key]}
							hand={v.key}
							highlight={v.highlight}
						/>
					})
				})
			}
		</Board>
		<DetailControlWrapper>
			<button onClick={() => setDetailState('hands')}>Hands</button>
			<button onClick={() => setDetailState('filters')}>Filters</button>
			<button onClick={() => handleClickFilter({ type: 'none' })}>Clear</button>
		</DetailControlWrapper>
		<StrategyDetail>
			{
				detailState === 'hands'
					? <Hand data={data} indexList={INDEX_MAP[currentHand.name]} hand={selectedKey}></Hand>
					: <Filter
							data={data}
							onSelectFilter={({ type, key }) => setFilterState({ type, key })}
							onClickFilter={({ type, key }) => handleClickFilter({ type, key })}
							hand={selectedKey}>
						></Filter>
			}
		</StrategyDetail>
	</SolutionPageWrapper>
}

const SolutionStrategyPage = (props) => {
	return window.innerWidth < 768
		? <SolutionStrategyMobilePage {...props}/>
		: <SolutionStrategyDesktopPage {...props}/>
}

export default SolutionStrategyPage