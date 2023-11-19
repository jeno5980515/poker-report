import * as d3 from "d3";
import { Routes, Route, Outlet, Link } from "react-router-dom";
import { useEffect, useRef, useState } from 'react';
import { Canvg } from 'canvg';
import styled from 'styled-components';
import Select, { components } from "react-select";
import Action from './Action';
import Hand from './Hand';
import Filter from './Filter';

import INDEX_MAP from '../../indexMap.json';
// import DATA from './solutions/NL50GG'
import DATA from './solutions/NL500'
// import DATA from './solutions/A42.json'

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

const RangePage = () => {
	const [mouseMode, setMouseMode] = useState('none')
	const [currentCombos, setCurrentCombos] = useState(0)
	const [setting, setSetting] = useState('NL500');
	const [preflop, setPreflop] = useState('F-F-F-R2.5-F-C');
	const [action, setAction] = useState('X');
	const [board, setBoard] = useState('2h2d2c');
	const [data, setData] = useState(DATA[preflop][action][board])
	const [selectedKey, setSelectedKey] = useState('AA')
	const [pageState, setPageState] = useState('range')
	const [detailState, setDetailState] = useState('hands')
	const [filterState, setFilterState] = useState({ type: 'none' })
  const [chartData, setChartDate] = useState([10, 25, 18, 32, 12, 7]);
	const [currentPlayer, setCurrentPlayer] = useState(2)
  const chartRef = useRef();

	const player1HandData = data.players_info[0].simple_hand_counters;
	const player2HandData = data.players_info[1].simple_hand_counters;
	const [player1RangeData, setPlayer1RangeData] = useState(RANGE.map(row => {
		return row.map(v => ({ key: v, value : player1HandData[v].total_frequency > 0 ? 0 : -1, combo: player1HandData[v].total_combos, highlight: true }))
	}))
	const [player2RangeData, setPlayer2RangeData] = useState(RANGE.map(row => {
		return row.map(v => ({ key: v, value : player2HandData[v].total_frequency > 0 ? 0 : -1, combo: player2HandData[v].total_combos, highlight: true }))
	}))


	const answerCheckFreq = data.solutions[0].total_frequency;

	const totalCombos = Object.values(data.players_info[1].simple_hand_counters)
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

	// useEffect(() => {
	// 	const newCombo = data.reduce((cal, row) => {
	// 		return cal + row.reduce((c, v) => {
	// 			const r = v.value === -1 ? 0 : v.value /100 * v.combo
	// 			return c + r
	// 		}, 0)
	// 	}, 0)
	// 	setCurrentCombos(newCombo);
	// }, [JSON.stringify(data)])

	const onHandUp = () => {
		setMouseMode('none')
	}

	useEffect(() => {
		let newPlayer1RangeData;
		let newPlayer2RangeData;
		const { key, type } = filterState;
		switch (type) {
			case 'hands': {
				const index1 = (data.players_info[0].hand_categories.find(c => c.name === key) || { index: -1 }).index 
				newPlayer1RangeData = player1RangeData.map((row, x) => {
					return row.map((v, y) => {
						return {
							...v,
							highlight: v.value === -1 ? false : INDEX_MAP[v.key].some(i => data.hand_categories_range[i] === index1)
						}
					})
				})
				const index2 = (data.players_info[1].hand_categories.find(c => c.name === key) || { index: -1 }).index 
				newPlayer2RangeData = player2RangeData.map((row, x) => {
					return row.map((v, y) => {
						return {
							...v,
							highlight: v.value === -1 ? false : INDEX_MAP[v.key].some(i => data.hand_categories_range[i] === index2)
						}
					})
				})
				break;
			}
			case 'draw': {
				const index1 = (data.players_info[0].draw_categories.find(c => c.name === key) || { index: -1 }).index 
				newPlayer1RangeData = player1RangeData.map((row, x) => {
					return row.map((v, y) => {
						return {
							...v,
							highlight: v.value === -1 ? false : INDEX_MAP[v.key].some(i => data.draw_categories_range[i] === index1)
						}
					})
				})
				const index2 = (data.players_info[1].draw_categories.find(c => c.name === key) || { index: -1 }).index 
				newPlayer2RangeData = player2RangeData.map((row, x) => {
					return row.map((v, y) => {
						return {
							...v,
							highlight: v.value === -1 ? false : INDEX_MAP[v.key].some(i => data.draw_categories_range[i] === index2)
						}
					})
				})
				break;
			}
			case 'eqs': {
				const index1 = (data.players_info[0].equity_buckets.find(c => c.name === key) || { index: -1 }).index 
				newPlayer1RangeData = player1RangeData.map((row, x) => {
					return row.map((v, y) => {
						return {
							...v,
							highlight: v.value === -1 ? false : INDEX_MAP[v.key].some(i => data.players_info[0].equity_buckets_range[i] === index1)
						}
					})
				})
				const index2 = (data.players_info[1].equity_buckets.find(c => c.name === key) || { index: -1 }).index 
				newPlayer2RangeData = player2RangeData.map((row, x) => {
					return row.map((v, y) => {
						return {
							...v,
							highlight: v.value === -1 ? false : INDEX_MAP[v.key].some(i => data.players_info[1].equity_buckets_range[i] === index2)
						}
					})
				})
				break;
			}
			case 'eqa': {
				const index1 = (data.players_info[0].equity_buckets_advanced.find(c => c.name === key) || { index: -1 }).index 
				newPlayer1RangeData = player1RangeData.map((row, x) => {
					return row.map((v, y) => {
						return {
							...v,
							highlight: v.value === -1 ? false : INDEX_MAP[v.key].some(i => data.players_info[0].equity_buckets_advanced_range[i] === index1)
						}
					})
				})
				const index2 = (data.players_info[1].equity_buckets_advanced.find(c => c.name === key) || { index: -1 }).index 
				newPlayer2RangeData = player2RangeData.map((row, x) => {
					return row.map((v, y) => {
						return {
							...v,
							highlight: v.value === -1 ? false : INDEX_MAP[v.key].some(i => data.players_info[1].equity_buckets_advanced_range[i] === index2)
						}
					})
				})
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
	}, [JSON.stringify(filterState)])


  useEffect(() => {
		if (!chartRef.current) {
			return
		}

		let player1Data = data.players_info[0].hand_eqs
			.filter(d => d !== 0)
			.map(d => d * 100).sort()
		let player2Data = data.players_info[1].hand_eqs
			.filter(d => d !== 0)
			.map(d => d * 100).sort()

		const gap = player2Data.length - player1Data.length;
		// player1Data = Array(gap).fill(0).concat(player1Data)
		player2Data = [...player2Data.slice(gap)]
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

    const xScale = d3.scaleLinear().domain([0, Math.max(player1Data.length, player2Data.length) - 1]).range([0, innerWidth]);
    const yScale1 = d3.scaleLinear().domain([0, d3.max(player1Data)]).range([innerHeight, 0]);
    const line1 = d3.line().x((d, i) => xScale(i)).y((d) => yScale1(d));

    svg
      .append('path')
      .datum(player1Data)
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .attr('fill', 'none')
      .attr('stroke', 'blue')
      .attr('stroke', 'rgb(151, 234, 248)')
      .attr('stroke-width', 2)
      .attr('d', line1);

    const yScale2 = d3.scaleLinear().domain([0, d3.max(player2Data)]).range([innerHeight, 0]);
    const line2 = d3.line().x((d, i) => xScale(i)).y((d) => yScale2(d));

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

  }, [JSON.stringify(data), chartRef.current]);

	const playerRangeData = currentPlayer === 1 ? player1RangeData : player2RangeData
	const currentHand = data.players_info[1].simple_hand_counters[selectedKey]
	const DetailComp = detailState === 'hands'
		? () => <Hand data={data} indexList={INDEX_MAP[currentHand.name]} hand={selectedKey}></Hand>
		: () => <Filter data={data} onSelectFilter={({ type, key }) => setFilterState({ type, key })} hand={selectedKey}></Filter>
	
	const SolutionPage = pageState === 'strategy'
		? () => <SolutionPageWrapper>
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
		: () => <SolutionPageWrapper>
				<RangeLeft>
					<BoardWrapper>
						<Board>
							{
								player1RangeData.map((row, x) => {
									return row.map((v, y) => {
										return <HandDiv
											onMouseEnter={() => onHandEnter({ key: v.key })}
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
											onMouseEnter={() => onHandEnter({ key: v.key })}
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
					<Chart ref={chartRef}></Chart>
				</RangeLeft>
				<RangeDetail>
					<Filter data={data} onSelectFilter={({ type, key }) => setFilterState({ type, key })} hand={selectedKey}></Filter>
				</RangeDetail>
			</SolutionPageWrapper>

	return (
		<Page>
			<Wrapper>
				<SolutionPageControlWrapper>
					<button onClick={() => setPageState('strategy')}>Strategy</button>
					<button onClick={() => setPageState('range')}>Range</button>
				</SolutionPageControlWrapper>
				<SolutionPage />
			</Wrapper>
		</Page>
	)
}

export default RangePage;