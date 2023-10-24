import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { ReactComponent as HeartSVG } from '../../assets/heart.svg';
import { ReactComponent as DiamondSVG } from '../../assets/diamond.svg';
import { ReactComponent as ClubSVG } from '../../assets/club.svg';

const Wrapper = styled.div`
	width: 125px;
	height: 35px;
	display: flex;
	position: absolute;
	background: white;
	border-radius: 5px;
`

const Text = styled.div`
	color: ${({ color }) => color};
	display: flex;
	margin: 5px;
	> * {
		width: 15px;
		font-size: 20px;
	}
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

const getSVG = (text) => {
	switch (text) {
    case 'h':
      return <HeartSVG fill="#EF5350"/>;
    case 'd':
      return <DiamondSVG fill="#448AFF" />;
    case 'c':
      return <ClubSVG fill="#66BB6A"/>;
    default:
      return <HeartSVG fill="#EF5350" />;
  }
}


const Flop = ({ data }) => {
  return (
		<Wrapper>
			<Text color={getColor(data[1])} >
				<div>{data[0]}</div>
				<div>{getSVG(data[1])}</div>
			</Text>
			<Text color={getColor(data[3])} >
				<div>{data[2]}</div>
				<div>{getSVG(data[3])}</div>
			</Text>
			<Text color={getColor(data[5])} >
				<div>{data[4]}</div>
				<div>{getSVG(data[5])}</div>
			</Text>
		</Wrapper>
	)
}

export default Flop;