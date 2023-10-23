import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Flop from './Flop';

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
	font-size: 25px;
`

const Content = ({ data }) => {
	const { actions, flop } = data;
	const reverseActions = [...actions].reverse();
	console.log(reverseActions)
  return (
		<Wrapper>
			<Flop data={flop}/>
			<ColorBlock color="rgb(106, 26, 26)" width={reverseActions[0].frequency * 100} />
			<ColorBlock color="rgb(125, 31, 31)" width={reverseActions[1].frequency * 100} />
			<ColorBlock color="rgb(163, 41, 41)" width={reverseActions[2].frequency * 100} />
			<ColorBlock color="rgb(202, 50, 50)" width={reverseActions[3].frequency * 100}/>
			<ColorBlock color="rgb(240, 60, 60)" width={reverseActions[4].frequency * 100}/>
			<ColorBlock color="rgb(90, 185, 102)" width={reverseActions[5].frequency * 100}/>
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