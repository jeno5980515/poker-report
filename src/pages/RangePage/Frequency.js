import styled from 'styled-components';
import Select, { components } from "react-select";

const Wrapper = styled.div`
	display: flex;
	width: 100%;
	justify-content: space-between;
	background: rgb(39, 39, 39);
	margin: 10px;
	padding: 10px;
`

const Text = styled.div`
	color: rgb(245, 245, 245);
	:first-child {
		color: rgb(240, 60, 60);
	}
	:nth-child(2) {
		color: rgb(90, 185, 102);
	}
`


const Frequency = ({ freqB, freqX }) => {
	return <Wrapper>
		<Text>
			<div>Bet</div>
			<div>Check</div>
		</Text>
		<Text>
			<div>{freqB}%</div>
			<div>{freqX}%</div>
		</Text>
	</Wrapper>
}

export default Frequency;