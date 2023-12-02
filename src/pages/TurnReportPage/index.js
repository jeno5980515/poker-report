import * as d3 from "d3";
import { useLocation } from 'react-router-dom';
import { Routes, Route, Outlet, Link } from "react-router-dom";
import { useEffect, useRef, useState } from 'react';
import { Canvg } from 'canvg';
import styled from 'styled-components';
import Select, { components } from "react-select";

import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'

import Action from './Action';
import Solutions from './Solutions';

import { ReactComponent as HeartSVG } from '../../assets/heart.svg';
import { ReactComponent as DiamondSVG } from '../../assets/diamond.svg';
import { ReactComponent as ClubSVG } from '../../assets/club.svg';
import { ReactComponent as SpadeSVG } from '../../assets/spade.svg';
import { ReactComponent as ArrowSVG } from '../../assets/arrow.svg';

import Content from './Content';

import FilterModal from '../../components/modal/FilterModal'
import INDEX_MAP from '../../indexMap.json';
import DATA from './turn_reports'
import * as settingSlice from "../../reducers/setting/settingSlice";
import * as flopActionSlice from "../../reducers/flopAction/flopActionSlice";
import * as turnActionSlice from "../../reducers/turnAction/turnActionSlice";
import * as preflopSlice from "../../reducers/preflop/preflopSlice";

const PREFLOP_MAP = {
	'F-F-F-R2.5-F-C': 'BTN VS BB',
	'R2.5-F-F-F-F-C': 'LJ VS BB',
	'F-F-F-F-R3-C': 'SB VS BB',
	'F-F-F-R2.5-R10-F-C': 'SB 3B BTN',
	'F-F-F-R2.5-F-C.2': 'BB Call BTN',
	'F-F-R2.5-R7.5-F-F-C': 'BTN 3B CO'
}

const FLOP_MAP = {
	'X-R5.45-C': 'Small',
	'X-R1.8-C': 'Small',
	'X-X': 'Check',
	'R6.95-C': 'Small',
	'R2-C': 'Small',
	'X-R1.8-R6.35-C': 'X/R VS Small',
}

const TURN_MAP = {
	'X': 'Check',
	'Empty': 'Empty'
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
      return '#919191';
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
      return ["#FFFFFF", "rgb(106, 26, 26)", "rgb(125, 31, 31)", "rgb(163, 41, 41)", "rgb(202, 50, 50)", "rgb(221, 55, 55)", "rgb(240, 60, 60)", "rgb(90, 185, 102)"]
    case 6:
      return ["#FFFFFF", "rgb(106, 26, 26)", "rgb(125, 31, 31)", "rgb(163, 41, 41)", "rgb(202, 50, 50)", "rgb(240, 60, 60)", "rgb(90, 185, 102)"];
		case 5:
			return ["#FFFFFF", "rgb(106, 26, 26)", "rgb(125, 31, 31)", "rgb(202, 50, 50)", "rgb(240, 60, 60)", "rgb(90, 185, 102)"];
    case 3:
      return ["#FFFFFF", "rgb(125, 31, 31)", "rgb(240, 60, 60)", "rgb(90, 185, 102)"]
    default:
      return []
  }
}


function sum(values) {
  return values.reduce((prev, value) => prev + value, 0);
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

const ButtonWrapper = styled.div`
	display: flex;
`


const ChartWrapper = styled.div`
  width: 94%;
  padding: 3%;
  overflow-x: scroll;
`


const CanvasWrapper = styled.div`
  width: 100%;
  > canvas {
    width: 100% !important;
    height: 35px !important;
  }
`

const ArrowWrapper = styled.div`
  width: 12px;
  position: absolute;
  right: 5px;
`

const SelectWrapper = styled.div`
  width: 150px;
`

const getValue = (text) => {
  switch (text) {
    case 'A':
      return 14;
    case 'K':
      return 13;
    case 'Q':
      return 12;
    case 'J':
      return 11;
    case 'T':
      return 10;
    default:
      return parseInt(text);
  }
}

const getSuitValue = (text) => {
  switch (text) {
    case 's':
      return 1;
    case 'c':
      return 2;
    case 'd':
      return 3;
    case 'h':
      return 4;
		default:
			return 1;
  }
}


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

const TurnReportGraphPage = ({ data = {} }) => {
	const chartWrapperRef = useRef()
	const chartRef = useRef()
	const rectTextRef = useRef();
	const axisBottomRef = useRef();
	const axisLeftRef = useRef();
	const [selectedIndex, setSelectedIndex] = useState(-1)

	const { solutions = [] } = data; 

  const margin = { top: 10, right: 0, bottom: 20, left: 30 };
  const width = 18.5 * (solutions || []).length - margin.left - margin.right;
  const height = 350 - margin.top - margin.bottom;
  const axisHeight = 35;

  const header = "label,value1,value2,value3,value4,value5,value6,value7,value8,value9";
  const subgroups = header.split(",");

  const body = (solutions || []).map(d => ({
    label: d.name,
    values: [...d.solutions].reverse().map((a) => {
      return a.frequency * 100
    })
  }))
    .map(({ label, values }) => {
      return [label, ...values].join(",")
    })
    .join("\n");

  const csv = d3.csvParse([header, body].join("\n"));
	const labels = csv.map((data) => data.label || "");
  const max = Math.max(
    ...csv.map((data) =>
      sum([data.value1, data.value2, data.value3, data.value4, data.value5].map(Number))
    )
  );

  const scaleX = d3.scaleBand().domain(labels).range([0, width]).padding(0);
  const scaleY = d3.scaleLinear().domain([0, max]).range([height, 0]);
  const yAxis = d3.axisLeft(scaleY).tickValues([0,25,50,75,100])
  yAxis.tickSize(-width)

  const color = d3
    .scaleOrdinal()
    .domain(subgroups)
    .range(getColors((solutions[0] || { solutions: [] }).solutions.length));

	const stacked = d3.stack().keys(subgroups)(csv);
	const content = data.solutions[selectedIndex]


  useEffect(() => {
    if (axisBottomRef.current) {
      d3.select(axisBottomRef.current).call(d3.axisBottom(scaleX));
      d3.select(axisBottomRef.current)
          .attr("class", "x axis")
          .attr("transform", "translate(0," +height + ")")
          .attr("height", 700)
          .selectAll('.x .tick text')
          .call(function(t){                
            t.each(function(d){
              var self = d3.select(this);
              var s = self.text();
              self.text('');
              self.append("tspan")
                .attr("x", 0)
                .attr("dy","1em")
                .attr('fill', getColor(s[1]))
                .attr('font-size', '15')
                .attr('font-weight', '700')
                .attr('padding-bottom', '15px')
                .text(s[0]);
            })
        });
    }

    if (axisLeftRef.current) {
      d3.select(axisLeftRef.current).call(yAxis);
      d3.select(axisLeftRef.current)
        .attr("class", "y axis")
        .selectAll('.y .tick text')
        .call(function(t){                
          t.each(function(d){
            var self = d3.select(this);
            self.attr('fill', 'white')
          })
        })
      d3.select(axisLeftRef.current)
        .selectAll('.y .tick line')
        .attr('stroke-opacity', "0.3")
    }
  }, [scaleX, scaleY]);

	return <>
		<Action data={data.totals}></Action>
    <ChartWrapper
      ref={chartWrapperRef}
    >
      <svg
        width={width + margin.left + margin.right}
        height={height + margin.top + margin.bottom + axisHeight}
        ref={chartRef}
      >
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          <rect
            ref={rectTextRef}
            height={axisHeight}
            width={width}
            x={0}
            y={height}
            opacity={0}
          />
          <g ref={axisBottomRef} transform={`translate(0, ${height})`} />
          {stacked.map((data, index) => {
            return (
              <g key={`group-${index}`} fill={color(data.key)}>
                {data.map((d, index) => {
                  const label = String(d.data.label);
                  const y0 = scaleY(d[0]);
                  const y1 = scaleY(d[1]);

                  return (
                    <rect
											onClick={() => setSelectedIndex(index)}
                      key={`rect-${index}`}
                      x={scaleX(label)}
                      y={y1}
                      data-index={index}
                      width={scaleX.bandwidth()}
                      height={y0 - y1 || 0}
                      stroke='black'
                      strokeWidth='0.7'
                    />
                  );
                })}
              </g>
            );
          })}
          <g ref={axisLeftRef} />
        </g>
      </svg>
    </ChartWrapper>
    { content && <Content data={content}/> }
  </>
}


const TurnReportPage = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
	const [mouseMode, setMouseMode] = useState('none')
	const [currentCombos, setCurrentCombos] = useState(0)
	const [pageState, setPageState] = useState('graph')
	const [board, setBoard] = useState(queryParams.get('board') || '2h2d2c');
	const [data, setData] = useState(null)
	const [selectedKey, setSelectedKey] = useState('2s')
  const orderSelectDivRef = useRef(null)
  const [originData, setOriginData] = useState(null)
  const [type, setType] = useState('suit')
  const [orderMenuIsOpen, setOrderMenuIsOpen] = useState(false)
  const [order, setOrder] = useState('asc')
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
	const navigate = useNavigate();
  const dispatch = useDispatch()
	const { flops: filteredFlop } = useSelector((state) => state.filter)
	const settingStore = useSelector((state) => state.setting)
	const preflopStore = useSelector((state) => state.preflop)
	const flopActionStore = useSelector((state) => state.flopAction)
	const turnActionStore = useSelector((state) => state.turnAction)
	let setting = queryParams.get('setting') || settingStore
	let preflop = queryParams.get('preflop') || preflopStore
	let flopAction = queryParams.get('flopAction') || flopActionStore
	let turnAction = queryParams.get('turnAction') || turnActionStore

	if (preflop.split('.').length === 3) {
		preflop = 'F-F-F-R2.5-F-C';
	}

	if (!DATA[setting]) {
		setting = 'NL500'
	}

	const orderOptions = [
		{ value: 'flop', label: 'Flop' },
		{ value: 'suit', label: 'Suit' },
		{ value: 'check', label: 'Check' },
	]
	

	useEffect(() => {
		if (DATA[setting][preflop] && !DATA[setting][preflop][flopAction]) {
			const flop = Object.keys(DATA[setting][preflop])[0]
			dispatch(flopActionSlice.set(flop))
			dispatch(turnActionSlice.set(Object.keys(DATA[setting][preflop][flop])[0]))
		}
	}, [])

	useEffect(() => {
		let finalFlopAction = flopAction
		let finalTurnAction = turnAction
		let finalPreflop = preflop

		if (DATA[setting] && !DATA[setting][preflop]) {
			finalPreflop = Object.keys(DATA[setting])[0]
			finalFlopAction = Object.keys(DATA[setting][finalPreflop])[0]
			finalTurnAction = Object.keys(DATA[setting][finalPreflop][finalFlopAction])[0]
			dispatch(preflopSlice.set(finalPreflop))
			dispatch(flopActionSlice.set(finalFlopAction))
			dispatch(turnActionSlice.set(finalTurnAction))
		} else if (DATA[setting][preflop] && !DATA[setting][preflop][flopAction]) {
			finalFlopAction = Object.keys(DATA[setting][preflop])[0]
			finalTurnAction = Object.keys(DATA[setting][preflop][finalFlopAction])[0]
			dispatch(flopActionSlice.set(finalFlopAction))
			dispatch(turnActionSlice.set(finalTurnAction))
			return
		} else if (DATA[setting][preflop][flopAction] && !DATA[setting][preflop][flopAction][turnAction]) {
			finalTurnAction = Object.keys(DATA[setting][preflop][finalFlopAction])[0]
			dispatch(turnActionSlice.set(finalTurnAction))
			return
		}
		const fn = async () => {
			try {
				const path = `${process.env.PUBLIC_URL}/turn_reports/${setting}/${preflop}/${finalFlopAction}/${finalTurnAction}/${board}.json`;
				const response = await fetch(path);
				const data = await response.json()
				setOriginData(data)
			} catch (e) {
				console.log(e)
			}
		}
		fn();
	}, [setting, preflop, flopAction, turnAction, board])

	useEffect(() => {
		if (!filteredFlop.includes(board)) { 
			setBoard(filteredFlop[0])
			navigate(`?board=${filteredFlop[0]}`);
		}
	}, [JSON.stringify(filteredFlop)])

  useEffect(() => {
    if (!originData) {
      return;
    }
    let solutions = [...originData.solutions]
    // if (prevSolution !== solution || prevSetting !== setting) {
    //   const solutionPath = solution.split('.')
    //   const newSolution = DATA[setting][solutionPath[0]][solutionPath[1]][solutionPath[2]];
    //   if (!newSolution) {
    //     return;
    //   }
    //   newData = [...newSolution.results.data];
    // }
    if (type === 'flop') {
			solutions = solutions.sort((a, b) => {
				const flopA = a.name;
				const flopB = b.name;
				let isLeftBigger = true;
				if (getValue(flopA[0]) > getValue(flopB[0])) {
					isLeftBigger = true
				} else if (getValue(flopA[0]) < getValue(flopB[0])) {
					isLeftBigger = false
				}
				if (order === 'asc') {
					return isLeftBigger ? 1 : -1
				} else {
					return isLeftBigger ? -1 : 1
				}
			})
    } else if (type === 'check') {
      solutions = [...solutions].sort((a, b) => {
        return order === 'desc'
          ? b.solutions[0].frequency - a.solutions[0].frequency
          : a.solutions[0].frequency - b.solutions[0].frequency
      })
    } else if (type === 'suit') {
      solutions = [...solutions].sort((a, b) => {
        return order === 'desc'
          ? getSuitValue(b.name[1]) - getSuitValue(a.name[1])
          : getSuitValue(a.name[1]) - getSuitValue(b.name[1])
      })
		}
    setData({
			...originData,
			...data,
			solutions
		})
  }, [type, order, JSON.stringify(originData)])

  const onOrderSelectClick = (e) => {
    if (orderSelectDivRef.current && !orderSelectDivRef.current.contains(e.target)) { 
      setOrder(order === 'asc' ? 'desc' : 'asc');
    }
  }

	const onOrderChange = () => {
    setOrder(order === 'asc' ? 'desc' : 'asc');
    setOrderMenuIsOpen(true);
  }

  const OrderValueContainer = ({ children, ...props }) => {
    return (
      components.ValueContainer && (
        <components.ValueContainer {...props}>
          <div onClick={() => onOrderChange()} style={{ display: 'flex' }}>
            {children}
            {!!children && (
              order === 'asc'
                ? <ArrowWrapper><ArrowSVG /></ArrowWrapper>
                : <ArrowWrapper><ArrowSVG style={{ transform: 'rotate(180deg)' }} /></ArrowWrapper>
            )}
          </div>
        </components.ValueContainer>
      )
    );
  };


	if (!data) {
		return <div>Loading</div>
	}

	const settingOptions = Object.keys(DATA)
		.map(k => ({ value: k, label: k }))

	const preflopOptions = Object.keys(DATA[setting] || DATA[settingOptions[0].value])
		.map(k => ({ value: k, label: PREFLOP_MAP[k] }))

	const flopActionOptions = Object.keys(DATA[setting][preflop] || DATA[setting][preflopOptions[0].value])
		.map(k => ({ value: k, label: FLOP_MAP[k] || k }))

	const turnActionOptions = Object.keys(DATA[setting][preflop][flopAction] || DATA[setting][preflop][flopActionOptions[0].value])
		.map(k => ({ value: k, label: TURN_MAP[k] || k }))


	const boardOptions = filteredFlop
		.map(k => ({ value: k, label: k }))
	// const boardOptions = Object.keys(DATA[setting][preflop][flopAction][turnAction] || turnActionOptions[0])
	// 	.map(k => ({ value: k, label: k }))

	return (
		<Page>
			<Wrapper>
				<ControlWrapper>
					<SelectWrapper 
						ref={orderSelectDivRef}
						onClick={onOrderSelectClick}
						onTouchStart={() => setOrderMenuIsOpen(true)}
						onMouseEnter={() => setOrderMenuIsOpen(true)}
					>
						<Select
							defaultValue={orderOptions[0]}
							options={orderOptions}
							components={{ ValueContainer: OrderValueContainer }}
							menuIsOpen={orderMenuIsOpen}
							onChange={(e) => {
								if (e.value === type) {
									onOrderChange();
								}
								setOrderMenuIsOpen(false)
								setType(e.value);
							}}
							styles={{
								menu: base => ({
									...base,
									marginTop: 0
								})
							}}
							isClearable={false}
							isSearchable={false}
						/>
					</SelectWrapper>
					<Select
						defaultValue={settingOptions[0]}
						options={settingOptions}
						onChange={(e) => {
							navigate(`?setting=${e.value}`);
							dispatch(settingSlice.set(e.value))
							if (DATA[e.value] && !DATA[e.value][preflop]) {
								const preflop = Object.keys(DATA[e.value])[0]
								dispatch(preflopSlice.set(preflop))
							}
						}}
						isClearable={false}
						isSearchable={false}
						value={settingOptions.find(o => o.value === setting)}
					/>
					<Select
						defaultValue={preflopOptions[0]}
						options={preflopOptions}
						onChange={(e) => {
							navigate(`?preflop=${e.value}`);
							dispatch(preflopSlice.set(e.value))
							if (DATA[setting][e.value] && !DATA[setting][e.value][flopAction]) {
								const flop = Object.keys(DATA[setting][e.value])[0]
								dispatch(flopActionSlice.set(flop))
								dispatch(turnActionSlice.set(Object.keys(DATA[setting][e.value][flop])[0]))
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
							navigate(`?flopAction=${e.value}`);
							dispatch(flopActionSlice.set(e.value))
						}}
						isClearable={false}
						isSearchable={false}
						value={flopActionOptions.find(o => o.value === flopAction)}
					/>
					<Select
						defaultValue={turnActionOptions[0]}
						options={turnActionOptions}
						onChange={(e) => {
							navigate(`?turnAction=${e.value}`);
							dispatch(turnActionSlice.set(e.value))
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
							navigate(`?board=${e.value}`);
							setBoard(e.value)
						}}
						isClearable={false}
						isSearchable={false}
						value={boardOptions.find(o => o.value === board)}
					/>
				</ControlWrapper>
				<ButtonWrapper>
					<button
						onClick={() => {
							setPageState('graph')
						}}
					>Graph</button>
					<button
						onClick={() => {
							setPageState('strategy')
						}}
					>Strategy</button>
					<button
						onClick={() => {
							const list = filteredFlop
							const min = 0;
							const max = list.length - 1
							const index = Math.floor(Math.random() * (max - min + 1)) + min
							const newFlop = list[index]
							setBoard(newFlop)
							navigate(`?board=${newFlop}`);
						}}
					>Random</button>
					<button onClick={() => setIsFilterModalOpen(true)}>Filter</button>
				</ButtonWrapper>
				{
					pageState === 'strategy' ? <>
						<Action data={data.totals}></Action>
						<Solutions data={data.solutions}></Solutions>	
					</> : null
				}
				{
					pageState === 'graph' ? <TurnReportGraphPage data={data} /> : null
				}
				<FilterModal
					onCancel={() => setIsFilterModalOpen(false)}
					onSave={({ flops, state }) => {
						setIsFilterModalOpen(false)
					}}
					open={isFilterModalOpen}
				/>
			</Wrapper>
		</Page>
	)
}

export default TurnReportPage;