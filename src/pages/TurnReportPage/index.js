import { useLocation } from 'react-router-dom';
import { Routes, Route, Outlet, Link } from "react-router-dom";
import { useEffect, useRef, useState } from 'react';
import { Canvg } from 'canvg';
import styled from 'styled-components';
import Select, { components } from "react-select";
import Action from './Action';
import Solutions from './Solutions';

import { ReactComponent as HeartSVG } from '../../assets/heart.svg';
import { ReactComponent as DiamondSVG } from '../../assets/diamond.svg';
import { ReactComponent as ClubSVG } from '../../assets/club.svg';
import { ReactComponent as SpadeSVG } from '../../assets/spade.svg';
import { ReactComponent as ArrowSVG } from '../../assets/arrow.svg';

import INDEX_MAP from '../../indexMap.json';
import DATA from './turn_reports'

const PREFLOP_MAP = {
	'F-F-F-R2.5-F-C': 'BTN VS BB',
	'R2.5-F-F-F-F-C': 'LJ VS BB',
	'F-F-F-F-R3-C': 'SB VS BB',
	'F-F-F-R2.5-R10-F-C': 'SB 3B BTN',
}

const FLOP_MAP = {
	'X-R1.8-C': 'Small',
	'X-X': 'Check',
	'R6.95-C': 'Small',
}

// import DATA from './solutions/A42.json'

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
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
	justify-content: center;
	border: black 1px solid;
	font-size: 0.7em;
	user-select: none;
`

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

const ColorBlock = styled.div`
	width: ${({ width }) => width}%;
	background: ${({ color }) => color};
	height: 100%;
`

const TextBlock = styled.div`
	position: absolute;
`

const Page = styled.div`
	display: flex;
	flex-direction: column;
`

const Detail = styled.div`
	width: 450px;
	display: flex;
	flex-direction: column;
	height: 550px;
	justify-content: space-between;
`


const ControlWrapper = styled.div`
	@media (max-width: 767px) {
		display: flex;
		flex-wrap: wrap;
		> div:nth-child(-n+4) {
			flex: 1 0 48%;
		}
		> div:nth-child(n+5) {
			flex-basis: 100%;
		}
		> *:nth-child(n+5) {
			margin-top: 10px;
			margin-bottom: 10px;
		}
	}
	@media (min-width: 769px) {
		display: flex;
		margin-top: 70px;
	}
`


const SuitCharacter = styled.div`
	color: ${({ color }) => color};
`

const SuitText = styled.div`
	border: 1px solid;
	background: white;
	display: flex;
	padding: 7px;
	> * {
		width: 13px;
		font-size: 15px;
		padding: 2px;
	}
	:hover: {
		background: blue;
	}
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
	'R3': "rgb(240, 60, 60)",
	'R2.75': "rgb(202, 50, 50)",
	'R4.1': "rgb(163, 41, 41)",
	'R6': "rgb(163, 41, 41)",
	'R11.5': "rgb(240, 60, 60)",
	'R23.05': "rgb(163, 41, 41)",
	"R6.9": "rgb(125, 31, 31)",
	"R11.85": "rgb(125, 31, 31)",
	"R45.35": "rgb(125, 31, 31)",
	"RAI": "rgb(106, 26, 26)",
	"X": "rgb(90, 185, 102)"
}


const RANGE = [
	['AA', 'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s'],
	['AKo', 'KK', 'KQs', 'KJs', 'KTs', 'K9s', 'A8s', 'A7s', 'K6s', 'K5s', 'K4s', 'K3s', 'K2s'],
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

const SuitTextForInput = styled.div`
	background: white;
	display: flex;
	> * {
		width: 13px;
		font-size: 15px;
		padding: 2px;
	}
	:hover: {
		background: blue;
	}
`


const SingleValue = ({
	children,
  ...props
}) => {
	const label = children
  return (
		<components.SingleValue {...props}>
			<SuitTextForInput>
				<SuitCharacter color={getColor(label[1])}>{label[0]}</SuitCharacter>
				<SuitCharacter color={getColor(label[1])}>{getSVG(label[1])}</SuitCharacter>
				<SuitCharacter color={getColor(label[3])}>{label[2]}</SuitCharacter>
				<SuitCharacter color={getColor(label[3])}>{getSVG(label[3])}</SuitCharacter>
				<SuitCharacter color={getColor(label[5])}>{label[4]}</SuitCharacter>
				<SuitCharacter color={getColor(label[5])}>{getSVG(label[5])}</SuitCharacter>
			</SuitTextForInput>
		</components.SingleValue>
  );
};


const BoardOption = ({ innerProps, label }) => {
  return <SuitText {...innerProps}>
		<SuitCharacter color={getColor(label[1])}>{label[0]}</SuitCharacter>
		<SuitCharacter color={getColor(label[1])}>{getSVG(label[1])}</SuitCharacter>
		<SuitCharacter color={getColor(label[3])}>{label[2]}</SuitCharacter>
		<SuitCharacter color={getColor(label[3])}>{getSVG(label[3])}</SuitCharacter>
		<SuitCharacter color={getColor(label[5])}>{label[4]}</SuitCharacter>
		<SuitCharacter color={getColor(label[5])}>{getSVG(label[5])}</SuitCharacter>
  </SuitText>
}


const TurnReportPage = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
	const [mouseMode, setMouseMode] = useState('none')
	const [currentCombos, setCurrentCombos] = useState(0)
	const [setting, setSetting] = useState(queryParams.get('setting') || 'NL500');
	const [preflop, setPreflop] = useState(queryParams.get('preflop') || 'F-F-F-R2.5-F-C');
	const [flopAction, setFlopAction] = useState(queryParams.get('flopAction') || 'X-R1.8-C');
	const [turnAction, setTurnAction] = useState('X');
	const [board, setBoard] = useState(queryParams.get('board') || '2h2d2c');
	const [data, setData] = useState(null)
	const [selectedKey, setSelectedKey] = useState('2s')

	useEffect(() => {
		if (DATA[setting][preflop] && !DATA[setting][preflop][flopAction]) {
			const flop = Object.keys(DATA[setting][preflop])[0]
			setFlopAction(flop)
			setTurnAction(Object.keys(DATA[setting][preflop][flop])[0])
		}
	}, [])

	useEffect(() => {
		let finalFlopAction = flopAction
		let finalTurnAction = turnAction
		if (DATA[setting][preflop] && !DATA[setting][preflop][flopAction]) {
			finalFlopAction = Object.keys(DATA[setting][preflop])[0]
			finalTurnAction = Object.keys(DATA[setting][preflop][finalFlopAction])[0]
			setFlopAction(finalFlopAction)
			setTurnAction(finalTurnAction)
		}
		if (DATA[setting][preflop][flopAction] && DATA[setting][preflop][flopAction][turnAction]) {
			finalTurnAction = Object.keys(DATA[setting][preflop][finalFlopAction])[0]
			setTurnAction(finalTurnAction)
		}
		const fn = async () => {
			try {
				const path = `${process.env.PUBLIC_URL}/turn_reports/${setting}/${preflop}/${finalFlopAction}/${finalTurnAction}/${board}.json`;
				console.log(path)
				const response = await fetch(path);
				const data = await response.json()
				setData(data)
			} catch (e) {
				console.log(e)
			}
		}
		fn();
	}, [setting, preflop, flopAction, turnAction, board])

	if (!data) {
		return <div>Loading</div>
	}

	const settingOptions = Object.keys(DATA)
		.map(k => ({ value: k, label: k }))

	const preflopOptions = Object.keys(DATA[setting] || settingOptions[0])
		.map(k => ({ value: k, label: PREFLOP_MAP[k] }))

	const flopActionOptions = Object.keys(DATA[setting][preflop] || preflopOptions[0])
		.map(k => ({ value: k, label: FLOP_MAP[k] || k }))

	const turnActionOptions = Object.keys(DATA[setting][preflop][flopAction] || flopActionOptions[0])
		.map(k => ({ value: k, label: k }))

	const boardOptions = Object.keys(DATA[setting][preflop][flopAction][turnAction] || turnActionOptions[0])
		.map(k => ({ value: k, label: k }))

	return (
		<Page>
			<Wrapper>
				<ControlWrapper>
					<Select
						defaultValue={settingOptions[0]}
						options={settingOptions}
						onChange={(e) => {
							setSetting(e.value)
						}}
						isClearable={false}
						isSearchable={false}
						value={settingOptions.find(o => o.value === setting)}
					/>
					<Select
						defaultValue={preflopOptions[0]}
						options={preflopOptions}
						onChange={(e) => {
							setPreflop(e.value)
							if (DATA[setting][e.value] && !DATA[setting][e.value][flopAction]) {
								const flop = Object.keys(DATA[setting][e.value])[0]
								setFlopAction(flop)
								setTurnAction(Object.keys(DATA[setting][e.value][flop])[0])
							}
						}}
						isClearable={false}
						isSearchable={false}
						value={preflopOptions.find(o => o.value === preflop)}
					/>
					<Select
						defaultValue={flopActionOptions[0]}
						options={flopActionOptions}
						onChange={(e) => {
							setFlopAction(e.value)
						}}
						isClearable={false}
						isSearchable={false}
						value={flopActionOptions.find(o => o.value === flopAction)}
					/>
					<Select
						defaultValue={turnActionOptions[0]}
						options={turnActionOptions}
						onChange={(e) => {
							setTurnAction(e.value)
						}}
						isClearable={false}
						isSearchable={false}
						value={turnActionOptions.find(o => o.value === turnAction)}
					/>
					<Select
						defaultValue={boardOptions[0]}
						components={{ Option: BoardOption, SingleValue }}
						options={boardOptions}
						onChange={(e) => {
							setBoard(e.value)
						}}
						isClearable={false}
						isSearchable={false}
						value={boardOptions.find(o => o.value === board)}
					/>
					<button
						onClick={() => {
							const list = Object.keys(DATA[setting][preflop][flopAction][turnAction])
							const min = 0;
							const max = list.length - 1
							const index = Math.floor(Math.random() * (max - min + 1)) + min
							const newFlop = list[index]
							setBoard(newFlop)
						}}
					>Random</button>
				</ControlWrapper>
				<Action data={data.totals}></Action>
				<Solutions data={data.solutions}></Solutions>
			</Wrapper>
		</Page>
	)
}

export default TurnReportPage;