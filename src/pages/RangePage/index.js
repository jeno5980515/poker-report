import * as d3 from "d3";
import { Routes, Route, Outlet, Link } from "react-router-dom";
import { useEffect, useRef, useState } from 'react';
import { Canvg } from 'canvg';
import styled from 'styled-components';
import Select, { components } from "react-select";
import Frequency from './Frequency';

import DATA from './ranges/A42.json'
import { set } from "../../reducers/setting/settingSlice";

const BoardWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
`

const Board = styled.div`
	display: flex;
  flex-wrap: wrap;
	width: 100%;
	max-width: 600px;
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

const Page = styled.div`
	display: flex;
	flex-direction: column;
`


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

const ACTIVE_VALUE = 100;

const FrequencyWrapper = styled.div`
	display: flex;
`

const HandDiv = ({
	value,
	hand,
	onMouseEnter,
	onMouseDown,
	onMouseUp,
	indexX,
	indexY,
	type
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
					<ColorBlock color={type === 'bet' ? 'rgb(240, 60, 60)' : 'rgb(106, 26, 26)'} width={value}></ColorBlock>
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
		return row.map(v => ({ key: v, value : handData[v].total_frequency > 0 ? 0 : -1, combo: handData[v].total_combos }))
	})
	const [data, setData] = useState(rangeData)
	const [mouseDown, setMouseDown] = useState(false)
	const [type, setType] = useState('bet');
	const [currentCombos, setCurrentCombos] = useState(0)

	const answerCheckFreq = DATA.solutions[0].total_frequency;

	const totalCombos = Object.values(DATA.players_info[1].simple_hand_counters)
		.reduce((cal, val) => {
			return cal + val.total_combos
		}, 0)

	const onHandEnter = ({ x, y }) => {
		if (mouseDown) {
			const newData = [...data];
			const newRow = [...newData[x]]
			let newValue = 0
			if (type === 'none') {
				newValue = -1
			} else if (type === 'check') {
				newValue = 0;
			} else {
				newValue = ACTIVE_VALUE;
			}
			const newHand = {
				...newRow[y],
				value: newValue,
				type
			}
			newRow[y] = newHand;
			newData[x] = newRow;
			setData(newData)
		}
	}

	const onHandDown = ({ x, y }) => {
		setMouseDown(true)
		let newValue = 0;
		if (type === 'none') {
			newValue = -1
		} else if (type === 'check') {
			newValue = 0;
		} else {
			newValue = ACTIVE_VALUE;
		}
		const newData = [...data];
		const newRow = [...newData[x]]
		const newHand = {
			...newRow[y],
			value: newValue,
			type
		}
		newRow[y] = newHand;
		newData[x] = newRow;
		setData(newData)
	}

	useEffect(() => {
		const newCombo = data.reduce((cal, row) => {
			return cal + row.reduce((c, v) => {
				const r = v.value === -1 ? 0 : v.value /100 * v.combo
				return c + r
			}, 0)
		}, 0)
		setCurrentCombos(newCombo);
	}, [JSON.stringify(data)])

	const onHandUp = () => {
		setMouseDown(false)
	}

	useEffect(() => {
		setData([[{"key":"AA","value":100,"combo":3,"type":"bet"},{"key":"AKs","value":100,"combo":3,"type":"bet"},{"key":"AQs","value":100,"combo":3,"type":"bet"},{"key":"AJs","value":100,"combo":3,"type":"bet"},{"key":"ATs","value":100,"combo":3,"type":"bet"},{"key":"A9s","value":100,"combo":3,"type":"bet"},{"key":"A8s","value":100,"combo":3,"type":"bet"},{"key":"A7s","value":100,"combo":3,"type":"bet"},{"key":"A6s","value":0,"combo":3,"type":"check"},{"key":"A5s","value":100,"combo":3,"type":"bet"},{"key":"A4s","value":100,"combo":2,"type":"bet"},{"key":"A3s","value":100,"combo":3,"type":"bet"},{"key":"A2s","value":100,"combo":2,"type":"allin"}],[{"key":"AKo","value":100,"combo":9,"type":"allin"},{"key":"KK","value":100,"combo":6,"type":"bet"},{"key":"KQs","value":100,"combo":4,"type":"bet"},{"key":"KJs","value":100,"combo":4,"type":"bet"},{"key":"KTs","value":100,"combo":4,"type":"bet"},{"key":"K9s","value":100,"combo":4,"type":"bet"},{"key":"K8s","value":100,"combo":4,"type":"bet"},{"key":"K7s","value":100,"combo":4,"type":"bet"},{"key":"K6s","value":0,"combo":4,"type":"check"},{"key":"K5s","value":0,"combo":4,"type":"check"},{"key":"K4s","value":100,"combo":3,"type":"bet"},{"key":"K3s","value":100,"combo":4,"type":"bet"},{"key":"K2s","value":100,"combo":3,"type":"allin"}],[{"key":"AQo","value":100,"combo":9,"type":"bet"},{"key":"KQo","value":100,"combo":12,"type":"bet"},{"key":"QQ","value":100,"combo":6,"type":"bet"},{"key":"QJs","value":0,"combo":4,"type":"check"},{"key":"QTs","value":0,"combo":4,"type":"check"},{"key":"Q9s","value":100,"combo":4,"type":"bet"},{"key":"Q8s","value":100,"combo":4,"type":"bet"},{"key":"Q7s","value":0,"combo":4,"type":"check"},{"key":"Q6s","value":0,"combo":4,"type":"check"},{"key":"Q5s","value":0,"combo":4,"type":"check"},{"key":"Q4s","value":0,"combo":3,"type":"check"},{"key":"Q3s","value":0,"combo":4,"type":"check"},{"key":"Q2s","value":0,"combo":3,"type":"check"}],[{"key":"AJo","value":100,"combo":9,"type":"bet"},{"key":"KJo","value":100,"combo":12,"type":"bet"},{"key":"QJo","value":100,"combo":12,"type":"bet"},{"key":"JJ","value":100,"combo":6,"type":"bet"},{"key":"JTs","value":0,"combo":4,"type":"check"},{"key":"J9s","value":0,"combo":4,"type":"check"},{"key":"J8s","value":0,"combo":4,"type":"check"},{"key":"J7s","value":0,"combo":4,"type":"check"},{"key":"J6s","value":0,"combo":4,"type":"check"},{"key":"J5s","value":0,"combo":4,"type":"check"},{"key":"J4s","value":0,"combo":3,"type":"check"},{"key":"J3s","value":0,"combo":0,"type":"check"},{"key":"J2s","value":100,"combo":0,"type":"allin"}],[{"key":"ATo","value":100,"combo":9,"type":"bet"},{"key":"KTo","value":100,"combo":12,"type":"bet"},{"key":"QTo","value":100,"combo":12,"type":"bet"},{"key":"JTo","value":100,"combo":12,"type":"bet"},{"key":"TT","value":100,"combo":6,"type":"bet"},{"key":"T9s","value":100,"combo":4,"type":"bet"},{"key":"T8s","value":100,"combo":4,"type":"bet"},{"key":"T7s","value":0,"combo":4,"type":"check"},{"key":"T6s","value":0,"combo":4,"type":"check"},{"key":"T5s","value":0,"combo":2.84,"type":"check"},{"key":"T4s","value":0,"combo":0,"type":"check"},{"key":"T3s","value":0,"combo":0,"type":"check"},{"key":"T2s","value":0,"combo":0,"type":"check"}],[{"key":"A9o","value":100,"combo":9,"type":"allin"},{"key":"K9o","value":100,"combo":12,"type":"allin"},{"key":"Q9o","value":100,"combo":12,"type":"bet"},{"key":"J9o","value":100,"combo":12,"type":"bet"},{"key":"T9o","value":100,"combo":12,"type":"bet"},{"key":"99","value":100,"combo":6,"type":"bet"},{"key":"98s","value":100,"combo":4,"type":"bet"},{"key":"97s","value":100,"combo":4,"type":"bet"},{"key":"96s","value":0,"combo":4,"type":"check"},{"key":"95s","value":0,"combo":0,"type":"check"},{"key":"94s","value":0,"combo":0,"type":"check"},{"key":"93s","value":0,"combo":0,"type":"check"},{"key":"92s","value":0,"combo":0,"type":"check"}],[{"key":"A8o","value":100,"combo":9,"type":"allin"},{"key":"K8o","value":100,"combo":8.82,"type":"allin"},{"key":"Q8o","value":100,"combo":0,"type":"bet"},{"key":"J8o","value":100,"combo":4.44,"type":"bet"},{"key":"T8o","value":100,"combo":9.239999999999998,"type":"bet"},{"key":"98o","value":0,"combo":4.380000000000001,"type":"check"},{"key":"88","value":100,"combo":6,"type":"bet"},{"key":"87s","value":100,"combo":4,"type":"bet"},{"key":"86s","value":0,"combo":4,"type":"check"},{"key":"85s","value":0,"combo":0,"type":"check"},{"key":"84s","value":0,"combo":0,"type":"check"},{"key":"83s","value":0,"combo":0,"type":"check"},{"key":"82s","value":0,"combo":0,"type":"check"}],[{"key":"A7o","value":100,"combo":9,"type":"bet"},{"key":"K7o","value":100,"combo":5.04,"type":"allin"},{"key":"Q7o","value":100,"combo":0,"type":"bet"},{"key":"J7o","value":0,"combo":0,"type":"check"},{"key":"T7o","value":100,"combo":0,"type":"bet"},{"key":"97o","value":0,"combo":0,"type":"check"},{"key":"87o","value":0,"combo":0,"type":"check"},{"key":"77","value":100,"combo":6,"type":"bet"},{"key":"76s","value":0,"combo":4,"type":"check"},{"key":"75s","value":0,"combo":4,"type":"check"},{"key":"74s","value":0,"combo":0,"type":"check"},{"key":"73s","value":0,"combo":0,"type":"check"},{"key":"72s","value":0,"combo":0,"type":"check"}],[{"key":"A6o","value":100,"combo":9,"type":"allin"},{"key":"K6o","value":100,"combo":0,"type":"allin"},{"key":"Q6o","value":0,"combo":0,"type":"check"},{"key":"J6o","value":0,"combo":0,"type":"check"},{"key":"T6o","value":0,"combo":0,"type":"check"},{"key":"96o","value":0,"combo":0,"type":"check"},{"key":"86o","value":0,"combo":0,"type":"check"},{"key":"76o","value":0,"combo":0,"type":"check"},{"key":"66","value":100,"combo":6,"type":"bet"},{"key":"65s","value":0,"combo":4,"type":"check"},{"key":"64s","value":0,"combo":0.6900000000000001,"type":"check"},{"key":"63s","value":0,"combo":0,"type":"check"},{"key":"62s","value":0,"combo":0,"type":"check"}],[{"key":"A5o","value":100,"combo":9,"type":"allin"},{"key":"K5o","value":100,"combo":0,"type":"allin"},{"key":"Q5o","value":100,"combo":0,"type":"allin"},{"key":"J5o","value":0,"combo":0,"type":"check"},{"key":"T5o","value":0,"combo":0,"type":"check"},{"key":"95o","value":0,"combo":0,"type":"check"},{"key":"85o","value":0,"combo":0,"type":"check"},{"key":"75o","value":0,"combo":0,"type":"check"},{"key":"65o","value":0,"combo":0,"type":"check"},{"key":"55","value":100,"combo":6,"type":"bet"},{"key":"54s","value":0,"combo":3,"type":"check"},{"key":"53s","value":0,"combo":0,"type":"check"},{"key":"52s","value":0,"combo":0,"type":"check"}],[{"key":"A4o","value":100,"combo":7,"type":"allin"},{"key":"K4o","value":100,"combo":0,"type":"allin"},{"key":"Q4o","value":100,"combo":0,"type":"allin"},{"key":"J4o","value":100,"combo":0,"type":"allin"},{"key":"T4o","value":100,"combo":0,"type":"bet"},{"key":"94o","value":0,"combo":0,"type":"check"},{"key":"84o","value":0,"combo":0,"type":"check"},{"key":"74o","value":0,"combo":0,"type":"check"},{"key":"64o","value":0,"combo":0,"type":"check"},{"key":"54o","value":0,"combo":0,"type":"check"},{"key":"44","value":100,"combo":3,"type":"bet"},{"key":"43s","value":0,"combo":0,"type":"check"},{"key":"42s","value":0,"combo":0,"type":"check"}],[{"key":"A3o","value":100,"combo":6.57,"type":"allin"},{"key":"K3o","value":100,"combo":0,"type":"allin"},{"key":"Q3o","value":100,"combo":0,"type":"allin"},{"key":"J3o","value":0,"combo":0,"type":"check"},{"key":"T3o","value":0,"combo":0,"type":"check"},{"key":"93o","value":0,"combo":0,"type":"check"},{"key":"83o","value":0,"combo":0,"type":"check"},{"key":"73o","value":100,"combo":0,"type":"bet"},{"key":"63o","value":0,"combo":0,"type":"check"},{"key":"53o","value":0,"combo":0,"type":"check"},{"key":"43o","value":0,"combo":0,"type":"check"},{"key":"33","value":0,"combo":6,"type":"check"},{"key":"32s","value":0,"combo":0,"type":"check"}],[{"key":"A2o","value":100,"combo":0,"type":"allin"},{"key":"K2o","value":100,"combo":0,"type":"allin"},{"key":"Q2o","value":100,"combo":0,"type":"allin"},{"key":"J2o","value":100,"combo":0,"type":"allin"},{"key":"T2o","value":0,"combo":0,"type":"check"},{"key":"92o","value":0,"combo":0,"type":"check"},{"key":"82o","value":0,"combo":0,"type":"check"},{"key":"72o","value":100,"combo":0,"type":"bet"},{"key":"62o","value":100,"combo":0,"type":"bet"},{"key":"52o","value":0,"combo":0,"type":"check"},{"key":"42o","value":0,"combo":0,"type":"check"},{"key":"32o","value":0,"combo":0,"type":"check"},{"key":"22","value":100,"combo":3,"type":"allin"}]])
		//setData([[{"key":"AA","value":100,"combo":3,"type":"bet"},{"key":"AKs","value":100,"combo":3,"type":"bet"},{"key":"AQs","value":100,"combo":3,"type":"bet"},{"key":"AJs","value":100,"combo":3,"type":"bet"},{"key":"ATs","value":100,"combo":3,"type":"bet"},{"key":"A9s","value":100,"combo":3,"type":"bet"},{"key":"A8s","value":100,"combo":3,"type":"bet"},{"key":"A7s","value":100,"combo":3,"type":"bet"},{"key":"A6s","value":100,"combo":3,"type":"bet"},{"key":"A5s","value":0,"combo":3,"type":"check"},{"key":"A4s","value":100,"combo":2,"type":"bet"},{"key":"A3s","value":100,"combo":3,"type":"bet"},{"key":"A2s","value":0,"combo":2,"type":"check"}],[{"key":"AKo","value":100,"combo":9,"type":"bet"},{"key":"KK","value":100,"combo":6,"type":"bet"},{"key":"KQs","value":100,"combo":4,"type":"bet"},{"key":"KJs","value":100,"combo":4,"type":"bet"},{"key":"KTs","value":100,"combo":4,"type":"bet"},{"key":"K9s","value":100,"combo":4,"type":"bet"},{"key":"K8s","value":100,"combo":4,"type":"bet"},{"key":"K7s","value":100,"combo":4,"type":"bet"},{"key":"K6s","value":100,"combo":4,"type":"bet"},{"key":"K5s","value":100,"combo":4,"type":"bet"},{"key":"K4s","value":100,"combo":3,"type":"bet"},{"key":"K3s","value":0,"combo":4,"type":"check"},{"key":"K2s","value":0,"combo":3,"type":"check"}],[{"key":"AQo","value":100,"combo":9,"type":"bet"},{"key":"KQo","value":100,"combo":12,"type":"bet"},{"key":"QQ","value":100,"combo":6,"type":"bet"},{"key":"QJs","value":0,"combo":4,"type":"check"},{"key":"QTs","value":0,"combo":4,"type":"check"},{"key":"Q9s","value":100,"combo":4,"type":"bet"},{"key":"Q8s","value":100,"combo":4,"type":"bet"},{"key":"Q7s","value":100,"combo":4,"type":"bet"},{"key":"Q6s","value":100,"combo":4,"type":"bet"},{"key":"Q5s","value":0,"combo":4,"type":"check"},{"key":"Q4s","value":0,"combo":3,"type":"check"},{"key":"Q3s","value":0,"combo":4,"type":"check"},{"key":"Q2s","value":0,"combo":3,"type":"check"}],[{"key":"AJo","value":100,"combo":9,"type":"bet"},{"key":"KJo","value":100,"combo":12,"type":"bet"},{"key":"QJo","value":100,"combo":12,"type":"bet"},{"key":"JJ","value":100,"combo":6,"type":"bet"},{"key":"JTs","value":100,"combo":4,"type":"bet"},{"key":"J9s","value":100,"combo":4,"type":"bet"},{"key":"J8s","value":100,"combo":4,"type":"bet"},{"key":"J7s","value":0,"combo":4,"type":"check"},{"key":"J6s","value":0,"combo":4,"type":"check"},{"key":"J5s","value":0,"combo":4,"type":"check"},{"key":"J4s","value":0,"combo":3,"type":"check"},{"key":"J3s","value":0,"combo":0,"type":"check"},{"key":"J2s","value":100,"combo":0,"type":"bet"}],[{"key":"ATo","value":100,"combo":9,"type":"bet"},{"key":"KTo","value":100,"combo":12,"type":"bet"},{"key":"QTo","value":100,"combo":12,"type":"bet"},{"key":"JTo","value":100,"combo":12,"type":"bet"},{"key":"TT","value":100,"combo":6,"type":"bet"},{"key":"T9s","value":100,"combo":4,"type":"bet"},{"key":"T8s","value":100,"combo":4,"type":"bet"},{"key":"T7s","value":100,"combo":4,"type":"bet"},{"key":"T6s","value":0,"combo":4,"type":"check"},{"key":"T5s","value":0,"combo":2.84,"type":"check"},{"key":"T4s","value":0,"combo":0,"type":"check"},{"key":"T3s","value":100,"combo":0,"type":"bet"},{"key":"T2s","value":100,"combo":0,"type":"bet"}],[{"key":"A9o","value":0,"combo":9,"type":"check"},{"key":"K9o","value":100,"combo":12,"type":"bet"},{"key":"Q9o","value":100,"combo":12,"type":"bet"},{"key":"J9o","value":100,"combo":12,"type":"bet"},{"key":"T9o","value":100,"combo":12,"type":"bet"},{"key":"99","value":100,"combo":6,"type":"bet"},{"key":"98s","value":100,"combo":4,"type":"bet"},{"key":"97s","value":0,"combo":4,"type":"check"},{"key":"96s","value":0,"combo":4,"type":"check"},{"key":"95s","value":0,"combo":0,"type":"check"},{"key":"94s","value":100,"combo":0,"type":"bet"},{"key":"93s","value":100,"combo":0,"type":"bet"},{"key":"92s","value":100,"combo":0,"type":"bet"}],[{"key":"A8o","value":0,"combo":9,"type":"check"},{"key":"K8o","value":100,"combo":8.82,"type":"bet"},{"key":"Q8o","value":100,"combo":0,"type":"bet"},{"key":"J8o","value":100,"combo":4.44,"type":"bet"},{"key":"T8o","value":100,"combo":9.239999999999998,"type":"bet"},{"key":"98o","value":100,"combo":4.380000000000001,"type":"bet"},{"key":"88","value":100,"combo":6,"type":"bet"},{"key":"87s","value":100,"combo":4,"type":"bet"},{"key":"86s","value":0,"combo":4,"type":"check"},{"key":"85s","value":100,"combo":0,"type":"bet"},{"key":"84s","value":100,"combo":0,"type":"bet"},{"key":"83s","value":100,"combo":0,"type":"bet"},{"key":"82s","value":100,"combo":0,"type":"bet"}],[{"key":"A7o","value":100,"combo":9,"type":"bet"},{"key":"K7o","value":100,"combo":5.04,"type":"bet"},{"key":"Q7o","value":100,"combo":0,"type":"bet"},{"key":"J7o","value":100,"combo":0,"type":"bet"},{"key":"T7o","value":100,"combo":0,"type":"bet"},{"key":"97o","value":100,"combo":0,"type":"bet"},{"key":"87o","value":100,"combo":0,"type":"bet"},{"key":"77","value":100,"combo":6,"type":"bet"},{"key":"76s","value":100,"combo":4,"type":"bet"},{"key":"75s","value":0,"combo":4,"type":"check"},{"key":"74s","value":100,"combo":0,"type":"bet"},{"key":"73s","value":100,"combo":0,"type":"bet"},{"key":"72s","value":100,"combo":0,"type":"bet"}],[{"key":"A6o","value":100,"combo":9,"type":"bet"},{"key":"K6o","value":100,"combo":0,"type":"bet"},{"key":"Q6o","value":100,"combo":0,"type":"bet"},{"key":"J6o","value":100,"combo":0,"type":"bet"},{"key":"T6o","value":100,"combo":0,"type":"bet"},{"key":"96o","value":100,"combo":0,"type":"bet"},{"key":"86o","value":100,"combo":0,"type":"bet"},{"key":"76o","value":100,"combo":0,"type":"bet"},{"key":"66","value":100,"combo":6,"type":"bet"},{"key":"65s","value":100,"combo":4,"type":"bet"},{"key":"64s","value":0,"combo":0.6900000000000001,"type":"check"},{"key":"63s","value":100,"combo":0,"type":"bet"},{"key":"62s","value":100,"combo":0,"type":"bet"}],[{"key":"A5o","value":100,"combo":9,"type":"bet"},{"key":"K5o","value":100,"combo":0,"type":"bet"},{"key":"Q5o","value":100,"combo":0,"type":"bet"},{"key":"J5o","value":100,"combo":0,"type":"bet"},{"key":"T5o","value":0,"combo":0,"type":"check"},{"key":"95o","value":0,"combo":0,"type":"check"},{"key":"85o","value":0,"combo":0,"type":"check"},{"key":"75o","value":100,"combo":0,"type":"bet"},{"key":"65o","value":100,"combo":0,"type":"bet"},{"key":"55","value":100,"combo":6,"type":"bet"},{"key":"54s","value":100,"combo":3,"type":"bet"},{"key":"53s","value":0,"combo":0,"type":"check"},{"key":"52s","value":100,"combo":0,"type":"bet"}],[{"key":"A4o","value":100,"combo":7,"type":"bet"},{"key":"K4o","value":100,"combo":0,"type":"bet"},{"key":"Q4o","value":100,"combo":0,"type":"bet"},{"key":"J4o","value":100,"combo":0,"type":"bet"},{"key":"T4o","value":0,"combo":0,"type":"check"},{"key":"94o","value":0,"combo":0,"type":"check"},{"key":"84o","value":0,"combo":0,"type":"check"},{"key":"74o","value":0,"combo":0,"type":"check"},{"key":"64o","value":0,"combo":0,"type":"check"},{"key":"54o","value":100,"combo":0,"type":"bet"},{"key":"44","value":100,"combo":3,"type":"bet"},{"key":"43s","value":100,"combo":0,"type":"bet"},{"key":"42s","value":100,"combo":0,"type":"bet"}],[{"key":"A3o","value":0,"combo":6.57,"type":"check"},{"key":"K3o","value":100,"combo":0,"type":"bet"},{"key":"Q3o","value":0,"combo":0,"type":"check"},{"key":"J3o","value":0,"combo":0,"type":"check"},{"key":"T3o","value":0,"combo":0,"type":"check"},{"key":"93o","value":0,"combo":0,"type":"check"},{"key":"83o","value":-1,"combo":0},{"key":"73o","value":-1,"combo":0},{"key":"63o","value":0,"combo":0,"type":"check"},{"key":"53o","value":100,"combo":0,"type":"bet"},{"key":"43o","value":0,"combo":0,"type":"check"},{"key":"33","value":100,"combo":6,"type":"bet"},{"key":"32s","value":100,"combo":0,"type":"bet"}],[{"key":"A2o","value":0,"combo":0,"type":"check"},{"key":"K2o","value":0,"combo":0,"type":"check"},{"key":"Q2o","value":0,"combo":0,"type":"check"},{"key":"J2o","value":0,"combo":0,"type":"check"},{"key":"T2o","value":0,"combo":0,"type":"check"},{"key":"92o","value":-1,"combo":0},{"key":"82o","value":-1,"combo":0},{"key":"72o","value":-1,"combo":0},{"key":"62o","value":-1,"combo":0},{"key":"52o","value":-1,"combo":0},{"key":"42o","value":-1,"combo":0},{"key":"32o","value":-1,"combo":0},{"key":"22","value":0,"combo":3,"type":"check"}]])
		//setData([[{"key":"AA","value":100,"combo":3,"type":"bet"},{"key":"AKs","value":100,"combo":3,"type":"bet"},{"key":"AQs","value":100,"combo":3,"type":"bet"},{"key":"AJs","value":100,"combo":3,"type":"bet"},{"key":"ATs","value":100,"combo":3,"type":"bet"},{"key":"A9s","value":100,"combo":3,"type":"bet"},{"key":"A8s","value":100,"combo":3,"type":"bet"},{"key":"A7s","value":100,"combo":3,"type":"bet"},{"key":"A6s","value":100,"combo":3,"type":"allin"},{"key":"A5s","value":100,"combo":3,"type":"allin"},{"key":"A4s","value":100,"combo":2,"type":"allin"},{"key":"A3s","value":100,"combo":3,"type":"allin"},{"key":"A2s","value":100,"combo":2,"type":"allin"}],[{"key":"AKo","value":100,"combo":9,"type":"bet"},{"key":"KK","value":100,"combo":6,"type":"bet"},{"key":"KQs","value":100,"combo":4,"type":"bet"},{"key":"KJs","value":100,"combo":4,"type":"bet"},{"key":"KTs","value":100,"combo":4,"type":"bet"},{"key":"K9s","value":100,"combo":4,"type":"bet"},{"key":"K8s","value":100,"combo":4,"type":"bet"},{"key":"K7s","value":100,"combo":4,"type":"bet"},{"key":"K6s","value":100,"combo":4,"type":"bet"},{"key":"K5s","value":100,"combo":4,"type":"bet"},{"key":"K4s","value":-1,"combo":3,"type":"none"},{"key":"K3s","value":-1,"combo":4,"type":"none"},{"key":"K2s","value":-1,"combo":3,"type":"none"}],[{"key":"AQo","value":100,"combo":9,"type":"bet"},{"key":"KQo","value":100,"combo":12,"type":"bet"},{"key":"QQ","value":100,"combo":6,"type":"bet"},{"key":"QJs","value":100,"combo":4,"type":"bet"},{"key":"QTs","value":100,"combo":4,"type":"allin"},{"key":"Q9s","value":100,"combo":4,"type":"bet"},{"key":"Q8s","value":100,"combo":4,"type":"bet"},{"key":"Q7s","value":-1,"combo":4,"type":"none"},{"key":"Q6s","value":-1,"combo":4,"type":"none"},{"key":"Q5s","value":-1,"combo":4,"type":"none"},{"key":"Q4s","value":-1,"combo":3,"type":"none"},{"key":"Q3s","value":-1,"combo":4,"type":"none"},{"key":"Q2s","value":-1,"combo":3,"type":"none"}],[{"key":"AJo","value":100,"combo":9,"type":"bet"},{"key":"KJo","value":100,"combo":12,"type":"bet"},{"key":"QJo","value":100,"combo":12,"type":"bet"},{"key":"JJ","value":100,"combo":6,"type":"bet"},{"key":"JTs","value":100,"combo":4,"type":"allin"},{"key":"J9s","value":100,"combo":4,"type":"bet"},{"key":"J8s","value":100,"combo":4,"type":"bet"},{"key":"J7s","value":-1,"combo":4,"type":"none"},{"key":"J6s","value":-1,"combo":4,"type":"none"},{"key":"J5s","value":-1,"combo":4,"type":"none"},{"key":"J4s","value":-1,"combo":3,"type":"none"},{"key":"J3s","value":-1,"combo":0,"type":"none"},{"key":"J2s","value":-1,"combo":0}],[{"key":"ATo","value":100,"combo":9,"type":"allin"},{"key":"KTo","value":100,"combo":12,"type":"bet"},{"key":"QTo","value":100,"combo":12,"type":"bet"},{"key":"JTo","value":100,"combo":12,"type":"bet"},{"key":"TT","value":100,"combo":6,"type":"bet"},{"key":"T9s","value":100,"combo":4,"type":"allin"},{"key":"T8s","value":100,"combo":4,"type":"bet"},{"key":"T7s","value":-1,"combo":4,"type":"none"},{"key":"T6s","value":-1,"combo":4,"type":"none"},{"key":"T5s","value":-1,"combo":2.84,"type":"none"},{"key":"T4s","value":-1,"combo":0},{"key":"T3s","value":-1,"combo":0},{"key":"T2s","value":-1,"combo":0}],[{"key":"A9o","value":100,"combo":9,"type":"allin"},{"key":"K9o","value":100,"combo":12,"type":"bet"},{"key":"Q9o","value":-1,"combo":12,"type":"none"},{"key":"J9o","value":-1,"combo":12,"type":"none"},{"key":"T9o","value":-1,"combo":12,"type":"none"},{"key":"99","value":100,"combo":6,"type":"bet"},{"key":"98s","value":100,"combo":4,"type":"bet"},{"key":"97s","value":100,"combo":4,"type":"bet"},{"key":"96s","value":-1,"combo":4,"type":"none"},{"key":"95s","value":-1,"combo":0},{"key":"94s","value":-1,"combo":0},{"key":"93s","value":-1,"combo":0},{"key":"92s","value":-1,"combo":0}],[{"key":"A8o","value":100,"combo":9,"type":"allin"},{"key":"K8o","value":-1,"combo":8.82,"type":"none"},{"key":"Q8o","value":-1,"combo":0},{"key":"J8o","value":-1,"combo":4.44,"type":"none"},{"key":"T8o","value":-1,"combo":9.239999999999998,"type":"none"},{"key":"98o","value":-1,"combo":4.380000000000001,"type":"none"},{"key":"88","value":100,"combo":6,"type":"bet"},{"key":"87s","value":100,"combo":4,"type":"bet"},{"key":"86s","value":-1,"combo":4,"type":"none"},{"key":"85s","value":-1,"combo":0},{"key":"84s","value":-1,"combo":0},{"key":"83s","value":-1,"combo":0},{"key":"82s","value":-1,"combo":0}],[{"key":"A7o","value":100,"combo":9,"type":"bet"},{"key":"K7o","value":-1,"combo":5.04,"type":"none"},{"key":"Q7o","value":-1,"combo":0},{"key":"J7o","value":-1,"combo":0},{"key":"T7o","value":-1,"combo":0},{"key":"97o","value":-1,"combo":0},{"key":"87o","value":-1,"combo":0},{"key":"77","value":100,"combo":6,"type":"bet"},{"key":"76s","value":-1,"combo":4,"type":"none"},{"key":"75s","value":-1,"combo":4,"type":"none"},{"key":"74s","value":-1,"combo":0},{"key":"73s","value":-1,"combo":0},{"key":"72s","value":-1,"combo":0}],[{"key":"A6o","value":100,"combo":9,"type":"bet"},{"key":"K6o","value":-1,"combo":0},{"key":"Q6o","value":-1,"combo":0},{"key":"J6o","value":-1,"combo":0},{"key":"T6o","value":-1,"combo":0},{"key":"96o","value":-1,"combo":0},{"key":"86o","value":-1,"combo":0},{"key":"76o","value":-1,"combo":0},{"key":"66","value":100,"combo":6,"type":"bet"},{"key":"65s","value":-1,"combo":4,"type":"none"},{"key":"64s","value":-1,"combo":0.6900000000000001,"type":"none"},{"key":"63s","value":-1,"combo":0},{"key":"62s","value":-1,"combo":0}],[{"key":"A5o","value":100,"combo":9,"type":"bet"},{"key":"K5o","value":-1,"combo":0},{"key":"Q5o","value":-1,"combo":0},{"key":"J5o","value":-1,"combo":0},{"key":"T5o","value":-1,"combo":0},{"key":"95o","value":-1,"combo":0},{"key":"85o","value":-1,"combo":0},{"key":"75o","value":-1,"combo":0},{"key":"65o","value":-1,"combo":0},{"key":"55","value":100,"combo":6,"type":"allin"},{"key":"54s","value":-1,"combo":3,"type":"none"},{"key":"53s","value":-1,"combo":0},{"key":"52s","value":-1,"combo":0}],[{"key":"A4o","value":-1,"combo":7,"type":"none"},{"key":"K4o","value":-1,"combo":0},{"key":"Q4o","value":-1,"combo":0},{"key":"J4o","value":-1,"combo":0},{"key":"T4o","value":-1,"combo":0},{"key":"94o","value":-1,"combo":0},{"key":"84o","value":-1,"combo":0},{"key":"74o","value":-1,"combo":0},{"key":"64o","value":-1,"combo":0},{"key":"54o","value":-1,"combo":0},{"key":"44","value":100,"combo":3,"type":"allin"},{"key":"43s","value":-1,"combo":0},{"key":"42s","value":-1,"combo":0}],[{"key":"A3o","value":-1,"combo":6.57,"type":"none"},{"key":"K3o","value":-1,"combo":0},{"key":"Q3o","value":-1,"combo":0},{"key":"J3o","value":-1,"combo":0},{"key":"T3o","value":-1,"combo":0},{"key":"93o","value":-1,"combo":0},{"key":"83o","value":-1,"combo":0},{"key":"73o","value":-1,"combo":0},{"key":"63o","value":-1,"combo":0},{"key":"53o","value":-1,"combo":0},{"key":"43o","value":-1,"combo":0},{"key":"33","value":100,"combo":6,"type":"allin"},{"key":"32s","value":-1,"combo":0}],[{"key":"A2o","value":-1,"combo":0},{"key":"K2o","value":-1,"combo":0},{"key":"Q2o","value":-1,"combo":0},{"key":"J2o","value":-1,"combo":0},{"key":"T2o","value":-1,"combo":0},{"key":"92o","value":-1,"combo":0},{"key":"82o","value":-1,"combo":0},{"key":"72o","value":-1,"combo":0},{"key":"62o","value":-1,"combo":0},{"key":"52o","value":-1,"combo":0},{"key":"42o","value":-1,"combo":0},{"key":"32o","value":-1,"combo":0},{"key":"22","value":100,"combo":3,"type":"allin"}]])
	}, [])

	return (
		<Page>
			<button onClick={() => console.log(JSON.stringify(data))}>Save</button>
			<button onClick={() => setType('allin')}>Allin</button>
			<button onClick={() => setType('bet')}>Bet</button>
			<button onClick={() => setType('check')}>Check</button>
			<button onClick={() => setType('none')}>None</button>
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
									type={v.type}
									hand={v.key} />
							})
						})
					}
				</Board>
			</BoardWrapper>
			<FrequencyWrapper>
				<Frequency freqB={(currentCombos/totalCombos * 100).toFixed(1)} freqX={((1-(currentCombos/totalCombos)) * 100).toFixed(1)}/>
				<Frequency freqX={(answerCheckFreq * 100).toFixed(1)} freqB={((1-answerCheckFreq) * 100).toFixed(1)}/>
			</FrequencyWrapper>
		</Page>
	)
}

export default RangePage;