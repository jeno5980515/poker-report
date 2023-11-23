import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { ReactComponent as HeartSVG } from '../../assets/heart.svg';
import { ReactComponent as DiamondSVG } from '../../assets/diamond.svg';
import { ReactComponent as ClubSVG } from '../../assets/club.svg';
import { ReactComponent as SpadeSVG } from '../../assets/spade.svg';
import { ReactComponent as ArrowSVG } from '../../assets/arrow.svg';



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

const sortBySize2 = (a, b) => {
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


const Wrapper = styled.div`
	width: 100%;
	height: 400px;
	display: flex;
	flex-wrap: no-wrap;
	flex-direction: column;
	@media (max-width: 767px) {
		font-size: 0.7rem;
		height: 230px;
		overflow-y: scroll;
		overflow-x: hidden;
	}

	@media (min-width: 768px) {
	}
`

const SuitText = styled.div`
	position: absolute;
	background: white;
	display: flex;
	margin: 5px;
	> * {
		width: 13px;
		font-size: 15px;
	}
`

const SuitCharacter = styled.div`
	color: ${({ color }) => color};
`

const BlockerText = styled.div`
	position: absolute;
	right: 0;
	background: white;
	display: flex;
	margin: 5px;
	> * {
		width: 13px;
		font-size: 15px;
	}
`



const SuitBlock = styled.div`
	width: ${({ width }) => width};
	display: flex;
	margin: 1px;
	position: relative;
`

const ComparedText = styled.div`
	color: ${({ bigger }) => bigger ? 'rgb(0, 172, 141)' : "rgb(245, 83, 83)"};
` 


const Text = styled.div`
	display: flex;
	width: 100%;
	justify-content: space-between;
`

const HandWrapper = styled.div`
	display: flex;
	flex-direction: column;
	color: white;
`

const FONT_SIZE_MAP = {
	4: '1em',
	6: '0.8em',
	12: '0.5em'
}

const TextWrapper = styled.div`
	position: absolute;
	display: flex;
	width: 80%;
	justify-content: space-between;
	margin-top: 20px;
	padding: 10%;
	font-size: ${({ size }) => FONT_SIZE_MAP[size]};
`

const ItemWrapper = styled.div`
	display: flex;
	justify-content: space-between;
	flex-direction: column;
`

const Title = styled.div`
	color: grey;
`

const ColorBlock = styled.div`
	background: ${({ color }) => color};
	height: 100%;
	width: ${({ width }) => width}%;
	color: black;
	display: flex;
	flex-direction: column;
	align-items: center;
`

const ColorBar = styled.div`
	height: 13px;
	display: flex;
	width: 100%;
	background: rgb(63, 63, 63);
	@media (max-width: 767px) {
		height: 8px;
	}

	@media (min-width: 768px) {
	}
`

const LeftComparedColorBar = styled.div`
	height: 13px;
	display: flex;
	position: absolute;
	right: 50%;
	width: ${({ width }) => width}%;
	background: ${({ bigger }) => bigger ? 'rgb(0, 172, 141)' : 'rgb(79, 79, 79)'};
	top: 0;
	@media (max-width: 767px) {
		height: 8px;
	}

	@media (min-width: 768px) {
	}
`

const RightComparedColorBar = styled.div`
	height: 13px;
	display: flex;
	position: absolute;
	left: 50%;
	width: ${({ width }) => width}%;
	background: ${({ bigger }) => bigger ? 'rgb(0, 172, 141)' : 'rgb(79, 79, 79)'};
	top: 0;
	@media (max-width: 767px) {
		height: 8px;
	}

	@media (min-width: 768px) {
	}
`


const BarWrapper = styled.div`
	position: relative;
`


const Right = styled.div`
	width: 150px;
	display: flex;
	align-items: center;
	justify-content: space-between;
`



const Left = styled.div`
	width: 90px;
	padding-right: 10px;
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
`

const Control = styled.div`
	display: flex;
`


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

const getSuitList = (length) => {
	switch (length) {
		case 6:
			return ['sh', 'sd', 'hd', 'sc', 'hc', 'dc'];
		case 4:
			return ['ss', 'hh', 'dd', 'cc'];
		case 12:
			return ['sh', 'sd', 'sc', 'hs', 'hd', 'hc', 'ds', 'dh', 'dc', 'cs', 'ch', 'cd'];
	}
}

const Hand = ({ data1, data2, onSelectFilter }) => {
	return <HandWrapper>
		<Title>Hands</Title>
		{
			data1
				.map((d, index) => ({ ...d, originalIndex: index }))
				.filter((d) => !(d.total_frequency === 0 && data2[d.originalIndex].total_frequency === 0))
				.map((d) => {
					return <ItemWrapper
						key={d.name}
						onMouseEnter={() => onSelectFilter({ key: d.name, type: 'hands' })}
						onMouseLeave={() => onSelectFilter({ type: 'none' })}
					>
						<Text>
							<ComparedText bigger={d.total_frequency>data2[d.originalIndex].total_frequency}>{(d.total_frequency * 100).toFixed(1)}%</ComparedText>
							<div>{d.name}</div>
							<ComparedText bigger={data2[d.originalIndex].total_frequency>d.total_frequency}>{(data2[d.originalIndex].total_frequency * 100).toFixed(1)}%</ComparedText>
						</Text>
						<Bar data1={d.total_frequency} data2={data2[d.originalIndex].total_frequency} total={d.total_frequency+data2[d.originalIndex].total_frequency}/>
					</ItemWrapper>
				})
		}
	</HandWrapper>
}

const EQSimple = ({ data1, data2, onSelectFilter }) => {
	return <HandWrapper>
		<Title>EQ Simple</Title>
		{
			data1
			.map((d, index) => ({ ...d, originalIndex: index }))
			.filter((d) => !(d.total_frequency === 0 && data2[d.originalIndex].total_frequency === 0))
				.map(d => {
					return <ItemWrapper
						key={d.name}
						onMouseEnter={() => onSelectFilter({ key: d.name, type: 'eqs' })}
						onMouseLeave={() => onSelectFilter({ type: 'none' })}
					>
						<Text>
							<ComparedText bigger={d.total_frequency>data2[d.originalIndex].total_frequency}>{(d.total_frequency * 100).toFixed(1)}%</ComparedText>
							<div>{d.name}</div>
							<ComparedText bigger={data2[d.originalIndex].total_frequency>d.total_frequency}>{(data2[d.originalIndex].total_frequency * 100).toFixed(1)}%</ComparedText>
						</Text>
						<Bar data1={d.total_frequency} data2={data2[d.originalIndex].total_frequency} total={d.total_frequency+data2[d.originalIndex].total_frequency}/>
					</ItemWrapper>
				})
		}
	</HandWrapper>
}

const Draw = ({ data1, data2, onSelectFilter }) => {
	return <HandWrapper>
		<Title>Draw</Title>
		{
			data1
				.map((d, index) => ({ ...d, originalIndex: index }))
				.filter((d) => !(d.total_frequency === 0 && data2[d.originalIndex].total_frequency === 0))
				.map(d => {
					return <ItemWrapper
						key={d.name}
						onMouseEnter={() => onSelectFilter({ key: d.name, type: 'draw' })}
						onMouseLeave={() => onSelectFilter({ type: 'none' })}
					>
						<Text>
							<ComparedText bigger={d.total_frequency>data2[d.originalIndex].total_frequency}>{(d.total_frequency * 100).toFixed(1)}%</ComparedText>
							<div>{d.name}</div>
							<ComparedText bigger={data2[d.originalIndex].total_frequency>d.total_frequency}>{(data2[d.originalIndex].total_frequency * 100).toFixed(1)}%</ComparedText>
						</Text>
						<Bar data1={d.total_frequency} data2={data2[d.originalIndex].total_frequency} total={d.total_frequency+data2[d.originalIndex].total_frequency}/>
					</ItemWrapper>
				})
		}
	</HandWrapper>
}

const EQAdv = ({ data1, data2, onSelectFilter }) => {
	return <HandWrapper>
		<Title>EQ Advanced</Title>
		{
			data1
				.map((d, index) => ({ ...d, originalIndex: index }))
				.filter((d) => !(d.total_frequency === 0 && data2[d.originalIndex].total_frequency === 0))
				.map(d => {
					return <ItemWrapper
						key={d.name}
						onMouseEnter={() => onSelectFilter({ key: d.name, type: 'eqa' })}
						onMouseLeave={() => onSelectFilter({ type: 'none' })}
					>
						<Text>
							<ComparedText bigger={d.total_frequency>data2[d.originalIndex].total_frequency}>{(d.total_frequency * 100).toFixed(1)}%</ComparedText>
							<div>{d.name}</div>
							<ComparedText bigger={data2[d.originalIndex].total_frequency>d.total_frequency}>{(data2[d.originalIndex].total_frequency * 100).toFixed(1)}%</ComparedText>
						</Text>
						<Bar data1={d.total_frequency} data2={data2[d.originalIndex].total_frequency} total={d.total_frequency+data2[d.originalIndex].total_frequency}/>
					</ItemWrapper>
				})
		}
	</HandWrapper>
}

const Bar = ({ data1, data2, total }) => {
	return <BarWrapper>
		<ColorBar width={100}></ColorBar>
		<LeftComparedColorBar bigger={data1>data2} width={(data1/total) * 50}></LeftComparedColorBar>
		<RightComparedColorBar bigger={data2>data1} width={(data2/total) * 50}></RightComparedColorBar>
	</BarWrapper>
} 

const Common = ({ data }) => {
	return <HandWrapper>
		<ItemWrapper>
			<Text>
				<ComparedText bigger={data.players_info[0].total_combos>data.players_info[1].total_combos}>{data.players_info[0].total_combos.toFixed(1)}</ComparedText>
				<div>Combo</div>
				<ComparedText bigger={data.players_info[1].total_combos>data.players_info[0].total_combos}>{data.players_info[1].total_combos.toFixed(1)}</ComparedText>
			</Text>
			<Bar data1={data.players_info[0].total_combos} data2={data.players_info[1].total_combos} total={data.players_info[0].total_combos+data.players_info[1].total_combos}/>
		</ItemWrapper>
		<ItemWrapper>
			<Text>
				<ComparedText bigger={data.players_info[0].total_ev>data.players_info[1].total_ev}>{data.players_info[0].total_ev.toFixed(2)}</ComparedText>
				<div>EV</div>
				<ComparedText bigger={data.players_info[1].total_ev>data.players_info[0].total_ev}>{data.players_info[1].total_ev.toFixed(2)}</ComparedText>
			</Text>
			<Bar data1={data.players_info[0].total_ev} data2={data.players_info[1].total_ev} total={data.players_info[0].total_ev+data.players_info[1].total_ev}/>
		</ItemWrapper>
		<ItemWrapper>
			<Text>
				<ComparedText bigger={data.players_info[0].total_eq>data.players_info[1].total_eq}>{(data.players_info[0].total_eq * 100).toFixed(1)}%</ComparedText>
				<div>Equity</div>
				<ComparedText bigger={data.players_info[1].total_eq>data.players_info[0].total_eq}>{(data.players_info[1].total_eq * 100).toFixed(1)}%</ComparedText>
			</Text>
			<Bar data1={data.players_info[0].total_eq} data2={data.players_info[1].total_eq} total={data.players_info[0].total_eq+data.players_info[1].total_eq}/>
		</ItemWrapper>
		<ItemWrapper>
			<Text>
				<ComparedText bigger={data.players_info[0].total_eqr>data.players_info[1].total_eqr}>{(data.players_info[0].total_eqr * 100).toFixed(1)}%</ComparedText>
				<div>EQR</div>
				<ComparedText bigger={data.players_info[1].total_eqr>data.players_info[0].total_eqr}>{(data.players_info[1].total_eqr * 100).toFixed(1)}%</ComparedText>
			</Text>
			<Bar data1={data.players_info[0].total_eqr} data2={data.players_info[1].total_eqr} total={data.players_info[0].total_eqr+data.players_info[1].total_eqr}/>
		</ItemWrapper>
	</HandWrapper>
}

const RangeFilter = ({ data, onSelectFilter, hand, handleClickFilter }) => {
	const { solutions, blocker_rate, unblocker_rate } = data
	const [type, setType] = useState('hands');

	const getComp = () => {
		switch (type) {
			case 'hands':
				return () => <Hand data1={data.players_info[0].hand_categories} data2={data.players_info[1].hand_categories} onSelectFilter={onSelectFilter} />
			case 'eqs':
				return () => <EQSimple data1={data.players_info[0].equity_buckets} data2={data.players_info[1].equity_buckets} onSelectFilter={onSelectFilter} />
			case 'draw':
				return () => <Draw data1={data.players_info[0].draw_categories} data2={data.players_info[1].draw_categories} onSelectFilter={onSelectFilter} />
			case 'eqa':
				return () => <EQAdv data1={data.players_info[0].equity_buckets_advanced} data2={data.players_info[1].equity_buckets_advanced} onSelectFilter={onSelectFilter} />
			default:
				return () => <></>
		}
	}

	const Comp = getComp()

	return <Wrapper>
		{
			<>
				<div style={{ display: 'flex' }}>
					<Title>BB - BTN</Title>
					<button onClick={() => handleClickFilter({ type: 'none' })}>Clear</button>
				</div>
				<Common data={data}/>
				<Control>
					<button onClick={() => setType('hands')}>Hands</button>
					<button onClick={() => setType('eqs')}>EQS</button>
					<button onClick={() => setType('draw')}>Draw</button>
					<button onClick={() => setType('eqa')}>EQA</button>
				</Control>
				<Comp />
			</>
		}
	</Wrapper>
}

export default RangeFilter;