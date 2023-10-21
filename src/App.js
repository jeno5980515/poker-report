import * as d3 from "d3";
import { useEffect, useRef } from 'react';
import styled from 'styled-components';

import './App.css';

import data from './BtnVSBB.json'


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

const App = () => {
  const axisBottomRef = useRef(null);
  const axisLeftRef = useRef(null);

  const header = "label,value1,value2,value3,value4,value5";
  const body = data.results.data.map(d => ({
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
  const width = 40365 - margin.left - margin.right;
  const height = 350 - margin.top - margin.bottom;
  const axisHeight = 300;

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

  return (
    <svg
      width={width + margin.left + margin.right}
      height={height + margin.top + margin.bottom + axisHeight}
    >
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        <rect
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
                    key={`rect-${index}`}
                    x={scaleX(label)}
                    y={y1}
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
  );
}

export default App;
