import { useEffect, useRef, useState, useMemo } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
	position: fixed;
	top: 0;
	width: 100vw;
	height: 100vh;
	background: black;
	opacity: 0.5;
	@media (max-width: 767px) {
		padding-top: 50%;
	}

	@media (min-width: 768px) {

	}
`


const Loading = () => {
	return <Wrapper>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 100 100"
			preserveAspectRatio="xMidYMid"
			style={{ background: 'none' }}
			fill="#000000"
		>
			<circle cx="50" cy="50" r="10" stroke="white" strokeWidth="3" strokeLinecap="round">
				<animate
					attributeName="stroke-dashoffset"
					dur="2s"
					repeatCount="indefinite"
					from="0"
					to="502"
				/>
			</circle>
		</svg>
	</Wrapper>
}

export default Loading