import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Flop from './Flop';

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


const Wrapper = styled.div`
	width: 100%;
	height: 230px;
	display: flex;
	margin-top: 20px;
`

const ColorBlock = styled.div`
	background: ${({ color }) => color};
	width: ${({ width }) => `${width}%`};
	height: 100%;
`

const Left = styled.div`

`

const Right = styled.div`

`

const Text = styled.div`

`

const TextWrapper = styled.div`
	position: absolute;
	display: flex;
	width: 96%;
	justify-content: space-between;
	margin-top: 30px;
	padding: 2%;
	font-size: 20px;
`

const Content = ({ data }) => {
	const { actions, flop } = data;
	const reverseActions = [...actions].reverse();

  return (
		<Wrapper>
			<Flop data={flop}/>
			{
				reverseActions.map((a, index) => <ColorBlock color={getColors(reverseActions.length)[index+1]} width={reverseActions[index].frequency * 100} />)
			}
			<TextWrapper>
				<Left>
					{
						reverseActions.map(a => <Text>{a.action_code}</Text>)
					}
				</Left>
				<Right>
					{
						reverseActions.map(a => <Text>{(a.frequency * 100).toFixed(1)}</Text>)
					}
				</Right>
			</TextWrapper>
		</Wrapper>
	)
}

export default Content;