import { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

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

const ColorBlock = styled.div`
	background: ${({ color }) => color};
	height: 100%;
	width: 32%;
	margin: 1px;
	color: white;
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	align-items: center;
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
	"X": "rgb(90, 185, 102)",
	'Bet': 'rgb(240, 60, 60)'
}

const Wrapper = styled.div`
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	@media (max-width: 767px) {
		margin-top: 10px;
		margin-bottom: 10px;
		width: 100%;
	}
	@media (min-width: 769px) {
		height: 70px;
	}
`

const Action = ({ data = [], onSizeSelected = () => {}, mode = 'complex' }) => {
	let betFreq = 0
	let checkFreq = 0
	data.forEach((d) => {
		if (d.action.code === 'X') {
			checkFreq += d.total_frequency
		} else {
			betFreq += d.total_frequency
		}
	})
	const complexData = useMemo(() => {
		return [...data]
			.sort(sortBySize)
			.map(d => {
				return <ColorBlock color={COLOR_MAP[d.action.code]} onClick={() => onSizeSelected(d.action.code)}>
					<div>{d.action.code}</div>
					<div>{`${(d.total_frequency * 100).toFixed(1)}%`}</div>
				</ColorBlock>
			})
	}, [JSON.stringify(data)])

	const simpleData = useMemo(() => {
		return <>
			<ColorBlock color={'rgb(240, 60, 60)'} onClick={() => onSizeSelected('Bet')}>
				<div>Bet</div>
				<div>{`${(betFreq * 100).toFixed(1)}%`}</div>
			</ColorBlock>
			<ColorBlock color={'rgb(90, 185, 102)'} onClick={() => onSizeSelected('X')}>
				<div>Check</div>
				<div>{`${(checkFreq * 100).toFixed(1)}%`}</div>
			</ColorBlock>
		</>
	}, [JSON.stringify(data)])

	return <Wrapper>
		{
			mode === 'complex' ? complexData : simpleData
		}
	</Wrapper>
}

export default Action;