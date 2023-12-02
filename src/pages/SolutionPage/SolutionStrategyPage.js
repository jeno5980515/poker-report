import styled from 'styled-components';
import { useEffect, useRef, useState, useMemo } from 'react';

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
	justify-content: start;
	border: black 1px solid;
	font-size: 0.7em;
	user-select: none;
	position: relative;
	filter: ${({ highlight }) => highlight ? 'brightness(100%)' : 'brightness(30%)'};
`

const ColorBlock = styled.div`
	width: ${({ width }) => width}%;
	background: ${({ color }) => color };
	height: 100%;
	display: ${({ width }) => width === 0 ? 'none' : 'block'};
`

const TextBlock = styled.div`
	position: absolute;
	width: 100%;
	display: flex;
	justify-content: center;
`

const StrategyDetail = styled.div`
	width: 400px;
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
	isFreq = true,
	selectedSize = 'none',
	mode = 'complex'
}) => {
	const checkFreq = data.actions_total_frequencies.X
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
				? 
					mode === 'complex'
						? [...Object.entries(data.actions_total_frequencies)]
								.sort(sortBySize)
								.map(([key, value]) => {
									let width = value * 100 * data.total_frequency
									if (selectedSize !== 'none') {
										if (key !== selectedSize) {
											width = 0;
										}
									}
									return width !== 0 ? <ColorBlock
										color={COLOR_MAP[key]}
										width={width}
										isSelected={selectedSize !== 'none'}
									></ColorBlock> : null
								})
						: <>
							<ColorBlock
								color={'rgb(240, 60, 60)'}
								width={(selectedSize === 'Bet' || selectedSize === 'none') ? (1 - checkFreq)*100*data.total_frequency : 0}
								isSelected={selectedSize !== 'none'}
							></ColorBlock>
							<ColorBlock
								color={'rgb(90, 185, 102)'}
								width={(selectedSize === 'X' || selectedSize === 'none') ? checkFreq*100*data.total_frequency : 0}
								isSelected={selectedSize !== 'none'}
							></ColorBlock>
						</>
				: data.total_frequenc !== 0 ? <ColorBlock color={'rgb(255, 143, 0)'} width={data.total_frequency * 100}></ColorBlock> : null
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
	selectedSize = 'none',
	setSelectedSize,
	setStrategyMode,
	strategyMode,
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
							selectedSize={selectedSize}
							mode={strategyMode}
						/>
					})
				})
			}
		</Board>
		<StrategyDetail>
			<div style={{ display: 'flex' }}>
				<button onClick={() => setStrategyMode('simple')}>Simple</button>
				<button onClick={() => setStrategyMode('complex')}>Complex</button>
			</div>
			<Action data={data.solutions} onSizeSelected={setSelectedSize} mode={strategyMode} ></Action>
			<DetailControlWrapper>
				<button onClick={() => setDetailState('hands')}>Hands</button>
				<button onClick={() => setDetailState('filters')}>Filters</button>
			<button onClick={() => handleClickFilter({ type: 'none' })}>Clear</button>
			</DetailControlWrapper>
			{
				detailState === 'hands'
					? <Hand data={data} indexList={INDEX_MAP[currentHand.name]} hand={selectedKey} mode={strategyMode}></Hand>
					: <Filter
							data={data}
							onSelectFilter={setFilterState}
							onClickFilter={handleClickFilter}
							hand={selectedKey}
							mode={strategyMode}
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
	selectedSize,
	setSelectedSize,
	setStrategyMode,
	strategyMode
}) => {

	const memoHand = useMemo(() => {
		return <Hand data={data} indexList={INDEX_MAP[currentHand.name]} hand={selectedKey} mode={strategyMode}></Hand>
	}, [JSON.stringify(data), JSON.stringify(currentHand), strategyMode])

	const memoFilter = useMemo(() => {
		return <Filter
			data={data}
			onSelectFilter={setFilterState}
			onClickFilter={handleClickFilter}
			hand={selectedKey}
			mode={strategyMode}
		/>
	}, [JSON.stringify(data), JSON.stringify(currentHand), strategyMode])

	return <SolutionPageWrapper>
		<div style={{ display: 'flex' }}>
			<button onClick={() => setStrategyMode('simple')}>Simple</button>
			<button onClick={() => setStrategyMode('complex')}>Complex</button>
		</div>
		<Action data={data.solutions} onSizeSelected={setSelectedSize} mode={strategyMode}></Action>
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
							selectedSize={selectedSize}
							mode={strategyMode}
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
					? memoHand
					: memoFilter
			}
		</StrategyDetail>
	</SolutionPageWrapper>
}

const SolutionStrategyPage = (props) => {
	return window.innerWidth < 768
		? <SolutionStrategyMobilePage {...props} />
		: <SolutionStrategyDesktopPage {...props} />
}

export default SolutionStrategyPage