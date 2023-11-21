import * as d3 from "d3";
import { Routes, Route, Outlet, Link } from "react-router-dom";
import { useEffect, useRef, useState, memo } from 'react';
import { Canvg } from 'canvg';
import styled from 'styled-components';
import Select, { components } from "react-select";
import Action from './Action';
import Hand from './Hand';
import Filter from './Filter';
import RangeFilter from './RangeFilter';

import INDEX_MAP from '../../indexMap.json';
// import DATA from './solutions/NL50GG'
import DATA from './solutions'
// import DATA from './solutions/A42.json'

const PREFLOP_MAP = {
	'F-F-F-R2.5-F-C': 'BTN VS BB',
	'R2.5-F-F-F-F-C': 'LJ VS BB',
	'F-F-F-F-R3-C': 'SB VS BB',
	'F-F-F-R2.5-R10-F-C': 'SB 3B BTN',
}

const Wrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	width: 100%;
`

const SolutionPageWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
`


const Board = styled.div`
	display: flex;
  flex-wrap: wrap;
	width: 100%;
	max-width: 600px;
	padding: 2.5%;
`

const HandDivWrapper = styled.div`
	flex-basis: 7%;
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

const Page = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
`

const StrategyDetail = styled.div`
	width: 450px;
	display: flex;
	flex-direction: column;
	height: 550px;
	justify-content: space-between;
`

const RangeDetail = styled.div`
	width: 450px;
	display: flex;
	flex-direction: column;
	height: 550px;
	justify-content: space-between;
`


const DetailControlWrapper = styled.div`
	display: flex;
	margin-top: 70px;
`

const SolutionPageControlWrapper = styled.div`
	display: flex;
	margin-top: 70px;
`

const Chart = styled.div`
	width: 100%;
	height: 300px;
`

const FilteredChart = styled.div`
	width: 100%;
	height: 300px;
	position: absolute;
	top: 0;
`

const ChartWrapper = styled.div`
	position: relative;
`

const BoardWrapper = styled.div`
	display: flex;
`

const RangeLeft = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
`


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

const getColors = (number) => {
  switch (number) {
    case 7:
      return ["rgb(106, 26, 26)", "rgb(125, 31, 31)", "rgb(163, 41, 41)", "rgb(202, 50, 50)", "rgb(221, 55, 55)", "rgb(240, 60, 60)", "rgb(90, 185, 102)"]
    case 6:
      return ["rgb(106, 26, 26)", "rgb(125, 31, 31)", "rgb(163, 41, 41)", "rgb(202, 50, 50)", "rgb(240, 60, 60)", "rgb(90, 185, 102)"];
    case 5:
      return ["rgb(106, 26, 26)", "rgb(125, 31, 31)", "rgb(202, 50, 50)", "rgb(240, 60, 60)", "rgb(90, 185, 102)"];
    case 3:
      return ["rgb(125, 31, 31)", "rgb(240, 60, 60)", "rgb(90, 185, 102)"]
    default:
      return []
  }
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


const RANGE = [
	['AA', 'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s'],
	['AKo', 'KK', 'KQs', 'KJs', 'KTs', 'K9s', 'K8s', 'K7s', 'K6s', 'K5s', 'K4s', 'K3s', 'K2s'],
	['AQo', 'KQo', 'QQ', 'QJs', 'QTs', 'Q9s', 'Q8s', 'Q7s', 'Q6s', 'Q5s', 'Q4s', 'Q3s', 'Q2s'],
	['AJo', 'KJo', 'QJo', 'JJ', 'JTs', 'J9s', 'J8s', 'J7s', 'J6s', 'J5s', 'J4s', 'J3s', 'J2s'],
	['ATo', 'KTo', 'QTo', 'JTo', 'TT', 'T9s', 'T8s', 'T7s', 'T6s', 'T5s', 'T4s', 'T3s', 'T2s'],
	['A9o', 'K9o', 'Q9o', 'J9o', 'T9o', '99', '98s', '97s', '96s', '95s', '94s', '93s', '92s'],
	['A8o', 'K8o', 'Q8o', 'J8o', 'T8o', '98o', '88', '87s', '86s', '85s', '84s', '83s', '82s'],
	['A7o', 'K7o', 'Q7o', 'J7o', 'T7o', '97o', '87o', '77', '76s', '75s', '74s', '73s', '72s'],
	['A6o', 'K6o', 'Q6o', 'J6o', 'T6o', '96o', '86o', '76o', '66', '65s', '64s', '63s', '62s'],
	['A5o', 'K5o', 'Q5o', 'J5o', 'T5o', '95o', '85o', '75o', '65o', '55', '54s', '53s', '52s'],
	['A4o', 'K4o', 'Q4o', 'J4o', 'T4o', '94o', '84o', '74o', '64o', '54o', '44', '43s', '42s'],
	['A3o', 'K3o', 'Q3o', 'J3o', 'T3o', '93o', '83o', '73o', '63o', '53o', '43o', '33', '32s'],
	['A2o', 'K2o', 'Q2o', 'J2o', 'T2o', '92o', '82o', '72o', '62o', '52o', '42o', '32o', '22'],
]

const ACTIVE_VALUE = 83;

const FrequencyWrapper = styled.div`
	display: flex;
`

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

const SolutionStrategyPage = ({
	playerRangeData,
	currentPlayer,
	data,
	onHandEnter,
	setDetailState,
	DetailComp,
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
			</DetailControlWrapper>
			<DetailComp />
		</StrategyDetail>
	</SolutionPageWrapper>
}

const SolutionRangePage = ({
	data,
	player1RangeData,
	player2RangeData,
	currentPlayer,
	chartRef,
	filteredChartRef,
	setFilterState,
	selectedKey
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
			<RangeFilter data={data} onSelectFilter={({ type, key }) => setFilterState({ type, key })} hand={selectedKey}></RangeFilter>
		</RangeDetail>
	</SolutionPageWrapper>
}

const RangePage = () => {
	const [mouseMode, setMouseMode] = useState('none')
	const [currentCombos, setCurrentCombos] = useState(0)
	const [setting, setSetting] = useState('NL500');
	const [preflop, setPreflop] = useState('F-F-F-R2.5-F-C');
	const [flopAction, setFlopAction] = useState('X');
	const [board, setBoard] = useState('2h2d2c');
	const [data, setData] = useState(null)
	const [selectedKey, setSelectedKey] = useState('AA')
	const [pageState, setPageState] = useState('range')
	const [detailState, setDetailState] = useState('hands')
	const [filterState, setFilterState] = useState({ type: 'none' })
  const [chartData, setChartDate] = useState([10, 25, 18, 32, 12, 7]);
	const [currentPlayer, setCurrentPlayer] = useState(2)
  const chartRef = useRef(null);
  const filteredChartRef = useRef(null);

	const player1HandData = data && data.players_info[0].simple_hand_counters;
	const player2HandData = data && data.players_info[1].simple_hand_counters;
	const [player1RangeData, setPlayer1RangeData] = useState(RANGE.map(row => {
		return row.map(v => ({ key: v, value : data && player1HandData[v].total_frequency > 0 ? 0 : -1, combo: data && player1HandData[v].total_combos, highlight: true }))
	}))
	const [player2RangeData, setPlayer2RangeData] = useState(RANGE.map(row => {
		return row.map(v => ({ key: v, value : data && player2HandData[v].total_frequency > 0 ? 0 : -1, combo: data && player2HandData[v].total_combos, highlight: true }))
	}))


	const answerCheckFreq = data && data.solutions[0].total_frequency;

	const totalCombos = data && Object.values(data.players_info[1].simple_hand_counters)
		.reduce((cal, val) => {
			return cal + val.total_combos
		}, 0)

	const onHandEnter = ({ key }) => {
		setSelectedKey(key)
		// setSelectedKey('A3o')
	}

	const onHandDown = ({ x, y }) => {
		let newMouseMode = 'none'
		switch (data[x][y].value) {
			case 0: {
				newMouseMode = 'bet';
				break;
			}
			case ACTIVE_VALUE: {
				newMouseMode = 'check';
				break;
			}
			default: {
				newMouseMode = 'none';
			}
		}
		setMouseMode(newMouseMode);
		if (data[x][y].value !== -1 && newMouseMode !== 'none') {
			const newData = [...data];
			const newRow = [...newData[x]]
			const newHand = {
				...newRow[y],
				value: newMouseMode === 'bet' ? ACTIVE_VALUE : 0
			}
			newRow[y] = newHand;
			newData[x] = newRow;
			setData(newData)
		}
	}

	const onHandUp = () => {
		setMouseMode('none')
	}

	useEffect(() => {
		let newPlayer1RangeData;
		let newPlayer2RangeData;
		let index1, index2;
		let player1MappedEQS = [], player2MappedEQS = [];
		const { key, type } = filterState;

		switch (type) {
			case 'hands': {
				index1 = (data.players_info[0].hand_categories.find(c => c.name === key) || { index: -1 }).index 
				newPlayer1RangeData = player1RangeData.map((row, x) => {
					return row.map((v, y) => {
						return {
							...v,
							highlight: v.value === -1 ? false : INDEX_MAP[v.key].some(i => data.hand_categories_range[i] === index1)
						}
					})
				})
				index2 = (data.players_info[1].hand_categories.find(c => c.name === key) || { index: -1 }).index 
				newPlayer2RangeData = player2RangeData.map((row, x) => {
					return row.map((v, y) => {
						return {
							...v,
							highlight: v.value === -1 ? false : INDEX_MAP[v.key].some(i => data.hand_categories_range[i] === index2)
						}
					})
				})
				player1MappedEQS = data.players_info[0].hand_eqs
					.map((q, index) => {
						return { value: q, index: data.hand_categories_range[index] }
					})
					.filter(d => d.value !== 0)
					.sort((a, b) => a.value - b.value)
				player2MappedEQS = data.players_info[1].hand_eqs
					.map((q, index) => {
						return { value: q, index: data.hand_categories_range[index] }
					})
					.filter(d => d.value !== 0)
					.sort((a, b) => a.value - b.value)
				break;
			}
			case 'draw': {
				index1 = (data.players_info[0].draw_categories.find(c => c.name === key) || { index: -1 }).index 
				newPlayer1RangeData = player1RangeData.map((row, x) => {
					return row.map((v, y) => {
						return {
							...v,
							highlight: v.value === -1 ? false : INDEX_MAP[v.key].some(i => data.draw_categories_range[i] === index1)
						}
					})
				})
				index2 = (data.players_info[1].draw_categories.find(c => c.name === key) || { index: -1 }).index 
				newPlayer2RangeData = player2RangeData.map((row, x) => {
					return row.map((v, y) => {
						return {
							...v,
							highlight: v.value === -1 ? false : INDEX_MAP[v.key].some(i => data.draw_categories_range[i] === index2)
						}
					})
				})
				player1MappedEQS = data.players_info[0].hand_eqs
					.map((q, index) => {
						return { value: q, index: data.draw_categories_range[index] }
					})
					.filter(d => d.value !== 0)
					.sort((a, b) => a.value - b.value)
				player2MappedEQS = data.players_info[1].hand_eqs
					.map((q, index) => {
						return { value: q, index: data.draw_categories_range[index] }
					})
					.filter(d => d.value !== 0)
					.sort((a, b) => a.value - b.value)
				break;
			}
			case 'eqs': {
				index1 = (data.players_info[0].equity_buckets.find(c => c.name === key) || { index: -1 }).index 
				newPlayer1RangeData = player1RangeData.map((row, x) => {
					return row.map((v, y) => {
						return {
							...v,
							highlight: v.value === -1 ? false : INDEX_MAP[v.key].some(i => data.players_info[0].equity_buckets_range[i] === index1)
						}
					})
				})
				index2 = (data.players_info[1].equity_buckets.find(c => c.name === key) || { index: -1 }).index 
				newPlayer2RangeData = player2RangeData.map((row, x) => {
					return row.map((v, y) => {
						return {
							...v,
							highlight: v.value === -1 ? false : INDEX_MAP[v.key].some(i => data.players_info[1].equity_buckets_range[i] === index2)
						}
					})
				})
				player1MappedEQS = data.players_info[0].hand_eqs
					.map((q, index) => {
						return { value: q, index: data.players_info[0].equity_buckets_range[index] }
					})
					.filter(d => d.value !== 0)
					.sort((a, b) => a.value - b.value)
				player2MappedEQS = data.players_info[1].hand_eqs
					.map((q, index) => {
						return { value: q, index: data.players_info[1].equity_buckets_range[index] }
					})
					.filter(d => d.value !== 0)
					.sort((a, b) => a.value - b.value)
				break;
			}
			case 'eqa': {
				index1 = (data.players_info[0].equity_buckets_advanced.find(c => c.name === key) || { index: -1 }).index 
				newPlayer1RangeData = player1RangeData.map((row, x) => {
					return row.map((v, y) => {
						return {
							...v,
							highlight: v.value === -1 ? false : INDEX_MAP[v.key].some(i => data.players_info[0].equity_buckets_advanced_range[i] === index1)
						}
					})
				})
				index2 = (data.players_info[1].equity_buckets_advanced.find(c => c.name === key) || { index: -1 }).index 
				newPlayer2RangeData = player2RangeData.map((row, x) => {
					return row.map((v, y) => {
						return {
							...v,
							highlight: v.value === -1 ? false : INDEX_MAP[v.key].some(i => data.players_info[1].equity_buckets_advanced_range[i] === index2)
						}
					})
				})
				player1MappedEQS = data.players_info[0].hand_eqs
					.map((q, index) => {
						return { value: q, index: data.players_info[0].equity_buckets_advanced_range[index] }
					})
					.filter(d => d.value !== 0)
					.sort((a, b) => a.value - b.value)
				player2MappedEQS = data.players_info[1].hand_eqs
					.map((q, index) => {
						return { value: q, index: data.players_info[1].equity_buckets_advanced_range[index] }
					})
					.filter(d => d.value !== 0)
					.sort((a, b) => a.value - b.value)
				break;
			}
			case 'none':
			default: {
				newPlayer1RangeData = player1RangeData.map((row, x) => {
					return row.map((v, y) => {
						return {
							...v,
							highlight: true
						}
					})
				})
				newPlayer2RangeData = player2RangeData.map((row, x) => {
					return row.map((v, y) => {
						return {
							...v,
							highlight: true
						}
					})
				})
			}
		}

		setPlayer1RangeData(newPlayer1RangeData)
		setPlayer2RangeData(newPlayer2RangeData)

    const width = 500;
    const height = 250;
    const margin = { top: 20, right: 20, bottom: 20, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    d3.select(filteredChartRef.current).selectAll('*').remove();
		
    const svg = d3
      .select(filteredChartRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

		let player1FilteredValue = player1MappedEQS.map(({ value, index }) => {
			return index === index1 ? value * 100 : 0
		})
		let player2FilteredValue = player2MappedEQS.map(({ value, index }) => {
			return index === index2 ? value * 100 : 0
		})

    const xScale1 = d3.scaleLinear().domain([0, player1FilteredValue.length - 1]).range([0, innerWidth]);
    const xScale2 = d3.scaleLinear().domain([0, player2FilteredValue.length - 1]).range([0, innerWidth]);
    const yScale1 = d3.scaleLinear().domain([0, 100]).range([innerHeight, 0]);
    const yScale2 = d3.scaleLinear().domain([0, 100]).range([innerHeight, 0]);

		svg
			.selectAll('circle.player1')
			.data(player1FilteredValue)
			.enter().append('circle')
			.attr('class', 'player1')
			.attr('cx', (d, i) => xScale1(i))
			.attr('cy', d => d > 0 ? yScale1(d) : -300)
			.attr('r', 5)
			.attr('fill', 'rgb(151, 234, 248)')
      .attr('transform', `translate(${margin.left},${margin.top})`);

		svg
			.selectAll('circle.player2')
			.data(player2FilteredValue)
			.enter().append('circle')
			.attr('class', 'player2')
			.attr('cx', (d, i) => xScale2(i))
			.attr('cy', d => d > 0 ? yScale2(d) : -300)
			.attr('r', 5)
			.attr('fill', 'rgb(37, 179, 54)')
      .attr('transform', `translate(${margin.left},${margin.top})`);

	}, [JSON.stringify(filterState)])


  useEffect(() => {
		if (!chartRef.current) return;
		if (data) {
			setPlayer1RangeData(RANGE.map(row => {
				return row.map(v => ({ key: v, value : player1HandData[v].total_frequency > 0 ? 0 : -1, combo: player1HandData[v].total_combos, highlight: true }))
			}))
			setPlayer2RangeData(RANGE.map(row => {
				return row.map(v => ({ key: v, value : player2HandData[v].total_frequency > 0 ? 0 : -1, combo: player2HandData[v].total_combos, highlight: true }))
			}))
		}


		let player1Data = data.players_info[0].hand_eqs
			.filter(d => d !== 0)
			.map(d => d * 100).sort()
		let player2Data = data.players_info[1].hand_eqs
			.filter(d => d !== 0)
			.map(d => d * 100).sort()

    const width = 500;
    const height = 250;
    const margin = { top: 20, right: 20, bottom: 20, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    d3.select(chartRef.current).selectAll('*').remove();

    const svg = d3
      .select(chartRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const xScale1 = d3.scaleLinear().domain([0, player1Data.length - 1]).range([0, innerWidth]);
    const xScale2 = d3.scaleLinear().domain([0, player2Data.length - 1]).range([0, innerWidth]);
    const yScale1 = d3.scaleLinear().domain([0, 100]).range([innerHeight, 0]);
    const line1 = d3.line().x((d, i) => xScale1(i)).y((d) => yScale1(d));

    svg
      .append('path')
      .datum(player1Data)
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .attr('fill', 'none')
      .attr('stroke', 'blue')
      .attr('stroke', 'rgb(151, 234, 248)')
      .attr('stroke-width', 2)
      .attr('d', line1);

    const yScale2 = d3.scaleLinear().domain([0, 100]).range([innerHeight, 0]);
    const line2 = d3.line().x((d, i) => xScale2(i)).y((d) => yScale2(d));

    svg
      .append('path')
      .datum(player2Data)
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .attr('fill', 'none')
      .attr('stroke', 'red')
      .attr('stroke', 'rgb(37, 179, 54)')
      .attr('stroke-width', 2)
      .attr('d', line2);

    const xAxis = d3.axisBottom(d3.scaleLinear().domain([0, 100]).range([0, innerWidth])).tickValues([25,50,75,100]).tickSizeInner(-innerHeight).tickSizeOuter(0).tickPadding(-3)
		const yAxis = d3.axisLeft(yScale1).tickValues([0,25,50,75,100])
		yAxis.tickSize(-5)
		xAxis.tickSize(-5)

    svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .call(yAxis)
			.selectAll('text')
			.style('fill', 'white')
			.selectAll('.tick line')
			.style('stroke', 'white');
  
    svg
      .append('g')
      .attr('transform', `translate(${margin.left},${innerHeight + margin.top})`)
      .call(xAxis)
			.selectAll('text')
			.style('fill', 'white')
			.selectAll('.tick line')
			.style('stroke', 'white');

  }, [JSON.stringify(data), pageState]);

	useEffect(() => {
		const fn = async () => {
			try {
				const path = `${process.env.PUBLIC_URL}/solutions/${setting}/${preflop}/${flopAction}/${board}.json`;
				const response = await fetch(path);
				const data = await response.json()
				setData(data)
			} catch (e) {
				console.log(e)
			}
		}
		fn();
	}, [setting, preflop, flopAction, board])

	const playerRangeData = currentPlayer === 1 ? player1RangeData : player2RangeData
	const currentHand = data && data.players_info[1].simple_hand_counters[selectedKey]
	const DetailComp = detailState === 'hands'
		? () => <Hand data={data} indexList={INDEX_MAP[currentHand.name]} hand={selectedKey}></Hand>
		: () => <Filter data={data} onSelectFilter={({ type, key }) => setFilterState({ type, key })} hand={selectedKey}></Filter>

	const settingOptions = Object.keys(DATA)
		.map(k => ({ value: k, label: k }))

	const preflopOptions = Object.keys(DATA[setting] || settingOptions[0])
		.map(k => ({ value: k, label: PREFLOP_MAP[k] }))

	const flopActionOptions = Object.keys(DATA[setting][preflop] || preflopOptions[0])
		.map(k => ({ value: k, label: k }))

	const boardOptions = Object.keys(DATA[setting][preflop][flopAction] || flopActionOptions[0])
		.map(k => ({ value: k, label: k }))

	if (!data) {
		return <div>Loading</div>
	}

	return (
		<Page>
			<Wrapper>
				<SolutionPageControlWrapper>
					<Select
						defaultValue={settingOptions[0]}
						options={settingOptions}
						onChange={(e) => {
							setSetting(e.value)
						}}
					/>
					<Select
						defaultValue={preflopOptions[0]}
						options={preflopOptions}
						onChange={(e) => {
							setPreflop(e.value)
						}}
					/>
					<Select
						defaultValue={flopActionOptions[0]}
						options={flopActionOptions}
						onChange={(e) => {
							setFlopAction(e.value)
						}}
					/>
					<Select
						defaultValue={boardOptions[0]}
						options={boardOptions}
						onChange={(e) => {
							setBoard(e.value)
						}}
						value={boardOptions.find(o => o.value === board)}
					/>
					<button onClick={() => setPageState('strategy')}>Strategy</button>
					<button onClick={() => setPageState('range')}>Range</button>
					<button
						onClick={() => {
							const list = Object.keys(DATA[setting][preflop][flopAction])
							const min = 0;
							const max = list.length - 1
							const index = Math.floor(Math.random() * (max - min + 1)) + min
							const newFlop = list[index]
							setBoard(newFlop)
						}}
					>Random</button>
				</SolutionPageControlWrapper>
				{
					pageState === 'strategy'
						? <SolutionStrategyPage
								data={data}
								player1RangeData={player1RangeData}
								player2RangeData={player2RangeData}
								playerRangeData={playerRangeData}
								currentPlayer={currentPlayer}
								onHandEnter={onHandEnter}
								setDetailState={setDetailState}
								DetailComp={DetailComp}
								setFilterState={setFilterState}
								chartRef={chartRef}
								filteredChartRef={filteredChartRef}
								selectedKey={selectedKey}
							/>
						: <SolutionRangePage
								data={data}
								player1RangeData={player1RangeData}
								player2RangeData={player2RangeData}
								playerRangeData={playerRangeData}
								currentPlayer={currentPlayer}
								onHandEnter={onHandEnter}
								setDetailState={setDetailState}
								DetailComp={DetailComp}
								setFilterState={setFilterState}
								chartRef={chartRef}
								filteredChartRef={filteredChartRef}
								selectedKey={selectedKey}
							/>
				}
			</Wrapper>
		</Page>
	)
}

export default RangePage;