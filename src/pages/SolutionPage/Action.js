import { useEffect, useRef, useState } from 'react';
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
	'R2.75': "rgb(202, 50, 50)",
	'R4.1': "rgb(163, 41, 41)",
	"R6.9": "rgb(125, 31, 31)",
	"RAI": "rgb(106, 26, 26)",
	"X": "rgb(90, 185, 102)"
}

const Wrapper = styled.div`
	width: 100%;
	height: 70px;
	display: flex;
	flex-wrap: wrap;
`

const Action = ({ data }) => {
	console.log(data)
	return <Wrapper>
		{
			[...data]
				.sort(sortBySize)
				.map(d => {
					return <ColorBlock color={COLOR_MAP[d.action.code]}>
						<div>{d.action.code}</div>
						<div>{`${(d.total_frequency * 100).toFixed(1)}%`}</div>
					</ColorBlock>
				})
		}
	</Wrapper>
}

export default Action;