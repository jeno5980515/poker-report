import * as d3 from "d3";
import { Routes, Route, Outlet, Link } from "react-router-dom";
import { useEffect, useRef, useState } from 'react';
import { Canvg } from 'canvg';
import styled from 'styled-components';
import Select, { components } from "react-select";

import DATA from './ranges/A42.json'

const BoardWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
`

const Board = styled.div`
	display: flex;
  flex-wrap: wrap;
	width: 100%;
	padding: 5%;
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

const ColorBlock = styled.div`
	width: ${({ width }) => width}%;
	background: ${({ color }) => color};
	height: 100%;
`

const TextBlock = styled.div`
	position: absolute;
`


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

const HandDiv = ({
	value,
	hand,
	onMouseEnter,
	onMouseDown,
	onMouseUp,
	indexX,
	indexY
}) => {
	return <HandDivWrapper
		onMouseEnter={onMouseEnter}
		onMouseDown={onMouseDown}
		onMouseUp={onMouseUp}
		data-x={indexX}
		data-y={indexY}
	>
		{
			value === -1 ? null : (
				<>
					<ColorBlock color={'rgb(240, 60, 60)'} width={value}></ColorBlock>
					<ColorBlock color={'rgb(90, 185, 102)'} width={100-value}></ColorBlock>
				</>
			)
		}
		<TextBlock>{hand}</TextBlock>
	</HandDivWrapper>
}

const RangePage = () => {
	const handData = DATA.players_info[1].simple_hand_counters;
	const rangeData = RANGE.map(row => {
		return row.map(v => ({ key: v, value : handData[v].total_frequency > 0 ? 0 : -1 }))
	})
	const [data, setData] = useState(rangeData)
	const [mouseMode, setMouseMode] = useState('none')

	const onHandEnter = ({ x, y }) => {
		if (data[x][y].value !== -1 && mouseMode !== 'none') {
			const newData = [...data];
			const newRow = [...newData[x]]
			const newHand = {
				...newRow[y],
				value: mouseMode === 'bet' ? ACTIVE_VALUE : 0
			}
			newRow[y] = newHand;
			newData[x] = newRow;
			setData(newData)
		}
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

	return (
		<BoardWrapper>
			<Board>
				{
					data.map((row, x) => {
						return row.map((v, y) => {
							return <HandDiv
								onMouseEnter={() => onHandEnter({ x, y })}
								onMouseDown={() => onHandDown({ x, y })}
								onMouseUp={onHandUp}
								value={v.value}
								hand={v.key} />
						})
					})
				}
			</Board>
		</BoardWrapper>
	)
}

export default RangePage;