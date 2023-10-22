import * as d3 from "d3";
import { useEffect, useRef, useState } from 'react';
import { Canvg } from 'canvg';
import styled from 'styled-components';
import Select, { components } from "react-select";

import { ReactComponent as ArrowSVG } from './arrow.svg';
import Content from './Content';
import './App.css';

import DATA from './BtnVSBB.json'

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

const Tooltip = styled.div`
  position: absolute;
  width: 18.5px;
  height: 390px;
  background: white;
  opacity: 0.2;
  border-radius: 5px;
  left: ${({ left }) => `${left}px`};
  top: 40px;
  pointer-events: none;
`

const SelectWrapper = styled.div`
  width: 150px;
`

const ArrowWrapper = styled.div`
  width: 12px;
  position: absolute;
  right: 5px;
`


function sum(values) {
  return values.reduce((prev, value) => prev + value, 0);
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

const options = [
  { value: 'flop', label: 'Flop' },
  { value: 'check', label: 'Check' },
]

const useOutsideOver = (ref, callback) => {
  const handleOver = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener('mouseover', handleOver);

    return () => {
      document.removeEventListener('mouseover', handleOver);
    };
  });
}

const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const App = () => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const axisBottomRef = useRef(null);
  const axisLeftRef = useRef(null);
  const chartWrapperRef = useRef(null);
  const rectTextRef = useRef(null)
  const selectDivRef = useRef(null)

  const [chartScrollX, setChartScrollX] = useState(0)
  const [barX, setBarX] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [rectTextLeft, setRectTextLeft] = useState(0)
  const [order, setOrder] = useState('asc')
  const [type, setType] = useState('flop')
  const [menuIsOpen, setMenuIsOpen] = useState(false)
  const [data, setData] = useState(DATA.results.data)

  const header = "label,value1,value2,value3,value4,value5";
  const body = data.map(d => ({
    label: d.flop,
    values: [...d.actions].reverse().map((a) => {
      return a.frequency * 100
    })
  }))
    .map(({ label, values }) => {
      return [label, ...values].join(",")
    })
    .join("\n");

  const csv = d3.csvParse([header, body].join("\n"));

  const margin = { top: 10, right: 0, bottom: 20, left: 30 };
  const width = 32500 - margin.left - margin.right;
  const height = 350 - margin.top - margin.bottom;
  const axisHeight = 35;

  const subgroups = header.split(",");
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
    .range(["#000000", "#000000", "#7D1F1F", "#CA3232", "#F03C3C", "#5AB966"]);
  const stacked = d3.stack().keys(subgroups)(csv);

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
              self.append("tspan")
                .attr("x", 0)
                .attr("dy","1em")
                .attr('fill', getColor(s[3]))
                .attr('font-size', '15')
                .attr('font-weight', '700')
                .attr('padding-bottom', '15px')
                .text(s[2]);
              self.append("tspan")
                .attr("x", 0)
                .attr("dy","1em")
                .attr('fill', getColor(s[5]))
                .attr('font-size', '15')
                .attr('font-weight', '700')
                .text(s[4]);
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

  useEffect(() => {
    const setX = () => {
      if (chartWrapperRef.current) {
        setChartScrollX(chartWrapperRef.current.scrollLeft);
      }
    }
    if (chartWrapperRef.current) {
      chartWrapperRef.current.addEventListener('scroll', setX)
    }
    return () => {
      if (chartWrapperRef.current) {
        chartWrapperRef.current.removeEventListener('scroll', setX)
      }
    }
  }, [chartWrapperRef.current])

  useOutsideOver(selectDivRef, () => {
    setMenuIsOpen(false);
  });

  useEffect(() => {
    if (rectTextRef.current) {
      setRectTextLeft(rectTextRef.current.getBoundingClientRect().x)
    }
  }, [rectTextRef.current])

  // useEffect(() => {
  //   d3.selectAll('rect')
  //     .on("mouseover", function(d) {
  //       const xPosition = parseFloat(d3.select(this).attr("x")) + scaleX.bandwidth() / 2 + 52 + chartScrollX;
  //       const yPosition = 40
  //       // console.log(chartScrollX)
  //       // d3.select("#chart-tooltip")
  //       //   .style("left", xPosition + "px")
  //       //   .style("top", yPosition + "px")
  //       //   .style('display', 'block')
  //     })
  //     .on("mouseout", function() {
  //       // d3.select("#tooltip").classed("hidden", true);
  //     })
  // }, [])

  const onBarMouseOver = (e) => {
    const x = parseFloat(e.target.getAttribute('x')) + scaleX.bandwidth() / 2 + rectTextLeft - 9;
    const index = parseInt(e.target.getAttribute('data-index'));
    setBarX(x);
    setSelectedIndex(index);
  }

  const onCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const index = parseInt((x/rect.width) * data.length)
    setSelectedIndex(index);
    chartWrapperRef.current.scrollLeft = scaleX.bandwidth() * index;
  }

  const ValueContainer = ({ children, ...props }) => {
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

  const onOrderChange = () => {
    setOrder(order === 'asc' ? 'desc' : 'asc');
    setMenuIsOpen(true);
  }

  const onSelectClick = (e) => {
    if (selectDivRef.current && !selectDivRef.current.contains(e.target)) { 
      setOrder(order === 'asc' ? 'desc' : 'asc');
    }
  }

  const syncCanvas = async () => {
    const ctx = canvasRef.current.getContext('2d');
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(chartRef.current)
    const v = await Canvg.from(ctx, svgString);
    v.start();
    v.stop();
  }

  useEffect(() => {
    let newData = [...data]
    if (type === 'flop') {
      newData = [...newData].sort((a, b) => {
        const flopA = a.flop;
        const flopB = b.flop;
        let isLeftBigger = true;
        if (getValue(flopA[0]) > getValue(flopB[0])) {
          isLeftBigger = true
        } else if (getValue(flopA[0]) < getValue(flopB[0])) {
          isLeftBigger = false
        } else {
          if (getValue(flopA[2]) > getValue(flopB[2])) {
            isLeftBigger = true;
          } else if (getValue(flopA[2]) < getValue(flopB[2])) {
            isLeftBigger = false;
          } else {
            if (getValue(flopA[4]) > getValue(flopB[4])) {
              isLeftBigger = true;
            } else if (getValue(flopA[4]) < getValue(flopB[4])) {
              isLeftBigger = false
            }
          }
        }
        if (order === 'asc') {
          return isLeftBigger ? 1 : -1
        } else {
          return isLeftBigger ? -1 : 1
        }
      })
    } else if (type === 'check') {
      newData = [...newData].sort((a, b) => {
        return order === 'desc'
          ? b.actions[0].frequency - a.actions[0].frequency
          : a.actions[0].frequency - b.actions[0].frequency
      })
    }
    setData(newData)
  }, [type, order])

  useEffect(() => {
    syncCanvas()
  }, [data])

  useEffect(() => {
    if (chartRef.current && canvasRef.current) {
      syncCanvas()
    }
  }, [chartRef.current, canvasRef.current])

  const content = data[selectedIndex]

  return (
    <>
      <SelectWrapper 
        ref={selectDivRef}
        onClick={onSelectClick}
        onMouseEnter={() => setMenuIsOpen(true)}
      >
        <Select
          defaultValue={options[0]}
          options={options}
          components={{ ValueContainer }}
          menuIsOpen={menuIsOpen}
          onChange={(e) => {
            if (e.value === type) {
              onOrderChange();
            }
            setType(e.value);
          }}
          styles={{
            menu: base => ({
              ...base,
              marginTop: 0
            })
          }}
        />
      </SelectWrapper>
      <ChartWrapper
        ref={chartWrapperRef}
      >
        <Tooltip left={barX - chartScrollX}></Tooltip>
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
                        onMouseOver={onBarMouseOver}
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
      <CanvasWrapper>
        <canvas ref={canvasRef} onClick={onCanvasClick}/>
      </CanvasWrapper>
      <Content data={content}/>
    </>
  );
}

export default App;
