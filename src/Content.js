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
  return (
		<Wrapper>
			<Flop data={flop}/>
			<ColorBlock color="#000000" width={reverseActions[0].frequency * 100} />
			<ColorBlock color="#7D1F1F" width={reverseActions[1].frequency * 100} />
			<ColorBlock color="#CA3232" width={reverseActions[2].frequency * 100} />
			<ColorBlock color="#F03C3C" width={reverseActions[3].frequency * 100} />
			<ColorBlock color="#5AB966" width={reverseActions[4].frequency * 100}/>
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