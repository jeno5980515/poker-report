import styled from 'styled-components';
import { useEffect, useRef, useState, memo } from 'react';
import Action from './Action';
import RangeFilter from './RangeFilter';

const RangeDetail = styled.div`
	width: 450px;
	display: flex;
	flex-direction: column;
	height: 550px;
	justify-content: space-between;
	@media (max-width: 767px) {
		width: 45vw;
		margin-right: 20px;
		margin-left: 5px;
	}

	@media (min-width: 768px) {

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

const BoardControl = styled.div`
	@media (max-width: 767px) {
	}

	@media (min-width: 768px) {

	}
`

const FilteredChart = styled.div`
	width: 100%;
	position: absolute;
	top: 0;
	@media (max-width: 767px) {
		height: 200px;
	}

	@media (min-width: 768px) {
		height: 300px;
	}
`

const ChartWrapper = styled.div`
	position: relative;
`

const BoardWrapper = styled.div`
	display: flex;
	@media (max-width: 767px) {
		flex-direction: column;
		width: 100vw;
		font-size: 5px;
	}

	@media (min-width: 768px) {

	}
`

const RangeLeft = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
`

const Board = styled.div`
	display: flex;
  flex-wrap: wrap;
	width: 100%;
	max-width: 600px;
	padding: 2.5%;
`

const HandDivWrapper = styled.div`
	@media (max-width: 767px) {
		flex-basis: 6.5%;
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

const Chart = styled.div`
	width: 100%;
	height: 200px;
`

const TopWrapper = styled.div`
	display: flex;
	width: 100vw;
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

const HandDiv = ({
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

const SolutionRangeDesktopPage = ({
	data,
	player1RangeData,
	player2RangeData,
	currentPlayer,
	chartRef,
	filteredChartRef,
	setFilterState,
	selectedKey,
	setClickedFilter,
	handleClickFilter
}) => {
	return <SolutionPageWrapper>
		<RangeLeft>
			<BoardWrapper>
				<Board>
					{
						player1RangeData.map((row, x) => {
							return row.map((v, y) => {
								return <HandDiv
									// onMouseDown={() => onHandDown({ x, y })}
									// onMouseUp={onHandUp}
									data={data.players_info[0].simple_hand_counters[v.key]}
									hand={v.key}
									highlight={v.highlight}
									isFreq={false}
								/>
							})
						})
					}
				</Board>
				<Board>
					{
						player2RangeData.map((row, x) => {
							return row.map((v, y) => {
								return <HandDiv
									// onMouseDown={() => onHandDown({ x, y })}
									// onMouseUp={onHandUp}
									data={data.players_info[1].simple_hand_counters[v.key]}
									hand={v.key}
									highlight={v.highlight}
									isFreq={false}
								/>
							})
						})
					}
				</Board>
			</BoardWrapper>
			<ChartWrapper>
				<Chart ref={chartRef}></Chart>
				<FilteredChart ref={filteredChartRef}></FilteredChart>
			</ChartWrapper>
		</RangeLeft>
		<RangeDetail>
			<Action data={data.solutions}></Action>
			<RangeFilter
				data={data}
				onSelectFilter={({ type, key }) => setFilterState({ type, key })}
				hand={selectedKey}
				handleClickFilter={handleClickFilter}
			></RangeFilter>
		</RangeDetail>
	</SolutionPageWrapper>
}

const SolutionRangeMobilePage = ({
	data,
	player1RangeData,
	player2RangeData,
	currentPlayer,
	chartRef,
	filteredChartRef,
	setFilterState,
	selectedKey,
	setClickedFilter,
	handleClickFilter,
}) => {
	const [rangePlayer, setRangePlayer] = useState(2)
	return <SolutionPageWrapper>
		<Action data={data.solutions}></Action>
		<ChartWrapper>
			<Chart ref={chartRef}></Chart>
			<FilteredChart ref={filteredChartRef}></FilteredChart>
		</ChartWrapper>
		<TopWrapper>
			<BoardWrapper>
				<BoardControl>
					<button onClick={() => setRangePlayer(1)}>Player1</button>
					<button onClick={() => setRangePlayer(2)}>Player2</button>
				</BoardControl>
				<Board>
					{
						rangePlayer === 1 ? player1RangeData.map((row, x) => {
							return row.map((v, y) => {
								return <HandDiv
									// onMouseDown={() => onHandDown({ x, y })}
									// onMouseUp={onHandUp}
									data={data.players_info[0].simple_hand_counters[v.key]}
									hand={v.key}
									highlight={v.highlight}
									isFreq={false}
								/>
							})
						}) : player2RangeData.map((row, x) => {
							return row.map((v, y) => {
								return <HandDiv
									// onMouseDown={() => onHandDown({ x, y })}
									// onMouseUp={onHandUp}
									data={data.players_info[1].simple_hand_counters[v.key]}
									hand={v.key}
									highlight={v.highlight}
									isFreq={false}
								/>
							})
						})
					}
				</Board>
			</BoardWrapper>
			<RangeDetail>
				<RangeFilter
					data={data}
					onSelectFilter={({ type, key }) => setFilterState({ type, key })}
					hand={selectedKey}
					handleClickFilter={handleClickFilter}
				>	
				</RangeFilter>
			</RangeDetail>
		</TopWrapper>
	</SolutionPageWrapper>
}

const SolutionRangePage = (props) => {
	return window.innerWidth < 768
		? <SolutionRangeMobilePage {...props}/>
		: <SolutionRangeDesktopPage {...props}/>
}

export default SolutionRangePage;