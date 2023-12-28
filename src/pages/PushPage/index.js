import * as d3 from "d3";
import { Routes, Route, Outlet, Link } from "react-router-dom";
import { useEffect, useRef, useState } from 'react';
import { Canvg } from 'canvg';
import styled from 'styled-components';
import Select, { components } from "react-select";

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

const Button = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 150px;
	height: 30px;
	border: black 1px solid;
	background: ${({ isSelected }) => isSelected ? 'grey' : 'white'};
	color: ${({ isSelected }) => isSelected ? 'white' : 'black'};
`

const ButtonWrapper = styled.div`
	display: flex;
	flex-wrap: wrap;
`

const ControlTitle = styled.div`
	color: white;
	margin: 5px;
`


const Control = styled.div`
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

const ACTIVE_VALUE = 83;

const FrequencyWrapper = styled.div`
	display: flex;
`

const Field = styled.fieldset`
	margin: 10px;
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
					<ColorBlock color={type === 'allin' ? 'rgb(106, 26, 26)' : 'rgb(240, 60, 60)'} width={value}></ColorBlock>
					<ColorBlock color={'rgb(90, 185, 102)'} width={100-value}></ColorBlock>
				</>
			)
		}
		<TextBlock>{hand}</TextBlock>
	</HandDivWrapper>
}

const PushPage = () => {
	const rangeData = RANGE.map(row => {
		return row.map(v => ({ key: v, value : true }))
	})
	const [type, setType] = useState('3btnOpen')
	const [bb, setBB] = useState(10)
	const [data, setData] = useState(rangeData)
	const [mouseMode, setMouseMode] = useState('none')
	const [currentCombos, setCurrentCombos] = useState(0)

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
		setMouseMode('none')
	}

	useEffect(() => {
		const fn = async () => {
			try {
				const path = `${process.env.PUBLIC_URL}/push/${type}${bb}.json`
				const response = await fetch(path);
				const data = await response.json()
				setData(data)
			} catch (e) {
				setData(rangeData)
				console.log(e)
			}
		}
		fn();
	}, [type, bb])

	return (
		<Page>
			<Control>
				<ControlTitle>People</ControlTitle>
				<ButtonWrapper>
					<Button onClick={() => setType('2sbOpen')} isSelected={type.includes('2')}>2</Button>
					<Button onClick={() => setType('3btnOpen')} isSelected={type.includes('3')}>3</Button>
				</ButtonWrapper>
			</Control>
			<Field>
				<legend style={{ color: 'white' }}>Type</legend>
				<Control>
					<ControlTitle>Limp/Open</ControlTitle>
					{
						type.includes('2')
							? <ButtonWrapper>
									<Button onClick={() => setType('2sbOpen')} isSelected={type === '2sbOpen'}>SB</Button>
								</ButtonWrapper>
							: <ButtonWrapper>
									<Button onClick={() => setType('3btnOpen')} isSelected={type === '3btnOpen'}>BTN</Button>
									<Button onClick={() => setType('3sbOpen')} isSelected={type === '3sbOpen'}>SB</Button>
								</ButtonWrapper>	
					}
				</Control>
				{
					type.includes('3')
						? <Control>
								<ControlTitle>SB VS Open/Limp/Shove</ControlTitle>
									<ButtonWrapper>
										<Button onClick={() => setType('3sbVsbtn')} isSelected={type === '3sbVsbtn'}>SB VS BTN</Button>
										<Button onClick={() => setType('3sbCallbtn')} isSelected={type === '3sbCallbtn'}>SB Call Btn Shove</Button>
									</ButtonWrapper>	
							</Control> : null
				}
				<Control>
					<ControlTitle>BB VS Open/Limp/Shove</ControlTitle>
					{
						type.includes('2')
							? <ButtonWrapper>
									<Button onClick={() => setType('2bbVssb')} isSelected={type === '2bbVssb'}>BB VS SB</Button>
									<Button onClick={() => setType('2bbIsosb')} isSelected={type === '2bbIsosb'}>BB ISO SB</Button>
									<Button onClick={() => setType('2bbCallshovesb')} isSelected={type === '2bbCallshovesb'}>BB Call SB Shove</Button>
								</ButtonWrapper>
							: <ButtonWrapper>
									<Button onClick={() => setType('3bbVsbtn')} isSelected={type === '3bbVsbtn'}>BB VS BTN</Button>
									<Button onClick={() => setType('3bbVssb')} isSelected={type === '3bbVssb'}>BB VS SB</Button>
									<Button onClick={() => setType('3bbIsosb')} isSelected={type === '3bbIsosb'}>BB ISO SB</Button>
									<Button onClick={() => setType('3bbIsobtnsb')} isSelected={type === '3bbIsobtnsb'}>BB ISO BTN + SB</Button>
									<Button onClick={() => setType('3bbCallshovebtn')} isSelected={type === '3bbCallshovebtn'}>BB Call Btn Shove</Button>
									<Button onClick={() => setType('3bbCallshovesb')} isSelected={type === '3bbCallshovesb'}>BB Call SB Shove</Button>
									<Button onClick={() => setType('3bbCallshovebtnsb')} isSelected={type === '3bbCallshovebtnsb'}>BB Call Both Shove</Button>
								</ButtonWrapper>	
					}
				</Control>
				{/* <Control>
					<ControlTitle>Open VS 3Bet</ControlTitle>
					{
						type.includes('2')
							? <ButtonWrapper>
									<Button onClick={() => setType('2bbIsosb')} isSelected={type === '2bbIsosb'}>BB ISO SB</Button>
								</ButtonWrapper>
							: <ButtonWrapper>
									<Button onClick={() => setType('3bbIsosb')} isSelected={type === '3bbIsosb'}>BB ISO SB</Button>
								</ButtonWrapper>	
					}
				</Control> */}
				<Control>
					<ControlTitle>Limp/Open VS Action</ControlTitle>
					{
						type.includes('2')
							? <ButtonWrapper>
									<Button onClick={() => setType('2sbLimpisobb')} isSelected={type === '2sbLimpisobb'}>SB Limp VS ISO</Button>
									<Button onClick={() => setType('2sbLimpshovebb')} isSelected={type === '2sbLimpshovebb'}>SB Limp VS Shove</Button>
									<Button onClick={() => setType('2sbOpenshovebb')} isSelected={type === '2sbOpenshovebb'}>SB Open VS Shove</Button>
									<Button onClick={() => setType('2sbOpenraisebb')} isSelected={type === '2sbOpenraisebb'}>SB Open VS 3Bet</Button>
								</ButtonWrapper>
							: <ButtonWrapper>
									<Button onClick={() => setType('3btnOpencallshovesb')} isSelected={type === '3btnOpencallshovesb'}>BTN VS SB Shove</Button>
									<Button onClick={() => setType('3btnOpencallshovebb')} isSelected={type === '3btnOpencallshovebb'}>BTN VS BB Shove</Button>
								</ButtonWrapper>	
					}
				</Control>
				{/* <Control>
					<ControlTitle>Shove</ControlTitle>
					{
						type.includes('2')
							? <ButtonWrapper>
									<Button onClick={() => setType('2sbShove')} isSelected={type === '2sbShove'}>SB</Button>
								</ButtonWrapper>
							: <ButtonWrapper>
									<Button onClick={() => setType('3btnShove')} isSelected={type === '3btnShove'}>BTN</Button>
									<Button onClick={() => setType('3sbShove')} isSelected={type === '3sbShove'}>SB</Button>
								</ButtonWrapper>	
					}
				</Control> */}
				{/* <Control>
					<ControlTitle>Call Shove</ControlTitle>
					{
						type.includes('2')
							? <ButtonWrapper>
									<Button onClick={() => setType('2bbCallsb')} isSelected={type === '2bbCallsb'}>BB Call SB</Button>
								</ButtonWrapper>
							: <ButtonWrapper>
									<Button onClick={() => setType('3bbCallbtn')} isSelected={type === '3bbCallbtn'}>BB Call Btn</Button>
									<Button onClick={() => setType('3bbCallsb')} isSelected={type === '3bbCallsb'}>BB Call SB</Button>
									<Button onClick={() => setType('3sbCallbtn')} isSelected={type === '3sbCallbtn'}>SB Call Btn</Button>
									<Button onClick={() => setType('3bbCallshovebtnsb')} isSelected={type === '3bbCallshovebtnsb'}>BB Call Btn + SB</Button>
								</ButtonWrapper>	
					}
				</Control> */}
				{/* <Control>
					<ControlTitle>Reshove</ControlTitle>
					{
						type.includes('2')
							? <ButtonWrapper>
									<Button onClick={() => setType('2bbReshovesb')} isSelected={type === '2bbReshovesb'}>BB Reshove SB</Button>
								</ButtonWrapper>
							: <ButtonWrapper>
									<Button onClick={() => setType('3bbReshovebtn')} isSelected={type === '3bbReshovebtn'}>BB Reshove Btn</Button>
									<Button onClick={() => setType('3bbReshovesb')} isSelected={type === '3bbReshovesb'}>BB Reshove SB</Button>
									<Button onClick={() => setType('3sbReshovebtn')} isSelected={type === '3sbReshovebtn'}>SB Reshove Btn</Button>
								</ButtonWrapper>	
					}
				</Control> */}
			</Field>
			{/* <Control>
				<ControlTitle>Ante</ControlTitle>
				{
					<ButtonWrapper>
						<Button isSelected={true}>No Ante</Button>
					</ButtonWrapper>	
				}
			</Control> */}
			<Control>
				<ControlTitle>BB</ControlTitle>
				{
					<ButtonWrapper>
						{
							[...Array(25).keys()].map(k => k + 1).map(key => {
								return <Button style={{ width: '70px'}} onClick={() => setBB(key)} isSelected={bb === key}>{key}</Button>
							})
						}
					</ButtonWrapper>	
				}
			</Control>
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
		</Page>
	)
}

export default PushPage;